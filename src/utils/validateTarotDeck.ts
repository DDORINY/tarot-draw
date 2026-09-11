import type { TarotCard } from '../types/tarot'

type DeckValidationInput = {
  totalExpected: number
  perArcana: {
    major: number
    wands: number
    cups: number
    swords: number
    pentacles: number
  }
}

type ValidationIssue = {
  field: string
  cardId?: number
  message: string
}

export type ValidationResult = {
  valid: boolean
  totalCards: number
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

const EXPECTED: DeckValidationInput = {
  totalExpected: 78,
  perArcana: {
    major: 22,
    wands: 14,
    cups: 14,
    swords: 14,
    pentacles: 14,
  },
}

const requiredMeaningKeys = [
  'keywords',
  'summary',
  'love',
  'career',
  'money',
  'relationship',
  'advice',
  'shadow',
] as const

const requiredThemeKeys = ['emotion', 'action', 'subconscious', 'outcome', 'timing'] as const

const validateMeaning = (id: number, orientation: string, orientationData: Record<string, unknown>) => {
  const issues: ValidationIssue[] = []
  const meaningful = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0

  requiredMeaningKeys.forEach((key) => {
    if (key === 'keywords') {
      const candidate = orientationData[key]
      if (!Array.isArray(candidate) || candidate.length === 0 || !candidate.every((value) => typeof value === 'string')) {
        issues.push({
          field: `${orientation}.${key}`,
          cardId: id,
          message: `${key} must be a non-empty string array.`,
        })
      }
      return
    }

    if (!meaningful(orientationData[key])) {
      issues.push({
        field: `${orientation}.${key}`,
        cardId: id,
        message: `${key} must be a non-empty string.`,
      })
    }
  })

  return issues
}

const validateThemes = (id: number, themes: Record<string, unknown>) => {
  const issues: ValidationIssue[] = []
  requiredThemeKeys.forEach((key) => {
    const value = themes[key]
    if (typeof value !== 'string' || value.trim().length === 0) {
      issues.push({
        field: `themes.${key}`,
        cardId: id,
        message: `${key} must be a non-empty string.`,
      })
    }
  })
  return issues
}

export function validateTarotDeck(cards: TarotCard[]): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const ids = new Set<number>()
  const slugs = new Set<string>()
  const suitCounts = {
    major: 0,
    wands: 0,
    cups: 0,
    swords: 0,
    pentacles: 0,
  }

  cards.forEach((card, index) => {
    if (!Number.isInteger(card.id) || card.id < 0 || card.id > 77) {
      errors.push({ field: 'id', cardId: card.id, message: `id must be integer between 0 and 77 (found ${card.id}).` })
    }

    if (!slugs.has(card.slug)) {
      slugs.add(card.slug)
    } else {
      errors.push({ field: 'slug', cardId: card.id, message: `duplicate slug: ${card.slug}` })
    }

    if (!ids.has(card.id)) {
      ids.add(card.id)
    } else {
      errors.push({ field: 'id', cardId: card.id, message: `duplicate id: ${card.id}` })
    }

    const hasName = typeof card.name === 'string' && card.name.trim().length > 0
    const hasNameKo = typeof card.nameKo === 'string' && card.nameKo.trim().length > 0
    if (!hasName || !hasNameKo) {
      errors.push({
        field: 'name',
        cardId: card.id,
        message: 'name and nameKo are required non-empty strings.',
      })
    }

    if (!(typeof card.slug === 'string') || card.slug.trim().length === 0) {
      errors.push({ field: 'slug', cardId: card.id, message: `slug missing for card index ${index}.` })
    }

    if (typeof card.image !== 'string' || card.image.trim().length === 0) {
      errors.push({ field: 'image', cardId: card.id, message: `${card.nameKo} image path is required.` })
    } else if (!card.image.startsWith('/cards/')) {
      warnings.push({ field: 'image', cardId: card.id, message: `${card.nameKo} image path should start with /cards/.` })
    }

    if (!(typeof card.archetype === 'string') || card.archetype.trim().length === 0) {
      errors.push({ field: 'archetype', cardId: card.id, message: `${card.nameKo} archetype is required.` })
    }

    if (!Array.isArray(card.symbols) || card.symbols.length < 1) {
      warnings.push({ field: 'symbols', cardId: card.id, message: `${card.nameKo} has no symbols.` })
    }

    errors.push(...validateMeaning(card.id, 'upright', card.upright as unknown as Record<string, unknown>))
    errors.push(...validateMeaning(card.id, 'reversed', card.reversed as unknown as Record<string, unknown>))
    errors.push(...validateThemes(card.id, card.themes as unknown as Record<string, unknown>))

    if (card.arcana === 'major') {
      suitCounts.major += 1
      if (card.suit !== 'major') {
        errors.push({ field: 'suit', cardId: card.id, message: `${card.nameKo} arcana major but suit is not major.` })
      }
      if (card.number === null || card.number < 0 || card.number > 21) {
        errors.push({ field: 'number', cardId: card.id, message: `${card.nameKo} major must have number 0-21.` })
      }
      if (card.id >= 22) {
        warnings.push({ field: 'id', cardId: card.id, message: `${card.nameKo} major card id is expected 0-21.` })
      }
    }

    if (card.arcana === 'minor') {
      if (card.suit === 'wands') {
        suitCounts.wands += 1
        if (card.id < 22 || card.id > 35) {
          warnings.push({ field: 'id', cardId: card.id, message: `${card.nameKo} id is outside wands range 22-35.` })
        }
      } else if (card.suit === 'cups') {
        suitCounts.cups += 1
        if (card.id < 36 || card.id > 49) {
          warnings.push({ field: 'id', cardId: card.id, message: `${card.nameKo} id is outside cups range 36-49.` })
        }
      } else if (card.suit === 'swords') {
        suitCounts.swords += 1
        if (card.id < 50 || card.id > 63) {
          warnings.push({ field: 'id', cardId: card.id, message: `${card.nameKo} id is outside swords range 50-63.` })
        }
      } else if (card.suit === 'pentacles') {
        suitCounts.pentacles += 1
        if (card.id < 64 || card.id > 77) {
          warnings.push({ field: 'id', cardId: card.id, message: `${card.nameKo} id is outside pentacles range 64-77.` })
        }
      } else {
        errors.push({ field: 'suit', cardId: card.id, message: `${card.nameKo} minor card has invalid suit ${card.suit}.` })
      }
    }
  })

  if (cards.length !== EXPECTED.totalExpected) {
    errors.push({
      field: 'length',
      message: `Total cards must be ${EXPECTED.totalExpected} (found ${cards.length}).`,
    })
  }

  if (suitCounts.major !== EXPECTED.perArcana.major) {
    warnings.push({
      field: 'major',
      message: `Major count should be ${EXPECTED.perArcana.major} (found ${suitCounts.major}).`,
    })
  }
  if (suitCounts.wands !== EXPECTED.perArcana.wands) {
    warnings.push({
      field: 'wands',
      message: `Wands count should be ${EXPECTED.perArcana.wands} (found ${suitCounts.wands}).`,
    })
  }
  if (suitCounts.cups !== EXPECTED.perArcana.cups) {
    warnings.push({
      field: 'cups',
      message: `Cups count should be ${EXPECTED.perArcana.cups} (found ${suitCounts.cups}).`,
    })
  }
  if (suitCounts.swords !== EXPECTED.perArcana.swords) {
    warnings.push({
      field: 'swords',
      message: `Swords count should be ${EXPECTED.perArcana.swords} (found ${suitCounts.swords}).`,
    })
  }
  if (suitCounts.pentacles !== EXPECTED.perArcana.pentacles) {
    warnings.push({
      field: 'pentacles',
      message: `Pentacles count should be ${EXPECTED.perArcana.pentacles} (found ${suitCounts.pentacles}).`,
    })
  }

  return {
    valid: errors.length === 0,
    totalCards: cards.length,
    errors,
    warnings,
  }
}
