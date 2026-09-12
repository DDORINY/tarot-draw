import { useRef, useState } from 'react'
import { RevealScreen } from './components/RevealScreen'
import { SelectionScreen } from './components/SelectionScreen'
import { SetupScreen } from './components/SetupScreen'
import { tarotCards } from './data/tarotCards'
import type { RevealedCard, SelectedCard, ShuffledCard } from './types/tarot'
import { getRandomOrientation } from './utils/orientation'
import { createShuffledDeck, selectCardFromDeck } from './utils/tarotDeck'
import './App.css'

const DRAW_COUNT_PRESETS = [1, 3, 5, 7, 10] as const
const MIN_DRAW_COUNT = 1
const MAX_DRAW_COUNT = 78
const DRAW_COUNT_ERROR = '1장부터 78장까지 정수로 선택할 수 있습니다.'

type ReadingStage = 'setup' | 'selecting' | 'revealed'

function App() {
  const [stage, setStage] = useState<ReadingStage>('setup')
  const [drawCount, setDrawCount] = useState(3)
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

    if (nextDrawCount === null) return

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

  if (stage === 'revealed') {
    return <RevealScreen revealedCards={revealedCards} onReset={resetReading} />
  }

  if (stage === 'selecting') {
    return (
      <SelectionScreen
        deck={shuffledDeck}
        selectedCards={selectedCards}
        drawCount={drawCount}
        onSelect={selectCard}
        onReveal={revealSelection}
        onReset={resetReading}
      />
    )
  }

  return (
    <SetupScreen
      presets={DRAW_COUNT_PRESETS}
      drawCount={drawCount}
      drawCountInput={drawCountInput}
      minDrawCount={MIN_DRAW_COUNT}
      maxDrawCount={MAX_DRAW_COUNT}
      validationMessage={validationMessage}
      includeReversed={includeReversed}
      onPresetSelect={selectPreset}
      onInputChange={(value) => {
        setDrawCountInput(value)
        setValidationMessage('')
      }}
      onInputCommit={() => commitDrawCount(drawCountInput)}
      onReversedChange={setIncludeReversed}
      onStart={startReading}
    />
  )
}

export default App
