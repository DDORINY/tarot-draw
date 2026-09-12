import type { ReadingCategory } from '../types/reading'
import type { RevealedCard, TarotCard, TarotSuit } from '../types/tarot'

type MinorSuit = Exclude<TarotSuit, 'major'>

export interface ReadingSummary {
  totalCards: number
  uprightCount: number
  reversedCount: number
  majorCount: number
  minorCount: number
  suitCounts: Record<MinorSuit, number>
  topKeywords: string[]
  dominantSuit: MinorSuit | null
  dominantSuitCount: number
  majorRatio: number
  reversedRatio: number
  observations: string[]
}

const SUITS: readonly MinorSuit[] = ['wands', 'cups', 'swords', 'pentacles']
const HIGH_MAJOR_RATIO = 0.6
const NOTABLE_MAJOR_RATIO = 0.4
const HIGH_REVERSED_RATIO = 0.6
const LOW_REVERSED_RATIO = 0.2

const SUIT_OBSERVATIONS: Record<MinorSuit, string> = {
  cups: '감정, 관계, 공감과 같은 정서적 요소가 강하게 나타난 리딩입니다.',
  wands: '행동, 추진력, 열정과 변화의 에너지가 강조된 리딩입니다.',
  swords: '생각, 판단, 갈등, 결정과 관련된 요소가 두드러진 리딩입니다.',
  pentacles: '현실적인 조건, 안정, 일, 금전과 관련된 요소가 강조된 리딩입니다.',
}

const CATEGORY_SUIT_OBSERVATIONS: Partial<Record<ReadingCategory, Partial<Record<MinorSuit, string>>>> = {
  'inner-feelings': { cups: '감정과 관계를 나타내는 카드의 비중이 상대적으로 높습니다.' },
  love: { cups: '감정과 관계를 나타내는 카드의 비중이 상대적으로 높습니다.' },
  money: { pentacles: '현실적인 조건과 금전 흐름을 나타내는 카드가 많이 등장했습니다.' },
  career: {
    wands: '직업의 추진력과 변화에 관련된 카드가 상대적으로 많이 등장했습니다.',
    pentacles: '업무의 현실적인 조건과 안정에 관련된 카드가 상대적으로 많이 등장했습니다.',
  },
}

export function createReadingSummary(
  revealedCards: readonly RevealedCard[],
  cards: readonly TarotCard[],
  category: ReadingCategory,
  includeReversed: boolean,
): ReadingSummary {
  const cardsById = new Map(cards.map((card) => [card.id, card]))
  const suitCounts: Record<MinorSuit, number> = { wands: 0, cups: 0, swords: 0, pentacles: 0 }
  const keywordCounts = new Map<string, { count: number; firstIndex: number }>()
  let majorCount = 0
  let reversedCount = 0
  let keywordIndex = 0

  for (const revealedCard of revealedCards) {
    const card = cardsById.get(revealedCard.cardId)
    if (!card) continue

    if (card.arcana === 'major') majorCount += 1
    else if (card.suit !== 'major') suitCounts[card.suit] += 1
    if (revealedCard.orientation === 'reversed') reversedCount += 1

    const meaning = revealedCard.orientation === 'reversed' ? card.reversed : card.upright
    for (const keyword of meaning.keywords) {
      const current = keywordCounts.get(keyword)
      keywordCounts.set(keyword, {
        count: (current?.count ?? 0) + 1,
        firstIndex: current?.firstIndex ?? keywordIndex,
      })
      keywordIndex += 1
    }
  }

  const totalCards = revealedCards.length
  const minorCount = totalCards - majorCount
  const uprightCount = totalCards - reversedCount
  const majorRatio = totalCards === 0 ? 0 : majorCount / totalCards
  const reversedRatio = totalCards === 0 ? 0 : reversedCount / totalCards
  const highestSuitCount = Math.max(...SUITS.map((suit) => suitCounts[suit]))
  const leadingSuits = SUITS.filter((suit) => suitCounts[suit] === highestSuitCount)
  const dominantSuit = highestSuitCount > 0 && leadingSuits.length === 1 ? leadingSuits[0] : null
  const keywordLimit = totalCards === 1 ? 3 : totalCards <= 3 ? 4 : 6
  const topKeywords = [...keywordCounts.entries()]
    .sort(([, a], [, b]) => b.count - a.count || a.firstIndex - b.firstIndex)
    .slice(0, keywordLimit)
    .map(([keyword]) => keyword)
  const observations: string[] = []

  if (totalCards >= 3 && dominantSuit) {
    observations.push(CATEGORY_SUIT_OBSERVATIONS[category]?.[dominantSuit] ?? SUIT_OBSERVATIONS[dominantSuit])
  }
  if (totalCards >= 3 && majorRatio >= HIGH_MAJOR_RATIO) {
    observations.push('메이저 아르카나가 많이 나온 리딩으로, 일상적인 문제보다 큰 방향성이나 전환점이 강조됩니다.')
  } else if (totalCards >= 3 && majorRatio >= NOTABLE_MAJOR_RATIO) {
    observations.push('메이저 아르카나의 비중이 높아 현재 질문에서 비교적 큰 변화나 중요한 주제가 강조됩니다.')
  }
  if (totalCards >= 3 && includeReversed && reversedRatio >= HIGH_REVERSED_RATIO) {
    observations.push('역방향 카드의 비중이 높아 지연, 내면화, 막힘 또는 재검토가 필요한 흐름이 상대적으로 많이 나타납니다.')
  } else if (totalCards >= 3 && includeReversed && reversedRatio <= LOW_REVERSED_RATIO) {
    observations.push('정방향 카드가 중심을 이루어 현재 흐름이 비교적 직접적으로 드러나는 리딩입니다.')
  }

  return {
    totalCards,
    uprightCount,
    reversedCount,
    majorCount,
    minorCount,
    suitCounts,
    topKeywords,
    dominantSuit,
    dominantSuitCount: dominantSuit ? suitCounts[dominantSuit] : highestSuitCount,
    majorRatio,
    reversedRatio,
    observations: observations.slice(0, 3),
  }
}
