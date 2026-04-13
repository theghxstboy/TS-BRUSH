import { usePageColors } from '../../../hooks/usePageColors'
import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplSecaoProps {
  numero: string    // ex: "01"
  titulo: string    // ex: "Logo"
  subtitulo?: string
}

export function TplSecao({ numero, titulo, subtitulo }: TplSecaoProps) {
  const { primaryColor, darkColor } = usePageColors()
  const { assets_base64 } = useBrandStore()
  const { pageTitleStyle } = usePresentationTextStyles()

  return (
    <div
      className="pagina-pdf"
      style={{
        background: primaryColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Número gigante à esquerda, cortando a borda */}
      <div style={{
        position: 'absolute',
        left: -36,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 260,
        fontWeight: 900,
        color: darkColor,
        lineHeight: 0.85,
        userSelect: 'none',
        zIndex: 2,
        letterSpacing: '-8px',
      }}>
        {numero}
      </div>

      {/* Título da seção — centro */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '38%',
        paddingRight: '28%',
        zIndex: 5,
      }}>
        <div>
          <div style={{
            fontWeight: 800,
            color: darkColor,
            ...pageTitleStyle(subtitulo ? 36 : 42, { lineHeight: 1.05 }),
          }}>
            {titulo}
          </div>
          {subtitulo && (
            <div style={{
              fontWeight: 800,
              color: darkColor,
              marginTop: 2,
              ...pageTitleStyle(36, { lineHeight: 1.05 }),
            }}>
              {subtitulo}
            </div>
          )}
        </div>
      </div>

      {/* Logo outline gigante — canto direito */}
      <div style={{
        position: 'absolute',
        right: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 3,
        opacity: 0.18,
        width: '42%',
        overflow: 'hidden',
      }}>
        {assets_base64.logo_principal ? (
          <img
            src={assets_base64.logo_principal}
            alt=""
            style={{
              width: '100%',
              objectFit: 'contain',
              filter: 'brightness(0)',
            }}
          />
        ) : (
          <div style={{
            fontSize: 140,
            fontWeight: 900,
            color: darkColor,
            lineHeight: 1,
            fontFamily: 'Impact, sans-serif',
            letterSpacing: '-4px',
          }}>
            LG<br />AQ
          </div>
        )}
      </div>

      {/* Linha inferior */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 28,
        right: 28,
        height: 2,
        background: darkColor,
        opacity: 0.25,
        zIndex: 10,
      }} />
    </div>
  )
}
