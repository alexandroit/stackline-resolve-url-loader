export function prepend(candidate: string): string
export function prepend<T extends { sources: string[] }>(candidate: T): T
export function remove(candidate: string, platform?: string): string
export function remove<T extends { sources: string[] }>(candidate: T, platform?: string): T
