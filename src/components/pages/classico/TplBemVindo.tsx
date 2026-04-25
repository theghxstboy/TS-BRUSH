import { useBrandStore } from '../../../store/useBrandStore'
import type { SlideAppearance } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplBemVindoProps { 
  pageNumber: number 
  overrideAppearance?: SlideAppearance
  overrideContent?: Record<string, any>
}

export function TplBemVindo({ pageNumber, overrideAppearance, overrideContent }: TplBemVindoProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle, exibirLogoFundo } = usePageColors('bem-vindo', overrideAppearance)
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()
  const nomeMarca = projeto.nome_marca || 'AGÊNCIA TS'
  
  const title = overrideContent?.title || conteudo_pdf.boas_vindas_titulo || 'Bem Vindo!'
  const text1 = overrideContent?.text1 || conteudo_pdf.boas_vindas_texto_1
  const text2 = overrideContent?.text2 || conteudo_pdf.boas_vindas_texto_2
  const text3 = overrideContent?.text3 || conteudo_pdf.boas_vindas_texto_3

  return (
    <div
      className="pagina-pdf"
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor, ...pageBackgroundStyle }}
    >
      {/* Logo de fundo - agora atrás de tudo */}
      {exibirLogoFundo && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none', zIndex: 1 }}>
          {assets_base64.logo_principal ? (
            <img
              src={assets_base64.logo_principal}
              alt=""
              style={{
                width: '80%',
                height: '80%',
                objectFit: 'contain',
                filter: 'grayscale(1)',
              }}
            />
          ) : (
            <div style={{ fontSize: 200, fontWeight: 900, color: darkColor }}>LOGO</div>
          )}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
          zIndex: 5,
        }}
      >
        <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h1 style={{ fontWeight: 900, color: contentTitleColor, margin: 0, ...pageTitleStyle(42, { lineHeight: 1.1 }) }}>
            {title}
          </h1>

          <p style={{ color: textColor, margin: 0, ...bodyStyle(14, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{text1}
          </p>

          <p style={{ color: textColor, margin: 0, ...bodyStyle(14, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{text2.replace('Na marca', `Na ${nomeMarca}`)}
          </p>

          <p style={{ color: textColor, margin: 0, ...bodyStyle(14, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{text3}
          </p>
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
