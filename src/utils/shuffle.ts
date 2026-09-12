import { secureRandomInt } from './random'

export function secureShuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1)
    const current = shuffled[i]

    shuffled[i] = shuffled[j]
    shuffled[j] = current
  }

  return shuffled
}
