import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

interface PageLogoSimboloProps { pageNumber: number }

export function PageLogoSimbolo({ pageNumber }: PageLogoSimboloProps) {
  const { assets_base64, conteudo_pdf } = useBrandStore()
  const { primaryColor, contentTitleColor, textColor, pageColor, logoBackdropColor, pageBackgroundStyle } = usePageColors('simbolo')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  if (!assets_base64.logo_simbolo) return null

  const simboloTitulo = conteudo_pdf.simbolo_titulo || 'Símbolo & Ícone'
  const [linha1, linha2] = simboloTitulo.split(/\n| & /)

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%', background: logoBackdropColor, borderRight: '1px solid rgba(0,0,0,0.05)' }} />
        <svg style={{ position: 'absolute', left: '22.5%', top: '50%', transform: 'translate(-50%,-50%)', opacity: 0.06 }} width="280" height="280">
          <circle cx="140" cy="140" r="130" fill={primaryColor} />
        </svg>
      </div>

      <div className="conteudo" style={{ height: '100%', display: 'grid', gridTemplateColumns: '45% 1fr' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
          <img src={assets_base64.logo_simbolo} alt="Símbolo" style={{ maxWidth: 180, maxHeight: 180, objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px 48px 32px', gap: 20 }}>
          <div>
            <div style={{ fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor, ...metaStyle(11) }}>Elemento Gráfico</div>
            <div style={{ fontWeight: 900, color: contentTitleColor, marginTop: 4, ...pageTitleStyle(32, { lineHeight: 1.1 }) }}>
              {linha1}
              <br />
              {linha2 ? `& ${linha2}` : ''}
            </div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 12, borderRadius: 2 }} />
          </div>

          <div style={{ color: '#52525b', ...bodyStyle(12, { lineHeight: 1.7 }) }}>
            {conteudo_pdf.simbolo_descricao}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Tamanho Mínimo', value: conteudo_pdf.simbolo_tamanho_minimo },
              { label: 'Aplicação', value: conteudo_pdf.simbolo_aplicacao },
              { label: 'Fundo Preferencial', value: conteudo_pdf.simbolo_fundo_preferencial },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: logoBackdropColor, borderRadius: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: primaryColor, flexShrink: 0 }} />
                <div>
                  <div style={{ ...metaStyle(10), fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ ...bodyStyle(12), fontWeight: 600, color: contentTitleColor }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HUD sectionTitle={simboloTitulo} pageNumber={pageNumber} titleColor={contentTitleColor} lineColor="rgba(0,0,0,0.1)" numColor={primaryColor} />
    </div>
  )
}
