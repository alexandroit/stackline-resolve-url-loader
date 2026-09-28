import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const vendor = fileURLToPath(new URL('../lib/vendor/adjust-sourcemap-loader/', import.meta.url))
// Reviewed v4 baseline with the linear-time error formatting patch documented in NOTICE.
const expectedDigest = '614507a63a737555a473c995cbb1e061c88d6bcefe5c9c8e869c839764be977f'

async function list(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const absolute = path.join(directory, entry.name)
    return entry.isDirectory() ? list(absolute) : [absolute]
  }))
  return nested.flat()
}

const files = (await list(vendor)).sort()
const hash = createHash('sha256')
for (const file of files) {
  hash.update(path.relative(vendor, file).replaceAll(path.sep, '/'))
  hash.update('\0')
  hash.update(await readFile(file))
  hash.update('\0')
}
const actualDigest = hash.digest('hex')
assert.equal(actualDigest, expectedDigest, 'vendored v4 processor/codecs must match the reviewed security patch')
assert.equal(files.filter((file) => file.endsWith('.js')).length, 25)
console.log(`Vendored adjust-sourcemap-loader@4 integrity passed (${actualDigest}).`)
