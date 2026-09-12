import type { ReadingCategory } from '../types/reading'
import type { TarotMeaning, TarotThemes } from '../types/tarot'

type MeaningSource = 'meaning' | 'themes'
type MeaningKey = Exclude<keyof TarotMeaning, 'keywords' | 'summary' | 'advice'> | keyof TarotThemes

export interface MeaningSection {
  key: MeaningKey
  label: string
  value: string
}

interface SectionDefinition {
  key: MeaningKey
  label: string
  source: MeaningSource
}

const DETAIL_SECTIONS: readonly SectionDefinition[] = [
  { key: 'love', label: '연애', source: 'meaning' },
  { key: 'relationship', label: '관계', source: 'meaning' },
  { key: 'career', label: '직업 · 이직', source: 'meaning' },
  { key: 'money', label: '금전', source: 'meaning' },
  { key: 'shadow', label: '숨겨진 흐름', source: 'meaning' },
  { key: 'emotion', label: '현재 감정', source: 'themes' },
  { key: 'action', label: '행동 경향', source: 'themes' },
  { key: 'subconscious', label: '내면 · 무의식', source: 'themes' },
  { key: 'outcome', label: '앞으로의 가능성', source: 'themes' },
  { key: 'timing', label: '시기 · 속도감', source: 'themes' },
]

const PRIMARY_BY_CATEGORY: Record<ReadingCategory, readonly MeaningKey[]> = {
  'inner-feelings': ['relationship', 'love', 'shadow'],
  love: ['love', 'relationship'],
  money: ['money', 'shadow'],
  career: ['career', 'shadow'],
  timeline: ['outcome'],
  choice: ['shadow'],
  daily: [],
  self: ['emotion', 'subconscious'],
  free: [],
}

const CATEGORY_LABELS: Partial<Record<ReadingCategory, Partial<Record<MeaningKey, string>>>> = {
  'inner-feelings': { love: '감정 · 연애', shadow: '숨겨진 흐름' },
  money: { shadow: '주의할 점' },
  career: { shadow: '주의할 점' },
  choice: { shadow: '주의할 점' },
}

function toSection(
  definition: SectionDefinition,
  category: ReadingCategory,
  meaning: TarotMeaning,
  themes: TarotThemes,
): MeaningSection {
  const value = definition.source === 'meaning'
    ? meaning[definition.key as keyof TarotMeaning]
    : themes[definition.key as keyof TarotThemes]

  return {
    key: definition.key,
    label: CATEGORY_LABELS[category]?.[definition.key] ?? definition.label,
    value: String(value),
  }
}

export function getPrimaryMeaningSections(
  category: ReadingCategory,
  meaning: TarotMeaning,
  themes: TarotThemes,
): MeaningSection[] {
  const primaryKeys = new Set(PRIMARY_BY_CATEGORY[category])

  return DETAIL_SECTIONS
    .filter(({ key }) => primaryKeys.has(key))
    .map((definition) => toSection(definition, category, meaning, themes))
}

export function getSecondaryMeaningSections(
  category: ReadingCategory,
  meaning: TarotMeaning,
  themes: TarotThemes,
): MeaningSection[] {
  const primaryKeys = new Set(PRIMARY_BY_CATEGORY[category])

  return DETAIL_SECTIONS
    .filter(({ key }) => !primaryKeys.has(key))
    .map((definition) => toSection(definition, category, meaning, themes))
}
