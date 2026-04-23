import { Layers } from 'lucide-react'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'

/** Helper for presentation appearance updates */
type PresAppearance = any // Shortening for clarity

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
      {description && (
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          {description}
        </p>
      )}

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
  const { screen } = useAppStore()
  const { aparencia, setAparencia, presentation_data, setPresentationData } = useBrandStore()

  const isPres = screen === 'brand-presentation'

  const handleChange = (section: string, key: string, value: any) => {
    if (isPres) {
      const nextAppearance = { ...presentation_data.appearance }
      // @ts-ignore
      nextAppearance[section] = { ...nextAppearance[section], [key]: value }
      setPresentationData({ ...presentation_data, appearance: nextAppearance })
    } else {
      // @ts-ignore
      setAparencia({ [section]: { ...aparencia[section], [key]: value } })
    }
  }

  return (
    <CollapsibleSection icon={<Layers size={14} />} label="Aparência das Páginas" defaultOpen={false} sectionId="aparencia">
      {/* CAPA */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Capa
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se exclusivamente ao primeiro slide da {isPres ? 'proposta' : 'apresentação'}.
        </p>

        <ColorField
          label="Cor do Fundo"
          description=""
          color={isPres ? presentation_data.appearance.capa.fundo : aparencia.capa.cor_fundo_pagina}
          onChange={(hex) => handleChange('capa', isPres ? 'fundo' : 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Usada em botões cruzados, badges, e blocos de destaque nas capas."
          color={isPres ? presentation_data.appearance.capa.detalhe : aparencia.capa.cor_detalhes}
          onChange={(hex) => handleChange('capa', isPres ? 'detalhe' : 'cor_detalhes', hex)}
        />

        {!isPres && (
          <div style={{ marginTop: 12 }}>
            <UploadZone
              inputId="input-imagem-fundo-capa"
              label="Fundo Exclusivo da Capa"
              hint="Substitui o fundo global apenas na capa"
              accept="image/*"
              value={aparencia.capa.imagem_fundo ?? null}
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
        )}
      </div>

      {/* SEÇÃO */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Divisórias / Seção
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se aos slides de título das seções.
        </p>

        <ColorField
          label="Cor do Fundo"
          description=""
          color={isPres ? presentation_data.appearance.secao.fundo : aparencia.secao.cor_fundo_pagina}
          onChange={(hex) => handleChange('secao', isPres ? 'fundo' : 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={isPres ? presentation_data.appearance.secao.titulo : aparencia.secao.cor_titulo}
          onChange={(hex) => handleChange('secao', isPres ? 'titulo' : 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Cores das faixas decorativas laterais."
          color={isPres ? presentation_data.appearance.secao.detalhe : aparencia.secao.cor_detalhes}
          onChange={(hex) => handleChange('secao', isPres ? 'detalhe' : 'cor_detalhes', hex)}
        />

        {!isPres && (
          <div style={{ marginTop: 12 }}>
            <UploadZone
              inputId="input-imagem-fundo-secao"
              label="Fundo Exclusivo da Seção"
              hint="Substitui o fundo global apenas nas divisórias"
              accept="image/*"
              value={aparencia.secao.imagem_fundo ?? null}
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
        )}
      </div>

      {/* FINAL */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Obrigado / Final
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se ao último slide de fechamento.
        </p>

        <ColorField
          label="Cor do Fundo"
          description=""
          color={isPres ? presentation_data.appearance.final.fundo : aparencia.final.cor_fundo_pagina}
          onChange={(hex) => handleChange('final', isPres ? 'fundo' : 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={isPres ? presentation_data.appearance.final.titulo : aparencia.final.cor_titulo}
          onChange={(hex) => handleChange('final', isPres ? 'titulo' : 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Textos"
          description=""
          color={isPres ? presentation_data.appearance.final.texto : aparencia.final.cor_texto}
          onChange={(hex) => handleChange('final', isPres ? 'texto' : 'cor_texto', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description=""
          color={isPres ? presentation_data.appearance.final.detalhe : aparencia.final.cor_detalhes}
          onChange={(hex) => handleChange('final', isPres ? 'detalhe' : 'cor_detalhes', hex)}
        />

        {!isPres && (
          <div style={{ marginTop: 12 }}>
            <UploadZone
              inputId="input-imagem-fundo-final"
              label="Fundo Exclusivo do Final"
              hint="Substitui o fundo global apenas no slide final"
              accept="image/*"
              value={aparencia.final.imagem_fundo ?? null}
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
        )}
      </div>

      {/* CONTEUDO */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Conteúdo / Textos
        </h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aplica-se à Sumário, Conceito, Tipografia, Cores, etc.
        </p>

        <ColorField
          label="Cor do Fundo da Página"
          description=""
          color={isPres ? presentation_data.appearance.conteudo.fundo : aparencia.conteudo.cor_fundo_pagina}
          onChange={(hex) => handleChange('conteudo', isPres ? 'fundo' : 'cor_fundo_pagina', hex)}
        />
        <ColorField
          label="Cor do Título"
          description=""
          color={isPres ? presentation_data.appearance.conteudo.titulo : aparencia.conteudo.cor_titulo}
          onChange={(hex) => handleChange('conteudo', isPres ? 'titulo' : 'cor_titulo', hex)}
        />
        <ColorField
          label="Cor dos Textos"
          description=""
          color={isPres ? presentation_data.appearance.conteudo.texto : aparencia.conteudo.cor_texto}
          onChange={(hex) => handleChange('conteudo', isPres ? 'texto' : 'cor_texto', hex)}
        />
        <ColorField
          label="Cor dos Detalhes"
          description="Usada em botões, badges, e elementos visuais de destaque."
          color={isPres ? presentation_data.appearance.conteudo.detalhe : aparencia.conteudo.cor_detalhes}
          onChange={(hex) => handleChange('conteudo', isPres ? 'detalhe' : 'cor_detalhes', hex)}
        />

        {!isPres && (
          <div style={{ marginTop: 12 }}>
            <UploadZone
              inputId="input-imagem-fundo-conteudo"
              label="Fundo Exclusivo de Conteúdo"
              hint="Substitui o fundo global nos slides de texto"
              accept="image/*"
              value={aparencia.conteudo.imagem_fundo ?? null}
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
        )}
      </div>

      {/* GLOBAL BACKGROUND SUPPORT */}
      <div className="form-group">
        <label className="form-label">{isPres ? 'Fundo Global da Proposta' : 'Imagem / Textura de Fundo'}</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          {isPres 
            ? 'Substitui o fundo padrão dos slides de conteúdo da apresentação.' 
            : 'Aplicada como fundo global da apresentação. Cada slide pode receber um arquivo próprio.'}
        </p>
        <UploadZone
          inputId="input-imagem-fundo-global"
          label="Upload Imagem de Fundo"
          hint="JPG, PNG ou WebP"
          accept="image/*"
          value={isPres ? presentation_data.appearance.fundos.conteudo : aparencia.imagem_fundo}
          onChange={(value) => {
            if (isPres) {
              setPresentationData({
                ...presentation_data,
                appearance: {
                  ...presentation_data.appearance,
                  fundos: { ...presentation_data.appearance.fundos, conteudo: value }
                }
              })
            } else {
              setAparencia({ imagem_fundo: value })
            }
          }}
        />
      </div>

      {!isPres && (
        <OpacityField
          label="Opacidade do Fundo Global"
          value={aparencia.imagem_fundo ? aparencia.imagem_fundo_opacidade : DEFAULT_BACKGROUND_IMAGE_OPACITY}
          onChange={(value) => setAparencia({ imagem_fundo_opacidade: value })}
        />
      )}
    </CollapsibleSection>
  )
}
