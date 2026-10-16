import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'
import { useElementDrag } from '../../canvas/presentationDrag'
import { PresBgLayer } from './PresBgLayer'

interface PresMockupProps {
  pageId: string
  mockupSrc: string
  index: number
  total: number
}

export function PresMockup({ pageId, mockupSrc, index, total }: PresMockupProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'conteudo')
  const { typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_texto: colorTexto, cor_sombra: colorSombra, imagem_fundo, imagem_fundo_opacidade, imagem_fundo_blend, espacamento_letras, element_positions } = style

  const textFont = typography.textosNome || 'inherit'
  const badgeDrag = useElementDrag(pageId, 'badge', element_positions.badge, '', { positioned: true })

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <PresBgLayer imagem_fundo={imagem_fundo} opacidade={imagem_fundo_opacidade} blend={imagem_fundo_blend} />
      <div style={{
        width: '100%',
        height: '100%',
        background: `${colorTexto}05`,
        border: `1px solid ${colorTexto}10`,
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: `0 30px 60px ${colorSombra}`,
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: `${colorTexto}40` }}>
            Mockup não disponível
          </div>
        )}

        {/* Floating Badge */}
        <div
          className={badgeDrag.className}
          onPointerDown={badgeDrag.onPointerDown}
          style={{
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
          letterSpacing: `calc(0.1em + ${element_positions.badge?.ls ?? 0}em)`,
          fontFamily: textFont,
          ...badgeDrag.style
        }}>
          APLICAÇÃO {index + 1} / {total}
          {badgeDrag.handle}
        </div>
      </div>
    </div>
  )
}
