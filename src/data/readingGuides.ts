import type {
  ReadingCategory,
  ReadingCategoryInfo,
  TarotSpread,
} from '../types/reading'

export const readingCategories: readonly ReadingCategoryInfo[] = [
  {
    id: 'inner-feelings',
    label: '상대의 속마음',
    description: '관계에서 보이는 태도와 내면의 감정, 숨겨진 생각과 앞으로의 행동 가능성을 타로의 관점에서 살펴봅니다.',
    questions: [
      '상대는 현재 나를 어떻게 느끼고 있을까?',
      '상대가 겉으로 보이는 마음과 속으로 느끼는 감정은 어떻게 다를까?',
      '상대는 나와의 관계에서 무엇을 원하고 있을까?',
      '상대가 앞으로 어떤 행동을 보일 가능성이 있을까?',
      '이 관계에서 내가 아직 보지 못하고 있는 것은 무엇일까?',
    ],
  },
  {
    id: 'love',
    label: '연애 · 관계',
    description: '두 사람 사이의 현재 흐름과 관계를 성장시키는 요소, 반복되는 감정의 패턴을 살펴봅니다.',
    questions: [
      '우리 관계의 현재 흐름은 어떨까?',
      '이 관계가 발전하려면 무엇이 필요할까?',
      '현재 우리 사이의 가장 큰 장애물은 무엇일까?',
      '새로운 인연이 들어오는 흐름은 어떨까?',
      '내가 연애에서 반복하고 있는 패턴은 무엇일까?',
    ],
  },
  {
    id: 'money',
    label: '금전운',
    description: '현재의 금전 흐름과 방해 요인, 주의할 점과 앞으로 열릴 수 있는 가능성을 살펴봅니다.',
    questions: [
      '현재 나의 금전 흐름은 어떨까?',
      '앞으로 돈과 관련해 주의해야 할 점은 무엇일까?',
      '현재 재정 상황을 개선하려면 무엇이 필요할까?',
      '새로운 수입 기회가 들어올 가능성은 어떨까?',
      '지금 생각하고 있는 금전적 선택에서 무엇을 고려해야 할까?',
    ],
  },
  {
    id: 'career',
    label: '직업 · 이직',
    description: '현재 직업 상황과 기회, 장애물과 강점을 살피고 앞으로의 방향을 정리합니다.',
    questions: [
      '현재 직장에서의 흐름은 어떨까?',
      '이직을 고려할 때 무엇을 가장 중요하게 봐야 할까?',
      '새로운 직업 기회가 들어오는 흐름은 어떨까?',
      '현재 직업에서 나를 막고 있는 것은 무엇일까?',
      '내가 앞으로 키워야 할 직업적 강점은 무엇일까?',
    ],
  },
  {
    id: 'timeline',
    label: '과거 · 현재 · 미래',
    description: '지나온 배경과 지금의 핵심을 연결해, 현재 흐름이 이어질 때의 가능성을 살펴봅니다.',
    questions: [
      '이 상황은 어떻게 시작되었고 앞으로 어떻게 흘러갈까?',
      '현재 내가 놓치고 있는 흐름은 무엇일까?',
      '과거의 어떤 영향이 현재 상황에 이어지고 있을까?',
    ],
  },
  {
    id: 'choice',
    label: '선택 · 고민',
    description: '서로 다른 선택의 흐름과 고려할 점을 비교해 스스로 결정할 수 있는 관점을 얻습니다.',
    questions: [
      'A를 선택했을 때 어떤 흐름이 예상될까?',
      'B를 선택했을 때 어떤 흐름이 예상될까?',
      '이 결정을 내릴 때 가장 중요하게 고려해야 할 것은 무엇일까?',
      '지금 결정을 미루고 있는 이유는 무엇일까?',
    ],
  },
  {
    id: 'daily',
    label: '오늘의 메시지',
    description: '오늘의 중심 흐름과 주의할 점, 지금 필요한 태도를 짧고 선명하게 살펴봅니다.',
    questions: [
      '오늘 내가 가장 주의해야 할 것은 무엇일까?',
      '오늘 나에게 필요한 태도는 무엇일까?',
      '오늘의 핵심 메시지는 무엇일까?',
    ],
  },
  {
    id: 'self',
    label: '나 자신 · 내면',
    description: '현재 감정과 아직 인식하지 못한 욕구, 반복되는 패턴과 필요한 변화를 살펴봅니다.',
    questions: [
      '현재 내 감정의 핵심은 무엇일까?',
      '내가 아직 인식하지 못한 욕구는 무엇일까?',
      '지금 나에게 가장 필요한 변화는 무엇일까?',
      '내가 반복하고 있는 패턴은 무엇일까?',
    ],
  },
  {
    id: 'free',
    label: '자유 질문',
    description: '정해진 형식 없이 질문과 카드 장수를 직접 정하는 자유 리딩입니다.',
    questions: [],
  },
]

