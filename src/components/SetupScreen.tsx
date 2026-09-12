interface SetupScreenProps {
  presets: readonly number[]
  drawCount: number
  drawCountInput: string
  minDrawCount: number
  maxDrawCount: number
  validationMessage: string
  includeReversed: boolean
  onPresetSelect: (preset: number) => void
  onInputChange: (value: string) => void
  onInputCommit: () => void
  onReversedChange: (includeReversed: boolean) => void
  onStart: () => void
}

export function SetupScreen({
  presets,
  drawCount,
  drawCountInput,
  minDrawCount,
  maxDrawCount,
  validationMessage,
  includeReversed,
  onPresetSelect,
  onInputChange,
  onInputCommit,
  onReversedChange,
  onStart,
}: SetupScreenProps) {
  return (
    <main className="app-shell setup-screen">
      <header className="brand-lockup">
        <span className="brand-rule" aria-hidden="true" />
        <p>Midnight Observatory</p>
        <h1>TAROT DRAW</h1>
      </header>

      <section className="setup-content" aria-labelledby="setup-title">
        <p className="section-index">Reading 01</p>
        <h2 id="setup-title">몇 장의 카드를 뽑을까요?</h2>
        <p className="setup-intro">고요히 숨을 고르고, 지금 필요한 카드의 수를 정하세요.</p>

        <fieldset className="draw-count-fieldset">
          <legend>빠른 선택</legend>
          <div className="preset-list">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="preset-button"
                aria-pressed={drawCount === preset}
                onClick={() => onPresetSelect(preset)}
              >
                {String(preset).padStart(2, '0')}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="custom-control">
          <label htmlFor="draw-count-input">직접 입력</label>
          <div className="number-input-wrap">
            <input
              id="draw-count-input"
              type="number"
              min={minDrawCount}
              max={maxDrawCount}
              step={1}
              value={drawCountInput}
              aria-invalid={validationMessage !== ''}
              aria-describedby="draw-count-range draw-count-error"
              onChange={(event) => onInputChange(event.target.value)}
              onBlur={onInputCommit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onInputCommit()
              }}
            />
            <span aria-hidden="true">CARDS</span>
          </div>
          <p id="draw-count-range" className="field-hint">
            {minDrawCount}에서 {maxDrawCount}장까지
          </p>
          <p id="draw-count-error" className="field-error" role="alert">
            {validationMessage}
          </p>
        </div>

        <label className="reversed-control">
          <span>
            <strong>역방향 포함</strong>
            <small>카드가 전하는 두 방향의 의미를 모두 읽습니다.</small>
          </span>
          <input
            type="checkbox"
            checked={includeReversed}
            onChange={(event) => onReversedChange(event.target.checked)}
          />
          <span className="toggle-track" aria-hidden="true">
            <span>{includeReversed ? 'ON' : 'OFF'}</span>
            <i />
          </span>
        </label>

        <button type="button" className="primary-button" onClick={onStart}>
          리딩 시작
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <p className="setup-footnote">선택한 {drawCount}장의 카드는 한 번의 리딩 동안 중복되지 않습니다.</p>
    </main>
  )
}
