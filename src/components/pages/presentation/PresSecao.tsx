import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'

interface PresSecaoProps {
  pageId: string
  numero: string
  titulo: string
}

export function PresSecao({ pageId, numero, titulo }: PresSecaoProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'secao')
  const { typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: colorTitulo, cor_detalhes: detalhe, imagem_fundo } = style

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: imagem_fundo ? `url(${imagem_fundo})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <div style={{
        position: 'absolute',
        left: '10%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '320px',
        fontWeight: 900,
        color: colorTitulo,
        opacity: 0.05,
        lineHeight: 1,
        pointerEvents: 'none',
        letterSpacing: '-15px'
      }}>
        {numero}
      </div>

      <div style={{ zIndex: 10, textAlign: 'center', width: '100%', padding: '0 40px', maxHeight: 'calc(210mm - 120px)', overflow: 'hidden' }}>
        <p style={{
          color: detalhe,
          fontSize: '14px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          marginBottom: '16px',
          fontFamily: textFont
        }}>
          Proposta {numero}
        </p>
        <h2 style={{
          fontSize: '56px',
          fontWeight: 900,
          color: colorTitulo,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
          fontFamily: titleFont,
          maxWidth: '1000px',
          marginInline: 'auto',
          wordBreak: 'break-word',
          lineHeight: 1.1
        }}>
          {titulo}
        </h2>
        <div style={{
          width: '80px',
          height: '6px',
          background: detalhe,
          margin: '24px auto 0',
          borderRadius: '3px'
        }} />
      </div>

      <div style={{
        position: 'absolute',
        top: '40px',
        right: '40px',
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.1em'
      }}>
        {presentation_data.brand_name} / {presentation_data.responsible_name || 'Agência TS'}
      </div>
    </div>
  )
}
