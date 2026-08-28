import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  access,
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const destination = path.join(root, 'release-candidate')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const sourceCommit = process.env.STACKLINE_SOURCE_COMMIT || ''
const sourceTag = process.env.STACKLINE_SOURCE_TAG || ''
const sourceClean = process.env.STACKLINE_SOURCE_CLEAN || ''

assert.match(sourceCommit, /^[0-9a-f]{40}$/,
  'STACKLINE_SOURCE_COMMIT must identify the frozen 40-character source commit')
assert.equal(sourceTag, 'stackline-v1.0.0',
  'STACKLINE_SOURCE_TAG must be stackline-v1.0.0')
assert.equal(sourceClean, '1',
  'STACKLINE_SOURCE_CLEAN=1 must attest that the project-scoped source is clean')

function run(arguments_, cwd = root, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(npm, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio
  })
}

function digest(algorithm, bytes, encoding = 'hex') {
  return createHash(algorithm).update(bytes).digest(encoding)
}

try {
  await access(destination)
  throw new Error(`release candidate already exists: ${destination}`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

run(['run', 'verify'], root, 'inherit')
let staging = await mkdtemp(path.join(root, '.release-candidate-staging-'))

try {
  // Resolve npm's exact allowlisted package inventory first, then copy it to a
  // normalized source tree. This keeps every shipped regular file at 0644
  // even when the checkout was created under a restrictive builder umask.
  const dryOutput = run(['pack', '--silent', '--json', '--dry-run', '--ignore-scripts']).trim()
  const dryStart = dryOutput.lastIndexOf('\n[')
  const dry = JSON.parse(dryStart === -1 ? dryOutput : dryOutput.slice(dryStart + 1))
  assert.equal(dry.length, 1)
  const sourceStaging = await mkdtemp(path.join(staging, '.source-'))
  for (const { path: file } of dry[0].files) {
    const target = path.join(sourceStaging, file)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(root, file), target)
    await chmod(target, 0o644)
  }

  const packedOutput = run([
    'pack', '--silent', '--json', '--ignore-scripts', '--pack-destination', staging
  ], sourceStaging).trim()
  const packedStart = packedOutput.lastIndexOf('\n[')
  const packed = JSON.parse(packedStart === -1 ? packedOutput : packedOutput.slice(packedStart + 1))
  assert.equal(packed.length, 1)
  const details = packed[0]
  assert.ok(details.files.every(({ mode }) => mode === 0o644),
    'every shipped regular file must have mode 0644')
  await rm(sourceStaging, { force: true, recursive: true })
  const archive = path.join(staging, details.filename)
  const bytes = await readFile(archive)
  const sha1 = digest('sha1', bytes)
  const sha256 = digest('sha256', bytes)
  const sha512 = digest('sha512', bytes)
  assert.equal(details.shasum, sha1)
  assert.equal(details.integrity, `sha512-${digest('sha512', bytes, 'base64')}`)

  const manifest = {
    schema: 'stackline-release-artifact-v1',
    package: `${details.name}@${details.version}`,
    filename: details.filename,
    sha1,
    sha256,
    sha512,
    integrity: details.integrity,
    packedSize: details.size,
    unpackedSize: details.unpackedSize,
    entryCount: details.entryCount,
    modePolicy: 'all shipped regular files are 0644',
    sourceCommit,
    sourceTag,
    cleanSourceAttestation: true,
    upstream: {
      resolveUrlLoaderCommit: 'e2695cde68f325f617825e168173df92236efb93',
      adjustSourceMapLoaderCommit: '5f173eef'
    },
    builder: {
      node: process.version,
      npm: run(['--version']).trim(),
      platform: `${process.platform}-${process.arch}`,
      environment: 'local-stackline-release-gate'
    },
    files: details.files.map(({ path: file, size, mode }) => ({ file, size, mode }))
  }
  await writeFile(path.join(staging, 'artifact-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  await writeFile(path.join(staging, 'inventory.json'), JSON.stringify({
    package: manifest.package,
    files: manifest.files
  }, null, 2) + '\n')
  await writeFile(path.join(staging, 'SHA1SUMS'), `${sha1}  ${details.filename}\n`)
  await writeFile(path.join(staging, 'SHA256SUMS'), `${sha256}  ${details.filename}\n`)
  await writeFile(path.join(staging, 'SHA512SUMS'), `${sha512}  ${details.filename}\n`)
  await copyFile(path.join(root, 'CHANGELOG.md'), path.join(staging, 'RELEASE_NOTES.md'))
  await copyFile(path.join(root, 'THIRD_PARTY_LICENSES.md'), path.join(staging, 'THIRD_PARTY_LICENSES.md'))
  await writeFile(path.join(staging, 'licenses.json'), JSON.stringify({
    package: { name: '@stackline/resolve-url-loader', license: 'MIT', file: 'LICENSE' },
    vendored: [{
      name: 'adjust-sourcemap-loader',
      version: '4.0.0',
      license: 'MIT',
      file: 'lib/vendor/adjust-sourcemap-loader/LICENSE',
      sourceCommit: '5f173eef'
    }],
    productionDependencies: [
      ['big.js', '5.2.2', 'MIT', 'licenses/big.js-5.2.2-MIT.txt'],
      ['emojis-list', '3.0.0', 'MIT', 'licenses/emojis-list-3.0.0-MIT.txt'],
      ['json5', '2.2.3', 'MIT', 'licenses/json5-2.2.3-MIT.txt'],
      ['loader-utils', '2.0.4', 'MIT', 'licenses/loader-utils-2.0.4-MIT.txt'],
      ['nanoid', '3.3.18', 'MIT', 'licenses/nanoid-3.3.18-MIT.txt'],
      ['picocolors', '1.1.1', 'ISC', 'licenses/picocolors-1.1.1-ISC.txt'],
      ['postcss', '8.5.26', 'MIT', 'licenses/postcss-8.5.26-MIT.txt'],
      ['regex-parser', '2.3.1', 'MIT', 'licenses/regex-parser-2.3.1-MIT.txt'],
      ['source-map', '0.6.1', 'BSD-3-Clause', 'licenses/source-map-0.6.1-BSD-3-Clause.txt'],
      ['source-map-js', '1.2.1', 'BSD-3-Clause', 'licenses/source-map-js-1.2.1-BSD-3-Clause.txt']
    ].map(([name, version, license, file]) => ({ name, version, license, file })),
    notices: ['NOTICE', 'THIRD_PARTY_LICENSES.md']
  }, null, 2) + '\n')

  const sbomConsumer = await mkdtemp(path.join(staging, '.sbom-consumer-'))
  await writeFile(path.join(sbomConsumer, 'package.json'), JSON.stringify({
    name: 'resolve-url-loader-sbom-consumer', private: true, version: '1.0.0'
  }, null, 2) + '\n')
  run(['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', archive], sbomConsumer)
  const sbom = run(['sbom', '--omit=dev', '--sbom-format', 'cyclonedx'], sbomConsumer)
  const parsed = JSON.parse(sbom)
  const components = [parsed.metadata && parsed.metadata.component, ...(parsed.components || [])].filter(Boolean)
  assert.ok(components.some(({ name, version }) =>
    name === '@stackline/resolve-url-loader' && version === '1.0.0'))
  await writeFile(path.join(staging, 'sbom.cdx.json'), sbom)
  await rm(sbomConsumer, { force: true, recursive: true })

  await rename(staging, destination)
  staging = null
  console.log(`Prepared immutable ${details.filename} (${sha256}).`)
} finally {
  if (staging) await rm(staging, { force: true, recursive: true })
}
