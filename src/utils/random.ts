const UINT32_RANGE = 0x1_0000_0000

const getCrypto = (): Crypto => {
  if (
    typeof globalThis.crypto === 'undefined' ||
    typeof globalThis.crypto.getRandomValues !== 'function'
  ) {
    throw new Error('Secure random generation requires the Web Crypto API.')
  }

  return globalThis.crypto
}

export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isFinite(maxExclusive)) {
    throw new RangeError('secureRandomInt(maxExclusive): maxExclusive must be a finite number.')
  }

  if (!Number.isInteger(maxExclusive)) {
    throw new RangeError('secureRandomInt(maxExclusive): maxExclusive must be an integer.')
  }

  if (maxExclusive < 1) {
    throw new RangeError('secureRandomInt(maxExclusive): maxExclusive must be at least 1.')
  }

  if (maxExclusive > UINT32_RANGE) {
    throw new RangeError('secureRandomInt(maxExclusive): maxExclusive must be <= 0x1_0000_0000.')
  }

  const crypto = getCrypto()
  const buffer = new Uint32Array(1)
  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive)

  let randomValue: number

  do {
    crypto.getRandomValues(buffer)
    randomValue = buffer[0]
  } while (randomValue >= limit)

  return randomValue % maxExclusive
}
