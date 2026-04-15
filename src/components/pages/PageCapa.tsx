import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

interface PageCapaProps { pageNumber: number }

export function PageCapa({ pageNumber }: PageCapaProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, textColor, pageBackgroundStyle } = usePageColors('capa')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  if (!assets_base64.logo_principal) return null

  return (
    <div className="pagina-pdf" style={{ background: darkColor, color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={primaryColor} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${darkColor}ee 36%, transparent 100%)` }} />
      </div>

      <div className="capa-accent-bar" style={{ background: primaryColor, zIndex: 5 }} />

      <div className="conteudo capa-conteudo" style={{ color: '#fff' }}>
        <img src={assets_base64.logo_principal} alt="logo" className="capa-logo" />
        <div className="capa-marca">
          <div className="capa-nome" style={pageTitleStyle(40, { lineHeight: 1.1 })}>
            {projeto.nome_marca || 'Nome da Marca'}
          </div>
          {projeto.conceito && (
            <div className="capa-subtitulo" style={bodyStyle(14, { marginTop: 8, opacity: 0.7 })}>
              {projeto.conceito}
            </div>
          )}
        </div>
        <div className="capa-badge" style={{ ...metaStyle(11), color: '#fff', background: `${primaryColor}22`, borderColor: `${primaryColor}55` }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: primaryColor, display: 'inline-block' }} />
          Manual de Marca
        </div>
      </div>

      <HUD pageNumber={pageNumber} titleColor="rgba(255,255,255,0.5)" lineColor={`${primaryColor}60`} numColor={primaryColor} />
    </div>
  )
}
