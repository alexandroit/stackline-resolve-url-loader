'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')

const processCss = require('../lib/engine/postcss')
const fileProtocol = require('../lib/file-protocol')

test('issue 239 drive file URLs lose only the synthetic root slash on Windows', () => {
  assert.equal(fileProtocol.remove('file:///D:/MyProjects/terria/source.scss', 'win32'), 'D:/MyProjects/terria/source.scss')
  assert.equal(fileProtocol.remove('file:///d:\\MyProjects\\terria\\source.scss', 'win32'), 'd:\\MyProjects\\terria\\source.scss')
  assert.equal(fileProtocol.remove('file://D:/MyProjects/terria/source.scss', 'win32'), 'D:/MyProjects/terria/source.scss')
})

test('POSIX drive-looking paths, ordinary roots, UNC-like paths, and non-file strings do not regress', () => {
  assert.equal(fileProtocol.remove('file:///D:/literal-posix-name', 'linux'), '/D:/literal-posix-name')
  assert.equal(fileProtocol.remove('file:///srv/project/source.scss', 'linux'), '/srv/project/source.scss')
  assert.equal(fileProtocol.remove('file:////server/share/source.scss', 'linux'), '//server/share/source.scss')
  assert.equal(fileProtocol.remove('/D:/literal-posix-name', 'linux'), '/D:/literal-posix-name')
  assert.equal(fileProtocol.remove('https://example.test/source.scss', 'linux'), 'https://example.test/source.scss')
})

async function captureOriginalBases(originalSource) {
  let captured
  await processCss('/generated/output.css', '.x { background: url("asset.png"); }', {
    outputSourceMap: false,
    absSourceMap: null,
    sourceMapConsumer: {
      originalPositionFor() { return { source: originalSource } }
    },
    removeCR: false,
    transformDeclaration(value, getPathsAtChar) {
      captured = getPathsAtChar(0)
      return value
    }
  })
  return captured
}

test('the PostCSS boundary supplies a usable Windows drive base for issue 239', {
  skip: process.platform !== 'win32'
}, async () => {
  const bases = await captureOriginalBases('file:///D:/MyProjects/terria/styles/source.scss')
  assert.deepEqual(new Set(Object.values(bases)), new Set(['D:/MyProjects/terria/styles']))
})

test('the same PostCSS boundary retains a rooted POSIX base', async () => {
  const bases = await captureOriginalBases('file:///srv/project/styles/source.scss')
  assert.deepEqual(new Set(Object.values(bases)), new Set(['/srv/project/styles']))
})
