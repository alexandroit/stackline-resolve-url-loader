'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const maintained = require('..')
const baseline = require('resolve-url-loader-baseline')
const { identitySourceMap, runLoader } = require('./helpers/run-loader.cjs')

function comparable(result) {
  return {
    error: result.error && result.error.message,
    content: result.content,
    map: result.map,
    errors: result.errors.map(({ message }) => message),
    warnings: result.warnings.map(({ message }) => message),
    cacheableCalls: result.cacheableCalls
  }
}

test('object/string maps and webpack 4/5 output formats match 5.0.0', async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-url-differential-'))
  try {
    const projectRoot = path.join(temporary, 'project')
    const sourceDirectory = path.join(projectRoot, 'styles', 'nested')
    const buildDirectory = path.join(projectRoot, 'build')
    fs.mkdirSync(sourceDirectory, { recursive: true })
    fs.mkdirSync(buildDirectory, { recursive: true })
    const sourceFile = path.join(sourceDirectory, '_partial.scss')
    const resourcePath = path.join(buildDirectory, 'bundle.css')
    const content = [
      '.first { background: url("./asset.png?size=2#icon"); }',
      '.remote { src: url(https://example.test/font.woff2); }',
      '.module { src: url(~module/file.woff2); }'
    ].join('\n')
    fs.writeFileSync(sourceFile, content)
    fs.writeFileSync(resourcePath, content)
    fs.writeFileSync(path.join(sourceDirectory, 'asset.png'), 'asset')
    const sourceMap = identitySourceMap(content, sourceFile, resourcePath)

    for (const webpackVersion of [4, 5]) {
      for (const mapInput of [sourceMap, JSON.stringify(sourceMap)]) {
        const parameters = {
          content,
          sourceMap: mapInput,
          options: { sourceMap: true },
          resourcePath,
          projectRoot,
          webpackVersion
        }
        const [actual, expected] = await Promise.all([
          runLoader(maintained, parameters),
          runLoader(baseline, parameters)
        ])
        assert.deepEqual(comparable(actual), comparable(expected), `webpack ${webpackVersion}`)
        assert.match(actual.content, /\.\.\/styles\/nested\/asset\.png\?size=2#icon/)
        assert.equal(actual.map.sources.every((source) => !path.isAbsolute(source)), true)
      }
    }
  } finally {
    fs.rmSync(temporary, { force: true, recursive: true })
  }
})

test('custom join item, rewritten URI, and debug diagnostics match 5.0.0', async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-url-custom-diff-'))
  try {
    const sourceDirectory = path.join(temporary, 'source')
    const outputDirectory = path.join(temporary, 'output')
    fs.mkdirSync(sourceDirectory)
    fs.mkdirSync(outputDirectory)
    const sourceFile = path.join(sourceDirectory, 'source.scss')
    const resourcePath = path.join(outputDirectory, 'bundle.css')
    const replacement = path.join(sourceDirectory, 'replacement.png')
    const content = '.x { background: url("ignored.png?raw#fragment"); }'
    fs.writeFileSync(sourceFile, content)
    fs.writeFileSync(resourcePath, content)
    fs.writeFileSync(replacement, 'asset')
    const sourceMap = identitySourceMap(content, sourceFile, resourcePath)

    function createJoin(log, seen) {
      return function join(options, loaderContext) {
        assert.equal(options.debug, log)
        assert.equal(loaderContext.resourcePath, resourcePath)
        return function joined(item) {
          seen.push(item)
          return replacement
        }
      }
    }

    const actualSeen = []
    const expectedSeen = []
    const actualLog = () => undefined
    const expectedLog = () => undefined
    const [actual, expected] = await Promise.all([
      runLoader(maintained, {
        content,
        sourceMap,
        options: { sourceMap: true, debug: actualLog, join: createJoin(actualLog, actualSeen) },
        resourcePath,
        projectRoot: temporary
      }),
      runLoader(baseline, {
        content,
        sourceMap,
        options: { sourceMap: true, debug: expectedLog, join: createJoin(expectedLog, expectedSeen) },
        resourcePath,
        projectRoot: temporary
      })
    ])
    assert.deepEqual(comparable(actual), comparable(expected))
    assert.deepEqual(actualSeen, expectedSeen)
    assert.equal(actualSeen[0].query, '?raw#fragment')
    assert.match(actual.content, /\.\.\/source\/replacement\.png\?raw#fragment/)
  } finally {
    fs.rmSync(temporary, { force: true, recursive: true })
  }
})

test('representative warnings and validation errors match 5.0.0', async () => {
  const resourcePath = path.join(__dirname, 'fixture.css')
  const cases = [
    { content: '.x{}', sourceMap: null, options: { sourceMap: false } },
    { content: '.x{}', sourceMap: '{bad', options: {} },
    { content: '.x{}', sourceMap: null, options: { join: true } },
    { content: '.x{}', sourceMap: null, options: { root: true, sourceMap: false } }
  ]
  for (const parameters of cases) {
    const complete = { ...parameters, resourcePath, projectRoot: __dirname }
    const [actual, expected] = await Promise.all([
      runLoader(maintained, complete),
      runLoader(baseline, complete)
    ])
    assert.deepEqual(comparable(actual), comparable(expected))
  }
})
