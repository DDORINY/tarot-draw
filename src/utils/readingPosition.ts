import type { SpreadPosition, TarotSpread } from '../types/reading'

export function getReadingPosition(
  spread: TarotSpread | null,
  drawIndex: number,
): SpreadPosition {
  const guidedPosition = spread?.positions[drawIndex]

  if (guidedPosition) return guidedPosition

  if (spread) {
    const extraIndex = drawIndex - spread.positions.length + 1

    return {
      title: `추가 카드 ${extraIndex}`,
      description: '기본 카드 배열에 더해 전체 흐름을 보완하는 카드입니다.',
    }
  }

  return {
    title: `${drawIndex + 1}번째 카드`,
    description: '자유 리딩에서 선택한 순서입니다.',
  }
}
