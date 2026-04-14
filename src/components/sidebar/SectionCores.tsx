import { useState, useRef, useEffect } from 'react'
import { Palette, Plus, Trash2 } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import type { BrandColor } from '../../store/useBrandStore'
import { hexToHsl, hexToRgb } from '../../lib/colorUtils'

interface ColorItemProps {
  color: BrandColor
  inputIdPrefix?: string
  onChange: (fields: Partial<BrandColor>) => void
  onRemove: () => void
}

function ColorItem({ color, inputIdPrefix, onChange, onRemove }: ColorItemProps) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleHexChange = (hex: string) => {
    onChange({ hex, rgb: hexToRgb(hex), hsl: hexToHsl(hex) })
  }

  return (
    <div className="color-item">
      <div style={{ position: 'relative' }}>
        <div
          className="color-swatch"
          style={{ background: color.hex }}
          onClick={() => setOpen(!open)}
          title="Clique para abrir color picker"
        />
        {open && (
          <div className="color-popover" ref={popoverRef}>
            <HexColorPicker color={color.hex} onChange={handleHexChange} />
          </div>
        )}
      </div>

      <div className="color-inputs">
        <input
          className="form-input"
          id={inputIdPrefix ? `${inputIdPrefix}-${color.id}-hex` : undefined}
          style={{ height: 28, padding: '0 8px', fontSize: 12, fontFamily: "'Geist Mono', monospace" }}
          value={color.hex}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#FFFFFF"
        />
        <input
          className="color-meta-input"
          value={color.rgb}
          onChange={(e) => onChange({ rgb: e.target.value })}
          placeholder="RGB: 255, 255, 255"
        />
        <input
          className="color-meta-input"
          value={color.hsl}
          onChange={(e) => onChange({ hsl: e.target.value })}
          placeholder="HSL: 0°, 0%, 0%"
        />
        <input
          className="color-meta-input"
          value={color.cmyk}
          onChange={(e) => onChange({ cmyk: e.target.value })}
          placeholder="CMYK: 0, 0, 0, 0"
        />
      </div>

      <button className="btn-icon" onClick={onRemove} title="Remover cor">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

interface PaletteBlockProps {
  title: string
  description: string
  colors: BrandColor[]
  inputIdPrefix: string
  onAdd: () => void
  onChange: (id: number, fields: Partial<BrandColor>) => void
  onRemove: (id: number) => void
}

function PaletteBlock({ title, description, colors, inputIdPrefix, onAdd, onChange, onRemove }: PaletteBlockProps) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div>
        <p className="form-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>{title}</p>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: '#71717a' }}>{description}</p>
      </div>

      <div className="color-list">
        {colors.map((color) => (
          <ColorItem
            key={color.id}
            color={color}
            inputIdPrefix={inputIdPrefix}
            onChange={(fields) => onChange(color.id, fields)}
            onRemove={() => onRemove(color.id)}
          />
        ))}
      </div>

      <button className="btn-add" onClick={onAdd}>
        <Plus size={13} /> Adicionar Cor
      </button>
    </div>
  )
}

export function SectionCores() {
  const {
    cores_logo,
    setCor,
    addCor,
    removeCor,
  } = useBrandStore()

  return (
    <CollapsibleSection icon={<Palette size={14} />} label="Cores" defaultOpen sectionId="cores">
      <PaletteBlock
        title="Cores da Logo"
        description="Essas cores aparecem na página de padrão cromático. Ao subir a logo principal, tentamos preencher automaticamente."
        colors={cores_logo}
        inputIdPrefix="input-cor-logo"
        onAdd={() => addCor('logo')}
        onChange={(id, fields) => setCor('logo', id, fields)}
        onRemove={(id) => removeCor('logo', id)}
      />

    </CollapsibleSection>
  )
}
