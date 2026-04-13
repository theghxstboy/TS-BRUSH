import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'

interface TplBemVindoProps { pageNumber: number }

export function TplBemVindo({ pageNumber }: TplBemVindoProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, darkColor } = usePageColors()
  const nomeMarca = projeto.nome_marca || 'TRAJETÓRIA DO SUCESSO'

  return (
    <div
      className="pagina-pdf"
      style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}
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
          <h1 style={{ fontSize: 38, fontWeight: 900, color: darkColor, margin: 0, lineHeight: 1.1 }}>
            Bem Vindo!
          </h1>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;Este manual foi criado para garantir a consistência e a
            autenticidade da identidade visual de sua marca. Aqui, você
            encontrará diretrizes essenciais para o uso correto do logo, cores,
            tipografia e outros elementos gráficos que representam a essência
            do seu negócio.
          </p>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;Na <strong>{nomeMarca}</strong>, acreditamos que uma identidade
            visual forte é a base para uma comunicação impactante e
            memorável. Com este material, sua marca estará preparada para se
            destacar e construir conexões sólidas com seu público.
          </p>

          <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.7, margin: 0 }}>
            &nbsp;&nbsp;Siga as orientações deste guia e mantenha a coerência em todas
            as aplicações. Juntos, estamos construindo uma marca de sucesso!
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
