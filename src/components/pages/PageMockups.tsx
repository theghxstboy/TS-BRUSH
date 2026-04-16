import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

interface PageMockupsProps { pageNumber: number }

function getMockupGridStyle(count: number): React.CSSProperties {
  if (count === 1) return { gridTemplateColumns: '1fr' }
  if (count === 2) return { gridTemplateColumns: '1fr 1fr' }
  if (count === 3) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
  if (count === 4) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
  return { gridTemplateColumns: '1fr 1fr 1fr' }
}

export function PageMockups({ pageNumber }: PageMockupsProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, textColor, pageColor, shadowColor, pageBackgroundStyle } = usePageColors('mockup')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const mockups = assets_base64.mockups
  if (mockups.length === 0) return null
  const displayMockups = mockups.slice(0, 6)

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor, ...pageBackgroundStyle }}>
      {/* Fundo */}
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: shadowColor }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 70, background: primaryColor }} />
      </div>

      {/* Conteudo */}
      <div className="conteudo mockups-layout">
        {/* Header */}
        <div className="mockups-header" style={{ paddingTop: 20, paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <div>
              <div style={{ ...metaStyle(10), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Aplicações da Marca</div>
              <div style={{ ...pageTitleStyle(22, { fontWeight: 800, lineHeight: 1.05 }) }}>Mockups — {projeto.nome_marca || 'Marca'}</div>
            </div>
            <div style={{ ...bodyStyle(24), fontFamily: "'Geist Mono', monospace", fontWeight: 900, color: primaryColor, lineHeight: 1 }}>
              {String(pageNumber).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          className="mockups-grid"
          style={getMockupGridStyle(displayMockups.length)}
        >
          {displayMockups.map((src, i) => (
            <img key={i} src={src} alt={`Mockup ${i + 1}`} className="mockup-img" />
          ))}
        </div>
      </div>

      {/* HUD (light version, page num shown in header) */}
      <HUD
        sectionTitle="Aplicações & Mockups"
        pageNumber={pageNumber}
        titleColor="rgba(255,255,255,0.5)"
        lineColor="rgba(0,0,0,0.08)"
        numColor="transparent"
      />
    </div>
  )
}
