import loader = require('../index')

export function sanitise(candidate: unknown): loader.SourcePosition
export function strToOffset(candidate: string): loader.SourcePosition
export function add(list: loader.SourcePosition[]): loader.SourcePosition
