import type { TarotSpread } from '../types/reading'
import type { SelectedCard, ShuffledCard } from '../types/tarot'
import { withBasePath } from '../utils/assetPath'
import { getReadingPosition } from '../utils/readingPosition'
import { CelestialBackdrop } from './CelestialBackdrop'

interface SelectionScreenProps {
  deck: readonly ShuffledCard[]
  selectedCards: readonly SelectedCard[]
  drawCount: number
  spread: TarotSpread | null
  question: string
  onSelect: (deckIndex: number) => void
  onReveal: () => void
  onReset: () => void
}

export function SelectionScreen({
  deck,
  selectedCards,
  drawCount,
  spread,
  question,
  onSelect,
  onReveal,
  onReset,
}: SelectionScreenProps) {
  const isComplete = selectedCards.length === drawCount
  const selectionOrder = new Map(
    selectedCards.map((card) => [card.deckIndex, card.drawIndex + 1]),
  )
  const nextPosition = getReadingPosition(spread, selectedCards.length)
  const positionTitle = isComplete
    ? '선택 완료'
    : nextPosition.title
  const positionDescription = isComplete
    ? '선택한 카드들을 공개할 준비가 되었습니다.'
    : nextPosition.description

  return (
    <main className="app-shell selection-screen">
      <CelestialBackdrop variant="selection" />
      <header className="screen-header selection-header">
        <div>
          <p className="section-index">카드 선택</p>
          <h1>카드를 선택하세요</h1>
          {question && <p className="active-question">“{question}”</p>}
        </div>
        <div className="selection-status" aria-live="polite">
          <strong>{String(selectedCards.length).padStart(2, '0')}</strong>
          <span>/ {String(drawCount).padStart(2, '0')} 선택</span>
        </div>
      </header>

      <section className="position-guide" aria-live="polite">
        <p>{isComplete ? '공개 준비 완료' : `${selectedCards.length + 1} / ${drawCount}`}</p>
        <h2>{positionTitle}</h2>
        <span>{positionDescription}</span>
      </section>

      <details className="selection-help">
        <summary>카드는 어떻게 고르나요?</summary>
        <p>정답을 찾으려고 고민할 필요는 없습니다. 질문을 떠올린 뒤 가장 먼저 눈에 들어오거나 자연스럽게 손이 가는 카드를 선택하세요. 선택한 카드는 그대로 두어도 좋습니다.</p>
      </details>

      <section className="deck-field" aria-label="셔플된 타로 카드 덱">
        <div className="deck-grid">
          {deck.map(({ deckIndex }) => {
            const order = selectionOrder.get(deckIndex)
            const isSelected = order !== undefined

            return (
              <button
                key={deckIndex}
                type="button"
                className="deck-card"
                data-selected={isSelected}
                disabled={isComplete && !isSelected}
                aria-pressed={isSelected}
                aria-label={isSelected ? `카드 ${deckIndex + 1}, 선택됨, 선택 순서 ${order}` : `카드 ${deckIndex + 1} 선택`}
                onClick={() => onSelect(deckIndex)}
              >
                <span className="card-back-fallback" aria-hidden="true"><i /></span>
                <img src={withBasePath('/cards/back.webp')} alt="" aria-hidden="true" decoding="async" draggable={false} onError={(event) => { event.currentTarget.hidden = true }} />
                {isSelected && <span className="selection-order" aria-hidden="true">{String(order).padStart(2, '0')}</span>}
              </button>
            )
          })}
        </div>
      </section>

      <footer className="selection-toolbar">
        <button type="button" className="text-button" onClick={onReset}>처음부터</button>
        <button type="button" className="primary-button reveal-button" disabled={!isComplete} onClick={onReveal}>
          선택한 카드 공개 <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  )
}
