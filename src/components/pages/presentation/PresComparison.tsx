import { useBrandStore } from '../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../hooks/usePresentationAppearance'
import { useElementDrag } from '../../canvas/presentationDrag'
import { PresBgLayer } from './PresBgLayer'

interface PresComparisonProps {
  pageId: string
  originalLogo: string | null
  newLogo: string | null
}

export function PresComparison({ pageId, originalLogo, newLogo }: PresComparisonProps) {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, 'conteudo')
  const { typography } = presentation_data
  const { cor_fundo_pagina: fundo, cor_titulo: colorTitulo, cor_texto: colorTexto, cor_detalhes: detalhe, imagem_fundo, imagem_fundo_opacidade, imagem_fundo_blend, espacamento_letras, element_positions } = style

  const titleFont = typography.titulosNome || 'inherit'
  const textFont = typography.textosNome || 'inherit'

  const labelOldDrag = useElementDrag(pageId, 'labelOld', element_positions.labelOld)
  const logoOldDrag = useElementDrag(pageId, 'logoOld', element_positions.logoOld)
  const labelNewDrag = useElementDrag(pageId, 'labelNew', element_positions.labelNew)
  const logoNewDrag = useElementDrag(pageId, 'logoNew', element_positions.logoNew)

  const bgStyle: React.CSSProperties = {
    backgroundColor: fundo,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    position: 'relative'
  }

  return (
    <div className="pagina-pdf" style={bgStyle}>
      <PresBgLayer imagem_fundo={imagem_fundo} opacidade={imagem_fundo_opacidade} blend={imagem_fundo_blend} />
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
        padding: '60px',
        height: '210mm',
        overflow: 'hidden'
      }}>
        <h4
          className={labelOldDrag.className}
          onPointerDown={labelOldDrag.onPointerDown}
          style={{
          fontSize: '11px',
          fontWeight: 800,
          color: `${colorTexto}60`,
          textTransform: 'uppercase',
          letterSpacing: `calc(0.4em + ${element_positions.labelOld?.ls ?? 0}em)`,
          marginBottom: '40px',
          fontFamily: textFont,
          flexShrink: 0,
          ...labelOldDrag.style
        }}>
          Versão Antiga
          {labelOldDrag.handle}
        </h4>
        <div className={logoOldDrag.className} onPointerDown={logoOldDrag.onPointerDown} style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...logoOldDrag.style }}>
          {originalLogo ? (
            <img src={originalLogo} alt="Original" style={{ maxWidth: '80%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ color: `${colorTexto}20`, fontSize: '13px' }}>Sem logo original</div>
          )}
          {logoOldDrag.handle}
        </div>
      </div>

      {/* Right: New */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        background: `${colorTexto}05`,
        height: 'calc(210mm - 120px)',
        overflow: 'hidden'
      }}>
        <h4
          className={labelNewDrag.className}
          onPointerDown={labelNewDrag.onPointerDown}
          style={{
          fontSize: '11px',
          fontWeight: 800,
          color: detalhe,
          textTransform: 'uppercase',
          letterSpacing: `calc(0.4em + ${element_positions.labelNew?.ls ?? 0}em)`,
          marginBottom: '40px',
          fontFamily: titleFont,
          flexShrink: 0,
          ...labelNewDrag.style
        }}>
          Nova Versão
          {labelNewDrag.handle}
        </h4>
        <div className={logoNewDrag.className} onPointerDown={logoNewDrag.onPointerDown} style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...logoNewDrag.style }}>
          {newLogo ? (
            <img
              src={newLogo}
              alt="Nova"
              style={{
                maxWidth: '90%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
              }}
            />
          ) : (
            <div style={{ color: `${colorTexto}20`, fontSize: '13px' }}>Logo nova não enviada</div>
          )}
          {logoNewDrag.handle}
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
        {presentation_data.brand_name} / {presentation_data.responsible_name || 'Agência TS'}
      </div>
    </div>
  )
}
