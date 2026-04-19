import { useBrandStore } from '../../../store/useBrandStore'

export function PresFinal() {
  const { presentation_data } = useBrandStore()
  const { brand_name, appearance, typography } = presentation_data
  const { fundo, titulo, texto, detalhe } = appearance.final

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: appearance.fundos.capaSecao ? `url(${appearance.fundos.capaSecao})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <div style={{
          height: '1px',
          width: '40px',
          background: detalhe,
          margin: '0 auto 24px'
        }} />
      </div>

      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <h2 style={{
          fontSize: '84px',
          fontWeight: 900,
          color: titulo,
          textTransform: 'uppercase',
          letterSpacing: '-2px',
          margin: 0,
          lineHeight: 1,
          fontFamily: titleFont
        }}>
          Obrigado.
        </h2>
        <div style={{
          marginTop: '32px',
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          display: 'inline-block',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: 700,
            color: texto,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: 0,
            fontFamily: textFont
          }}>
            {brand_name || 'Projeto Concluído'}
          </p>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '80px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.4em'
        }}>
          Apresentação de Identidade Visual / 2026
        </p>
      </div>

      {/* Decorative vertical line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '1px',
        height: '60px',
        background: detalhe,
        opacity: 0.5
      }} />
    </div>
  )
}
