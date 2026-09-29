import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'))
const notices = await readFile(path.join(root, 'THIRD_PARTY_LICENSES.md'), 'utf8')
const ownLicense = await readFile(path.join(root, 'LICENSE'), 'utf8')
const vendoredLicense = await readFile(path.join(root, 'lib/vendor/adjust-sourcemap-loader/LICENSE'), 'utf8')
const upstreamVendoredLicense = await readFile(path.join(root, 'node_modules/adjust-sourcemap-loader/LICENSE'), 'utf8')

assert.deepEqual(packageJson.dependencies, {
  'loader-utils': 'npm:@stackline/loader-utils@1.0.4',
  postcss: '8.5.26',
  'regex-parser': 'npm:@stackline/regex-parser@1.0.0',
  'source-map': 'npm:@stackline/source-map-js@1.0.0'
})
assert.match(ownLicense, /Copyright \(c\) 2016 Ben Holloway/)
assert.equal(vendoredLicense, upstreamVendoredLicense)

const expected = [
  ['node_modules/loader-utils/node_modules/emojis-list', '@stackline/emojis-list', '1.0.0', 'MIT', 'LICENSE.md', 'emojis-list-3.0.0-MIT.txt'],
  ['node_modules/loader-utils/node_modules/json5', '@stackline/json5', '1.0.0', 'MIT', 'LICENSE.md', 'json5-2.2.3-MIT.txt'],
  ['node_modules/loader-utils', '@stackline/loader-utils', '1.0.4', 'MIT', 'LICENSE', 'stackline-loader-utils-1.0.2-MIT.txt'],
  ['node_modules/nanoid', 'nanoid', '3.3.18', 'MIT', 'LICENSE', 'nanoid-3.3.18-MIT.txt'],
  ['node_modules/picocolors', 'picocolors', '1.1.1', 'ISC', 'LICENSE', 'picocolors-1.1.1-ISC.txt'],
  ['node_modules/postcss', 'postcss', '8.5.26', 'MIT', 'LICENSE', 'postcss-8.5.26-MIT.txt'],
  ['node_modules/regex-parser', '@stackline/regex-parser', '1.0.0', 'MIT', 'LICENSE', 'regex-parser-2.3.1-MIT.txt'],
  ['node_modules/source-map', '@stackline/source-map-js', '1.0.0', 'BSD-3-Clause', 'LICENSE', 'source-map-js-1.2.1-BSD-3-Clause.txt'],
  ['node_modules/source-map-js', 'source-map-js', '1.2.1', 'BSD-3-Clause', 'LICENSE', 'source-map-js-1.2.1-BSD-3-Clause.txt']
]

for (const [location, name, version, licenseId, sourceFile, shippedFile] of expected) {
  const metadata = JSON.parse(await readFile(path.join(root, location, 'package.json'), 'utf8'))
  assert.equal(metadata.name, name, `${location} identity`)
  assert.equal(metadata.version, version, `${name} version`)
  assert.equal(metadata.license, licenseId, `${name} license`)
  const sourceText = await readFile(path.join(root, location, sourceFile), 'utf8')
  const shippedText = await readFile(path.join(root, 'licenses', shippedFile), 'utf8')
  assert.equal(shippedText, sourceText, `${name} full license text`)
  assert.ok(notices.includes(`${name} ${version}`), `${name} notice identity/version`)
}

const production = Object.entries(lock.packages)
  .filter(([location, metadata]) => location && !metadata.dev)
  .map(([location]) => location)
assert.deepEqual(production.sort(), expected.map(([location]) => location).sort())
console.log('Alias-aware production and vendored license inventory passed.')
