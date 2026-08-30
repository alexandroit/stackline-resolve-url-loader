'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const webpack5 = require('webpack')

const loaderPath = require.resolve('..')
const capturePath = require.resolve('./capture-loader.cjs')
const sassLoaderPath = require.resolve('sass-loader')

function compile(webpack, configuration) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(configuration)
    compiler.run((error, stats) => {
      const finish = () => {
        if (error) reject(error)
        else if (stats.hasErrors()) reject(new Error(stats.toString({ all: false, errors: true, warnings: true })))
        else resolve(stats)
      }
      if (typeof compiler.close === 'function') compiler.close(finish)
      else finish()
    })
  })
}

async function runWebpack() {
  const major = 5
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), `resolve-url-webpack-${major}-`))
  const source = path.join(temporary, 'src')
  const partials = path.join(source, 'partials')
  const output = path.join(temporary, 'dist')
  fs.mkdirSync(partials, { recursive: true })
  fs.writeFileSync(path.join(source, 'index.scss'), '@use "partials/thing";\n')
  fs.writeFileSync(path.join(partials, '_thing.scss'), '.icon { background-image: url("./asset.png?cache=1#icon"); }\n')
  fs.writeFileSync(path.join(partials, 'asset.png'), 'asset')
  const webpack = webpack5
  const previousCwd = process.cwd()
  try {
    // adjust-sourcemap-loader v4 defines webpack 5 project-relative output
    // against cwd. Real webpack invocations run from the project root.
    process.chdir(temporary)
    await compile(webpack, {
      context: temporary,
      mode: 'development',
      devtool: 'source-map',
      entry: './src/index.scss',
      output: {
        path: output,
        filename: 'bundle.js',
        hashFunction: 'sha256'
      },
      module: {
        rules: [{
          test: /\.scss$/,
          use: [
            { loader: capturePath, options: { label: `webpack${major}` } },
            { loader: loaderPath, options: { sourceMap: true } },
            {
              loader: sassLoaderPath,
              options: {
                sourceMap: true,
                sassOptions: { silenceDeprecations: ['legacy-js-api'] }
              }
            }
          ]
        }]
      },
      stats: 'errors-warnings'
    })
    const css = fs.readFileSync(path.join(output, `resolved-webpack${major}.css`), 'utf8')
    const map = JSON.parse(fs.readFileSync(path.join(output, `resolved-webpack${major}.map.json`), 'utf8'))
    assert.match(css, /partials\/asset\.png\?cache=1#icon/)
    assert.equal(map.version, 3)
    assert.ok(map.sources.some((sourceName) => /partials\/_thing\.scss$/.test(sourceName.replace(/\\/g, '/'))))
    assert.equal(map.sources.every((sourceName) => !path.isAbsolute(sourceName)), true)
    assert.ok(
      map.sources.some((sourceName) => /^src\//.test(sourceName.replace(/\\/g, '/'))),
      JSON.stringify(map.sources)
    )
  } finally {
    process.chdir(previousCwd)
    fs.rmSync(temporary, { force: true, recursive: true })
  }
}

test('real webpack 5 build rebases current Dart Sass output and emits project-relative maps', async () => {
  await runWebpack()
})
