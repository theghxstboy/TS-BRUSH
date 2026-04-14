import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'

interface TplCapaProps { pageNumber: number }

export function TplCapa({ pageNumber: _pageNumber }: TplCapaProps) {
  const { assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, textColor } = usePageColors('capa')

  if (!assets_base64.logo_principal) return null

  return (
    <div
      className="pagina-pdf"
      style={{ background: primaryColor, position: 'relative', color: textColor }}
    >
      {/* Badge MANUAL DE MARCA — canto superior esquerdo */}
      <div style={{
        position: 'absolute',
        top: 28,
        left: 28,
        background: darkColor,
        color: '#fff',
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: '0.08em',
        padding: '10px 20px',
        borderRadius: 24,
        zIndex: 10,
        textTransform: 'uppercase',
      }}>
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
          style={{ maxWidth: '55%', maxHeight: '52%', objectFit: 'contain' }}
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
