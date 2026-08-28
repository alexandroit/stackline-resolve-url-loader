import loader = require('../../index')

export function pathToString(absolutePath: string): string
export function formatJoinMessage(
  filename: string,
  uri: string,
  attempts: loader.JoinAttempt[]
): string
export function createDebugLogger(
  debug: boolean | ((message: string) => void)
): (formatter: (...parameters: any[]) => string, parameters: any[]) => void