export const tarotSpreads: readonly TarotSpread[] = [
  {
    id: 'one-card-message', category: 'daily', name: '오늘의 메시지',
    description: '지금 가장 필요한 한 가지 메시지에 집중합니다.', cardCount: 1, difficulty: 'beginner',
    positions: [{ title: '지금 필요한 메시지', description: '오늘 마음에 담아둘 핵심 흐름' }],
  },
  {
    id: 'past-present-future', category: 'timeline', name: '과거 · 현재 · 미래',
    description: '시간의 흐름을 따라 상황을 세 장으로 읽습니다.', cardCount: 3, difficulty: 'beginner',
    positions: [
      { title: '과거', description: '현재 상황에 영향을 준 배경' },
      { title: '현재', description: '지금 가장 중요한 흐름' },
      { title: '미래', description: '현재 흐름이 이어졌을 때의 가능성' },
    ],
  },
  {
    id: 'situation-advice-outcome', category: 'general', name: '상황 · 조언 · 결과',
    description: '어떤 주제에도 사용할 수 있는 균형 잡힌 기본 스프레드입니다.', cardCount: 3, difficulty: 'beginner',
    positions: [
      { title: '상황', description: '현재 상황의 핵심' },
      { title: '조언', description: '현재 도움이 되는 태도 또는 행동' },
      { title: '결과', description: '현재 흐름이 이어졌을 때의 가능성' },
    ],
  },
  {
    id: 'relationship-three', category: 'love', name: '관계 리딩',
    description: '나와 상대, 두 사람 사이의 관계 에너지를 살펴봅니다.', cardCount: 3, difficulty: 'beginner',
    positions: [
      { title: '나', description: '나의 감정과 태도' },
      { title: '상대', description: '상대 측의 감정 또는 태도로 해석되는 흐름' },
      { title: '관계', description: '두 사람 사이의 현재 관계 에너지' },
    ],
  },
  {
    id: 'inner-feelings-five', category: 'inner-feelings', name: '속마음 리딩',
    description: '겉으로 보이는 태도와 내면의 여러 층위를 다섯 장으로 살펴봅니다.', cardCount: 5, difficulty: 'intermediate',
    positions: [
      { title: '겉으로 드러난 마음', description: '상대가 외부적으로 보여주는 태도나 표현' },
      { title: '내면의 감정', description: '상대의 감정 상태를 타로 관점에서 살펴보는 자리' },
      { title: '숨기고 있는 생각', description: '쉽게 드러내지 않는 고민이나 생각' },
      { title: '관계에 대한 의도', description: '이 관계를 대하는 태도와 방향성' },
      { title: '앞으로의 행동 가능성', description: '현재 흐름이 이어질 경우 나타날 수 있는 행동' },
    ],
  },
  {
    id: 'money-five', category: 'money', name: '금전운',
    description: '현재 재정 흐름의 도움과 방해 요소를 함께 살펴봅니다.', cardCount: 5, difficulty: 'intermediate',
    positions: ['현재 금전 흐름', '도움이 되는 요소', '방해 요소', '주의할 점', '앞으로의 가능성'].map((title) => ({ title, description: `${title}에 해당하는 흐름` })),
  },
  {
    id: 'career-five', category: 'career', name: '직업 · 이직',
    description: '직업적 강점과 장애물, 기회를 통해 다음 방향을 살펴봅니다.', cardCount: 5, difficulty: 'intermediate',
    positions: ['현재 직업 상황', '나의 강점', '장애물', '기회', '조언 및 향후 흐름'].map((title) => ({ title, description: `${title}에 해당하는 흐름` })),
  },
  {
    id: 'choice-five', category: 'choice', name: 'A / B 선택',
    description: '두 선택지의 가능성과 각각 고려할 점을 나란히 비교합니다.', cardCount: 5, difficulty: 'intermediate',
    positions: ['현재 상황', 'A 선택의 흐름', 'A에서 고려할 점', 'B 선택의 흐름', 'B에서 고려할 점'].map((title) => ({ title, description: `${title}을 타로 관점에서 살펴보는 자리` })),
  },
  {
    id: 'self-insight-five', category: 'self', name: '내면 리딩',
    description: '의식과 무의식 사이에서 지금 필요한 변화를 발견합니다.', cardCount: 5, difficulty: 'intermediate',
    positions: ['현재 감정', '의식적으로 알고 있는 것', '무의식적인 욕구', '놓치고 있는 부분', '지금 필요한 태도'].map((title) => ({ title, description: `${title}을 비추는 자리` })),
  },
]

const recommendations: Record<ReadingCategory, readonly string[]> = {
  'inner-feelings': ['inner-feelings-five', 'relationship-three'],
  love: ['relationship-three', 'situation-advice-outcome'],
  money: ['money-five', 'situation-advice-outcome'],
  career: ['career-five', 'situation-advice-outcome'],
  timeline: ['past-present-future'],
  choice: ['choice-five', 'situation-advice-outcome'],
  daily: ['one-card-message', 'situation-advice-outcome'],
  self: ['self-insight-five', 'situation-advice-outcome'],
  free: [],
}

export function getRecommendedSpreads(category: ReadingCategory): TarotSpread[] {
  return recommendations[category]
    .map((id) => tarotSpreads.find((spread) => spread.id === id))
    .filter((spread): spread is TarotSpread => spread !== undefined)
}
