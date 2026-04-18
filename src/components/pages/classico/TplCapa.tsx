import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplCapaProps { pageNumber: number }

export function TplCapa({ pageNumber: _pageNumber }: TplCapaProps) {
  const { assets_base64, tipografia, aparencia } = useBrandStore()
  const { pageColor, darkColor, textColor, pageBackgroundStyle } = usePageColors('capa')
  const { metaStyle } = usePresentationTextStyles()

  const bgToUse = pageColor

  const alignment = tipografia.apresentacao_alinhamento || 'left'
  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 28,
    background: `${darkColor}33`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    fontWeight: 800,
    ...metaStyle(13),
    letterSpacing: '0.08em',
    padding: '10px 24px',
    borderRadius: 999,
    border: `1px solid ${darkColor}66`,
    zIndex: 10,
    textTransform: 'uppercase',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
  }

  if (alignment === 'center') {
    badgeStyle.left = '50%'
    badgeStyle.transform = 'translateX(-50%)'
  } else if (alignment === 'right') {
    badgeStyle.right = 28
  } else {
    badgeStyle.left = 28
  }

  if (!assets_base64.logo_principal) return null

  return (
    <div
      className="pagina-pdf"
      style={{ background: bgToUse, position: 'relative', color: textColor, ...pageBackgroundStyle }}
    >
      {/* Badge MANUAL DE MARCA */}
      <div style={badgeStyle}>
        Manual de Marca
      </div>

      {/* Logo centralizado */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        <img
          src={assets_base64.logo_principal}
          alt="Logo"
          style={{ maxWidth: '60%', maxHeight: '55%', objectFit: 'contain' }}
        />
      </div>

      {/* Linha inferior */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: 28,
        right: 28,
        height: 2,
        background: darkColor,
        opacity: 0.35,
        zIndex: 10,
      }} />
    </div>
  )
}
