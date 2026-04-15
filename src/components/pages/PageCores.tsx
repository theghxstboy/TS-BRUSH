import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
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
  const { primaryColor, darkColor, textColor, pageColor, contentTitleColor, pageBackgroundStyle } = usePageColors('padrao-cromatico')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(to right, ${cores_logo.map((c) => c.hex).join(', ')})` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: darkColor, overflow: 'hidden' }} />
      </div>

      <div className="conteudo cores-layout">
        <div className="cores-left" style={{ color: '#fff' }}>
          <div>
            <div style={{ ...metaStyle(11), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Sistema de</div>
            <div className="cores-title" style={pageTitleStyle(40, { lineHeight: 1.1 })}>Paleta<br />de Cores</div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 16, borderRadius: 2 }} />
            <div style={bodyStyle(11, { marginTop: 12, opacity: 0.6, maxWidth: 120 })}>
              Use sempre as referencias exatas para garantir consistencia.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {cores_logo.slice(0, 5).map((color) => (
              <div key={color.id} style={{ width: 20, height: 20, background: color.hex, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>

        <div className="cores-right">
          {cores_logo.map((color) => (
            <div key={color.id} className="cor-card" style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="cor-swatch" style={{ background: color.hex, boxShadow: `0 4px 14px ${color.hex}55`, border: getSwatchBorder(color.hex) }} />
              <div className="cor-details">
                <div className="cor-hex" style={{ color: contentTitleColor }}>{color.hex.toUpperCase()}</div>
                {color.rgb && <div className="cor-rgb" style={{ color: '#52525b' }}>RGB {color.rgb}</div>}
                {color.hsl && <div className="cor-rgb" style={{ color: '#52525b' }}>HSL {color.hsl}</div>}
                {color.cmyk && <div className="cor-cmyk" style={{ color: '#71717a' }}>CMYK {color.cmyk}</div>}
              </div>
              <div style={{ width: 4, alignSelf: 'stretch', background: color.hex, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>

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
