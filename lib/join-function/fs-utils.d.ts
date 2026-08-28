import loader = require('../../index')

declare function fsUtils(fileSystem: loader.InputFileSystem): {
  isFileSync(path: string): boolean
  isDirectorySync(path: string): boolean
  existsSync(path: string): boolean
}

export = fsUtils
