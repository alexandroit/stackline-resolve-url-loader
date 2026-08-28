import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const notice = await readFile(new URL('../NOTICE', import.meta.url), 'utf8')
const escapedVersion = packageJson.version.replaceAll('.', '\\.')

assert.match(changelog, new RegExp(`^## ${escapedVersion} - \\d{4}-\\d{2}-\\d{2}$`, 'm'))
assert.equal(packageJson.name, '@stackline/resolve-url-loader')
assert.equal(packageJson.version, '1.0.0')
assert.equal(packageJson.publishConfig.access, 'public')
assert.equal(packageJson.repository.url, 'git+https://github.com/alexandroit/stackline-resolve-url-loader.git')
assert.match(notice, /not affiliated with or endorsed by Ben Holloway/)
console.log(`Release metadata passed for ${packageJson.name}@${packageJson.version}.`)
