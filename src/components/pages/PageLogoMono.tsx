import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageLogoMonoProps { pageNumber: number }

export function PageLogoMono({ pageNumber }: PageLogoMonoProps) {
  const { assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay } = usePageColors()

  if (!assets_base64.logo_monocromatica) return null

  return (
    <div className="pagina-pdf" style={{ background: '#fff' }}>
      {/* FUNDO: split dark/light */}
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Dark half */}
          <div style={{ background: darkColor, position: 'relative', overflow: 'hidden' }}>
            {BgOverlay && <BgOverlay />}
          </div>
          {/* Light half */}
          <div style={{ background: '#f4f4f5' }} />
        </div>
      </div>

      {/* CONTEUDO */}
      <div className="conteudo" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* White version (on dark bg) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <img src={assets_base64.logo_monocromatica} alt="Logo Branca"
            style={{ maxWidth: '75%', maxHeight: 100, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Versão Branca</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2 }}>Para fundos escuros</div>
          </div>
        </div>

        {/* Black version (on light bg) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <img src={assets_base64.logo_monocromatica} alt="Logo Preta"
            style={{ maxWidth: '75%', maxHeight: 100, objectFit: 'contain', filter: 'brightness(0)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Versão Preta</div>
            <div style={{ color: 'rgba(0,0,0,0.3)', fontSize: 10, marginTop: 2 }}>Para fundos claros</div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar com info */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 68,
        background: primaryColor, zIndex: 20,
        display: 'flex', alignItems: 'center', padding: '0 48px', gap: 32
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>Seção</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Versão Monocromática</div>
        </div>
        <div style={{ flex: 2, fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>
          Use a versão branca em fundos escuros e a versão preta em fundos claros.<br />
          Nunca utilize a versão colorida em contextos de baixo contraste.
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
          {String(pageNumber).padStart(2, '0')}
        </div>
      </div>

      {/* HUD top */}
      <HUD sectionTitle="Logo Monocromática" pageNumber={pageNumber} titleColor="rgba(255,255,255,0.6)" lineColor="transparent" numColor="transparent" />
    </div>
  )
}
