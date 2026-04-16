import type { CSSProperties } from 'react'
import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplUsosIncorretosProps { pageNumber: number }

export function TplUsosIncorretos({ pageNumber }: TplUsosIncorretosProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle } = usePageColors('usos-incorretos')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const src = assets_base64.logo_principal

  const casos = [
    { label: 'Não deformar', filter: 'none', transform: 'scaleX(1.4)', bg: '#fff' },
    { label: 'Não mudar as cores', filter: 'sepia(1) saturate(5) hue-rotate(300deg)', transform: 'none', bg: '#fff' },
    { label: 'Não rotacionar', filter: 'none', transform: 'rotate(-20deg)', bg: '#fff' },
    { label: 'Não usar sem contraste', filter: 'brightness(1.6) contrast(0.4)', transform: 'none', bg: '#e8e5d8' },
    { label: 'Não inverter o símbolo', filter: 'none', transform: 'scaleX(-1)', bg: '#fff' },
    { label: 'Não aplicar em textos', filter: 'none', transform: 'none', bg: '#fff', small: true },
    { label: 'Não diminuir', filter: 'none', transform: 'scale(0.35)', bg: '#fff' },
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
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor, ...pageBackgroundStyle }}
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
        <h2 style={{ fontWeight: 900, color: contentTitleColor, margin: '0 0 8px 0', ...pageTitleStyle(38) }}>
          O Que Não Fazer
        </h2>
        <p style={{ color: textColor, margin: '0 0 16px 0', maxWidth: '88%', ...bodyStyle(12.5, { lineHeight: 1.7 }) }}>
          &nbsp;&nbsp;Para preservar a identidade visual da marca, é essencial evitar alterações indevidas no logo. Não modifique
          cores, proporções, inclinações ou insira efeitos que comprometam sua legibilidade e reconhecimento.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 16, flex: 1 }}>
          {casos.map((caso, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: caso.bg,
                borderRadius: 8,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                padding: '24px 12px 14px',
                gap: 16,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
                <svg width="100%" height="100%">
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.3" />
                  <line x1="100%" y1="0" x2="0" y2="100%" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.3" />
                </svg>
              </div>

              <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', overflow: 'hidden' }}>
                {caso.label === 'Não aplicar em textos' ? (
                  <div style={{ padding: '4px 8px', textAlign: 'justify', fontSize: 6, color: '#333', lineHeight: 1.2, opacity: 0.8 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor {src ? <img src={src} style={{ height: 10, verticalAlign: 'middle', display: 'inline-block', margin: '0 2px' }} alt="" /> : <span>[LOGO]</span>} incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </div>
                ) : src ? (
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

              <div style={{
                ...metaStyle(10.5),
                fontWeight: 600,
                color: '#EF4444',
                textAlign: 'center',
                position: 'relative',
                zIndex: 12,
                lineHeight: 1,
                background: 'rgba(239, 68, 68, 0.05)',
                padding: '6px 14px',
                borderRadius: 100,
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}>
                <span style={{ marginRight: 4, opacity: 0.8, fontSize: 8, verticalAlign: 'middle' }}>✖</span>
                <span style={{ verticalAlign: 'middle' }}>{caso.label}</span>
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
