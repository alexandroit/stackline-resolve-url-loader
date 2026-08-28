import loader = require('../../index')

declare const helpers: {
  asGenerator: typeof loader.asGenerator
  createJoinImplementation: typeof loader.createJoinImplementation
  createJoinFunction: typeof loader.createJoinFunction
  defaultJoinGenerator: typeof loader.defaultJoinGenerator
  defaultJoin: typeof loader.defaultJoin
}

export = helpers
