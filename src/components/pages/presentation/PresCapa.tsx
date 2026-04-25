import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'
import { usePresentationTypography } from '../../../hooks/usePresentationTypography'
import tsLogo from '../../../logos/TS.svg'

interface PresCapaProps {
  pageId: string
}

export function PresCapa({ pageId }: PresCapaProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'capa')
  const { titleFontFamily, bodyFontFamily } = usePresentationTypography()
  const { brand_name, subtitle } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: titulo, cor_detalhes: detalhe, imagem_fundo } = style

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    backgroundImage: imagem_fundo ? `url(${imagem_fundo})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '180px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <img src={tsLogo} alt="TS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{
        position: 'absolute',
        top: '65%',
        left: '0',
        right: '0',
        textAlign: 'center',
        padding: '0 40px',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '52px',
          fontWeight: 900,
          color: titulo,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          margin: 0,
          marginBottom: '24px',
          fontFamily: titleFontFamily,
          maxWidth: '1000px',
          marginInline: 'auto',
          wordBreak: 'break-word',
          lineHeight: 1.05
        }}>
          {brand_name || 'Sua Marca'}
        </h1>
        <div style={{
          width: '40px',
          height: '4px',
          background: detalhe,
          margin: '0 auto',
          borderRadius: '2px',
          flexShrink: 0
        }} />
        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          fontWeight: 700,
          color: `${titulo}80`,
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          fontFamily: bodyFontFamily,
          maxWidth: '600px',
          marginInline: 'auto',
          wordBreak: 'break-word'
        }}>
          {subtitle || 'Apresentação de Identidade Visual'}
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
