import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'

interface PageLogoPrincipalProps { pageNumber: number }

export function PageLogoPrincipal({ pageNumber }: PageLogoPrincipalProps) {
  const { projeto, assets_base64, conteudo_pdf } = useBrandStore()
  const { primaryColor, darkColor, contentTitleColor, textColor, pageColor, logoBackdropColor } = usePageColors('logo-principal')
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()
  const compatibilidade = conteudo_pdf.logo_principal_compatibilidade
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
  const usos = conteudo_pdf.logo_principal_usos
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
  const logoPrincipalTituloLinhas = (conteudo_pdf.logo_principal_titulo || 'Logotipo Principal').split(/\n| (?=[^ ]+$)/)

  if (!assets_base64.logo_principal) return null

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, background: primaryColor }} />
        <svg style={{ position: 'absolute', right: 40, bottom: 40, opacity: 0.04 }} width="220" height="220">
          <circle cx="110" cy="110" r="100" fill="none" stroke={primaryColor} strokeWidth="40" />
        </svg>
      </div>

      <div className="conteudo logo-layout">
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: pageColor, borderBottom: '1px solid rgba(0,0,0,0.06)', gap: 8 }}>
            <img src={assets_base64.logo_principal} alt="Logo — Fundo Claro" style={{ maxWidth: '80%', maxHeight: 80, objectFit: 'contain' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fundo Claro</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: logoBackdropColor, gap: 8 }}>
            <img src={assets_base64.logo_principal} alt="Logo — Fundo Escuro" style={{ maxWidth: '80%', maxHeight: 80, objectFit: 'contain' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#71717a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fundo de Apoio</span>
          </div>
        </div>

        <div className="logo-info">
          <div className="logo-info-block">
            <div className="logo-info-label" style={{ color: '#71717a' }}>Seção</div>
            <div style={{ fontWeight: 900, color: contentTitleColor, ...pageTitleStyle(28, { lineHeight: 1.1 }) }}>
              {logoPrincipalTituloLinhas[0] || 'Logotipo'}<br />
              {logoPrincipalTituloLinhas[1] || 'Principal'}
            </div>
            <div style={{ width: 40, height: 3, background: primaryColor, marginTop: 12, borderRadius: 2 }} />
          </div>

          <div className="logo-info-block">
            <div className="logo-info-label" style={{ color: '#71717a' }}>Marca</div>
            <div className="logo-info-value" style={{ color: '#1a1a1a' }}>{projeto.nome_marca || '—'}</div>
          </div>

          <div className="logo-info-block">
            <div className="logo-info-label" style={{ color: '#71717a' }}>Compatibilidade de Fundo</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              {(compatibilidade.length ? compatibilidade : ['Claro', 'Escuro', 'Colorido']).map((label, index) => {
                const styles = [
                  { bg: '#fff', color: '#1a1a1a', border: '#e4e4e7' },
                  { bg: darkColor, color: '#fff', border: darkColor },
                  { bg: primaryColor, color: '#fff', border: primaryColor },
                ][index % 3]
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: styles.bg, border: `1px solid ${styles.border}`, borderRadius: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: styles.color, opacity: 0.8 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: styles.color }}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="logo-info-block">
            <div className="logo-info-label" style={{ color: '#71717a' }}>Uso Recomendado</div>
            <div className="logo-meta-row">
              {(usos.length ? usos : ['Alta Resolução', 'Digital & Print', 'Fundo Transparente']).map((tag) => (
                <span key={tag} className="logo-meta-tag" style={{ color: '#1a1a1a', background: 'rgba(0,0,0,0.05)' }}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="logo-info-block">
            <div className="logo-info-label" style={{ color: '#71717a' }}>Espaço de Proteção</div>
            <div style={{ color: '#52525b', ...bodyStyle(12, { lineHeight: 1.6 }) }}>
              {conteudo_pdf.logo_principal_protecao}
            </div>
          </div>
        </div>
      </div>

      <HUD sectionTitle={conteudo_pdf.logo_principal_titulo || 'Logotipo Principal'} pageNumber={pageNumber} titleColor={contentTitleColor} lineColor="rgba(0,0,0,0.12)" numColor={primaryColor} />
    </div>
  )
}
