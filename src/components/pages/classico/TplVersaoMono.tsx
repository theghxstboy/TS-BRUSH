import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'
import { MonochromeLogo } from '../../common/MonochromeLogo'

interface TplVersaoMonoProps { pageNumber: number }

export function TplVersaoMono({ pageNumber }: TplVersaoMonoProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor, pageColor, logoBackdropColor, contentTitleColor, textColor, pageBackgroundStyle } = usePageColors('versao-mono')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const src = assets_base64.logo_monocromatica || assets_base64.logo_principal

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
          Versao Monocromatica
        </h2>

        <p style={{ color: '#222', margin: '0 0 24px 0', maxWidth: '90%', ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
          &nbsp;&nbsp;Para garantir a flexibilidade da identidade visual, o logo pode ser aplicado em versoes monocromaticas
          (preto ou branco). Essas variacoes devem ser usadas em casos especificos, como fundos que comprometam
          a legibilidade da versao original.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ ...metaStyle(12), fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>p&amp;b</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: logoBackdropColor, borderRadius: 4 }}>
              {src ? (
                <MonochromeLogo src={src} color={contentTitleColor} maxWidth="80%" maxHeight={110} />
              ) : (
                <div style={{ fontSize: 52, fontWeight: 900, color: darkColor, textAlign: 'center', lineHeight: 1 }}>LOGO<br />AQUI</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ ...metaStyle(12), fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>negativo</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: darkColor, borderRadius: 4 }}>
              {src ? (
                <MonochromeLogo src={src} color="#FFFFFF" maxWidth="80%" maxHeight={110} />
              ) : (
                <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1 }}>LOGO<br />AQUI</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ ...metaStyle(12), fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>apenas preto</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: pageColor, borderRadius: 4 }}>
              {src ? (
                <MonochromeLogo src={src} color={darkColor} maxWidth="80%" maxHeight={110} />
              ) : (
                <div style={{ fontSize: 52, fontWeight: 900, color: darkColor, textAlign: 'center', lineHeight: 1, opacity: 0.8 }}>LOGO<br />AQUI</div>
              )}
            </div>
          </div>
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
