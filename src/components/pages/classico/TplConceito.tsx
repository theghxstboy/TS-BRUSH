import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplConceitoProps { pageNumber: number }

export function TplConceito({ pageNumber }: TplConceitoProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle } = usePageColors('conceito')
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()

  const caracteristicas = projeto.caracteristicas_marca || 'os principais atributos e diferenciais da marca'
  const valores = projeto.valores_marca || 'os valores centrais que orientam sua comunicação'
  const texto1 = (conteudo_pdf.conceito_texto_1 || '').replace('da marca', `da ${projeto.nome_marca || 'marca'}`).replace('os principais atributos e diferenciais da marca', caracteristicas)
  const texto2 = (conteudo_pdf.conceito_texto_2 || '').replace('os valores centrais que orientam sua comunicação', valores)
  const texto3 = conteudo_pdf.conceito_texto_3

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
          gridTemplateColumns: '52% 1fr',
          padding: '40px 0 50px 40px',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, paddingRight: 28 }}>
          <h2 style={{ fontWeight: 900, color: contentTitleColor, margin: 0, ...pageTitleStyle(40) }}>
            {conteudo_pdf.conceito_titulo || 'Conceito'}
          </h2>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
            &nbsp;&nbsp;{texto1}
          </p>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
            &nbsp;&nbsp;{texto2}
          </p>

          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
            &nbsp;&nbsp;{texto3}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {assets_base64.logo_principal ? (
            <img
              src={assets_base64.logo_principal}
              alt="Logo"
              style={{
                maxWidth: '88%',
                maxHeight: '75%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: darkColor,
                lineHeight: 1,
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '-2px',
              }}
            >
              LOGO
              <br />
              AQUI
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
        <span style={{ fontSize: 15, fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
