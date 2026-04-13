import { useState, useRef, useEffect } from 'react'
import { Layers, X } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'
import { fileToBase64 } from '../../lib/imageUtils'
import { toast } from 'sonner'

// Presets de cor de fundo comuns em brand manuals
const PRESETS = [
  { label: 'Preto',    hex: '#0C0C0C' },
  { label: 'Carvão',  hex: '#1a1a1a' },
  { label: 'Marinho', hex: '#0f1729' },
  { label: 'Verde',   hex: '#0d1f1a' },
  { label: 'Vinho',   hex: '#1a0a10' },
  { label: 'Sépia',   hex: '#1c1510' },
]

function ColorPickerPopover({
  color,
  onChange,
}: {
  color: string
  onChange: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div style={{ position: 'relative' }}>
      {/* Swatch + hex input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: color,
            border: '2px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', flexShrink: 0,
          }}
          onClick={() => setOpen(!open)}
        />
        <input
          className="form-input"
          style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13 }}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0C0C0C"
        />
      </div>

      {/* Picker popover */}
      {open && (
        <div
          ref={ref}
          style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 200,
            borderRadius: 10, overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
            border: '1px solid var(--border)',
          }}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}

      {/* Presets */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {PRESETS.map((p) => (
          <button
            key={p.hex}
            title={p.label}
            onClick={() => { onChange(p.hex); setOpen(false) }}
            style={{
              width: 22, height: 22, borderRadius: 5, background: p.hex,
              border: color.toLowerCase() === p.hex.toLowerCase()
                ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', padding: 0,
              boxShadow: color.toLowerCase() === p.hex.toLowerCase()
                ? '0 0 0 2px rgba(249,115,22,0.4)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function SectionAparencia() {
  const { aparencia, setAparencia } = useBrandStore()

  const handleImageUpload = async (file: File) => {
    try {
      const b64 = await fileToBase64(file, 1800, 0.88)
      setAparencia({ imagem_fundo: b64 })
      toast.success('Imagem de fundo atualizada.')
    } catch {
      toast.error('Erro ao processar imagem.')
    }
  }

  return (
    <CollapsibleSection icon={<Layers size={14} />} label="Aparência das Páginas" defaultOpen={false}>

      {/* Cor de fundo */}
      <div className="form-group">
        <label className="form-label">Cor de Fundo dos Painéis</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          Usada nos painéis laterais escuros de cada página — barras de header, capa e seções.
        </p>
        <ColorPickerPopover
          color={aparencia.cor_fundo}
          onChange={(hex) => setAparencia({ cor_fundo: hex })}
        />
      </div>

      {/* Imagem de fundo */}
      <div className="form-group">
        <label className="form-label">Imagem / Textura de Fundo</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          Aplicada como overlay sobre os painéis escuros — ideal para texturas, padrões ou fotografias.
        </p>
        <UploadZone
          label="Upload Imagem de Fundo"
          hint="JPG, PNG ou WebP · será aplicada em todas as páginas"
          accept="image/*"
          value={aparencia.imagem_fundo}
          onChange={(v) => setAparencia({ imagem_fundo: v })}
        />
        {aparencia.imagem_fundo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <label className="form-label" style={{ margin: 0 }}>Opacidade da imagem</label>
          </div>
        )}
      </div>

      {/* Preview inline */}
      {(aparencia.imagem_fundo || aparencia.cor_fundo !== '#0C0C0C') && (
        <div style={{
          height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative',
          border: '1px solid var(--border)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: aparencia.cor_fundo }} />
          {aparencia.imagem_fundo && (
            <img
              src={aparencia.imagem_fundo}
              alt="preview fundo"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
          )}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}>
            <div style={{ width: 28, height: 3, background: '#fff', opacity: 0.5, borderRadius: 2 }} />
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preview do painel</span>
            <div style={{ width: 28, height: 3, background: '#fff', opacity: 0.5, borderRadius: 2 }} />
          </div>
        </div>
      )}
    </CollapsibleSection>
  )
}
