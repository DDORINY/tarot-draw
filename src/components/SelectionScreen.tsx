import type { SelectedCard, ShuffledCard } from '../types/tarot'

interface SelectionScreenProps {
  deck: readonly ShuffledCard[]
  selectedCards: readonly SelectedCard[]
  drawCount: number
  onSelect: (deckIndex: number) => void
  onReveal: () => void
  onReset: () => void
}

export function SelectionScreen({
  deck,
  selectedCards,
  drawCount,
  onSelect,
  onReveal,
  onReset,
}: SelectionScreenProps) {
  const isComplete = selectedCards.length === drawCount
  const selectionOrder = new Map(
    selectedCards.map((card) => [card.deckIndex, card.drawIndex + 1]),
  )

  return (
    <main className="app-shell selection-screen">
      <header className="screen-header selection-header">
        <div>
          <p className="section-index">The Draw</p>
          <h1>카드를 선택하세요</h1>
          <p>첫 느낌을 믿고, 마음이 머무는 카드를 고르세요.</p>
        </div>
        <div className="selection-status" aria-live="polite">
          <strong>{String(selectedCards.length).padStart(2, '0')}</strong>
          <span>/ {String(drawCount).padStart(2, '0')} 선택</span>
        </div>
      </header>

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
                aria-label={
                  isSelected
                    ? `카드 ${deckIndex + 1}, 선택됨, 선택 순서 ${order}`
                    : `카드 ${deckIndex + 1} 선택`
                }
                onClick={() => onSelect(deckIndex)}
              >
                <span className="card-back-fallback" aria-hidden="true">
                  <i />
                </span>
                <img
                  src="/cards/back.webp"
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  onError={(event) => {
                    event.currentTarget.hidden = true
                  }}
                />
                {isSelected && (
                  <span className="selection-order" aria-hidden="true">
                    {String(order).padStart(2, '0')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <footer className="selection-toolbar">
        <button type="button" className="text-button" onClick={onReset}>
          처음부터
        </button>
        <button
          type="button"
          className="primary-button reveal-button"
          disabled={!isComplete}
          onClick={onReveal}
        >
          선택한 카드 공개
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  )
}
