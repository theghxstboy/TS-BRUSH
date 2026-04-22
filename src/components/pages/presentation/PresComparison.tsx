import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'

interface PresComparisonProps {
  pageId: string
  originalLogo: string | null
  newLogo: string | null
}

export function PresComparison({ pageId, originalLogo, newLogo }: PresComparisonProps) {
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
    position: 'relative'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      {/* Vertical Divider */}
      <div style={{
        position: 'absolute',
        top: '20%',
        bottom: '20%',
        left: '50%',
        width: '1px',
        background: `${colorTexto}15`,
        zIndex: 5
      }} />

      {/* Left: Original */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px'
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: 800,
          color: `${colorTexto}60`,
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          marginBottom: '40px',
          fontFamily: textFont
        }}>
          Versão Antiga
        </h4>
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {originalLogo ? (
            <img src={originalLogo} alt="Original" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', opacity: 0.6 }} />
          ) : (
            <div style={{ color: `${colorTexto}20`, fontSize: '13px' }}>Sem logo original</div>
          )}
        </div>
      </div>

      {/* Right: New */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        background: `${colorTexto}05`
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: 800,
          color: detalhe,
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          marginBottom: '40px',
          fontFamily: titleFont
        }}>
          Nova Versão
        </h4>
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {newLogo ? (
            <img
              src={newLogo}
              alt="Nova"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
              }}
            />
          ) : (
            <div style={{ color: `${colorTexto}20`, fontSize: '13px' }}>Logo nova não enviada</div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        fontWeight: 700,
        color: `${colorTexto}40`,
        textTransform: 'uppercase',
        letterSpacing: '0.2em'
      }}>
        Comparativo / Evolução
      </div>
    </div>
  )
}
