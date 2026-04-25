import { useBrandStore } from '../../../store/useBrandStore'
import type { SlideAppearance } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplAplicacaoMockupProps {
  mockupIndex: number
  pageNumber: number
  totalMockups: number
  overrideAppearance?: SlideAppearance
}

export function TplAplicacaoMockup({ mockupIndex, pageNumber, totalMockups, overrideAppearance }: TplAplicacaoMockupProps) {
  const { assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, textColor, pageBackgroundStyle } = usePageColors('mockup', overrideAppearance)
  const { bodyStyle, metaStyle } = usePresentationTextStyles()
  const src = assets_base64.mockups[mockupIndex]
  if (!src) return null

  return (
    <div
      className="pagina-pdf"
      style={{ background: darkColor, position: 'relative', overflow: 'hidden', color: textColor, ...pageBackgroundStyle }}
    >
      <img
        src={src}
        alt={`Aplicacao ${mockupIndex + 1}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: `linear-gradient(to top, ${darkColor}dd 0%, transparent 50%, transparent 70%, ${darkColor}88 100%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 28,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 10,
        }}
      >
        <div style={{ ...metaStyle(10), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>
          Aplicacoes - Mockup {String(mockupIndex + 1).padStart(2, '0')}{totalMockups > 1 ? ` / ${String(totalMockups).padStart(2, '0')}` : ''}
        </div>
        <div style={{ flex: 1, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
        <span style={{ ...bodyStyle(15), fontWeight: 800, color: '#fff' }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
