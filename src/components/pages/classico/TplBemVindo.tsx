import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'

interface TplBemVindoProps { pageNumber: number }

export function TplBemVindo({ pageNumber }: TplBemVindoProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { primaryColor, darkColor, contentTitleColor, textColor, pageColor } = usePageColors('bem-vindo')
  const nomeMarca = projeto.nome_marca || 'TRAJETÓRIA DO SUCESSO'

  return (
    <div
      className="pagina-pdf"
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor }}
    >
      {/* Conteúdo esquerdo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: '55% 1fr',
        padding: '40px 0 40px 40px',
        zIndex: 5,
      }}>
        {/* Coluna esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, paddingRight: 24 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: contentTitleColor, margin: 0, lineHeight: 1.1 }}>
            {conteudo_pdf.boas_vindas_titulo || 'Bem Vindo!'}
          </h1>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_1}
          </p>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_2.replace('Na marca', `Na ${nomeMarca}`)}
          </p>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;{conteudo_pdf.boas_vindas_texto_3}
          </p>
        </div>

        {/* Coluna direita — logo outline gigante */}
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
            <div style={{
              fontSize: 110,
              fontWeight: 900,
              color: darkColor,
              opacity: 0.06,
              lineHeight: 1,
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '-4px',
              textAlign: 'right',
              userSelect: 'none',
            }}>
              LG
            </div>
          )}
        </div>
      </div>

      {/* Linha inferior + número */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 28,
        right: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 10,
      }}>
        <div style={{ flex: 1, height: 1.5, background: darkColor, opacity: 0.2 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
