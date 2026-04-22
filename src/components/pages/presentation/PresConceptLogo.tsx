import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'

interface PresConceptLogoProps {
  pageId: string
  explanation: string
  logoSrc: string | null
}

export function PresConceptLogo({ pageId, explanation, logoSrc }: PresConceptLogoProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'conteudo')
  const { typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: colorTitulo, cor_texto: colorTexto, cor_detalhes: detalhe, imagem_fundo } = style

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: imagem_fundo ? `url(${imagem_fundo})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '60px',
    gap: '60px'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      {/* Left Side: Concept Text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '3px',
          background: detalhe,
          marginBottom: '24px'
        }} />
        <h3 style={{
          fontSize: '12px',
          fontWeight: 800,
          color: detalhe,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          marginBottom: '16px',
          fontFamily: titleFont
        }}>
          Conceito Criativo
        </h3>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.7',
          color: colorTexto,
          fontWeight: 500,
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontFamily: textFont
        }}>
          {explanation || 'Nenhuma explicação fornecida para esta versão.'}
        </p>
      </div>

      {/* Right Side: Logo Display */}
      <div style={{
        background: `${colorTexto}08`,
        border: `1px solid ${colorTexto}10`,
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background element */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle, ${detalhe}22 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 1
        }} />

        {logoSrc ? (
          <img
            src={logoSrc}
            alt="Logo"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              zIndex: 2,
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
            }}
          />
        ) : (
          <div style={{ color: `${colorTexto}40`, fontSize: '14px', zIndex: 2 }}>
            Logo não enviada
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '60px',
        fontSize: '10px',
        fontWeight: 600,
        color: `${colorTexto}40`,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {presentation_data.brand_name} / Identidade Visual
      </div>
    </div>
  )
}
