import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'
import { usePresentationTypography } from '../../../hooks/usePresentationTypography'
import { useElementDrag } from '../../canvas/presentationDrag'
import { EditableText } from '../../canvas/EditableText'
import { PresBgLayer } from './PresBgLayer'
import tsLogo from '../../../logos/TS.svg'

interface PresCapaProps {
  pageId: string
}

export function PresCapa({ pageId }: PresCapaProps) {
  const { presentation_data, setPresentationData } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'capa')
  const { titleFontFamily, bodyFontFamily } = usePresentationTypography()
  const { brand_name, subtitle } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: titulo, cor_detalhes: detalhe, imagem_fundo, imagem_fundo_opacidade, imagem_fundo_blend, espacamento_letras, element_positions } = style

  const logoDrag = useElementDrag(pageId, 'logo', element_positions.logo, 'translate(-50%, -50%)', { positioned: true })

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <PresBgLayer imagem_fundo={imagem_fundo} opacidade={imagem_fundo_opacidade} blend={imagem_fundo_blend} />
      <div
        className={logoDrag.className}
        onPointerDown={logoDrag.onPointerDown}
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          ...logoDrag.style
        }}>
        <img src={tsLogo} alt="TS" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
        {logoDrag.handle}
      </div>

      <div style={{
        position: 'absolute',
        top: '65%',
        left: '0',
        right: '0',
        textAlign: 'center',
        padding: '0 40px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <EditableText
          pageId={pageId}
          elementKey="title"
          positions={element_positions}
          value={brand_name}
          placeholder="Sua Marca"
          onCommit={(v) => setPresentationData({ ...presentation_data, brand_name: v })}
          as="h1"
          style={{
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
            lineHeight: 1.05,
          }}
        />
        <div style={{
          width: '40px',
          height: '4px',
          background: detalhe,
          margin: '0 auto',
          borderRadius: '2px',
          flexShrink: 0
        }} />
        <EditableText
          pageId={pageId}
          elementKey="subtitle"
          positions={element_positions}
          value={subtitle}
          placeholder="Apresentação de Identidade Visual"
          onCommit={(v) => setPresentationData({ ...presentation_data, subtitle: v })}
          as="p"
          style={{
            marginTop: '32px',
            fontSize: '12px',
            fontWeight: 700,
            color: `${titulo}80`,
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            fontFamily: bodyFontFamily,
            maxWidth: '600px',
            marginInline: 'auto',
            wordBreak: 'break-word',
          }}
        />
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
