import { getRecommendedSpreads, readingCategories } from '../data/readingGuides'
import type { ReadingCategory } from '../types/reading'
import type { DrawCountMode } from '../App'
import { CelestialBackdrop } from './CelestialBackdrop'

interface SetupScreenProps {
  category: ReadingCategory
  question: string
  selectedSpreadId: string
  drawCountMode: DrawCountMode
  presets: readonly number[]
  drawCount: number
  drawCountInput: string
  minDrawCount: number
  maxDrawCount: number
  validationMessage: string
  includeReversed: boolean
  onCategoryChange: (category: ReadingCategory) => void
  onQuestionChange: (question: string) => void
  onSpreadChange: (spreadId: string) => void
  onDrawCountModeChange: (mode: DrawCountMode) => void
  onPresetSelect: (preset: number) => void
  onInputChange: (value: string) => void
  onInputCommit: () => void
  onReversedChange: (includeReversed: boolean) => void
  onStart: () => void
}

export function SetupScreen(props: SetupScreenProps) {
  const categoryInfo = readingCategories.find((item) => item.id === props.category)!
  const recommendedSpreads = getRecommendedSpreads(props.category)
  const isFreeReading = props.category === 'free'

  return (
    <main className="app-shell guided-setup">
      <CelestialBackdrop variant="setup" />
      <header className="brand-lockup guided-brand">
        <span className="brand-rule" aria-hidden="true" />
        <p>한밤의 관측소</p>
        <h1>TAROT DRAW</h1>
        <p className="guided-subtitle">질문을 떠올리고 마음이 가는 카드를 선택해 보세요.</p>
        <div className="setup-eclipse" aria-hidden="true">
          <span className="setup-eclipse-disc" />
          <span className="setup-eclipse-ring" />
          <i />
        </div>
      </header>

      <div className="guided-layout">
        <section className="guide-section category-section" aria-labelledby="category-title">
          <p className="section-index">01 · 주제</p>
          <h2 id="category-title">무엇이 궁금한가요?</h2>
          <div className="category-grid">
            {readingCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                className="category-button"
                aria-pressed={props.category === item.id}
                onClick={() => props.onCategoryChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="category-description">{categoryInfo.description}</p>
        </section>

        <section className="guide-section question-section" aria-labelledby="question-title">
          <p className="section-index">02 · 질문</p>
          <h2 id="question-title">질문을 정해 보세요</h2>
          {!isFreeReading && (
            <div className="question-suggestions">
              {categoryInfo.questions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  aria-pressed={props.question === suggestion}
                  onClick={() => props.onQuestionChange(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <label className="question-input">
            <span>직접 질문하기</span>
            <textarea
              rows={3}
              value={props.question}
              placeholder="질문 없이도 리딩을 시작할 수 있습니다."
              onChange={(event) => props.onQuestionChange(event.target.value)}
            />
          </label>
          <details className="question-guide">
            <summary>좋은 질문 만들기</summary>
            <p>단순한 YES / NO보다 상황과 흐름을 살펴볼 수 있는 질문이 좋습니다.</p>
            <dl>
              <dt>△ 그 사람이 나를 좋아하나요?</dt>
              <dd>○ 상대는 현재 나와의 관계를 어떻게 느끼고 있을까?</dd>
              <dt>△ 이직하면 성공하나요?</dt>
              <dd>○ 이직을 선택했을 때 예상되는 흐름과 고려할 점은 무엇일까?</dd>
            </dl>
          </details>
        </section>

        <section className="guide-section spread-section" aria-labelledby="spread-title">
          <p className="section-index">03 · 카드 배열</p>
          <h2 id="spread-title">{isFreeReading ? '자유 리딩' : '카드 배열을 선택하세요'}</h2>

          {isFreeReading ? (
            <DrawCountControls {...props} isFreeReading />
          ) : (
            <>
              <div className="spread-list">
                {recommendedSpreads.map((spread) => (
                  <button
                    key={spread.id}
                    type="button"
                    className="spread-option"
                    aria-pressed={props.selectedSpreadId === spread.id}
                    onClick={() => props.onSpreadChange(spread.id)}
                  >
                    <span className="spread-heading">
                      <strong>{spread.name}</strong>
                      <small>{spread.cardCount}장 · {spread.difficulty === 'beginner' ? '초보자 추천' : '심층'}</small>
                    </span>
                    <span>{spread.description}</span>
                    <ol>
                      {spread.positions.map((position) => (
                        <li key={position.title}>{position.title}</li>
                      ))}
                    </ol>
                  </button>
                ))}
              </div>
              <DrawCountControls {...props} />
            </>
          )}
        </section>

        <section className="guide-section start-section">
          <label className="reversed-control">
            <span><strong>역방향 포함</strong><small>카드의 두 방향을 모두 읽습니다.</small></span>
            <input
              type="checkbox"
              checked={props.includeReversed}
              onChange={(event) => props.onReversedChange(event.target.checked)}
            />
            <span className="toggle-track" aria-hidden="true"><span>{props.includeReversed ? '포함' : '미포함'}</span><i /></span>
          </label>
          <button type="button" className="primary-button" onClick={props.onStart}>
            리딩 시작 <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>
    </main>
  )
}

function DrawCountControls(props: SetupScreenProps & { isFreeReading?: boolean }) {
  const selectedSpread = getRecommendedSpreads(props.category)
    .find((spread) => spread.id === props.selectedSpreadId)
  const isCustom = props.isFreeReading || props.drawCountMode === 'custom'

  return (
    <div className="draw-count-panel">
      <h3>카드 장수</h3>
      {!props.isFreeReading && (
        <div className="draw-count-modes" role="radiogroup" aria-label="카드 장수 선택 방식">
          <button type="button" role="radio" aria-checked={props.drawCountMode === 'recommended'} onClick={() => props.onDrawCountModeChange('recommended')}>
            <strong>추천 장수 사용</strong>
            <span>{selectedSpread ? `${selectedSpread.name} · ${selectedSpread.cardCount}장` : '카드 배열을 선택하세요.'}</span>
          </button>
          <button type="button" role="radio" aria-checked={props.drawCountMode === 'custom'} onClick={() => props.onDrawCountModeChange('custom')}>
            <strong>직접 선택</strong>
            <span>1장에서 78장까지 선택할 수 있습니다.</span>
          </button>
        </div>
      )}
      {props.isFreeReading && <p>정해진 위치 없이 1장에서 78장까지 자유롭게 선택합니다.</p>}
      <div className="custom-count-controls" hidden={!isCustom}>
        <div className="preset-list">
          {props.presets.map((preset) => (
            <button key={preset} type="button" className="preset-button" aria-pressed={props.drawCount === preset} onClick={() => props.onPresetSelect(preset)}>
              {String(preset).padStart(2, '0')}
            </button>
          ))}
        </div>
        <label className="question-input free-count-input">
          <span>직접 장수 입력</span>
          <input
            type="number"
            min={props.minDrawCount}
            max={props.maxDrawCount}
            step={1}
            value={props.drawCountInput}
            aria-invalid={props.validationMessage !== ''}
            aria-describedby="draw-count-error"
            onChange={(event) => props.onInputChange(event.target.value)}
            onBlur={props.onInputCommit}
            onKeyDown={(event) => { if (event.key === 'Enter') props.onInputCommit() }}
          />
        </label>
        <p id="draw-count-error" className="field-error" role="alert">{props.validationMessage}</p>
      </div>
    </div>
  )
}
