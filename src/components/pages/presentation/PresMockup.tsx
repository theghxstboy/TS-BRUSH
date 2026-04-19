import { useBrandStore } from '../../../store/useBrandStore'

interface PresMockupProps {
  mockupSrc: string
  index: number
  total: number
}

export function PresMockup({ mockupSrc, index, total }: PresMockupProps) {
  const { presentation_data } = useBrandStore()
  const { appearance, typography } = presentation_data
  const { fundo } = appearance.capa

  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: appearance.fundos.conteudo ? `url(${appearance.fundos.conteudo})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {mockupSrc ? (
          <img
            src={mockupSrc}
            alt={`Mockup ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)' }}>
            Mockup não disponível
          </div>
        )}

        {/* Floating Badge */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          fontFamily: textFont
        }}>
          APLICAÇÃO {index + 1} / {total}
        </div>
      </div>
    </div>
  )
}
