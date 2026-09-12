import { tarotCards } from '../data/tarotCards'
import type { RevealedCard } from '../types/tarot'

const TAROT_CARD_BY_ID = new Map(tarotCards.map((card) => [card.id, card]))

interface RevealScreenProps {
  revealedCards: readonly RevealedCard[]
  onReset: () => void
}

export function RevealScreen({ revealedCards, onReset }: RevealScreenProps) {
  const orderedCards = [...revealedCards].sort(
    (a, b) => a.drawIndex - b.drawIndex,
  )

  return (
    <main className="app-shell reveal-screen">
      <header className="screen-header reveal-header">
        <div>
          <p className="section-index">The Reveal</p>
          <h1>당신이 선택한 카드</h1>
          <p>카드의 방향과 순서는 이 리딩이 끝날 때까지 유지됩니다.</p>
        </div>
        <button type="button" className="text-button" onClick={onReset}>
          새 리딩
        </button>
      </header>

      <section
        className="revealed-grid"
        data-count={Math.min(orderedCards.length, 4)}
        aria-label="공개된 타로 카드"
      >
        {orderedCards.map((revealedCard) => {
          const card = TAROT_CARD_BY_ID.get(revealedCard.cardId)

          if (!card) return null

          const isReversed = revealedCard.orientation === 'reversed'
          const orientationLabel = isReversed ? '역방향' : '정방향'

          return (
            <article
              key={revealedCard.deckIndex}
              className="revealed-card"
              aria-label={`${revealedCard.drawIndex + 1}번째 카드, ${card.nameKo}, ${orientationLabel}`}
            >
              <p className="draw-order">
                {String(revealedCard.drawIndex + 1).padStart(2, '0')}
              </p>
              <div className="reveal-flip">
                <div className="reveal-front">
                  <div className="revealed-image-frame">
                    <div className="face-fallback">
                      <strong>{card.nameKo}</strong>
                      <span>이미지 준비 중</span>
                    </div>
                    <img
                      className={isReversed ? 'card-image--reversed' : ''}
                      src={card.image}
                      alt={`${card.nameKo}, ${orientationLabel}`}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      onError={(event) => {
                        event.currentTarget.hidden = true
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="revealed-card-copy">
                <p>{card.name}</p>
                <h2>{card.nameKo}</h2>
                <span className="orientation-label">{orientationLabel}</span>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
