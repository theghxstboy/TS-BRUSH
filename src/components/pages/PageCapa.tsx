import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageCapaProps { pageNumber: number }

export function PageCapa({ pageNumber }: PageCapaProps) {
  const { projeto, assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay, aparencia } = usePageColors()

  if (!assets_base64.logo_principal) return null

  const hasBg = !!aparencia.imagem_fundo

  return (
    <div className="pagina-pdf" style={{ background: darkColor }}>
      {/* Fundo */}
      <div className="fundo" style={{ zIndex: 0 }}>
        {hasBg ? (
          <>
            <img
              src={aparencia.imagem_fundo!}
              alt="background"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${darkColor}ee 40%, transparent 100%)` }} />
          </>
        ) : (
          <>
            {/* Geometric grid pattern */}
            <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={primaryColor} strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
            {/* Background texture overlay */}
            {BgOverlay && <BgOverlay />}
          </>
        )}
      </div>

      {/* Accent bar right */}
      <div className="capa-accent-bar" style={{ background: primaryColor, zIndex: 5 }} />

      {/* Conteudo */}
      <div className="conteudo capa-conteudo" style={{ color: '#fff' }}>
        <img src={assets_base64.logo_principal} alt="logo" className="capa-logo" />
        <div className="capa-marca">
          <div className="capa-nome">{projeto.nome_marca || 'Nome da Marca'}</div>
          {projeto.conceito && (
            <div className="capa-subtitulo">{projeto.conceito}</div>
          )}
        </div>
        <div className="capa-badge" style={{ color: '#fff', background: `${primaryColor}22`, borderColor: `${primaryColor}55` }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: primaryColor, display: 'inline-block' }} />
          Manual de Marca
        </div>
      </div>

      {/* HUD */}
      <HUD pageNumber={pageNumber} titleColor="rgba(255,255,255,0.5)" lineColor={`${primaryColor}60`} numColor={primaryColor} />
    </div>
  )
}
