import { useEffect } from 'react'
import { Type } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

/**
 * Injects a Google Fonts <link> tag dynamically for a given font family.
 * Idempotent: if the link already exists, it won't be duplicated.
 */
function loadGoogleFont(fontName: string) {
  if (!fontName.trim()) return
  const id = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return // already loaded

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  const query = encodeURIComponent(fontName)
  link.href = `https://fonts.googleapis.com/css2?family=${query}:wght@300;400;500;600;700;800;900&display=swap`
  document.head.appendChild(link)
}

export function SectionTipografia() {
  const { tipografia, setTipografia } = useBrandStore()

  // Dynamically load Google Fonts whenever the font names change
  useEffect(() => {
    if (tipografia.principal_nome) loadGoogleFont(tipografia.principal_nome)
  }, [tipografia.principal_nome])

  useEffect(() => {
    if (tipografia.secundaria_nome) loadGoogleFont(tipografia.secundaria_nome)
  }, [tipografia.secundaria_nome])

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Tipografia" defaultOpen={false}>

      {/* ── Fonte Principal ───────────────────────────────────────── */}
      <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <p className="form-label" style={{ marginBottom: 10, color: 'var(--accent)' }}>Fonte Principal</p>

        <div className="form-group">
          <label className="form-label">Nome da Fonte</label>
          <input
            id="input-fonte-principal"
            className="form-input"
            placeholder="Ex: Geist, Inter, Montserrat"
            value={tipografia.principal_nome}
            onChange={(e) => setTipografia({ principal_nome: e.target.value })}
          />
          {tipografia.principal_nome && (
            <div style={{
              marginTop: 6, padding: '8px 12px',
              background: 'var(--bg-input)', borderRadius: 7,
              fontFamily: `'${tipografia.principal_nome}', sans-serif`,
              fontSize: 15, color: 'var(--text-primary)',
              letterSpacing: '0.01em',
              border: '1px solid var(--border)',
            }}>
              Aa Bb Cc 0123456789
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Estilos / Pesos</label>
          <input
            id="input-fonte-principal-estilos"
            className="form-input"
            placeholder="Ex: Light 300, Regular 400, Bold 700, Black 900"
            value={tipografia.principal_estilos}
            onChange={(e) => setTipografia({ principal_estilos: e.target.value })}
          />
        </div>
      </div>

      {/* ── Fonte Secundária (opcional) ───────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <p className="form-label" style={{ margin: 0, color: 'var(--text-secondary)' }}>Fonte Secundária</p>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '1px 6px', color: '#71717a',
          }}>opcional</span>
        </div>

        <div className="form-group">
          <label className="form-label">Nome da Fonte</label>
          <input
            id="input-fonte-secundaria"
            className="form-input"
            placeholder="Ex: Geist Mono, DM Mono, Space Mono"
            value={tipografia.secundaria_nome}
            onChange={(e) => setTipografia({ secundaria_nome: e.target.value })}
          />
          {tipografia.secundaria_nome && (
            <div style={{
              marginTop: 6, padding: '8px 12px',
              background: 'var(--bg-input)', borderRadius: 7,
              fontFamily: `'${tipografia.secundaria_nome}', monospace`,
              fontSize: 14, color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}>
              Aa Bb Cc 0123456789
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Estilos / Pesos</label>
          <input
            id="input-fonte-secundaria-estilos"
            className="form-input"
            placeholder="Ex: Regular 400, Medium 500"
            value={tipografia.secundaria_estilos}
            onChange={(e) => setTipografia({ secundaria_estilos: e.target.value })}
          />
        </div>

        {!tipografia.secundaria_nome && (
          <p style={{ fontSize: 11, color: '#52525b', marginTop: 6, lineHeight: 1.5 }}>
            Deixe em branco para usar apenas a fonte principal no manual.
          </p>
        )}
      </div>

    </CollapsibleSection>
  )
}
