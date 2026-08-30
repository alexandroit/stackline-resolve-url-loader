import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const registry = process.env.STACKLINE_TEST_REGISTRY || 'http://127.0.0.1:4873/'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-resolve-url-registry-'))

function run(command, arguments_, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(command, arguments_, {
    cwd: temporary,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio
  })
}

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    name: 'resolve-url-loader-registry-consumer',
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/resolve-url-loader': '1.0.1',
      'resolve-url-loader': 'npm:@stackline/resolve-url-loader@1.0.1'
    }
  }, null, 2) + '\n')
  run(npm, [
    'install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--registry', registry
  ])
  await writeFile(path.join(temporary, 'consumer.cjs'), `
const assert = require('node:assert/strict')
const scoped = require('@stackline/resolve-url-loader')
const legacy = require('resolve-url-loader')
const deep = require('resolve-url-loader/lib/join-function')
assert.equal(typeof scoped, 'function')
assert.deepEqual(Object.keys(scoped), Object.keys(legacy))
assert.equal(deep.defaultJoin, legacy.defaultJoin)
console.log('registry scoped, npm-alias, and deep consumers passed')
`)
  run(process.execPath, ['consumer.cjs'], 'inherit')
  const tree = JSON.parse(run(npm, ['ls', '--omit=dev', '--all', '--json']))
  assert.equal(tree.problems, undefined)
} finally {
  await rm(temporary, { force: true, recursive: true })
}
