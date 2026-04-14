import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'
import { MonochromeLogo } from '../common/MonochromeLogo'

interface PageLogoMonoProps { pageNumber: number }

export function PageLogoMono({ pageNumber }: PageLogoMonoProps) {
  const { assets_base64, conteudo_pdf } = useBrandStore()
  const { primaryColor, darkColor, textColor, BgOverlay, pageColor, logoBackdropColor } = usePageColors('versao-mono')

  if (!assets_base64.logo_monocromatica) return null

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor }}>
      {/* FUNDO: split dark/light */}
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Dark half */}
          <div style={{ background: darkColor, position: 'relative', overflow: 'hidden' }}>
            {BgOverlay && <BgOverlay />}
          </div>
          {/* Light half */}
          <div style={{ background: logoBackdropColor }} />
        </div>
      </div>

      {/* CONTEUDO */}
      <div className="conteudo" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* White version (on dark bg) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <MonochromeLogo src={assets_base64.logo_monocromatica} color="#FFFFFF" maxWidth="75%" maxHeight={100} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Versão Branca</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2 }}>Para fundos escuros</div>
          </div>
        </div>

        {/* Black version (on light bg) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <MonochromeLogo src={assets_base64.logo_monocromatica} color={darkColor} maxWidth="75%" maxHeight={100} />
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
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{conteudo_pdf.logo_mono_titulo || 'Versão Monocromática'}</div>
        </div>
        <div style={{ flex: 2, fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>
          {conteudo_pdf.logo_mono_descricao}
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
          {String(pageNumber).padStart(2, '0')}
        </div>
      </div>

      {/* HUD top */}
      <HUD sectionTitle={conteudo_pdf.logo_mono_titulo || 'Logo Monocromática'} pageNumber={pageNumber} titleColor="rgba(255,255,255,0.6)" lineColor="transparent" numColor="transparent" />
    </div>
  )
}
