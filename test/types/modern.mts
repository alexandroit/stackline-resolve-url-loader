import loader, {
  asGenerator,
  createJoinImplementation,
  createJoinFunction,
  defaultJoin
} from '../../index.mjs'
import cjsLoader, { asGenerator as bridgedAsGenerator } from '../../index.js'

const generator = asGenerator((item) => ['/source', ['/fallback', item.uri]])
const implementation = createJoinImplementation(generator)
const custom = createJoinFunction('modern', implementation)
const selected: typeof defaultJoin = custom
const callable: typeof loader = loader
const bridged: typeof asGenerator = bridgedAsGenerator
const sameLoader: typeof loader = cjsLoader

void selected
void callable
void bridged
void sameLoader
