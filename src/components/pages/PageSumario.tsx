import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

export interface SumarioEntry {
  title: string
  page: number
}

interface PageSumarioProps {
  pageNumber: number
  entries: SumarioEntry[]
}

export function PageSumario({ pageNumber, entries }: PageSumarioProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay } = usePageColors()
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  return (
    <div className="pagina-pdf" style={{ background: '#fff' }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '38%', background: darkColor, overflow: 'hidden' }}>
          {BgOverlay && <BgOverlay />}
        </div>
      </div>

      <div className="conteudo sumario-layout">
        <div className="sumario-left" style={{ color: '#fff' }}>
          <div>
            {assets_base64.logo_principal && (
              <img
                src={assets_base64.logo_principal}
                alt="logo"
                style={{ maxHeight: 48, objectFit: 'contain', marginBottom: 24, filter: 'brightness(0) invert(1)' }}
              />
            )}
            <div className="sumario-label" style={{ color: primaryColor, ...metaStyle(11) }}>Sumário</div>
            <div className="sumario-title" style={pageTitleStyle(48)}>Con<br />teúdo</div>
          </div>
          <div className="sumario-desc" style={bodyStyle(13)}>
            {projeto.conceito || 'Este manual define os padrões visuais da marca.'}
          </div>
        </div>

        <div className="sumario-right">
          {entries.map((entry, i) => (
            <div key={i} className="sumario-item">
              <span className="sumario-item-num" style={{ color: primaryColor }}>
                {String(entry.page).padStart(2, '0')}
              </span>
              <span className="sumario-item-title" style={{ color: '#1a1a1a', ...bodyStyle(14) }}>{entry.title}</span>
              <div className="sumario-item-dots" />
              <span className="sumario-item-page" style={{ color: '#1a1a1a' }}>{String(entry.page).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>

      <HUD
        sectionTitle="Sumário"
        pageNumber={pageNumber}
        titleColor="rgba(255,255,255,0.6)"
        lineColor="rgba(0,0,0,0.12)"
        numColor={primaryColor}
      />
    </div>
  )
}
