import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageMockupProps {
  /** 0-based index into assets_base64.mockups */
  mockupIndex: number
  /** Sequential page number in the full document */
  pageNumber: number
  /** Total number of mockup pages (for "X de Y" footer) */
  totalMockups: number
}

export function PageMockup({ mockupIndex, pageNumber, totalMockups }: PageMockupProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, textColor } = usePageColors('mockup')
  const src = assets_base64.mockups[mockupIndex]
  if (!src) return null
  const isLast = mockupIndex === totalMockups - 1

  return (
    <div className="pagina-pdf" style={{ background: '#111', color: textColor }}>
      {/* Fundo: mockup em tela cheia */}
      <div className="fundo" style={{ zIndex: 0 }}>
        <img
          src={src}
          alt={`Mockup ${mockupIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Gradient overlay for HUD legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${darkColor}cc 0%, transparent 45%, transparent 65%, ${darkColor}88 100%)`
        }} />
      </div>

      {/* Bottom info bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 20,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: primaryColor, marginBottom: 3 }}>
            Aplicações da Marca
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
            {projeto.nome_marca || 'Marca'}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
            MOCKUP {String(mockupIndex + 1).padStart(2, '0')}{totalMockups > 1 ? ` / ${String(totalMockups).padStart(2, '0')}` : ''}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 28, fontWeight: 900, color: primaryColor, lineHeight: 1 }}>
            {String(pageNumber).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Accent line bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: primaryColor, zIndex: 25 }} />

      {/* HUD top only */}
      <HUD
        sectionTitle={`Aplicações & Mockups`}
        pageNumber={pageNumber}
        titleColor="rgba(255,255,255,0.55)"
        lineColor="transparent"
        numColor="transparent"
      />
    </div>
  )
}
