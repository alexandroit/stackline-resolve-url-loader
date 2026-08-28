import { rm } from 'node:fs/promises'

await Promise.all([
  rm(new URL('../coverage/', import.meta.url), { force: true, recursive: true }),
  rm(new URL('../.test-output/', import.meta.url), { force: true, recursive: true })
])
console.log('Cleaned local coverage and test output.')
