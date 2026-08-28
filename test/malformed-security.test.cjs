'use strict'

const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')

const loader = require('..')
const valueProcessor = require('../lib/value-processor')
const { runLoader } = require('./helpers/run-loader.cjs')

const resourcePath = path.join(__dirname, 'malformed.css')

test('loader, join, root, and source-map misconfigurations retain error categories', async () => {
  const cases = [
    {
      parameters: { content: '.x{}', sourceMap: null, options: {}, resourcePath, context: './relative' },
      message: /webpack misconfiguration\n  loader\.context is relative/
    },
    {
      parameters: { content: '.x{}', sourceMap: null, options: { join: 'bad' }, resourcePath },
      message: /loader misconfiguration\n  "join" option must be a Function/
    },
    {
      parameters: { content: '.x{}', sourceMap: null, options: { join: (onlyOne) => onlyOne }, resourcePath },
      message: /must take exactly 2 arguments/
    },
    {
      parameters: {
        content: '.x{}', sourceMap: null,
        options: { join: function join(options, context) { return { options, context } } }, resourcePath
      },
      message: /must itself return a Function/
    },
    {
      parameters: {
        content: '.x{}', sourceMap: null,
        options: { join: function join() {} }, resourcePath
      },
      message: /must take exactly 2 arguments/
    },
    {
      parameters: { content: '.x{}', sourceMap: null, options: { root: '/definitely/not/a/real/directory' }, resourcePath },
      message: /"root" option must be an empty string or an absolute path/
    },
    {
      parameters: { content: '.x{}', sourceMap: '{broken', options: {}, resourcePath },
      message: /source-map error\n  cannot parse source-map string/
    }
  ]

  for (const { parameters, message } of cases) {
    const result = await runLoader(loader, parameters)
    assert.equal(result.content, parameters.content)
    assert.equal(result.errors.length, 1)
    assert.match(result.errors[0].message, message)
  }
})

test('valid outer join with invalid inner arity is rejected', async () => {
  function join(options, context) {
    assert.ok(options)
    assert.ok(context)
    return (...items) => items.length
  }
  const result = await runLoader(loader, {
    content: '.x{}', sourceMap: null, options: { join }, resourcePath
  })
  assert.equal(result.errors.length, 1)
  assert.match(result.errors[0].message, /function that takes exactly 1 arguments/)
})

test('non-file URL schemes never invoke source lookup or custom joins', () => {
  let joined = 0
  const processValue = valueProcessor({
    directory: '/generated',
    root: false,
    join() { joined += 1; return '/unexpected' }
  })
  const value = [
    'url("https://example.test/a.png")',
    'url(data:image/png;base64,AA)',
    'url(#local-fragment)',
    'url("~module/asset.png")'
  ].join(' ')
  assert.equal(processValue(value, () => { throw new Error('source lookup must not run') }), value)
  assert.equal(joined, 0)
})

test('join helper rejects malformed implementations, iterators, bases, and attempts', () => {
  assert.throws(
    () => loader.createJoinImplementation(() => [])({}, {}, { fs: {} }),
    /expected generator to return Iterator/
  )
  const malformedValue = loader.createJoinImplementation(() => [][Symbol.iterator]())
  assert.deepEqual(malformedValue({}, {}, { fs: { statSync() { throw new Error('absent') } } }), [])
  const nonTuple = loader.createJoinImplementation(() => ['bad'][Symbol.iterator]())
  assert.throws(
    () => nonTuple({}, {}, { fs: { statSync() { throw new Error('absent') } } }),
    /tuple of \[string,string\]/
  )
  const badBase = loader.createJoinImplementation(() => [['relative', 'x']][Symbol.iterator]())
  assert.throws(
    () => badBase({ isAbsolute: false }, { root: false }, { fs: { statSync() { throw new Error('absent') } } }),
    /absolute path to a valid directory/
  )
  const join = loader.createJoinFunction('bad', () => [{ joined: '/missing-fields' }])
  assert.throws(
    () => join({ debug: false }, { resourcePath })({ uri: 'x' }),
    /expected implementation to return Array/
  )
})
