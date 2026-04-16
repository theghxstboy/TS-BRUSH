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
    background: darkColor,
    color: '#fff',
    fontWeight: 800,
    ...metaStyle(13),
    letterSpacing: '0.08em',
    padding: '10px 20px',
    borderRadius: 24,
    zIndex: 10,
    textTransform: 'uppercase',
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
