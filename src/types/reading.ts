export type ReadingCategory =
  | 'inner-feelings'
  | 'love'
  | 'money'
  | 'career'
  | 'timeline'
  | 'choice'
  | 'daily'
  | 'self'
  | 'free'

export interface ReadingCategoryInfo {
  id: ReadingCategory
  label: string
  description: string
  questions: readonly string[]
}

export interface SpreadPosition {
  title: string
  description: string
}

export interface TarotSpread {
  id: string
  category: ReadingCategory | 'general'
  name: string
  description: string
  cardCount: number
  difficulty: 'beginner' | 'intermediate'
  positions: readonly SpreadPosition[]
}
