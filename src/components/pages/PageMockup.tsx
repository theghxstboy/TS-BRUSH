import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

interface PageMockupProps {
  mockupIndex: number
  pageNumber: number
  totalMockups: number
}

export function PageMockup({ mockupIndex, pageNumber, totalMockups }: PageMockupProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, textColor, shadowColor, pageBackgroundStyle } = usePageColors('mockup')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const src = assets_base64.mockups[mockupIndex]
  if (!src) return null

  return (
    <div className="pagina-pdf" style={{ background: '#111', color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <img
          src={src}
          alt={`Mockup ${mockupIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${shadowColor} 0%, transparent 45%, transparent 65%, ${shadowColor} 100%)`,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ ...metaStyle(10), fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: primaryColor, marginBottom: 3 }}>
            Aplicacoes da Marca
          </div>
          <div style={{ color: '#fff', ...pageTitleStyle(20, { fontWeight: 800, lineHeight: 1.05 }) }}>
            {projeto.nome_marca || 'Marca'}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ ...bodyStyle(11), fontFamily: "'Geist Mono', monospace", color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
            MOCKUP {String(mockupIndex + 1).padStart(2, '0')}{totalMockups > 1 ? ` / ${String(totalMockups).padStart(2, '0')}` : ''}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 28, fontWeight: 900, color: primaryColor, lineHeight: 1 }}>
            {String(pageNumber).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: primaryColor, zIndex: 25 }} />

      <HUD
        sectionTitle="Aplicacoes & Mockups"
        pageNumber={pageNumber}
        titleColor="rgba(255,255,255,0.55)"
        lineColor="transparent"
        numColor="transparent"
      />
    </div>
  )
}
