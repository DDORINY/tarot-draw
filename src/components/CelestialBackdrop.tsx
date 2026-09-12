interface CelestialBackdropProps {
  variant: 'setup' | 'selection' | 'reveal'
}

export function CelestialBackdrop({ variant }: CelestialBackdropProps) {
  return (
    <div className={`celestial-backdrop celestial-backdrop--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <g className="celestial-orbit celestial-orbit--primary">
          <ellipse cx="810" cy="480" rx="650" ry="255" />
          <circle cx="1460" cy="480" r="7" className="celestial-node" />
        </g>
        <g className="celestial-orbit celestial-orbit--secondary">
          <ellipse cx="250" cy="650" rx="420" ry="145" />
        </g>
        <path className="celestial-star celestial-star--one" d="M1320 172v30m-15-15h30m-25-10 20 20m0-20-20 20" />
        <path className="celestial-star celestial-star--two" d="M206 326v18m-9-9h18" />
        <path className="celestial-star celestial-star--three" d="m1180 760 7 7-7 7-7-7z" />
        <circle className="celestial-dot celestial-dot--one" cx="420" cy="152" r="2" />
        <circle className="celestial-dot celestial-dot--two" cx="1400" cy="700" r="2.5" />
      </svg>
    </div>
  )
}
