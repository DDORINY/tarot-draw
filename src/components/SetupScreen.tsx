import { getRecommendedSpreads, readingCategories } from '../data/readingGuides'
import type { ReadingCategory } from '../types/reading'

interface SetupScreenProps {
  category: ReadingCategory
  question: string
  selectedSpreadId: string
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
      <header className="brand-lockup guided-brand">
        <span className="brand-rule" aria-hidden="true" />
        <p>Midnight Observatory</p>
        <h1>TAROT DRAW</h1>
      </header>

      <div className="guided-layout">
        <section className="guide-section category-section" aria-labelledby="category-title">
          <p className="section-index">01 · Theme</p>
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
          <p className="section-index">02 · Question</p>
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
          <p className="section-index">03 · Spread</p>
          <h2 id="spread-title">{isFreeReading ? '자유 리딩' : '스프레드를 선택하세요'}</h2>

          {isFreeReading ? (
            <FreeDrawControls {...props} />
          ) : (
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
            <span className="toggle-track" aria-hidden="true"><span>{props.includeReversed ? 'ON' : 'OFF'}</span><i /></span>
          </label>
          <button type="button" className="primary-button" onClick={props.onStart}>
            리딩 시작 <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>
    </main>
  )
}

function FreeDrawControls(props: SetupScreenProps) {
  return (
    <div className="free-draw-controls">
      <p>정해진 포지션 없이 1장에서 78장까지 자유롭게 선택합니다.</p>
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
          aria-describedby="free-count-error"
          onChange={(event) => props.onInputChange(event.target.value)}
          onBlur={props.onInputCommit}
          onKeyDown={(event) => { if (event.key === 'Enter') props.onInputCommit() }}
        />
      </label>
      <p id="free-count-error" className="field-error" role="alert">{props.validationMessage}</p>
    </div>
  )
}
