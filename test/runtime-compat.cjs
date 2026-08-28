'use strict'

const assert = require('assert')
const loader = require('..')
const fileProtocol = require('../lib/file-protocol')
const joinHelpers = require('../lib/join-function')
const processMap = require('../lib/vendor/adjust-sourcemap-loader/lib/process')

assert.strictEqual(typeof loader, 'function')
assert.deepStrictEqual(Object.keys(loader), [
  'asGenerator',
  'createJoinImplementation',
  'createJoinFunction',
  'defaultJoinGenerator',
  'defaultJoin'
])
assert.strictEqual(loader.defaultJoin, joinHelpers.defaultJoin)
assert.strictEqual(fileProtocol.remove('file:///D:/work/source.scss', 'win32'), 'D:/work/source.scss')
assert.strictEqual(fileProtocol.remove('file:///D:/work/source.scss', 'linux'), '/D:/work/source.scss')
assert.strictEqual(fileProtocol.remove('file:///work/source.scss'), '/work/source.scss')
assert.strictEqual(typeof processMap, 'function')
assert.deepStrictEqual(Array.from(loader.asGenerator(function (item) {
  return ['/base', ['/base', item.uri]]
})({ uri: 'asset.png' })), [['/base', 'asset.png']])
console.log('runtime compatibility passed on ' + process.version)
