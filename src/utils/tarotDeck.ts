import type { SelectedCard, ShuffledCard } from '../types/tarot'
import { secureShuffle } from './shuffle'

export function createShuffledDeck(
  cardIds: readonly number[],
): ShuffledCard[] {
  return secureShuffle(cardIds).map((cardId, deckIndex) => ({
    cardId,
    deckIndex,
  }))
}

export function selectCardFromDeck(
  deck: readonly ShuffledCard[],
  selected: readonly SelectedCard[],
  deckIndex: number,
  maxSelections: number,
): SelectedCard[] {
  if (
    !Number.isInteger(maxSelections) ||
    maxSelections < 1 ||
    maxSelections > deck.length
  ) {
    throw new RangeError(
      'selectCardFromDeck: maxSelections must be an integer between 1 and the deck length.',
    )
  }

  if (
    !Number.isInteger(deckIndex) ||
    deckIndex < 0 ||
    deckIndex >= deck.length
  ) {
    throw new RangeError(
      'selectCardFromDeck: deckIndex must be an integer within the deck range.',
    )
  }

  if (selected.length >= maxSelections) {
    throw new RangeError(
      'selectCardFromDeck: the maximum number of selections has been reached.',
    )
  }

  const card = deck.find((entry) => entry.deckIndex === deckIndex)

  if (!card) {
    throw new Error(
      'selectCardFromDeck: no card exists at the requested deckIndex.',
    )
  }

  if (selected.some((entry) => entry.deckIndex === deckIndex)) {
    throw new Error(
      'selectCardFromDeck: the requested deckIndex is already selected.',
    )
  }

  if (selected.some((entry) => entry.cardId === card.cardId)) {
    throw new Error(
      'selectCardFromDeck: the requested card is already selected.',
    )
  }

  return [
    ...selected,
    {
      cardId: card.cardId,
      deckIndex: card.deckIndex,
      drawIndex: selected.length,
    },
  ]
}
