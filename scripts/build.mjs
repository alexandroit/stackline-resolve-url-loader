import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const vendorJson = JSON.parse(await readFile(
  new URL('../lib/vendor/adjust-sourcemap-loader/package.json', import.meta.url), 'utf8'
))
const loader = require('..')
const facade = await import(new URL('../index.mjs', import.meta.url))

assert.equal(packageJson.name, '@stackline/resolve-url-loader')
assert.equal(packageJson.version, '1.0.0')
assert.equal(packageJson.exports, undefined, 'deep entries must not be encapsulated by an exports map')
assert.equal(vendorJson.name, 'adjust-sourcemap-loader')
assert.equal(vendorJson.version, '4.0.0')
assert.equal(typeof loader, 'function')
assert.equal(facade.default, loader)
for (const name of Object.keys(loader)) assert.equal(facade[name], loader[name], `${name} ESM facade`)
console.log('Validated the source-distributed CJS build, ESM facade, and vendored v4 metadata.')
