import { tarotCards } from '../data/tarotCards'
import { ReadingSummaryPanel } from './ReadingSummaryPanel'
import { CelestialBackdrop } from './CelestialBackdrop'
import type { ReadingCategory, TarotSpread } from '../types/reading'
import type { RevealedCard } from '../types/tarot'
import { withBasePath } from '../utils/assetPath'
import { getReadingPosition } from '../utils/readingPosition'
import { createReadingSummary } from '../utils/readingSummary'
import { getPrimaryMeaningSections, getSecondaryMeaningSections } from '../utils/readingMeaning'

const TAROT_CARD_BY_ID = new Map(tarotCards.map((card) => [card.id, card]))

interface RevealScreenProps {
  revealedCards: readonly RevealedCard[]
  category: ReadingCategory
  spread: TarotSpread | null
  question: string
  includeReversed: boolean
  onRedraw: () => void
  onNewReading: () => void
}

export function RevealScreen({
  revealedCards,
  category,
  spread,
  question,
  includeReversed,
  onRedraw,
  onNewReading,
}: RevealScreenProps) {
  const orderedCards = [...revealedCards].sort((a, b) => a.drawIndex - b.drawIndex)
  const readingSummary = createReadingSummary(revealedCards, tarotCards, category, includeReversed)

  return (
    <main className="app-shell reveal-screen">
      <CelestialBackdrop variant="reveal" />
      <header className="screen-header reveal-header">
        <div>
          <p className="section-index">리딩 결과</p>
          <h1>당신이 선택한 카드</h1>
          <p>카드는 단독 의미뿐 아니라 뽑힌 자리와 주변 카드의 흐름을 함께 참고해 보세요.</p>
        </div>
      </header>

      <section className="reading-summary" aria-label="리딩 요약">
        {question && <div><span>질문</span><strong>{question}</strong></div>}
        <div><span>카드 배열</span><strong>{spread ? `${spread.name} · ${revealedCards.length}장` : `자유 리딩 · ${revealedCards.length}장`}</strong></div>
        <div><span>카드 수</span><strong>{revealedCards.length}장</strong></div>
        <div><span>역방향</span><strong>{includeReversed ? '포함' : '포함하지 않음'}</strong></div>
      </section>

      <section className="revealed-grid interpreted-grid" data-count={Math.min(orderedCards.length, 4)} aria-label="공개된 타로 카드">
        {orderedCards.map((revealedCard) => {
          const card = TAROT_CARD_BY_ID.get(revealedCard.cardId)
          if (!card) return null

          const position = getReadingPosition(spread, revealedCard.drawIndex)
          const positionTitle = position.title
          const positionDescription = position.description
          const isReversed = revealedCard.orientation === 'reversed'
          const orientationLabel = isReversed ? '역방향' : '정방향'
          const meaning = isReversed ? card.reversed : card.upright
          const primarySections = getPrimaryMeaningSections(category, meaning, card.themes)
          const secondarySections = getSecondaryMeaningSections(category, meaning, card.themes)

          return (
            <article key={revealedCard.deckIndex} className="revealed-card interpreted-card" aria-label={`${positionTitle}, ${card.nameKo}, ${orientationLabel}`}>
              <header className="position-result">
                <p>{String(revealedCard.drawIndex + 1).padStart(2, '0')} · 카드 위치</p>
                <h2>{positionTitle}</h2>
                <span>{positionDescription}</span>
              </header>
              <div className="reveal-flip">
                <div className="reveal-front">
                  <div className="revealed-image-frame">
                    <div className="face-fallback"><strong>{card.nameKo}</strong><span>이미지 준비 중</span></div>
                    <img className={isReversed ? 'card-image--reversed' : ''} src={withBasePath(card.image)} alt={`${card.nameKo}, ${orientationLabel}`} loading="lazy" decoding="async" draggable={false} onError={(event) => { event.currentTarget.hidden = true }} />
                  </div>
                </div>
              </div>
              <div className="revealed-card-copy">
                <p>{card.name}</p>
                <h3>{card.nameKo}</h3>
                <span className="orientation-label">{orientationLabel}</span>
              </div>
              <div className="card-meaning">
                <h4>핵심 키워드</h4>
                <ul aria-label="핵심 키워드">{meaning.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
                <section className="meaning-summary">
                  <h4>{category === 'choice' ? '현재 흐름' : category === 'timeline' ? '기본 흐름' : '기본 해석'}</h4>
                  <p>{meaning.summary}</p>
                </section>
                {primarySections.length > 0 && (
                  <dl className="primary-meaning-sections">
                    {primarySections.map((section) => (
                      <div key={section.key}><dt>{section.label}</dt><dd>{section.value}</dd></div>
                    ))}
                  </dl>
                )}
                <p className="meaning-advice"><strong>조언</strong>{meaning.advice}</p>
                <details className="meaning-details">
                  <summary>다른 영역도 보기</summary>
                  <dl>
                    {secondarySections.map((section) => (
                      <div key={section.key}><dt>{section.label}</dt><dd>{section.value}</dd></div>
                    ))}
                  </dl>
                </details>
              </div>
            </article>
          )
        })}
      </section>

      <ReadingSummaryPanel summary={readingSummary} />

      <footer className="result-actions result-actions--footer">
        <button type="button" className="text-button" onClick={onRedraw}>같은 질문으로 다시 뽑기</button>
        <button type="button" className="primary-button" onClick={onNewReading}>새 리딩 <span aria-hidden="true">→</span></button>
      </footer>
    </main>
  )
}
