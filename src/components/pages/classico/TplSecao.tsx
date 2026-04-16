import { usePageColors } from '../../../hooks/usePageColors'
import { useBrandStore } from '../../../store/useBrandStore'
import type { SlideAppearanceKey } from '../../../store/useBrandStore'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplSecaoProps {
  numero: string    // ex: "01"
  titulo: string    // ex: "Logo"
  subtitulo?: string
  appearanceKey: SlideAppearanceKey
}

export function TplSecao({ numero, titulo, subtitulo, appearanceKey }: TplSecaoProps) {
  const { pageColor, detailColor, dividerTitleColor, textColor, pageBackgroundStyle } = usePageColors(appearanceKey)
  const { assets_base64 } = useBrandStore()
  const { pageTitleStyle } = usePresentationTextStyles()

  return (
    <div
      className="pagina-pdf"
      style={{
        background: pageColor,
        position: 'relative',
        overflow: 'hidden',
        color: textColor,
        ...pageBackgroundStyle,
      }}
    >
      {/* Número gigante — movido mais para a esquerda para evitar overlap */}
      <div style={{
        position: 'absolute',
        left: -42,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 280,
        fontWeight: 900,
        color: dividerTitleColor,
        lineHeight: 0.8,
        userSelect: 'none',
        zIndex: 2,
        letterSpacing: '-12px',
      }}>
        {numero}
      </div>

      {/* Título da seção — centro-esquerda, com padding aumentado para não bater no número */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '40%',
        paddingRight: '20%',
        zIndex: 10,
      }}>
        <div>
          <div style={{
            fontWeight: 900,
            color: dividerTitleColor,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            ...pageTitleStyle(subtitulo ? 44 : 52, { lineHeight: 1 }),
          }}>
            {titulo}
          </div>
          {subtitulo && (
            <div style={{
              fontWeight: 800,
              color: dividerTitleColor,
              marginTop: 4,
              ...pageTitleStyle(38, { lineHeight: 1 }),
            }}>
              {subtitulo}
            </div>
          )}
        </div>
      </div>

      {/* Logo outline gigante — canto direito */}
      <div style={{
        position: 'absolute',
        right: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 3,
        opacity: 0.15,
        width: '65%',
        height: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        {assets_base64.logo_principal ? (
          <img
            src={assets_base64.logo_principal}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'brightness(0)',
            }}
          />
        ) : (
          <div style={{
            fontSize: 180,
            fontWeight: 900,
            color: dividerTitleColor,
            lineHeight: 1,
            opacity: 0.2,
          }}>
            LOGO
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
        background: detailColor,
        opacity: 0.25,
        zIndex: 10,
      }} />
    </div>
  )
}
