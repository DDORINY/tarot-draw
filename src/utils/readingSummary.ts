import type { ReadingCategory, TarotSpread } from '../types/reading'
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

export interface ReadingFlowSection {
  label: string
  text: string
}

export interface ReadingFlowSummary {
  title: string
  intro: string
  sections: ReadingFlowSection[]
  extraSections: ReadingFlowSection[]
  closing?: string
}

type FlowField =
  | 'summary'
  | 'love'
  | 'career'
  | 'money'
  | 'relationship'
  | 'advice'
  | 'shadow'
  | 'emotion'
  | 'action'
  | 'subconscious'
  | 'outcome'

const FLOW_INTROS: Record<ReadingCategory, { title: string; intro: string }> = {
  'inner-feelings': {
    title: '상대의 속마음',
    intro: '겉으로 드러나는 태도와 내면의 감정, 관계에 대한 의도와 행동 가능성을 순서대로 살펴봅니다.',
  },
  love: {
    title: '연애 · 관계',
    intro: '감정과 관계의 흐름, 주의할 점과 앞으로의 가능성을 중심으로 살펴봅니다.',
  },
  money: {
    title: '금전운',
    intro: '현재 금전 흐름과 도움·방해 요소, 주의점과 앞으로의 가능성을 중심으로 살펴봅니다.',
  },
  career: {
    title: '직업 · 이직',
    intro: '현재 직업 상황과 강점, 장애물, 기회와 향후 방향을 중심으로 살펴봅니다.',
  },
  timeline: {
    title: '과거 · 현재 · 미래',
    intro: '과거의 배경에서 현재의 흐름을 거쳐 앞으로 이어질 가능성을 순서대로 살펴봅니다.',
  },
  choice: {
    title: '선택 · 고민',
    intro: '현재 상황과 각 선택의 흐름, 선택할 때 고려할 점을 나란히 살펴봅니다.',
  },
  daily: {
    title: '오늘의 메시지',
    intro: '오늘 눈여겨볼 핵심 흐름과 필요한 태도를 간결하게 살펴봅니다.',
  },
  self: {
    title: '나 자신 · 내면',
    intro: '현재 감정과 의식, 무의식의 패턴과 필요한 태도를 차분히 살펴봅니다.',
  },
  free: {
    title: '자유 리딩',
    intro: '선택한 카드의 주요 키워드와 전체적인 구성을 중심으로 살펴봅니다.',
  },
}

const FLOW_FIELDS: Record<ReadingCategory, readonly FlowField[]> = {
  'inner-feelings': ['relationship', 'love', 'shadow', 'relationship', 'action'],
  love: ['love', 'relationship', 'shadow', 'advice', 'outcome'],
  money: ['money', 'money', 'shadow', 'shadow', 'outcome'],
  career: ['career', 'advice', 'shadow', 'action', 'outcome'],
  timeline: ['summary', 'summary', 'outcome'],
  choice: ['summary', 'summary', 'shadow', 'summary', 'shadow'],
  daily: ['summary', 'summary', 'advice'],
  self: ['emotion', 'summary', 'subconscious', 'shadow', 'advice'],
  free: [],
}

function getFlowText(card: TarotCard, orientation: RevealedCard['orientation'], field: FlowField): string {
  const meaning = orientation === 'upright' ? card.upright : card.reversed

  if (field === 'emotion' || field === 'action' || field === 'subconscious' || field === 'outcome') {
    return card.themes[field]
  }

  return meaning[field]
}

export function createReadingFlowSummary({
  category,
  spread,
  revealedCards,
  cards,
}: {
  category: ReadingCategory
  spread: TarotSpread | null
  revealedCards: readonly RevealedCard[]
  cards: readonly TarotCard[]
}): ReadingFlowSummary {
  const cardsById = new Map(cards.map((card) => [card.id, card]))
  const orderedCards = [...revealedCards].sort((a, b) => a.drawIndex - b.drawIndex)
  const guideLength = spread?.positions.length ?? 0
  const sections: ReadingFlowSection[] = []
  const extraSections: ReadingFlowSection[] = []

  if (category !== 'free') {
    for (const revealedCard of orderedCards) {
      const card = cardsById.get(revealedCard.cardId)
      if (!card) continue

      if (spread && revealedCard.drawIndex >= guideLength) {
        extraSections.push({
          label: `추가 카드 ${revealedCard.drawIndex - guideLength + 1}`,
          text: getFlowText(card, revealedCard.orientation, 'summary'),
        })
        continue
      }

      const fieldOrder = FLOW_FIELDS[category]
      const field = fieldOrder[revealedCard.drawIndex] ?? fieldOrder.at(-1) ?? 'summary'
      sections.push({
        label: spread?.positions[revealedCard.drawIndex]?.title ?? `${revealedCard.drawIndex + 1}번째 카드`,
        text: getFlowText(card, revealedCard.orientation, field),
      })
    }
  }

  const firstRevealed = orderedCards[0]
  const firstCard = firstRevealed ? cardsById.get(firstRevealed.cardId) : undefined
  const closing = firstCard && firstRevealed
    ? getFlowText(firstCard, firstRevealed.orientation, 'advice')
    : undefined

  return {
    ...FLOW_INTROS[category],
    sections,
    extraSections,
    closing,
  }
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
