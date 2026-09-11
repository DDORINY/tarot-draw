export type TarotArcana = 'major' | 'minor'

export type TarotSuit =
  | 'major'
  | 'wands'
  | 'cups'
  | 'swords'
  | 'pentacles'

export type TarotOrientation = 'upright' | 'reversed'

export type TarotElement =
  | 'fire'
  | 'water'
  | 'air'
  | 'earth'

export type TarotRank =
  | 'ace'
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'seven'
  | 'eight'
  | 'nine'
  | 'ten'
  | 'page'
  | 'knight'
  | 'queen'
  | 'king'

export interface TarotMeaning {
  keywords: string[]
  summary: string
  love: string
  career: string
  money: string
  relationship: string
  advice: string
  shadow: string
}

export interface TarotThemes {
  emotion: string
  action: string
  subconscious: string
  outcome: string
  timing: string
}

export interface TarotCard {
  id: number
  name: string
  nameKo: string
  slug: string
  arcana: TarotArcana
  suit: TarotSuit
  number: number | null
  rank?: TarotRank
  image: string
  element?: TarotElement
  astrology?: string
  planet?: string
  zodiac?: string
  numerology?: number
  symbols: string[]
  archetype: string
  upright: TarotMeaning
  reversed: TarotMeaning
  themes: TarotThemes
}

export interface DrawnCard {
  cardId: number
  orientation: TarotOrientation
  drawIndex: number
}
