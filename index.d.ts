declare function resolveUrlLoader(
  this: resolveUrlLoader.LoaderContext,
  content: string,
  sourceMap?: resolveUrlLoader.SourceMap | string | null
): string

declare namespace resolveUrlLoader {
  interface SourcePosition {
    line: number
    column: number
  }

  interface SourceMap {
    version: number
    sources: string[]
    names?: string[]
    mappings: string
    file?: string
    sourceRoot?: string
    sourcesContent?: Array<string | null>
    [field: string]: unknown
  }

  interface OriginalBases {
    subString: string
    value: string
    property: string
    selector: string
  }

  interface JoinItem {
    uri: string
    query: string
    isAbsolute: boolean
    bases: OriginalBases
  }

  interface JoinAttempt {
    base: string
    uri: string
    joined: string
    isSuccess: boolean
    isFallback: boolean
  }

  interface InputFileSystem {
    statSync(path: string): {
      isFile(): boolean
      isDirectory(): boolean
    }
  }

  interface LoaderContext {
    context: string
    resourcePath: string
    sourceMap?: boolean
    fs: InputFileSystem
    query?: Options
    options?: {
      context?: string
      output?: { directory?: string }
    }
    getOptions?(): Options
    cacheable(): void
    async(): LoaderCallback
    emitError(error: Error): void
    emitWarning(warning: Error): void
    [field: string]: unknown
  }

  interface Options {
    sourceMap?: boolean
    silent?: boolean
    removeCR?: boolean
    root?: false | string
    debug?: boolean | ((message: string) => void)
    join?: JoinFunction
  }

  type LoaderCallback = (error: Error | null, content?: string, sourceMap?: SourceMap) => void
  type JoinIteratorValue = string | readonly [string | null, string]
  type JoinIterator = Iterator<readonly [string | null, string]>
  type JoinGeneratorResult = JoinIteratorValue[] | Iterator<JoinIteratorValue>
  type JoinGenerator = (item: JoinItem, options: Options, loader: LoaderContext) => JoinGeneratorResult
  type NormalizedJoinGenerator = (item: JoinItem, options: Options, loader: LoaderContext) => JoinIterator
  type JoinImplementation = (item: JoinItem, options: Options, loader: LoaderContext) => JoinAttempt[]
  type JoinProper = (item: JoinItem) => string | null
  type JoinFunction = (options: Options, loader: LoaderContext) => JoinProper

  function asGenerator(generator: JoinGenerator): NormalizedJoinGenerator
  function createJoinImplementation(generator: NormalizedJoinGenerator): JoinImplementation
  function createJoinFunction(name: string, implementation: JoinImplementation): JoinFunction
  const defaultJoinGenerator: NormalizedJoinGenerator
  const defaultJoin: JoinFunction
}

export = resolveUrlLoader
