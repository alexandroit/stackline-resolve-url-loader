import loader = require('../index')

declare function valueProcessor(options: {
  join: loader.JoinProper
  root: false | string
  directory: string
}): (value: string, getPathsAtChar: (offset: number) => loader.OriginalBases) => string

export = valueProcessor
