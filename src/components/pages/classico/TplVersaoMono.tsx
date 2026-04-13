import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'

interface TplVersaoMonoProps { pageNumber: number }

export function TplVersaoMono({ pageNumber }: TplVersaoMonoProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor } = usePageColors()
  const src = assets_base64.logo_monocromatica || assets_base64.logo_principal

  return (
    <div
      className="pagina-pdf"
      style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '36px 40px 52px 40px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5,
      }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, color: darkColor, margin: '0 0 12px 0' }}>
          Versão Monocromática
        </h2>

        <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.75, margin: '0 0 24px 0', maxWidth: '90%' }}>
          &nbsp;&nbsp;Para garantir a flexibilidade da identidade visual, o logo pode ser aplicado em versões monocromáticas
          (preto ou branco). Essas variações devem ser usadas em casos específicos, como fundos que comprometam
          a legibilidade da versão original.
        </p>

        {/* 3 variações */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, flex: 1 }}>
          {/* p&b — fundo branco */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>p&amp;b</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {src
                ? <img src={src} alt="p&b" style={{ maxWidth: '80%', maxHeight: 110, objectFit: 'contain', filter: 'grayscale(1) contrast(1.8)' }} />
                : <div style={{ fontSize: 52, fontWeight: 900, color: darkColor, textAlign: 'center', lineHeight: 1 }}>LOGO<br/>AQUI</div>
              }
            </div>
          </div>

          {/* negativo — fundo preto */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>negativo</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: darkColor, borderRadius: 4 }}>
              {src
                ? <img src={src} alt="negativo" style={{ maxWidth: '80%', maxHeight: 110, objectFit: 'contain', filter: 'grayscale(1) contrast(1.8) invert(1)' }} />
                : <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1 }}>LOGO<br/>AQUI</div>
              }
            </div>
          </div>

          {/* apenas preto */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 400, color: darkColor, letterSpacing: '0.05em', fontFamily: 'monospace' }}>apenas preto</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {src
                ? <img src={src} alt="preto" style={{ maxWidth: '80%', maxHeight: 110, objectFit: 'contain', filter: 'brightness(0)' }} />
                : <div style={{ fontSize: 52, fontWeight: 900, color: darkColor, textAlign: 'center', lineHeight: 1, opacity: 0.8 }}>LOGO<br/>AQUI</div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Linha inferior + número */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 28,
        right: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 10,
      }}>
        <div style={{ flex: 1, height: 1.5, background: darkColor, opacity: 0.2 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
