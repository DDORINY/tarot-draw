import type { TarotOrientation } from '../types/tarot'
import { secureRandomInt } from './random'

export function getRandomOrientation(
  includeReversed: boolean,
): TarotOrientation {
  if (!includeReversed) {
    return 'upright'
  }

  return secureRandomInt(2) === 0 ? 'upright' : 'reversed'
}
