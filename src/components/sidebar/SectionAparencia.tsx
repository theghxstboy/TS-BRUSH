import { Layers } from 'lucide-react'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'

// Presets removidos

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
          value={color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#000000'}
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
    </div>
  )
}

function OpacityField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span style={{ fontSize: 11, color: '#71717a' }}>{Math.round(value * 100)}%</span>
    </div>
  )
}

export function SectionAparencia() {
  const { aparencia, setAparencia } = useBrandStore()

  const handleChange = (section: any, key: string, value: any) => {
    setAparencia({ [section]: { ...aparencia[section], [key]: value } })
  }

  return (
    <CollapsibleSection icon={<Layers size={14} />} label="Aparência das Páginas" defaultOpen={false} sectionId="aparencia">
      {/* CAPA */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Capa
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se exclusivamente ao primeiro slide da apresentação.
        </p>

        <ColorField
          label="Cor do Fundo da Página"
          description=""
          color={aparencia.capa.cor_fundo_pagina}
          onChange={(hex) => handleChange('capa', 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Usada em botões cruzados, badges, e blocos de destaque nas capas."
          color={aparencia.capa.cor_detalhes}
          onChange={(hex) => handleChange('capa', 'cor_detalhes', hex)}
        />

        <div style={{ marginTop: 12 }}>
          <UploadZone
            inputId="input-imagem-fundo-capa"
            label="Fundo Exclusivo da Capa"
            hint="Substitui o fundo global apenas na capa"
            accept="image/*"
            value={aparencia.capa.imagem_fundo}
            onChange={(value) => handleChange('capa', 'imagem_fundo', value)}
          />
          {aparencia.capa.imagem_fundo && (
            <OpacityField
              label="Opacidade do Fundo da Capa"
              value={aparencia.capa.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY}
              onChange={(val) => handleChange('capa', 'imagem_fundo_opacidade', val)}
            />
          )}
        </div>
      </div>

      {/* SEÇÃO */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Seção
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se aos slides de título das seções (ex: 01 Tipografia).
        </p>

        <ColorField
          label="Cor do Fundo da Página"
          description=""
          color={aparencia.secao.cor_fundo_pagina}
          onChange={(hex) => handleChange('secao', 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={aparencia.secao.cor_titulo}
          onChange={(hex) => handleChange('secao', 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Cores das faixas decorativas laterais se existirem."
          color={aparencia.secao.cor_detalhes}
          onChange={(hex) => handleChange('secao', 'cor_detalhes', hex)}
        />

        <div style={{ marginTop: 12 }}>
          <UploadZone
            inputId="input-imagem-fundo-secao"
            label="Fundo Exclusivo da Seção"
            hint="Substitui o fundo global apenas nas divisórias"
            accept="image/*"
            value={aparencia.secao.imagem_fundo}
            onChange={(value) => handleChange('secao', 'imagem_fundo', value)}
          />
          {aparencia.secao.imagem_fundo && (
            <OpacityField
              label="Opacidade do Fundo da Seção"
              value={aparencia.secao.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY}
              onChange={(val) => handleChange('secao', 'imagem_fundo_opacidade', val)}
            />
          )}
        </div>
      </div>

      {/* OBRIGADO */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Obrigado / Final
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se ao último slide de fechamento.
        </p>

        <ColorField
          label="Cor do Fundo da Página"
          description=""
          color={aparencia.final.cor_fundo_pagina}
          onChange={(hex) => handleChange('final', 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={aparencia.final.cor_titulo}
          onChange={(hex) => handleChange('final', 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Textos"
          description=""
          color={aparencia.final.cor_texto}
          onChange={(hex) => handleChange('final', 'cor_texto', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description=""
          color={aparencia.final.cor_detalhes}
          onChange={(hex) => handleChange('final', 'cor_detalhes', hex)}
        />

        <div style={{ marginTop: 12 }}>
          <UploadZone
            inputId="input-imagem-fundo-final"
            label="Fundo Exclusivo do Final"
            hint="Substitui o fundo global apenas no slide final"
            accept="image/*"
            value={aparencia.final.imagem_fundo}
            onChange={(value) => handleChange('final', 'imagem_fundo', value)}
          />
          {aparencia.final.imagem_fundo && (
            <OpacityField
              label="Opacidade do Fundo Final"
              value={aparencia.final.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY}
              onChange={(val) => handleChange('final', 'imagem_fundo_opacidade', val)}
            />
          )}
        </div>
      </div>

      {/* CONTEUDO */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Conteúdo / Textos
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se à Bem Vindo, Sumário, Conceito, Tipografia, Cores, etc.
        </p>

        <ColorField
          label="Cor do Fundo da Página"
          description=""
          color={aparencia.conteudo.cor_fundo_pagina}
          onChange={(hex) => handleChange('conteudo', 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={aparencia.conteudo.cor_titulo}
          onChange={(hex) => handleChange('conteudo', 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Textos"
          description=""
          color={aparencia.conteudo.cor_texto}
          onChange={(hex) => handleChange('conteudo', 'cor_texto', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Usada em botões, badges, e elementos visuais de destaque."
          color={aparencia.conteudo.cor_detalhes}
          onChange={(hex) => handleChange('conteudo', 'cor_detalhes', hex)}
        />

        <div style={{ marginTop: 12 }}>
          <UploadZone
            inputId="input-imagem-fundo-conteudo"
            label="Fundo Exclusivo de Conteúdo"
            hint="Substitui o fundo global nos slides de texto"
            accept="image/*"
            value={aparencia.conteudo.imagem_fundo}
            onChange={(value) => handleChange('conteudo', 'imagem_fundo', value)}
          />
          {aparencia.conteudo.imagem_fundo && (
            <OpacityField
              label="Opacidade do Fundo de Conteúdo"
              value={aparencia.conteudo.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY}
              onChange={(val) => handleChange('conteudo', 'imagem_fundo_opacidade', val)}
            />
          )}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Imagem / Textura de Fundo</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          Aplicada como fundo global da apresentação. Cada slide pode receber um arquivo próprio e substituir este fundo quando necessário.
        </p>
        <UploadZone
          inputId="input-imagem-fundo"
          label="Upload Imagem de Fundo"
          hint="JPG, PNG ou WebP · usada em toda a apresentação por padrão"
          accept="image/*"
          value={aparencia.imagem_fundo}
          onChange={(value) => setAparencia({ imagem_fundo: value })}
        />
      </div>

      <OpacityField
        label="Opacidade do Fundo Global"
        value={aparencia.imagem_fundo ? aparencia.imagem_fundo_opacidade : DEFAULT_BACKGROUND_IMAGE_OPACITY}
        onChange={(value) => setAparencia({ imagem_fundo_opacidade: value })}
      />

      <div className="appearance-preview-strip">
        <div className="appearance-preview-page" style={{ background: aparencia.secao.cor_fundo_pagina }}>
          <div className="appearance-preview-panel" style={{ background: aparencia.secao.cor_detalhes }}>
            {(aparencia.secao.imagem_fundo || aparencia.imagem_fundo) && (
              <img
                src={aparencia.secao.imagem_fundo || aparencia.imagem_fundo || ''}
                alt="preview fundo"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: aparencia.secao.imagem_fundo 
                    ? aparencia.secao.imagem_fundo_opacidade 
                    : aparencia.imagem_fundo_opacidade,
                }}
              />
            )}
            <div className="appearance-preview-title" style={{ color: aparencia.secao.cor_titulo }}>Divisória</div>
          </div>
          <div className="appearance-preview-logo" style={{ background: aparencia.conteudo.cor_fundo_pagina }}>
            <div style={{ width: 32, height: 8, background: aparencia.conteudo.cor_detalhes, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
