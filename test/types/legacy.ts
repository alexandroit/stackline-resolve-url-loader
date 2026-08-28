import loader = require('../..')
import joinHelpers = require('../../lib/join-function')
import valueProcessor = require('../../lib/value-processor')

const options: loader.Options = { sourceMap: true, root: false }
const normalized = loader.asGenerator((item) => ['/source', ['/fallback', item.uri]])
const implementation = loader.createJoinImplementation(normalized)
const join: loader.JoinFunction = loader.createJoinFunction('typed', implementation)
options.join = join

const processValue = valueProcessor({
  directory: '/output',
  root: false,
  join: () => null
})
const output: string = processValue('url(asset.png)', () => ({
  subString: '/source',
  value: '/source',
  property: '/source',
  selector: '/source'
}))

const same: typeof loader.defaultJoin = joinHelpers.defaultJoin
void output
void same
