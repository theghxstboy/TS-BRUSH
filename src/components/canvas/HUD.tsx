interface HUDProps {
  sectionTitle?: string
  pageNumber: number
  titleColor?: string
  lineColor?: string
  numColor?: string
  showLogoMark?: string | null
}

export function HUD({
  sectionTitle,
  pageNumber,
  titleColor = '#ffffff',
  lineColor = 'rgba(255,255,255,0.3)',
  numColor = '#ffffff',
  showLogoMark,
}: HUDProps) {
  return (
    <div className="hud">
      {/* Top row */}
      <div className="hud-top">
        {sectionTitle ? (
          <h2
            className="titulo-secao"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: titleColor, opacity: 0.7 }}
          >
            {sectionTitle}
          </h2>
        ) : <div />}
        {showLogoMark && (
          <img src={showLogoMark} alt="logo" style={{ height: 28, objectFit: 'contain', opacity: 0.8 }} />
        )}
      </div>

      {/* Bottom row */}
      <div className="hud-bottom">
        <div className="hud-line" style={{ background: lineColor }} />
        <span className="hud-page-num numero-pagina" style={{ color: numColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
