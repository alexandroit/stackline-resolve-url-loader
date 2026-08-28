import assert from 'node:assert/strict'

import facade, {
  asGenerator,
  createJoinImplementation,
  createJoinFunction,
  defaultJoinGenerator,
  defaultJoin
} from '../index.mjs'
import cjsDefault, {
  asGenerator as bridgedAsGenerator,
  defaultJoin as bridgedDefaultJoin
} from '../index.js'

assert.equal(typeof facade, 'function')
assert.equal(facade, cjsDefault)
assert.equal(asGenerator, facade.asGenerator)
assert.equal(createJoinImplementation, facade.createJoinImplementation)
assert.equal(createJoinFunction, facade.createJoinFunction)
assert.equal(defaultJoinGenerator, facade.defaultJoinGenerator)
assert.equal(defaultJoin, facade.defaultJoin)
assert.equal(bridgedAsGenerator, facade.asGenerator)
assert.equal(bridgedDefaultJoin, facade.defaultJoin)
console.log('ESM facade and Node CommonJS named-export bridge passed.')
