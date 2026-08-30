import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-resolve-url-smoke-'))
const consumer = path.join(temporary, 'consumer')

function run(command, arguments_, cwd = root, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(command, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio
  })
}

try {
  await mkdir(consumer)
  const output = run(npm, [
    'pack', '--silent', '--json', '--ignore-scripts', '--pack-destination', temporary
  ]).trim()
  const start = output.lastIndexOf('\n[')
  const packed = JSON.parse(start === -1 ? output : output.slice(start + 1))
  assert.equal(packed.length, 1)
  const archive = packed[0].filename

  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'resolve-url-loader-packed-consumer',
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/resolve-url-loader': `file:../${archive}`,
      'resolve-url-loader': `file:../${archive}`
    }
  }, null, 2) + '\n')
  run(npm, ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'], consumer)

  await writeFile(path.join(consumer, 'commonjs.cjs'), `
const assert = require('node:assert/strict')
const scoped = require('@stackline/resolve-url-loader')
const legacy = require('resolve-url-loader')
const scopedJoin = require('@stackline/resolve-url-loader/lib/join-function')
const legacyValue = require('resolve-url-loader/lib/value-processor.js')
const vendorProcess = require('@stackline/resolve-url-loader/lib/vendor/adjust-sourcemap-loader/lib/process')
assert.equal(typeof scoped, 'function')
assert.deepEqual(Object.keys(scoped), Object.keys(legacy))
assert.equal(scoped.defaultJoin, scopedJoin.defaultJoin)
assert.equal(typeof legacyValue, 'function')
assert.equal(typeof vendorProcess, 'function')
assert.equal(require('@stackline/resolve-url-loader/package.json').version, '1.0.1')
console.log('packed scoped, historical-key, and deep CommonJS entries passed')
`)
  await writeFile(path.join(consumer, 'module.mjs'), `
import assert from 'node:assert/strict'
import loader, { asGenerator, defaultJoin } from '@stackline/resolve-url-loader'
import facade, { createJoinFunction } from '@stackline/resolve-url-loader/index.mjs'
assert.equal(typeof loader, 'function')
assert.equal(asGenerator, loader.asGenerator)
assert.equal(defaultJoin, loader.defaultJoin)
assert.equal(facade, loader)
assert.equal(createJoinFunction, loader.createJoinFunction)
console.log('packed root ESM bridge and explicit ESM facade passed')
`)
  run(process.execPath, ['commonjs.cjs'], consumer, 'inherit')
  run(process.execPath, ['module.mjs'], consumer, 'inherit')

  const installed = JSON.parse(await readFile(path.join(
    consumer, 'node_modules', '@stackline', 'resolve-url-loader', 'package.json'
  ), 'utf8'))
  assert.equal(installed.exports, undefined)
  assert.deepEqual(installed.dependencies, {
    'loader-utils': 'npm:@stackline/loader-utils@1.0.2',
    postcss: '8.5.26',
    'regex-parser': '2.3.1',
    'source-map': '0.6.1'
  })
  assert.equal(installed.dependencies['adjust-sourcemap-loader'], undefined)
  const tree = JSON.parse(run(npm, ['ls', '--omit=dev', '--all', '--json'], consumer))
  assert.equal(tree.problems, undefined)
  console.log('Packed scoped/alias, CJS/ESM, deep-entry, and production-tree consumers passed.')
} finally {
  await rm(temporary, { force: true, recursive: true })
}
