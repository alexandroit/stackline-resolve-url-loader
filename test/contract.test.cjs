'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { Writable } = require('node:stream')
const test = require('node:test')

const loader = require('..')
const logToTestHarness = require('../lib/log-to-test-harness')
const { identitySourceMap, runLoader } = require('./helpers/run-loader.cjs')

function fixture() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-url-contract-'))
  const sourceDirectory = path.join(temporary, 'styles')
  const outputDirectory = path.join(temporary, 'generated')
  fs.mkdirSync(sourceDirectory)
  fs.mkdirSync(outputDirectory)
  const sourceFile = path.join(sourceDirectory, 'source.scss')
  const resourcePath = path.join(outputDirectory, 'bundle.css')
  return { temporary, sourceDirectory, outputDirectory, sourceFile, resourcePath }
}

test('relative assets retain query/hash while non-file URLs pass through', async () => {
  const value = fixture()
  try {
    const content = [
      '.x { background: url("./asset.png?query=1#hash"); }',
      '.a { src: url(data:image/png;base64,AAAA); }',
      '.b { src: url(https://example.test/font.woff2?#x); }',
      '.c { src: url("~package/font.woff2"); }',
      '.d { src: url(""); }'
    ].join('\n')
    fs.writeFileSync(value.sourceFile, content)
    fs.writeFileSync(value.resourcePath, content)
    fs.writeFileSync(path.join(value.sourceDirectory, 'asset.png'), 'asset')
    const result = await runLoader(loader, {
      content,
      sourceMap: identitySourceMap(content, value.sourceFile, value.resourcePath),
      options: { sourceMap: true },
      resourcePath: value.resourcePath,
      projectRoot: value.temporary
    })
    assert.equal(result.error, null)
    assert.equal(result.errors.length, 0)
    assert.match(result.content, /\.\.\/styles\/asset\.png\?query=1#hash/)
    assert.match(result.content, /data:image\/png;base64,AAAA/)
    assert.match(result.content, /https:\/\/example\.test\/font\.woff2\?#x/)
    assert.match(result.content, /~package\/font\.woff2/)
    assert.match(result.content, /url\(""\)/)
  } finally {
    fs.rmSync(value.temporary, { force: true, recursive: true })
  }
})

test('root-relative processing remains opt-in and uses an existing root', async () => {
  const value = fixture()
  try {
    const publicRoot = path.join(value.temporary, 'public')
    fs.mkdirSync(publicRoot)
    fs.writeFileSync(path.join(publicRoot, 'root.png'), 'asset')
    const content = '.x { background: url("/root.png?v=1#root"); }'
    fs.writeFileSync(value.sourceFile, content)
    fs.writeFileSync(value.resourcePath, content)
    const sourceMap = identitySourceMap(content, value.sourceFile, value.resourcePath)
    const disabled = await runLoader(loader, {
      content,
      sourceMap,
      options: { sourceMap: false },
      resourcePath: value.resourcePath,
      projectRoot: value.temporary
    })
    assert.equal(disabled.content, content)
    const enabled = await runLoader(loader, {
      content,
      sourceMap,
      options: { root: publicRoot, sourceMap: false },
      resourcePath: value.resourcePath,
      projectRoot: value.temporary
    })
    assert.match(enabled.content, /\.\.\/public\/root\.png\?v=1#root/)
    assert.equal(enabled.map, undefined)
  } finally {
    fs.rmSync(value.temporary, { force: true, recursive: true })
  }
})

test('custom join receives source-position bases and can decline rewriting', async () => {
  const value = fixture()
  try {
    const content = '.x { background: url("asset.png?keep#it"); }'
    fs.writeFileSync(value.sourceFile, content)
    fs.writeFileSync(value.resourcePath, content)
    let item
    function join(options, loaderContext) {
      assert.equal(options.root, false)
      assert.equal(loaderContext.resourcePath, value.resourcePath)
      return function joinItem(candidate) {
        item = candidate
        return null
      }
    }
    const result = await runLoader(loader, {
      content,
      sourceMap: identitySourceMap(content, value.sourceFile, value.resourcePath),
      options: { join, sourceMap: true },
      resourcePath: value.resourcePath,
      projectRoot: value.temporary
    })
    assert.equal(result.content, content)
    assert.equal(item.uri, 'asset.png')
    assert.equal(item.query, '?keep#it')
    assert.equal(item.isAbsolute, false)
    assert.deepEqual(new Set(Object.values(item.bases)), new Set([value.sourceDirectory]))
  } finally {
    fs.rmSync(value.temporary, { force: true, recursive: true })
  }
})

test('missing source maps warn, silent mode suppresses warnings, and results stay cacheable', async () => {
  const resourcePath = path.join(__dirname, 'missing-map.css')
  const warned = await runLoader(loader, {
    content: '.x { color: red; }',
    sourceMap: null,
    options: { sourceMap: false },
    resourcePath
  })
  assert.equal(warned.warnings.length, 1)
  assert.match(warned.warnings[0].message, /webpack or the upstream loader did not supply a source-map/)
  assert.equal(warned.cacheableCalls, 1)
  const silent = await runLoader(loader, {
    content: '.x { color: red; }',
    sourceMap: null,
    options: { silent: true, sourceMap: false },
    resourcePath
  })
  assert.equal(silent.warnings.length, 0)
  assert.equal(silent.cacheableCalls, 1)
})

test('test harness logging is one-shot and tolerates circular option values', () => {
  const chunks = []
  const target = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk.toString())
      callback()
    }
  })
  const circular = {}
  circular.self = circular
  logToTestHarness(target, { sourceMap: true, circular })
  logToTestHarness(target, { ignored: true })
  const output = chunks.join('')
  assert.match(output, /sourceMap: true/)
  assert.match(output, /circular: -unstringifyable-/)
  assert.doesNotMatch(output, /ignored/)
})
