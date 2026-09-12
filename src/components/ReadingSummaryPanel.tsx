import type { ReadingSummary } from '../utils/readingSummary'

const SUIT_LABELS = { wands: '완드', cups: '컵', swords: '소드', pentacles: '펜타클' } as const

export function ReadingSummaryPanel({ summary }: { summary: ReadingSummary }) {
  const suits = Object.entries(summary.suitCounts)
    .filter(([, count]) => count > 0) as Array<[keyof typeof SUIT_LABELS, number]>

  return (
    <section className="reading-flow" aria-labelledby="reading-flow-title">
      <header><p className="section-index">종합 요약</p><h2 id="reading-flow-title">전체 리딩 흐름</h2></header>
      <div className="reading-flow-grid">
        <section><h3>주요 키워드</h3><p className="summary-keywords">{summary.topKeywords.join(' · ')}</p></section>
        <section>
          <h3>카드 구성</h3>
          <ul className="summary-counts">
            <li>총 {summary.totalCards}장</li>
            {summary.majorCount > 0 && <li>메이저 {summary.majorCount}장</li>}
            {summary.minorCount > 0 && <li>마이너 {summary.minorCount}장</li>}
            {suits.map(([suit, count]) => <li key={suit}>{SUIT_LABELS[suit]} {count}장</li>)}
          </ul>
        </section>
        <section><h3>카드 방향</h3><p>정방향 {summary.uprightCount}장 · 역방향 {summary.reversedCount}장</p></section>
        {summary.observations.length > 0 && (
          <section><h3>눈여겨볼 흐름</h3><ul className="summary-observations">{summary.observations.map((item) => <li key={item}>{item}</li>)}</ul></section>
        )}
      </div>
    </section>
  )
}
