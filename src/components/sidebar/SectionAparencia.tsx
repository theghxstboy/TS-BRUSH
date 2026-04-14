import { Layers } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'

const PRESETS = [
  '#F97316',
  '#0C0C0C',
  '#FFFFFF',
  '#1F3A5F',
  '#8B1E3F',
  '#0F766E',
  '#E5E7EB',
  '#111827',
]

function ColorField({
  label,
  description,
  color,
  onChange,
}: {
  label: string
  description: string
  color: string
  onChange: (hex: string) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
        {description}
      </p>

      <div className="semantic-color-field">
        <input
          className="semantic-color-native"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <span className="semantic-color-label">Livre</span>
        <input
          className="form-input semantic-color-input"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF"
        />
      </div>

      <div className="semantic-color-presets">
        {PRESETS.map((preset) => (
          <button
            key={`${label}-${preset}`}
            type="button"
            className="semantic-color-preset"
            title={preset}
            onClick={() => onChange(preset)}
            style={{
              background: preset,
              outline: preset.toLowerCase() === color.toLowerCase() ? '2px solid var(--accent)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function SectionAparencia() {
  const { aparencia, setAparencia } = useBrandStore()

  return (
    <CollapsibleSection icon={<Layers size={14} />} label="Aparência das Páginas" defaultOpen={false} sectionId="aparencia">
      <ColorField
        label="Cor de Destaque"
        description="Usada em barras, badges, linhas de destaque e elementos visuais principais."
        color={aparencia.cor_destaque}
        onChange={(hex) => setAparencia({ cor_destaque: hex })}
      />

      <ColorField
        label="Cor dos Painéis"
        description="Usada nos blocos escuros, capas, seções laterais e áreas estruturais da apresentação."
        color={aparencia.cor_paineis}
        onChange={(hex) => setAparencia({ cor_paineis: hex })}
      />

      <ColorField
        label="Cor dos Títulos das Divisórias"
        description="Usada nas páginas de capítulo e divisórias, como 01 — Logo."
        color={aparencia.cor_titulos_divisoria}
        onChange={(hex) => setAparencia({ cor_titulos_divisoria: hex })}
      />

      <ColorField
        label="Cor dos Títulos de Conteúdo"
        description="Usada nas páginas explicativas em geral, como conceito, elementos, tipografia e similares."
        color={aparencia.cor_titulos_conteudo}
        onChange={(hex) => setAparencia({ cor_titulos_conteudo: hex })}
      />

      <ColorField
        label="Cor do Fundo da Página"
        description="Cor base geral das páginas claras do manual."
        color={aparencia.cor_fundo_pagina}
        onChange={(hex) => setAparencia({ cor_fundo_pagina: hex })}
      />

      <ColorField
        label="Cor do Fundo atrás da Logo"
        description="Usada em áreas de apoio e fundos claros para exibir logos e composições com mais contraste."
        color={aparencia.cor_fundo_logo}
        onChange={(hex) => setAparencia({ cor_fundo_logo: hex })}
      />

      <div className="form-group">
        <label className="form-label">Imagem / Textura de Fundo</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          Aplicada como textura geral da apresentação para dar mais atmosfera ao template.
        </p>
        <UploadZone
          inputId="input-imagem-fundo"
          label="Upload Imagem de Fundo"
          hint="JPG, PNG ou WebP · aplicada nos painéis da apresentação"
          accept="image/*"
          value={aparencia.imagem_fundo}
          onChange={(value) => setAparencia({ imagem_fundo: value })}
        />
      </div>

      <div className="appearance-preview-strip">
        <div className="appearance-preview-page" style={{ background: aparencia.cor_fundo_pagina }}>
          <div className="appearance-preview-panel" style={{ background: aparencia.cor_paineis }}>
            {aparencia.imagem_fundo && (
              <img
                src={aparencia.imagem_fundo}
                alt="preview fundo"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
              />
            )}
            <div className="appearance-preview-title" style={{ color: aparencia.cor_destaque }}>Divisória</div>
          </div>
          <div className="appearance-preview-logo" style={{ background: aparencia.cor_fundo_logo }}>
            <div style={{ width: 32, height: 8, background: aparencia.cor_titulos_conteudo, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
