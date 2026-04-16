import { Palette, Plus, Trash2 } from 'lucide-react'
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
  const handleHexChange = (hex: string) => {
    onChange({ hex, rgb: hexToRgb(hex), hsl: hexToHsl(hex) })
  }

  const safeColor = color.hex && /^#[0-9A-Fa-f]{6}$/.test(color.hex) ? color.hex : '#000000'

  return (
    <div className="color-item">
      <div className="semantic-color-field" style={{ width: '100%' }}>
        <input
          className="semantic-color-native"
          type="color"
          value={safeColor}
          onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
        />
        <span className="semantic-color-label">HEX</span>
        <input
          className="form-input semantic-color-input"
          id={inputIdPrefix ? `${inputIdPrefix}-${color.id}-hex` : undefined}
          value={color.hex}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#FFFFFF"
        />
        <button className="btn-icon" onClick={onRemove} title="Remover cor">
          <Trash2 size={13} />
        </button>
      </div>
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
