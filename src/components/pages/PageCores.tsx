import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageCoresProps { pageNumber: number }

function getSwatchBorder(hex: string) {
  const normalized = hex.toUpperCase()
  if (normalized === '#FFFFFF') return '1px solid rgba(0,0,0,0.16)'
  if (normalized === '#000000') return '1px solid rgba(255,255,255,0.18)'
  return '1px solid rgba(0,0,0,0.06)'
}

export function PageCores({ pageNumber }: PageCoresProps) {
  const { cores_logo } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay } = usePageColors()

  return (
    <div className="pagina-pdf" style={{ background: '#fff' }}>
      {/* Fundo */}
      <div className="fundo" style={{ zIndex: 0 }}>
        {/* Rainbow top strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(to right, ${cores_logo.map(c => c.hex).join(', ')})` }} />
        {/* Dark left panel */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: darkColor, overflow: 'hidden' }}>
          {BgOverlay && <BgOverlay />}
        </div>
      </div>

      {/* Conteudo */}
      <div className="conteudo cores-layout">
        {/* Left title — on dark panel, white text */}
        <div className="cores-left" style={{ color: '#fff' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Sistema de</div>
            <div className="cores-title">Paleta<br />de Cores</div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 16, borderRadius: 2 }} />
            <div style={{ fontSize: 11, marginTop: 12, opacity: 0.6, lineHeight: 1.6, maxWidth: 120 }}>
              Use sempre as referências exatas para garantir consistência.
            </div>
          </div>

          {/* Mini color strip */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {cores_logo.slice(0, 5).map((c) => (
              <div key={c.id} style={{ width: 20, height: 20, background: c.hex, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>

        {/* Right: color cards — on white bg, dark text */}
        <div className="cores-right">
          {cores_logo.map((cor) => (
            <div key={cor.id} className="cor-card" style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="cor-swatch" style={{ background: cor.hex, boxShadow: `0 4px 14px ${cor.hex}55`, border: getSwatchBorder(cor.hex) }} />
              <div className="cor-details">
                <div className="cor-hex" style={{ color: '#1a1a1a' }}>{cor.hex.toUpperCase()}</div>
                {cor.rgb  && <div className="cor-rgb"  style={{ color: '#52525b' }}>RGB {cor.rgb}</div>}
                {cor.hsl  && <div className="cor-rgb"  style={{ color: '#52525b' }}>HSL {cor.hsl}</div>}
                {cor.cmyk && <div className="cor-cmyk" style={{ color: '#71717a' }}>CMYK {cor.cmyk}</div>}
              </div>
              <div style={{ width: 4, alignSelf: 'stretch', background: cor.hex, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>

      {/* HUD */}
      <HUD
        sectionTitle="Paleta de Cores"
        pageNumber={pageNumber}
        titleColor="rgba(255,255,255,0.5)"
        lineColor="rgba(0,0,0,0.1)"
        numColor={primaryColor}
      />
    </div>
  )
}
