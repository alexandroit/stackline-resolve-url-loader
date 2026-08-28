import loader = require('../index')

declare function logToTestHarness(
  stream: { write(chunk: string): unknown } | null | undefined,
  options: loader.Options
): void

export = logToTestHarness
