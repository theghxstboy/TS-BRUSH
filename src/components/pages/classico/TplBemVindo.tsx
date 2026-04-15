import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplBemVindoProps { pageNumber: number }

export function TplBemVindo({ pageNumber }: TplBemVindoProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle } = usePageColors('bem-vindo')
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()
  const nomeMarca = projeto.nome_marca || 'TRAJETORIA DO SUCESSO'

  return (
    <div
      className="pagina-pdf"
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor, ...pageBackgroundStyle }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '55% 1fr',
          padding: '40px 0 40px 40px',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, paddingRight: 24 }}>
          <h1 style={{ fontWeight: 900, color: contentTitleColor, margin: 0, ...pageTitleStyle(38, { lineHeight: 1.1 }) }}>
            {conteudo_pdf.boas_vindas_titulo || 'Bem Vindo!'}
          </h1>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_1}
          </p>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_2.replace('Na marca', `Na ${nomeMarca}`)}
          </p>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.7 }) }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_3}
          </p>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {assets_base64.logo_principal ? (
            <img
              src={assets_base64.logo_principal}
              alt="Logo Outline"
              style={{
                width: '160%',
                maxWidth: 'none',
                objectFit: 'contain',
                opacity: 0.07,
                filter: 'grayscale(1)',
                position: 'absolute',
                right: -60,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 110,
                fontWeight: 900,
                color: darkColor,
                opacity: 0.06,
                lineHeight: 1,
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '-4px',
                textAlign: 'right',
                userSelect: 'none',
              }}
            >
              LG
            </div>
          )}
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
