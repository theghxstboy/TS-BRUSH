import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'
import { useElementDrag } from '../../canvas/presentationDrag'
import { EditableText } from '../../canvas/EditableText'
import { PresBgLayer } from './PresBgLayer'

interface PresFinalProps {
  pageId: string
}

export function PresFinal({ pageId }: PresFinalProps) {
  const { presentation_data, setPresentationData } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'final')
  const { brand_name, typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: titulo, cor_texto: texto, cor_detalhes: detalhe, imagem_fundo, imagem_fundo_opacidade, imagem_fundo_blend, espacamento_letras, element_positions } = style

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const titleDrag = useElementDrag(pageId, 'title', element_positions.title)
  const badgeDrag = useElementDrag(pageId, 'badge', element_positions.badge)

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <PresBgLayer imagem_fundo={imagem_fundo} opacidade={imagem_fundo_opacidade} blend={imagem_fundo_blend} />
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

      <div style={{
        textAlign: 'center',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        maxHeight: 'calc(210mm - 120px)',
        overflow: 'hidden'
      }}>
        <h2
          className={titleDrag.className}
          onPointerDown={titleDrag.onPointerDown}
          style={{
          fontSize: '84px',
          fontWeight: 900,
          color: titulo,
          textTransform: 'uppercase',
          letterSpacing: `calc(-2px + ${element_positions.title?.ls ?? 0}em)`,
          margin: 0,
          lineHeight: 1,
          fontFamily: titleFont,
          maxWidth: '1000px',
          wordBreak: 'break-word',
          marginBottom: '32px',
          ...titleDrag.style
        }}>
          Obrigado.
          {titleDrag.handle}
        </h2>

        <div
          className={badgeDrag.className}
          onPointerDown={badgeDrag.onPointerDown}
          style={{
          padding: '12px 32px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          display: 'inline-block',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maxWidth: '90%',
          overflow: 'hidden',
          ...badgeDrag.style
        }}>
            <EditableText
              pageId={pageId}
              elementKey="finalBrand"
              positions={element_positions}
              value={brand_name}
              placeholder="Projeto Concluído"
              onCommit={(v) => setPresentationData({ ...presentation_data, brand_name: v })}
              as="p"
              draggable={false}
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: texto,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0,
                fontFamily: textFont,
                maxWidth: '600px',
                wordBreak: 'break-word'
              }}
            />
            {badgeDrag.handle}
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
          {brand_name} / Agência TS / Autor da logo: {presentation_data.responsible_name || 'Não informado'}
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
