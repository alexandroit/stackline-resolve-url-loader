import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-resolve-url-webpack4-'))
const consumer = path.join(temporary, 'consumer')

function run(command, arguments_, cwd = root, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(command, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio,
    // Windows cannot execute npm.cmd directly through CreateProcess. Let
    // Node route only that batch-file invocation through cmd.exe; Unix keeps
    // the argument-safe direct exec path.
    shell: process.platform === 'win32' && command === npm
  })
}

try {
  await mkdir(consumer)
  const packedOutput = run(npm, [
    'pack', '--silent', '--json', '--ignore-scripts', '--pack-destination', temporary
  ]).trim()
  const packedStart = packedOutput.lastIndexOf('\n[')
  const packed = JSON.parse(packedStart === -1 ? packedOutput : packedOutput.slice(packedStart + 1))
  assert.equal(packed.length, 1)

  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'resolve-url-loader-webpack4-fixture',
    private: true,
    version: '1.0.0',
    dependencies: {
      '@stackline/resolve-url-loader': `file:../${packed[0].filename}`,
      sass: '1.103.1',
      'sass-loader': '10.5.2',
      webpack: '4.47.0'
    }
  }, null, 2) + '\n')
  run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)

  await writeFile(path.join(consumer, 'capture-loader.cjs'), `
'use strict'
module.exports = function capture(content, sourceMap) {
  this.emitFile('resolved-webpack4.css', content)
  this.emitFile('resolved-webpack4.map.json', JSON.stringify(sourceMap, null, 2))
  return 'module.exports = ' + JSON.stringify(content)
}
`)
  await writeFile(path.join(consumer, 'harness.cjs'), `
'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const webpack = require('webpack')

const source = path.join(__dirname, 'src')
const partials = path.join(source, 'partials')
const output = path.join(__dirname, 'dist')
fs.mkdirSync(partials, { recursive: true })
fs.writeFileSync(path.join(source, 'index.scss'), '@use "partials/thing";\\n')
fs.writeFileSync(path.join(partials, '_thing.scss'), '.icon { background-image: url("./asset.png?cache=1#icon"); }\\n')
fs.writeFileSync(path.join(partials, 'asset.png'), 'asset')

const configuration = {
  context: __dirname,
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.scss',
  output: { path: output, filename: 'bundle.js', hashFunction: 'sha256' },
  module: {
    rules: [{
      test: /\\.scss$/,
      use: [
        require.resolve('./capture-loader.cjs'),
        { loader: require.resolve('@stackline/resolve-url-loader'), options: { sourceMap: true } },
        { loader: require.resolve('sass-loader'), options: { sourceMap: true } }
      ]
    }]
  },
  stats: 'errors-warnings'
}

webpack(configuration, (error, stats) => {
  if (error) throw error
  if (stats.hasErrors()) throw new Error(stats.toString({ all: false, errors: true, warnings: true }))
  const css = fs.readFileSync(path.join(output, 'resolved-webpack4.css'), 'utf8')
  const map = JSON.parse(fs.readFileSync(path.join(output, 'resolved-webpack4.map.json'), 'utf8'))
  assert.match(css, /partials\\/asset\\.png\\?cache=1#icon/)
  assert.ok(map.sources.some((sourceName) => /^partials\\//.test(sourceName.replace(/\\\\/g, '/'))))
  assert.equal(map.sources.every((sourceName) => !path.isAbsolute(sourceName)), true)
  console.log('isolated webpack 4/current Dart Sass source-relative build passed')
})
`)
  run(process.execPath, ['harness.cjs'], consumer, 'inherit')
} finally {
  await rm(temporary, { force: true, recursive: true })
}
