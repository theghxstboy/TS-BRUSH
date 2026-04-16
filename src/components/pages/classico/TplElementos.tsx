import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplElementosProps { pageNumber: number }

export function TplElementos({ pageNumber }: TplElementosProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, logoBackdropColor, pageBackgroundStyle } = usePageColors('elementos')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  const uploadedAssets = [
    { src: assets_base64.logo_principal, fallbackLabel: 'Logotipo principal' },
    { src: assets_base64.logo_simbolo, fallbackLabel: 'Símbolo' },
    { src: assets_base64.logo_monocromatica, fallbackLabel: 'Versão monocromática' },
  ]

  const labels = projeto.elementos_logo
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)

  const visibleCount = Math.max(labels.length, uploadedAssets.filter((item) => item.src).length, 1)
  const cards = Array.from({ length: Math.min(visibleCount, 3) }, (_, index) => ({
    label: labels[index] || uploadedAssets[index]?.fallbackLabel || `Elemento ${index + 1}`,
    src: uploadedAssets[index]?.src ?? null,
  }))

  return (
    <div
      className="pagina-pdf"
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor, ...pageBackgroundStyle }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '36px 40px 52px 40px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
        }}
      >
        <h2 style={{ fontWeight: 900, color: contentTitleColor, margin: '0 0 12px 0', ...pageTitleStyle(40) }}>
          {conteudo_pdf.elementos_titulo || 'Elementos'}
        </h2>

        <p style={{ color: textColor, margin: '0 0 24px 0', ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
          &nbsp;&nbsp;{conteudo_pdf.elementos_descricao}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
            gap: 20,
            flex: 1,
          }}
        >
          {cards.map((card, index) => (
            <div key={`${card.label}-${index}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  ...metaStyle(12),
                  fontWeight: 700,
                  color: darkColor,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {card.label}
              </div>

              <div
                style={{
                  background: logoBackdropColor,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flex: 1,
                  minHeight: 180,
                  padding: 20,
                }}
              >
                {card.src ? (
                  <img
                    src={card.src}
                    alt={card.label}
                    style={{ maxWidth: '86%', maxHeight: '86%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>
                    {card.label}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <div style={{ flex: 1, height: 1.5, background: darkColor, opacity: 0.2 }} />
        <span style={{ ...bodyStyle(15), fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
