'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const loader = require('..')
const fileProtocol = require('../lib/file-protocol')
const algebra = require('../lib/position-algerbra')
const fsUtils = require('../lib/join-function/fs-utils')
const debug = require('../lib/join-function/debug')

test('root preserves the callable upstream helper surface', () => {
  assert.equal(typeof loader, 'function')
  assert.deepEqual(Object.keys(loader), [
    'asGenerator',
    'createJoinImplementation',
    'createJoinFunction',
    'defaultJoinGenerator',
    'defaultJoin'
  ])
  for (const key of Object.keys(loader)) assert.equal(typeof loader[key], 'function')
  assert.equal(String(loader.defaultJoin), '[Function defaultJoin]')
  assert.equal(JSON.stringify(loader.defaultJoin), '"[Function defaultJoin]"')
})

test('position algebra matches upstream line and column behavior', () => {
  assert.deepEqual(algebra.sanitise({ line: '2', column: 3, ignored: 4 }), { line: '2', column: 3 })
  assert.ok(Number.isNaN(algebra.sanitise(null).line))
  assert.deepEqual(algebra.strToOffset('ab\r\ncd\nef'), { line: 2, column: 2 })
  assert.deepEqual(algebra.add([
    { line: 3, column: 4 },
    { line: 0, column: 2 },
    { line: 1, column: 5 },
    { line: 0, column: 3 }
  ]), { line: 4, column: 8 })
})

test('file protocol helpers copy maps and validate input', () => {
  const original = { version: 3, sources: ['/a.scss', '/b.scss'], mappings: '' }
  const prefixed = fileProtocol.prepend(original)
  assert.notEqual(prefixed, original)
  assert.deepEqual(prefixed.sources, ['file:///a.scss', 'file:///b.scss'])
  assert.deepEqual(original.sources, ['/a.scss', '/b.scss'])
  assert.deepEqual(fileProtocol.remove(prefixed), original)
  assert.throws(() => fileProtocol.prepend(null), /expected string\|object/)
  assert.throws(() => fileProtocol.remove({ sources: 'bad' }), /expected string\|object/)
})

test('asGenerator normalizes arrays, defaults tuple values, and deduplicates', () => {
  const generator = loader.asGenerator(({ uri }) => [
    '/first',
    ['/first', uri],
    ['/second', 'changed.png'],
    [null, uri]
  ])
  assert.deepEqual(Array.from(generator({ uri: 'asset.png' })), [
    ['/first', 'asset.png'],
    ['/second', 'changed.png'],
    [null, 'asset.png']
  ])
  assert.throws(() => loader.asGenerator(() => 'bad')({ uri: 'x' }), /Array\|Iterator/)
})

test('join implementation preserves attempt order, fallback, and fs abstraction', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-url-upstream-'))
  try {
    const first = path.join(temporary, 'first')
    const second = path.join(temporary, 'second')
    fs.mkdirSync(first)
    fs.mkdirSync(second)
    fs.writeFileSync(path.join(second, 'asset.png'), 'asset')
    const generator = loader.asGenerator(() => [first, second])
    const implementation = loader.createJoinImplementation(generator)
    const attempts = implementation(
      { uri: 'asset.png', query: '', isAbsolute: false, bases: {} },
      { root: false },
      { fs }
    )
    assert.deepEqual(attempts.map(({ base, isSuccess, isFallback }) => ({ base, isSuccess, isFallback })), [
      { base: first, isSuccess: false, isFallback: true },
      { base: second, isSuccess: true, isFallback: true }
    ])
    const join = loader.createJoinFunction('fixture', implementation)
    assert.equal(join({ debug: false }, { resourcePath: 'input.scss', fs })(
      { uri: 'asset.png', query: '', isAbsolute: false, bases: {} }
    ), path.join(second, 'asset.png'))
  } finally {
    fs.rmSync(temporary, { force: true, recursive: true })
  }
})

test('fs and debug deep utilities retain upstream results', () => {
  const utilities = fsUtils(fs)
  assert.equal(utilities.isDirectorySync(__dirname), true)
  assert.equal(utilities.isFileSync(__filename), true)
  assert.equal(utilities.existsSync(path.join(__dirname, 'absent')), false)
  assert.equal(debug.pathToString(''), '-empty-')
  const messages = []
  const log = debug.createDebugLogger(messages.push.bind(messages))
  log((value) => value, ['same'])
  log((value) => value, ['same'])
  assert.deepEqual(messages, ['same'])
})
