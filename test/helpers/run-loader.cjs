'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { SourceMapGenerator } = require('source-map')

function identitySourceMap(content, sourceFile, generatedFile = sourceFile) {
  const generator = new SourceMapGenerator({ file: generatedFile })
  const source = sourceFile
  const lines = content.split(/\r\n|\r|\n/)
  lines.forEach((_, index) => {
    generator.addMapping({
      generated: { line: index + 1, column: 0 },
      original: { line: index + 1, column: 0 },
      source
    })
  })
  generator.setSourceContent(source, content)
  return generator.toJSON()
}

function runLoader(loader, parameters) {
  const {
    content,
    sourceMap = null,
    options = {},
    resourcePath,
    projectRoot = path.dirname(resourcePath),
    webpackVersion = 5,
    context = path.dirname(resourcePath)
  } = parameters

  return new Promise((resolve, reject) => {
    const errors = []
    const warnings = []
    let cacheableCalls = 0
    let asyncRequested = false
    let complete = false

    const finish = (error, output = content, outputMap) => {
      if (complete) return
      complete = true
      resolve({
        error: error || null,
        content: output,
        map: outputMap,
        errors,
        warnings,
        cacheableCalls
      })
    }

    const loaderContext = {
      context,
      resourcePath,
      rootContext: projectRoot,
      sourceMap: options.sourceMap === undefined ? true : options.sourceMap,
      fs,
      query: options,
      options: {
        context: projectRoot,
        output: { directory: path.join(projectRoot, 'dist') }
      },
      loaders: [{ request: resourcePath }],
      loaderIndex: 0,
      cacheable() { cacheableCalls += 1 },
      async() {
        asyncRequested = true
        return finish
      },
      emitError(error) { errors.push(error) },
      emitWarning(warning) { warnings.push(warning) }
    }

    if (webpackVersion >= 5) {
      loaderContext.getOptions = () => options
    }

    try {
      const returned = loader.call(loaderContext, content, sourceMap)
      if (!asyncRequested) finish(null, returned)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { identitySourceMap, runLoader }
