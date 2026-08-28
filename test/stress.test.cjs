'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')

const loader = require('..')
const valueProcessor = require('../lib/value-processor')

test('join iterators are bounded at the upstream 100,000-step safety limit', () => {
  let steps = 0
  const implementation = loader.createJoinImplementation(() => ({
    next() {
      steps += 1
      return { value: null, done: false }
    }
  }))
  const attempts = implementation(
    { uri: 'asset.png', isAbsolute: false },
    { root: false },
    { fs: { statSync() { throw new Error('must not stat null values') } } }
  )
  assert.deepEqual(attempts, [])
  assert.equal(steps, 100000)
})

test('large declarations rewrite thousands of URLs iteratively', () => {
  const count = 2500
  const value = Array.from({ length: count }, (_, index) => `url("asset-${index}.png?q=${index}#x")`).join(',')
  let joins = 0
  const processValue = valueProcessor({
    directory: '/generated',
    root: false,
    join(item) {
      joins += 1
      return `/assets/${item.uri}`
    }
  })
  const result = processValue(value, () => ({
    subString: '/source', value: '/source', property: '/source', selector: '/source'
  }))
  assert.equal(joins, count)
  assert.match(result, /\.\.\/assets\/asset-0\.png\?q=0#x/)
  assert.match(result, /\.\.\/assets\/asset-2499\.png\?q=2499#x/)
  assert.equal((result.match(/url\(/g) || []).length, count)
})

test('asGenerator consumes custom iterators lazily without changing tuples', () => {
  let created = 0
  let read = 0
  const iterator = {
    next() {
      read += 1
      return read === 1 ? { value: ['/base', 'asset.png'], done: false } : { done: true }
    }
  }
  const generator = loader.asGenerator(() => {
    created += 1
    return iterator
  })
  const normalized = generator({ uri: 'asset.png' })
  assert.equal(created, 1)
  assert.equal(read, 0)
  assert.deepEqual(normalized.next(), { value: ['/base', 'asset.png'], done: false })
})
