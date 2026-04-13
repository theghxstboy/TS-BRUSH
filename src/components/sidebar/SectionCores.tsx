import { useState, useRef, useEffect } from 'react'
import { Palette, Plus, Trash2 } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import type { BrandColor } from '../../store/useBrandStore'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return ''
  return `${r}, ${g}, ${b}`
}

interface ColorItemProps {
  color: BrandColor
  onChange: (fields: Partial<BrandColor>) => void
  onRemove: () => void
}

function ColorItem({ color, onChange, onRemove }: ColorItemProps) {
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
    onChange({ hex, rgb: hexToRgb(hex) })
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

export function SectionCores() {
  const { cores, setCor, addCor, removeCor } = useBrandStore()

  return (
    <CollapsibleSection icon={<Palette size={14} />} label="Paleta de Cores" defaultOpen>
      <div className="color-list">
        {cores.map((c) => (
          <ColorItem
            key={c.id}
            color={c}
            onChange={(fields) => setCor(c.id, fields)}
            onRemove={() => removeCor(c.id)}
          />
        ))}
      </div>
      <button className="btn-add" onClick={addCor}>
        <Plus size={13} /> Adicionar Cor
      </button>
    </CollapsibleSection>
  )
}
