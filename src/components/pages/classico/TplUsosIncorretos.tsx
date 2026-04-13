import type { CSSProperties } from 'react'
import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplUsosIncorretosProps { pageNumber: number }

export function TplUsosIncorretos({ pageNumber }: TplUsosIncorretosProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor } = usePageColors()
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()
  const src = assets_base64.logo_principal

  const casos = [
    { label: 'Não deformar', filter: 'none', transform: 'scaleX(1.4)', bg: '#fff' },
    { label: 'Não mudar as cores', filter: 'sepia(1) saturate(5) hue-rotate(300deg)', transform: 'none', bg: '#fff' },
    { label: 'Não rotacionar', filter: 'none', transform: 'rotate(-20deg)', bg: '#fff' },
    { label: 'Não usar sem contraste', filter: 'brightness(1.6) contrast(0.4)', transform: 'none', bg: '#e8e5d8' },
    { label: 'Não inverter o símbolo', filter: 'none', transform: 'scaleX(-1)', bg: '#fff' },
    { label: 'Não aplicar em textos', filter: 'none', transform: 'none', bg: '#fff', small: true },
    { label: 'Não diminuir', filter: 'brightness(0) opacity(0.3)', transform: 'none', bg: '#fff' },
    { label: 'Não aplicar sombra', filter: 'drop-shadow(4px 6px 4px rgba(0,0,0,0.9))', transform: 'none', bg: '#fff' },
  ]

  const LogoPlaceholder = ({ style }: { style?: CSSProperties }) => (
    <div style={{ fontSize: 40, fontWeight: 900, color: darkColor, textAlign: 'center', lineHeight: 1, ...style }}>
      LOGO
      <br />
      AQUI
    </div>
  )

  return (
    <div
      className="pagina-pdf"
      style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '32px 36px 52px 36px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
        }}
      >
        <h2 style={{ fontWeight: 900, color: darkColor, margin: '0 0 8px 0', ...pageTitleStyle(38) }}>
          O Que Não Fazer
        </h2>
        <p style={{ color: '#222', margin: '0 0 16px 0', maxWidth: '88%', ...bodyStyle(12.5, { lineHeight: 1.7 }) }}>
          &nbsp;&nbsp;Para preservar a identidade visual da marca, é essencial evitar alterações indevidas no logo. Não modifique
          cores, proporções, inclinações ou insira efeitos que comprometam sua legibilidade e reconhecimento.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 0, flex: 1, border: '1px solid #ddd' }}>
          {casos.map((caso, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: index % 4 !== 3 ? '1px solid #ddd' : 'none',
                borderBottom: index < 4 ? '1px solid #ddd' : 'none',
                background: caso.bg,
                position: 'relative',
                padding: '12px 8px 8px',
                gap: 6,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 6,
                  border: '2px dashed #E53935',
                  borderRadius: 2,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                      linear-gradient(to bottom right, transparent calc(50% - 1px), #E53935 calc(50% - 1px), #E53935 calc(50% + 1px), transparent calc(50% + 1px)),
                      linear-gradient(to bottom left, transparent calc(50% - 1px), #E53935 calc(50% - 1px), #E53935 calc(50% + 1px), transparent calc(50% + 1px))
                    `,
                    opacity: 0.5,
                  }}
                />
              </div>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                {src ? (
                  <img
                    src={src}
                    alt={caso.label}
                    style={{
                      maxWidth: caso.small ? '54%' : '82%',
                      maxHeight: caso.small ? 68 : 82,
                      objectFit: 'contain',
                      filter: caso.filter,
                      transform: caso.transform,
                    }}
                  />
                ) : (
                  <LogoPlaceholder style={{ filter: caso.filter, transform: caso.transform }} />
                )}
              </div>

              <div style={{ fontSize: 10.5, fontWeight: 700, color: darkColor, textAlign: 'center', position: 'relative', zIndex: 2, lineHeight: 1.3 }}>
                {caso.label}
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
        <span style={{ fontSize: 15, fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
