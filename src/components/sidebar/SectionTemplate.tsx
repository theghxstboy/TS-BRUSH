import { LayoutTemplate } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionTemplate() {
  const { template, setTemplate } = useBrandStore()

  return (
    <CollapsibleSection icon={<LayoutTemplate size={14} />} label="Opções de Template" defaultOpen={true}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Estilo do Manual</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          Escolha o layout para a geração do seu Manual de Marca. O template Clássico reflete o layout padrão original.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Opção Moderno */}
          <div
            onClick={() => setTemplate('moderno')}
            style={{
              border: template === 'moderno' ? '2px solid var(--accent)' : '2px solid var(--border)',
              borderRadius: 8,
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              background: template === 'moderno' ? 'rgba(249,115,22,0.05)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ width: '100%', height: 48, background: '#1c1c1c', borderRadius: 4, position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', background: '#0C0C0C' }} />
              <div style={{ position: 'absolute', right: 0, top: 4, bottom: 4, width: '50%', background: '#2c2c2c', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: template === 'moderno' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Moderno
            </span>
          </div>

          {/* Opção Clássico */}
          <div
            onClick={() => setTemplate('classico')}
            style={{
              border: template === 'classico' ? '2px solid var(--accent)' : '2px solid var(--border)',
              borderRadius: 8,
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              background: template === 'classico' ? 'rgba(249,115,22,0.05)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ width: '100%', height: 48, background: '#e5e5e5', borderRadius: 4, position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '25%', background: '#F97316' }} />
              <div style={{ position: 'absolute', right: 8, top: 12, bottom: 12, left: '35%', background: '#fff', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: template === 'classico' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Clássico
            </span>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
