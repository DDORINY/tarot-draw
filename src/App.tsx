import { useRef, useState } from 'react'
import { tarotCards } from './data/tarotCards'
import type {
  RevealedCard,
  SelectedCard,
  ShuffledCard,
} from './types/tarot'
import { getRandomOrientation } from './utils/orientation'
import { createShuffledDeck, selectCardFromDeck } from './utils/tarotDeck'
import './App.css'

const DRAW_COUNT_PRESETS = [1, 3, 5, 7, 10] as const
const MIN_DRAW_COUNT = 1
const MAX_DRAW_COUNT = 78
const DRAW_COUNT_ERROR = '1장부터 78장까지 정수로 선택할 수 있습니다.'
const TAROT_CARD_BY_ID = new Map(tarotCards.map((card) => [card.id, card]))

type ReadingStage = 'setup' | 'selecting' | 'revealed'

function App() {
  const [stage, setStage] = useState<ReadingStage>('setup')
  const [drawCount, setDrawCount] = useState<number>(3)
  const [drawCountInput, setDrawCountInput] = useState('3')
  const [validationMessage, setValidationMessage] = useState('')
  const [includeReversed, setIncludeReversed] = useState(true)
  const [shuffledDeck, setShuffledDeck] = useState<ShuffledCard[]>([])
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([])
  const hasRevealedRef = useRef(false)

  const commitDrawCount = (value: string): number | null => {
    if (value.trim() === '') {
      setValidationMessage(DRAW_COUNT_ERROR)
      return null
    }

    const nextDrawCount = Number(value)
    const isValid =
      Number.isFinite(nextDrawCount) &&
      Number.isInteger(nextDrawCount) &&
      nextDrawCount >= MIN_DRAW_COUNT &&
      nextDrawCount <= MAX_DRAW_COUNT

    if (!isValid) {
      setValidationMessage(DRAW_COUNT_ERROR)
      return null
    }

    setDrawCount(nextDrawCount)
    setDrawCountInput(String(nextDrawCount))
    setValidationMessage('')
    return nextDrawCount
  }

  const selectPreset = (preset: number) => {
    setDrawCount(preset)
    setDrawCountInput(String(preset))
    setValidationMessage('')
  }

  const startReading = () => {
    const nextDrawCount = commitDrawCount(drawCountInput)

    if (nextDrawCount === null) {
      return
    }

    setDrawCount(nextDrawCount)
    setShuffledDeck(createShuffledDeck(tarotCards.map((card) => card.id)))
    setSelectedCards([])
    setRevealedCards([])
    hasRevealedRef.current = false
    setStage('selecting')
  }

  const selectCard = (deckIndex: number) => {
    setSelectedCards((currentSelection) => {
      try {
        return selectCardFromDeck(
          shuffledDeck,
          currentSelection,
          deckIndex,
          drawCount,
        )
      } catch {
        return currentSelection
      }
    })
  }

  const revealSelection = () => {
    if (
      stage !== 'selecting' ||
      selectedCards.length !== drawCount ||
      hasRevealedRef.current
    ) {
      return
    }

    hasRevealedRef.current = true
    setRevealedCards(
      selectedCards.map((selectedCard) => ({
        ...selectedCard,
        orientation: getRandomOrientation(includeReversed),
      })),
    )
    setStage('revealed')
  }

  const resetReading = () => {
    setShuffledDeck([])
    setSelectedCards([])
    setRevealedCards([])
    hasRevealedRef.current = false
    setStage('setup')
  }

  const isSelectionComplete = selectedCards.length === drawCount

  if (stage === 'revealed') {
    return (
      <main className="reveal-page">
        <header className="reveal-header">
          <div>
            <p className="eyebrow">Your chosen cards</p>
            <h1>선택한 카드를 공개합니다</h1>
            <p>선택한 순서와 방향은 이번 리딩 동안 그대로 유지됩니다.</p>
          </div>
          <button type="button" className="reset-button" onClick={resetReading}>
            새 리딩
          </button>
        </header>

        <section className="revealed-grid" aria-label="공개된 타로 카드">
          {[...revealedCards]
            .sort((a, b) => a.drawIndex - b.drawIndex)
            .map((revealedCard) => {
              const card = TAROT_CARD_BY_ID.get(revealedCard.cardId)

              if (!card) {
                return null
              }

              const isReversed = revealedCard.orientation === 'reversed'
              const orientationLabel = isReversed ? '역방향' : '정방향'

              return (
                <article
                  key={revealedCard.deckIndex}
                  className="revealed-card"
                  aria-label={`${revealedCard.drawIndex + 1}번째 카드, ${card.nameKo}, ${orientationLabel}`}
                >
                  <p className="draw-order">
                    {revealedCard.drawIndex + 1}번째 카드
                  </p>
                  <div className="revealed-image-frame">
                    <div className="face-fallback">
                      <strong>{card.nameKo}</strong>
                      <span>이미지 준비 중</span>
                    </div>
                    <img
                      className={isReversed ? 'card-image--reversed' : ''}
                      src={card.image}
                      alt={`${card.nameKo}, ${orientationLabel}`}
                      onError={(event) => {
                        event.currentTarget.hidden = true
                      }}
                    />
                  </div>
                  <div className="revealed-card-copy">
                    <p className="english-name">{card.name}</p>
                    <h2>{card.nameKo}</h2>
                    <span className={`orientation orientation--${revealedCard.orientation}`}>
                      {orientationLabel}
                    </span>
                  </div>
                </article>
              )
            })}
        </section>
      </main>
    )
  }

  if (stage === 'selecting') {
    return (
      <main className="reading-page">
        <header className="reading-header">
          <div>
            <p className="eyebrow">Choose your cards</p>
            <h1>마음이 이끄는 카드를 선택하세요</h1>
          </div>
          <div className="reading-actions">
            <p className="selection-progress" aria-live="polite">
              선택한 카드 <strong>{selectedCards.length}</strong> / {drawCount}
            </p>
            <button type="button" className="reset-button" onClick={resetReading}>
              처음부터 다시
            </button>
          </div>
        </header>

        <section className="deck-grid" aria-label="셔플된 타로 카드 덱">
          {shuffledDeck.map(({ deckIndex }) => {
            const selectedCard = selectedCards.find(
              (card) => card.deckIndex === deckIndex,
            )
            const selectionNumber = selectedCard
              ? selectedCard.drawIndex + 1
              : null

            return (
              <button
                key={deckIndex}
                type="button"
                className="deck-card"
                data-selected={selectedCard ? 'true' : 'false'}
                disabled={isSelectionComplete && !selectedCard}
                aria-pressed={Boolean(selectedCard)}
                aria-label={
                  selectedCard
                    ? `카드 ${deckIndex + 1}, 선택됨, 선택 순서 ${selectionNumber}`
                    : `카드 ${deckIndex + 1} 선택`
                }
                onClick={() => selectCard(deckIndex)}
              >
                <span className="card-back-pattern" aria-hidden="true" />
                <img
                  src="/cards/back.webp"
                  alt=""
                  aria-hidden="true"
                  onError={(event) => {
                    event.currentTarget.hidden = true
                  }}
                />
                {selectionNumber !== null && (
                  <span className="selection-number" aria-hidden="true">
                    {selectionNumber}
                  </span>
                )}
              </button>
            )
          })}
        </section>

        <footer className="selection-footer">
          <button
            type="button"
            className="complete-button"
            disabled={!isSelectionComplete}
            onClick={revealSelection}
          >
            선택한 카드 공개
          </button>
        </footer>
      </main>
    )
  }

  return (
    <main className="draw-count-page">
      <section className="draw-count-card" aria-labelledby="draw-count-title">
        <p className="eyebrow">Tarot draw setup</p>
        <h1 id="draw-count-title">몇 장을 뽑을까요?</h1>
        <p className="intro">
          빠르게 고르거나, 이번 리딩에 필요한 카드 수를 직접 입력하세요.
        </p>

        <div className="preset-group" aria-label="빠른 장수 선택">
          {DRAW_COUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="preset-button"
              aria-pressed={drawCount === preset}
              onClick={() => selectPreset(preset)}
            >
              <span>{preset}</span>
              <small>장</small>
            </button>
          ))}
        </div>

        <div className="custom-control">
          <label htmlFor="draw-count-input">직접 입력</label>
          <div className="input-row">
            <input
              id="draw-count-input"
              type="number"
              min={MIN_DRAW_COUNT}
              max={MAX_DRAW_COUNT}
              step={1}
              value={drawCountInput}
              aria-invalid={validationMessage !== ''}
              aria-describedby="draw-count-hint draw-count-error"
              onChange={(event) => {
                setDrawCountInput(event.target.value)
                setValidationMessage('')
              }}
              onBlur={() => commitDrawCount(drawCountInput)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commitDrawCount(drawCountInput)
                }
              }}
            />
            <span aria-hidden="true">장</span>
          </div>
          <p id="draw-count-hint" className="input-hint">
            선택 범위: {MIN_DRAW_COUNT}~{MAX_DRAW_COUNT}
          </p>
          <p id="draw-count-error" className="validation-message" role="alert">
            {validationMessage}
          </p>
        </div>

        <label className="reversed-setting">
          <span>
            <strong>역방향 포함</strong>
            <small>카드 공개 시 정방향과 역방향을 독립적으로 결정합니다.</small>
          </span>
          <input
            type="checkbox"
            checked={includeReversed}
            onChange={(event) => setIncludeReversed(event.target.checked)}
          />
        </label>

        <div className="selection-summary" aria-live="polite">
          <span>선택한 장수</span>
          <strong>{drawCount}장</strong>
        </div>

        <button type="button" className="start-button" onClick={startReading}>
          이 장수로 리딩 시작
        </button>
      </section>
    </main>
  )
}

export default App
