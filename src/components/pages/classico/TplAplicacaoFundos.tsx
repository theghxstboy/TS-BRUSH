import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'

interface TplAplicacaoFundosProps { pageNumber: number }

export function TplAplicacaoFundos({ pageNumber }: TplAplicacaoFundosProps) {
  const { assets_base64 } = useBrandStore()
  const { darkColor } = usePageColors()
  const src = assets_base64.logo_principal

  const fundos = [
    { label: 'fundo cor 1', bg: darkColor, textColor: '#fff', filter: 'brightness(0) invert(1)' },
    { label: 'fundo cor 2', bg: '#888888', textColor: '#fff', filter: 'brightness(0)' },
  ]

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
          Aplicação Sobre Fundos
        </h2>

        <p style={{ fontSize: 13.5, color: '#222', lineHeight: 1.75, margin: '0 0 20px 0', maxWidth: '90%' }}>
          &nbsp;&nbsp;Para manter a integridade visual, a aplicação do logotipo deve considerar o contraste adequado com o
          fundo. Sempre que possível, utilize a versão original da marca. Em fundos escuros, prefira a versão clara, e em
          fundos claros, a versão escura.
        </p>

        {/* 2 boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
          {fundos.map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: darkColor, letterSpacing: '0.04em', fontFamily: 'monospace', textAlign: 'center' }}>
                {f.label}
              </div>
              <div style={{
                flex: 1,
                background: f.bg,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                minHeight: 160,
              }}>
                {src
                  ? <img src={src} alt={f.label} style={{ maxWidth: '70%', maxHeight: 110, objectFit: 'contain', filter: f.filter }} />
                  : <div style={{ fontSize: 52, fontWeight: 900, color: f.textColor, textAlign: 'center', lineHeight: 1 }}>LOGO<br/>AQUI</div>
                }
              </div>
            </div>
          ))}
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
