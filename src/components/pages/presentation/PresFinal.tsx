import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'

interface PresFinalProps {
  pageId: string
}

export function PresFinal({ pageId }: PresFinalProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'final')
  const { brand_name, typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: titulo, cor_texto: texto, cor_detalhes: detalhe, imagem_fundo } = style

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: imagem_fundo ? `url(${imagem_fundo})` : 'none',
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
        textAlign: 'center',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: '8px',
          fontFamily: textFont
        }}>
          © {new Date().getFullYear()} Todos os Direitos Reservados
        </div>
        <div style={{
          fontSize: '13px',
          color: texto,
          fontFamily: textFont
        }}>
          <strong>Desenvolvido por:</strong> Agência TS | Designer{' '}
          <span style={{ color: detalhe, fontWeight: 700 }}>{presentation_data.responsible_name || 'Seu Nome'}</span>
        </div>
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
