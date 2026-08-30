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
  'loader-utils': 'npm:@stackline/loader-utils@1.0.2',
  postcss: '8.5.26',
  'regex-parser': '2.3.1',
  'source-map': '0.6.1'
})
assert.match(ownLicense, /Copyright \(c\) 2016 Ben Holloway/)
assert.equal(vendoredLicense, upstreamVendoredLicense)

const expected = [
  ['emojis-list', '3.0.0', 'MIT', 'LICENSE.md', 'emojis-list-3.0.0-MIT.txt'],
  ['json5', '2.2.3', 'MIT', 'LICENSE.md', 'json5-2.2.3-MIT.txt'],
  ['loader-utils', '1.0.2', 'MIT', 'LICENSE', 'stackline-loader-utils-1.0.2-MIT.txt'],
  ['nanoid', '3.3.18', 'MIT', 'LICENSE', 'nanoid-3.3.18-MIT.txt'],
  ['picocolors', '1.1.1', 'ISC', 'LICENSE', 'picocolors-1.1.1-ISC.txt'],
  ['postcss', '8.5.26', 'MIT', 'LICENSE', 'postcss-8.5.26-MIT.txt'],
  ['regex-parser', '2.3.1', 'MIT', 'LICENSE', 'regex-parser-2.3.1-MIT.txt'],
  ['source-map', '0.6.1', 'BSD-3-Clause', 'LICENSE', 'source-map-0.6.1-BSD-3-Clause.txt'],
  ['source-map-js', '1.2.1', 'BSD-3-Clause', 'LICENSE', 'source-map-js-1.2.1-BSD-3-Clause.txt']
]

for (const [name, version, licenseId, sourceFile, shippedFile] of expected) {
  const metadata = JSON.parse(await readFile(path.join(root, 'node_modules', name, 'package.json'), 'utf8'))
  assert.equal(metadata.version, version, `${name} version`)
  assert.equal(metadata.license, licenseId, `${name} license`)
  const sourceText = await readFile(path.join(root, 'node_modules', name, sourceFile), 'utf8')
  const shippedText = await readFile(path.join(root, 'licenses', shippedFile), 'utf8')
  assert.equal(shippedText, sourceText, `${name} full license text`)
  assert.match(notices, new RegExp(`${name.replaceAll('.', '\\.')}[^\\n]*${version.replaceAll('.', '\\.')}`))
}

const production = Object.entries(lock.packages)
  .filter(([location, metadata]) => location && !metadata.dev)
  .map(([location]) => location)
assert.deepEqual(production.sort(), expected.map(([name]) => `node_modules/${name}`).sort())
console.log('Production and vendored license inventory passed for all ten components.')
