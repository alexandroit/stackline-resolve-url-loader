import loader = require('../../index')

interface ProcessParameters {
  outputSourceMap: boolean
  absSourceMap: loader.SourceMap | null
  sourceMapConsumer: {
    originalPositionFor(position: loader.SourcePosition): { source?: string | null }
  } | null
  removeCR: boolean
  transformDeclaration(
    value: string,
    getPathsAtChar: (offset: number) => loader.OriginalBases
  ): string
}

declare function processCss(
  sourceFile: string,
  sourceContent: string,
  parameters: ProcessParameters
): Promise<{ content: string; map: loader.SourceMap | null }>

export = processCss
