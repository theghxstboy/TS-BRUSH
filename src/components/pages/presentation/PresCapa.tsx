import { useBrandStore } from '../../../store/useBrandStore'
import tsLogo from '../../../logos/TS.svg'

export function PresCapa() {
  const { presentation_data } = useBrandStore()
  const { brand_name, appearance, typography } = presentation_data
  const { fundo, detalhe } = appearance.capa

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: appearance.fundos.capaSecao ? `url(${appearance.fundos.capaSecao})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <img src={tsLogo} alt="TS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{
        position: 'absolute',
        top: '55%',
        left: '0',
        right: '0',
        textAlign: 'center',
        padding: '0 40px',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 900,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          margin: 0,
          marginBottom: '10px',
          fontFamily: titleFont
        }}>
          {brand_name || 'Sua Marca'}
        </h1>
        <div style={{
          width: '60px',
          height: '4px',
          background: detalhe,
          margin: '0 auto',
          borderRadius: '2px'
        }} />
        <p style={{
          marginTop: '24px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontFamily: textFont
        }}>
          Apresentação de Identidade Visual
        </p>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        right: '40px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)'
      }} />
    </div>
  )
}
