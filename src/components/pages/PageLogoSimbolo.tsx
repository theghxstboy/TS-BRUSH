import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageLogoSimboloProps { pageNumber: number }

export function PageLogoSimbolo({ pageNumber }: PageLogoSimboloProps) {
  const { assets_base64 } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay } = usePageColors()

  if (!assets_base64.logo_simbolo) return null

  return (
    <div className="pagina-pdf" style={{ background: '#fff' }}>
      {/* Fundo */}
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%', background: '#f9f9f9', borderRight: '1px solid rgba(0,0,0,0.05)' }} />
        <svg style={{ position: 'absolute', left: '22.5%', top: '50%', transform: 'translate(-50%,-50%)', opacity: 0.06 }} width="280" height="280">
          <circle cx="140" cy="140" r="130" fill={primaryColor} />
        </svg>
      </div>

      {/* Conteudo */}
      <div className="conteudo" style={{ height: '100%', display: 'grid', gridTemplateColumns: '45% 1fr' }}>
        {/* Símbolo display — light bg */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
          <img src={assets_base64.logo_simbolo} alt="Símbolo"
            style={{ maxWidth: 180, maxHeight: 180, objectFit: 'contain' }} />
        </div>

        {/* Info — white bg, dark text */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px 48px 32px', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Elemento Gráfico</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: darkColor, lineHeight: 1.1, marginTop: 4 }}>Símbolo<br />& Ícone</div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 12, borderRadius: 2 }} />
          </div>

          <div style={{ fontSize: 12, color: '#52525b', lineHeight: 1.7 }}>
            O símbolo pode ser utilizado de forma independente do logotipo em aplicações onde o reconhecimento da marca já esteja estabelecido.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Tamanho Mínimo', value: '24px / 8mm' },
              { label: 'Aplicação',       value: 'Ícones, Favicons, Social Media' },
              { label: 'Fundo Preferencial', value: 'Claro ou Transparente' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#f4f4f5', borderRadius: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: primaryColor, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: darkColor }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUD */}
      <HUD sectionTitle="Símbolo & Ícone" pageNumber={pageNumber} titleColor={darkColor} lineColor="rgba(0,0,0,0.1)" numColor={primaryColor} />
    </div>
  )
}
