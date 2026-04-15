import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'
import { MonochromeLogo } from '../common/MonochromeLogo'

interface PageLogoMonoProps { pageNumber: number }

export function PageLogoMono({ pageNumber }: PageLogoMonoProps) {
  const { assets_base64, conteudo_pdf } = useBrandStore()
  const { primaryColor, darkColor, textColor, pageColor, logoBackdropColor, pageBackgroundStyle } = usePageColors('versao-mono')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  if (!assets_base64.logo_monocromatica) return null

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: darkColor, position: 'relative', overflow: 'hidden' }} />
          <div style={{ background: logoBackdropColor }} />
        </div>
      </div>

      <div className="conteudo" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <MonochromeLogo src={assets_base64.logo_monocromatica} color="#FFFFFF" maxWidth="75%" maxHeight={100} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...metaStyle(10), color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Versao Branca</div>
            <div style={{ ...bodyStyle(10), color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Para fundos escuros</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
          <MonochromeLogo src={assets_base64.logo_monocromatica} color={darkColor} maxWidth="75%" maxHeight={100} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...metaStyle(10), color: 'rgba(0,0,0,0.45)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Versao Preta</div>
            <div style={{ ...bodyStyle(10), color: 'rgba(0,0,0,0.3)', marginTop: 2 }}>Para fundos claros</div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 68,
          background: primaryColor,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px',
          gap: 32,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ ...metaStyle(10), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>Secao</div>
          <div style={{ color: '#fff', ...pageTitleStyle(16, { fontWeight: 800, lineHeight: 1.1 }) }}>
            {conteudo_pdf.logo_mono_titulo || 'Versao Monocromatica'}
          </div>
        </div>
        <div style={{ flex: 2, color: 'rgba(255,255,255,0.85)', ...bodyStyle(11, { lineHeight: 1.6 }) }}>
          {conteudo_pdf.logo_mono_descricao}
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
          {String(pageNumber).padStart(2, '0')}
        </div>
      </div>

      <HUD sectionTitle={conteudo_pdf.logo_mono_titulo || 'Logo Monocromatica'} pageNumber={pageNumber} titleColor="rgba(255,255,255,0.6)" lineColor="transparent" numColor="transparent" />
    </div>
  )
}
