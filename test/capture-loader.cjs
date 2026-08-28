'use strict'

module.exports = function captureLoader(content, sourceMap) {
  const options = typeof this.getOptions === 'function' ? this.getOptions() : this.query
  const label = options && options.label || 'unknown'
  this.emitFile(`resolved-${label}.css`, content)
  this.emitFile(`resolved-${label}.map.json`, JSON.stringify(sourceMap, null, 2))
  return `module.exports = ${JSON.stringify(content)}`
}
