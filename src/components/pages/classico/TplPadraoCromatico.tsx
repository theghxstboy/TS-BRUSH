import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplPadraoCromaticoProps { pageNumber: number }

function getCircleBorder(hex: string) {
  const normalized = hex.toUpperCase()
  if (normalized === '#FFFFFF') return '2px solid rgba(0,0,0,0.14)'
  if (normalized === '#000000') return '2px solid rgba(255,255,255,0.16)'
  return '2px solid rgba(0,0,0,0.04)'
}

export function TplPadraoCromatico({ pageNumber }: TplPadraoCromaticoProps) {
  const { projeto, cores_logo } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor, pageBackgroundStyle } = usePageColors('padrao-cromatico')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()
  const sensacoes = projeto.sensacoes_cores || 'as sensações e associações que fortalecem a personalidade da marca'

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
        <h2 style={{ fontWeight: 900, color: contentTitleColor, margin: '0 0 16px 0', ...pageTitleStyle(40) }}>
          Padrão Cromático
        </h2>

        <p style={{ color: '#222', margin: '0 0 32px 0', maxWidth: '92%', ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>
          &nbsp;&nbsp;As cores escolhidas para a identidade visual da marca desempenham um papel fundamental na construção de
          sua personalidade. Cada tom foi selecionado para transmitir <span style={{ color: darkColor, fontWeight: 600 }}>{sensacoes}</span>.
          O uso correto da paleta reforça o reconhecimento da marca e deve ser seguido em todas as aplicações.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 32,
            flex: 1,
            alignItems: 'center',
            justifyContent: cores_logo.length <= 3 ? 'center' : 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {cores_logo.map((cor) => (
            <div key={cor.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: cor.hex,
                  boxShadow: `0 4px 24px ${cor.hex}55`,
                  border: getCircleBorder(cor.hex),
                  flexShrink: 0,
                }}
              />

              <div style={{ textAlign: 'center', lineHeight: 1.7 }}>
                <div style={bodyStyle(13, { lineHeight: 1.7 })}>
                  <span style={{ fontWeight: 400 }}>Hex: </span>
                  <span style={{ fontWeight: 700 }}>{cor.hex.toUpperCase()}</span>
                </div>
                {cor.rgb && (
                  <div style={bodyStyle(13, { lineHeight: 1.7 })}>
                    <span style={{ fontWeight: 700 }}>RGB: </span>
                    <span style={{ fontWeight: 400 }}>{cor.rgb}</span>
                  </div>
                )}
                {cor.hsl && (
                  <div style={bodyStyle(13, { lineHeight: 1.7 })}>
                    <span style={{ fontWeight: 700 }}>HSL: </span>
                    <span style={{ fontWeight: 400 }}>{cor.hsl}</span>
                  </div>
                )}
                {cor.cmyk && (
                  <div style={bodyStyle(13, { lineHeight: 1.7 })}>
                    <span style={{ fontWeight: 700 }}>CMYK: </span>
                    <span style={{ fontWeight: 400 }}>{cor.cmyk}</span>
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
