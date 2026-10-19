import { useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { fileToBase64 } from '../../lib/imageUtils'

// Fundo global do painel/design (cor sólida ou imagem).
export function globalBgStyle(bg: { mode: 'color' | 'image'; color: string; image: string | null }): CSSProperties {
  return bg.mode === 'image' && bg.image
    ? { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: bg.color }
}

// Logo como background-image: preenche a caixa mesmo quando o SVG não traz width/height próprios
// (nesse caso um <img> colapsa pra 0×0, enquanto o background sempre preenche). `align` posiciona dentro da caixa.
export function logoBgStyle(logo: string, filter?: string, align: 'left' | 'center' | 'right' = 'center'): CSSProperties {
  return {
    backgroundImage: `url("${logo}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center',
    filter,
    pointerEvents: 'none',
  }
}

// Versões da logo (mesmos filtros das variações do avatar).
export type LogoVariant = 'original' | 'white' | 'black'
export const LOGO_FILTERS: Record<LogoVariant, string | undefined> = {
  original: undefined,
  white: 'brightness(0) invert(1)',
  black: 'brightness(0)',
}

export function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label" style={icon ? { display: 'flex', alignItems: 'center', gap: 6 } : undefined}>{icon}{label}</label>
      {children}
    </div>
  )
}

// Seletor de cor: amostra visível + hex editável.
export function ColorField({ label, icon, value, onChange }: { label: string; icon?: ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label} icon={icon}>
      <div className="sm-color">
        <input type="color" className="sm-color-sw" value={value} onChange={(e) => onChange(e.target.value)} />
        <input className="sm-color-hex" value={value.toUpperCase()} spellCheck={false} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  )
}

// Interruptor estilizado (substitui o checkbox nativo).
export function Toggle({ label, icon, checked, onChange }: { label: string; icon?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={`sm-toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="sm-toggle-track"><span className="sm-toggle-thumb" /></span>
      <span className="sm-toggle-label">{icon}{label}</span>
    </button>
  )
}

// Grupo de botões-ícone (substitui um select por escolhas visuais).
export function IconSegmented<T extends string>({ label, value, options, onChange }: {
  label: string
  value: T
  options: { value: T; icon: ReactNode; title: string }[]
  onChange: (v: T) => void
}) {
  return (
    <Field label={label}>
      <div className="sm-seg">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            title={o.title}
            aria-label={o.title}
            aria-pressed={value === o.value}
            className={`sm-seg-btn ${value === o.value ? 'active' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.icon}
          </button>
        ))}
      </div>
    </Field>
  )
}

export function ImageField({ label, value, onChange, maxPx, quality }: { label: string; value: string | null; onChange: (v: string | null) => void; maxPx?: number; quality?: number }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={() => ref.current?.click()} style={{ flex: 1 }}>
          <Upload size={14} /> {value ? 'Trocar' : 'Enviar'}
        </button>
        {value && (
          <>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundImage: `url(${value})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)' }} />
            <button type="button" className="btn btn-danger" style={{ width: 'auto', padding: '8px 10px' }} onClick={() => onChange(null)} title="Remover"><Trash2 size={14} /></button>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await fileToBase64(f, maxPx, quality)); e.target.value = '' }} />
    </Field>
  )
}
