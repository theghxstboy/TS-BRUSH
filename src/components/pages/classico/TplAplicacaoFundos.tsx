import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplAplicacaoFundosProps { pageNumber: number }

export function TplAplicacaoFundos({ pageNumber }: TplAplicacaoFundosProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle } = usePageColors('aplicacao-fundos')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const src = assets_base64.logo_principal

  const fundos = [
    { label: 'fundo cor 1', bg: darkColor, textColor: '#fff', filter: 'brightness(0) invert(1)' },
    { label: 'fundo cor 2', bg: '#888888', textColor: '#fff', filter: 'brightness(0)' },
  ]

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
          Aplicacao Sobre Fundos
        </h2>

        <p style={{ color: '#222', margin: '0 0 20px 0', maxWidth: '90%', ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
          &nbsp;&nbsp;Para manter a integridade visual, a aplicacao do logotipo deve considerar o contraste adequado com o
          fundo. Sempre que possivel, utilize a versao original da marca. Em fundos escuros, prefira a versao clara, e em
          fundos claros, a versao escura.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
          {fundos.map((backgroundOption, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ ...metaStyle(13), fontWeight: 400, color: darkColor, letterSpacing: '0.04em', fontFamily: 'monospace', textAlign: 'center' }}>
                {backgroundOption.label}
              </div>
              <div
                style={{
                  flex: 1,
                  background: backgroundOption.bg,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  minHeight: 160,
                }}
              >
                {src ? (
                  <img src={src} alt={backgroundOption.label} style={{ maxWidth: '70%', maxHeight: 110, objectFit: 'contain', filter: backgroundOption.filter }} />
                ) : (
                  <div style={{ fontSize: 52, fontWeight: 900, color: backgroundOption.textColor, textAlign: 'center', lineHeight: 1 }}>LOGO<br />AQUI</div>
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
