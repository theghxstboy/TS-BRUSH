import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { PanelRightClose, PanelRightOpen, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { FontUploadControl } from '../common/FontUploadControl'
import { UploadZone } from '../sidebar/UploadZone'
import { hexToHsl, hexToRgb } from '../../lib/colorUtils'
import { extractColorsFromDataUrl } from '../../lib/imageUtils'
import type { ContextDrawerTarget } from '../../lib/sidebarNavigation'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, DEFAULT_SLIDE_APPEARANCE, useBrandStore } from '../../store/useBrandStore'
import type { BrandColor, SlideAppearanceKey } from '../../store/useBrandStore'
import {
  DEFAULT_BODY_FONT,
  DEFAULT_MONO_FONT,
} from '../../lib/fontUtils'

type SlideType = SlideAppearanceKey

type AppearanceFieldKey =
  | 'cor_fundo_pagina'
  | 'cor_titulo'
  | 'cor_texto'
  | 'cor_detalhes'
  | 'cor_sombra'

const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,.svg,.png,.webp,.jpg,.jpeg'
const MOCKUP_ACCEPT = 'image/*'
const GLOBAL_SECTION_DESCRIPTION = 'Estes controles continuam sendo globais e podem refletir em outras paginas do manual.'

const STANDARD_APPEARANCE_FIELDS: Array<{ key: AppearanceFieldKey; label: string }> = [
  { key: 'cor_fundo_pagina', label: 'Cor do fundo da página' },
  { key: 'cor_titulo', label: 'Cor do título' },
  { key: 'cor_texto', label: 'Cor dos textos' },
  { key: 'cor_detalhes', label: 'Cor dos detalhes' },
  { key: 'cor_sombra', label: 'Cor da sombra' },
]


const TITLES: Record<SlideType, string> = {
  capa: 'Capa',
  'bem-vindo': 'Boas-vindas',
  sumario: 'Sumario',
  conceito: 'Conceito',
  'tipografia-principal': 'Tipografia Principal',
  'tipografia-secundaria': 'Tipografia Secundaria',
  'padrao-cromatico': 'Paleta de Cores',
  'versao-mono': 'Versao Monocromatica',
  elementos: 'Anatomia Visual',
  'aplicacao-fundos': 'Aplicacao Sobre Fundos',
  'usos-incorretos': 'Usos Incorretos',
  mockup: 'Mockup',
  final: 'Encerramento',
  'logo-principal': 'Logo Principal',
  simbolo: 'Simbolo',
  'secao-logo': 'Divisoria Logo',
  'secao-tipografia': 'Divisoria Tipografia',
  'secao-cores': 'Divisoria Cores',
  'secao-construcao': 'Divisoria Construcao',
  'secao-usos-incorretos': 'Divisoria Usos Incorretos',
  'secao-aplicacoes': 'Divisoria Aplicacoes',
}

function DrawerColorField({
  label,
  value,
  inheritedValue,
  onChange,
}: {
  label: string
  value: string
  inheritedValue: string
  onChange: (hex: string) => void
}) {
  const isInherited = !value
  const displayValue = isInherited ? inheritedValue : value

  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="form-label" style={{ margin: 0 }}>{label}</label>
        {!isInherited && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Resetar Global
          </button>
        )}
      </div>
      <div className="semantic-color-field" style={{ opacity: isInherited ? 0.8 : 1 }}>
        <input
          className="semantic-color-native"
          type="color"
          value={displayValue && /^#[0-9A-Fa-f]{6}$/.test(displayValue) ? displayValue : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <span className="semantic-color-label" style={{ fontSize: 10 }}>{isInherited ? 'AUTO' : 'SLIDE'}</span>
        <input
          className="form-input semantic-color-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={inheritedValue}
        />
      </div>
    </div>
  )
}

function DrawerOpacityField({
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

function DrawerSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="context-section">
      <div className="context-section-header">
        <h3 className="context-section-title">{title}</h3>
        {description ? <p className="context-section-description">{description}</p> : null}
      </div>
      <div className="context-section-body">{children}</div>
    </section>
  )
}

function AppearanceSection({ slideType }: { slideType: SlideType }) {
  const { page_appearance, setPageAppearance, aparencia } = useBrandStore()
  const appearance = page_appearance[slideType] || DEFAULT_SLIDE_APPEARANCE
  let globalApp: any = aparencia.conteudo
  let fields = STANDARD_APPEARANCE_FIELDS

  if (slideType === 'capa') {
    globalApp = aparencia.capa
    fields = STANDARD_APPEARANCE_FIELDS.filter(f => ['cor_fundo_pagina', 'cor_detalhes'].includes(f.key))
  } else if (slideType === 'final') {
    globalApp = aparencia.final
    fields = STANDARD_APPEARANCE_FIELDS
  } else if (slideType?.startsWith('secao-')) {
    globalApp = aparencia.secao
    fields = STANDARD_APPEARANCE_FIELDS.filter(f => ['cor_fundo_pagina', 'cor_titulo', 'cor_detalhes'].includes(f.key))
  } else if (slideType === 'mockup' || slideType === 'padrao-cromatico') {
    globalApp = aparencia.conteudo
    fields = STANDARD_APPEARANCE_FIELDS.filter(f => ['cor_fundo_pagina', 'cor_detalhes', 'cor_sombra'].includes(f.key))
  }

  const getInherited = (key: AppearanceFieldKey) => {
    switch (key) {
      case 'cor_detalhes': return globalApp.cor_detalhes || '#F97316'
      case 'cor_titulo': return globalApp.cor_titulo || '#0C0C0C'
      case 'cor_fundo_pagina': return globalApp.cor_fundo_pagina || '#FFFFFF'
      case 'cor_texto': return globalApp.cor_texto || '#1A1A1A'
      case 'cor_sombra': return globalApp.cor_sombra || 'rgba(0,0,0,0.5)'
      default: return '#000000'
    }
  }



  return (
    <DrawerSection title="Aparencia deste slide" description="Somente os controles que afetam esta pagina em especifico.">
      {fields.map((field) => (
        <DrawerColorField
          key={`${slideType}-${field.key}`}
          label={field.label}
          value={appearance[field.key]}
          inheritedValue={getInherited(field.key)}
          onChange={(hex) => setPageAppearance(slideType, { [field.key]: hex })}
        />
      ))}

      <div className="form-group">
        <label className="form-label">Fundo personalizado deste slide</label>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
          Se existir um fundo global, este arquivo substitui somente nesta pagina. Tambem funciona nos slides de texto.
        </p>
        <UploadZone
          label="Upload Fundo do Slide"
          hint="JPG, PNG ou WebP · substitui o fundo global nesta pagina"
          value={appearance.imagem_fundo}
          onChange={(value) => setPageAppearance(slideType, { imagem_fundo: value })}
          accept="image/*"
        />
      </div>

      <DrawerOpacityField
        label="Opacidade do Fundo deste Slide"
        value={appearance.imagem_fundo ? appearance.imagem_fundo_opacidade : DEFAULT_BACKGROUND_IMAGE_OPACITY}
        onChange={(value) => setPageAppearance(slideType, { imagem_fundo_opacidade: value })}
      />
    </DrawerSection>
  )
}

function AssetSection({
  title,
  description = GLOBAL_SECTION_DESCRIPTION,
  fieldLabel,
  uploadLabel,
  hint,
  value,
  accept,
  onChange,
}: {
  title: string
  description?: string
  fieldLabel: string
  uploadLabel: string
  hint: string
  value: string | null
  accept: string
  onChange: (base64: string | null) => void
}) {
  return (
    <DrawerSection title={title} description={description}>
      <div className="form-group">
        <label className="form-label">{fieldLabel}</label>
        <UploadZone label={uploadLabel} hint={hint} value={value} onChange={onChange} accept={accept} />
      </div>
    </DrawerSection>
  )
}

function LogoPaletteSection() {
  const { cores_logo, setCor, addCor, removeCor } = useBrandStore()

  const handleHexChange = (color: BrandColor, hex: string) => {
    setCor('logo', color.id, {
      hex,
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex),
    })
  }

  return (
    <DrawerSection title="Paleta usada neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
      <div className="color-list">
        {cores_logo.map((color) => {
          const safeColor = color.hex && /^#[0-9A-Fa-f]{6}$/.test(color.hex) ? color.hex : '#000000'

          return (
            <div key={color.id} className="color-item">
              <div className="semantic-color-field" style={{ width: '100%' }}>
                <input
                  className="semantic-color-native"
                  type="color"
                  value={safeColor}
                  onChange={(e) => handleHexChange(color, e.target.value.toUpperCase())}
                />
                <span className="semantic-color-label">HEX</span>
                <input
                  className="form-input semantic-color-input"
                  value={color.hex}
                  onChange={(e) => handleHexChange(color, e.target.value)}
                  placeholder="#FFFFFF"
                />
                <button type="button" className="btn-icon" onClick={() => removeCor('logo', color.id)} title="Remover cor">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button type="button" className="btn-add" onClick={() => addCor('logo')}>
        <Plus size={13} /> Adicionar Cor
      </button>
    </DrawerSection>
  )
}

function ContextBody({
  slideType,
  pageLabel,
  mockupIndex,
}: {
  slideType: SlideType
  pageLabel: string | null
  mockupIndex: number | null
}) {
  const {
    projeto,
    setProjeto,
    conteudo_pdf,
    setConteudoPdf,
    tipografia,
    setTipografia,
    assets_base64,
    setAsset,
    replaceCores,
    replaceMockup,
    removeMockup,
  } = useBrandStore()

  const handleLogoPrincipalChange = async (value: string | null) => {
    setAsset('logo_principal', value)
    if (!value) return

    const extracted = await extractColorsFromDataUrl(value, 4)
    if (extracted.length > 0) {
      replaceCores('logo', extracted)
      replaceCores('apresentacao', extracted)
      toast.success('Cores da logo atualizadas automaticamente.')
    }
  }

  const renderBrandIdentitySection = ({
    includeName = true,
    includeConcept = true,
    title = 'Dados globais usados neste slide',
  }: {
    includeName?: boolean
    includeConcept?: boolean
    title?: string
  }) => (
    <DrawerSection title={title} description={GLOBAL_SECTION_DESCRIPTION}>
      {includeName ? (
        <div className="form-group">
          <label className="form-label">Nome da Marca</label>
          <input className="form-input" value={projeto.nome_marca} onChange={(e) => setProjeto({ nome_marca: e.target.value })} />
        </div>
      ) : null}

      {includeConcept ? (
        <div className="form-group">
          <label className="form-label">Conceito / Tagline</label>
          <textarea className="form-textarea" value={projeto.conceito} onChange={(e) => setProjeto({ conceito: e.target.value })} />
        </div>
      ) : null}
    </DrawerSection>
  )

  const renderTypographySection = (mode: 'primary' | 'secondary' | 'both') => (
    <DrawerSection title="Tipografia da Marca" description={GLOBAL_SECTION_DESCRIPTION}>
      {(mode === 'primary' || mode === 'both') && (
        <FontUploadControl
          title="Fonte Principal"
          name={tipografia.principal_nome}
          styles={tipografia.principal_estilos}
          customFont={tipografia.principal_custom}
          onNameChange={(value) => setTipografia({ principal_nome: value })}
          onStylesChange={(value) => setTipografia({ principal_estilos: value })}
          onCustomFontChange={(value) => setTipografia({ principal_custom: value })}
          placeholder="Ex: Geist, Inter, Montserrat"
          stylesPlaceholder="Ex: Light 300, Regular 400, Bold 700"
          previewFallback={DEFAULT_BODY_FONT}
        />
      )}

      {(mode === 'secondary' || mode === 'both') && (
        <FontUploadControl
          title="Fonte Secundaria"
          optional
          name={tipografia.secundaria_nome}
          styles={tipografia.secundaria_estilos}
          customFont={tipografia.secundaria_custom}
          onNameChange={(value) => setTipografia({ secundaria_nome: value })}
          onStylesChange={(value) => setTipografia({ secundaria_estilos: value })}
          onCustomFontChange={(value) => setTipografia({ secundaria_custom: value })}
          placeholder="Ex: DM Sans, Space Grotesk, Mono"
          stylesPlaceholder="Ex: Regular 400, Medium 500"
          previewFallback={DEFAULT_MONO_FONT}
          previewGeneric="monospace"
        />
      )}
    </DrawerSection>
  )

  if (slideType === 'capa') {
    return (
      <>
        {renderBrandIdentitySection({})}
        <AssetSection
          title="Logo exibida neste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="SVG recomendado - PNG com transparencia"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'bem-vindo') {
    return (
      <>
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.boas_vindas_titulo} onChange={(e) => setConteudoPdf({ boas_vindas_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 1</label>
            <textarea className="form-textarea" value={conteudo_pdf.boas_vindas_texto_1} onChange={(e) => setConteudoPdf({ boas_vindas_texto_1: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 2</label>
            <textarea className="form-textarea" value={conteudo_pdf.boas_vindas_texto_2} onChange={(e) => setConteudoPdf({ boas_vindas_texto_2: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 3</label>
            <textarea className="form-textarea" value={conteudo_pdf.boas_vindas_texto_3} onChange={(e) => setConteudoPdf({ boas_vindas_texto_3: e.target.value })} />
          </div>
        </DrawerSection>
        {renderBrandIdentitySection({ includeConcept: false })}
        <AssetSection
          title="Logo de apoio deste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="Usada como marca d'agua / apoio visual"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'sumario') {
    return (
      <>
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Descricao do sumario</label>
            <textarea className="form-textarea" value={conteudo_pdf.sumario_descricao} onChange={(e) => setConteudoPdf({ sumario_descricao: e.target.value })} />
          </div>
        </DrawerSection>
        {renderBrandIdentitySection({ includeName: false })}
        <AssetSection
          title="Logo usada neste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="Opcional no template moderno"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'conceito') {
    return (
      <>
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.conceito_titulo} onChange={(e) => setConteudoPdf({ conceito_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 1</label>
            <textarea className="form-textarea" value={conteudo_pdf.conceito_texto_1} onChange={(e) => setConteudoPdf({ conceito_texto_1: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 2</label>
            <textarea className="form-textarea" value={conteudo_pdf.conceito_texto_2} onChange={(e) => setConteudoPdf({ conceito_texto_2: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texto 3</label>
            <textarea className="form-textarea" value={conteudo_pdf.conceito_texto_3} onChange={(e) => setConteudoPdf({ conceito_texto_3: e.target.value })} />
          </div>
        </DrawerSection>
        <DrawerSection title="Dados globais usados neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
          <div className="form-group">
            <label className="form-label">Nome da Marca</label>
            <input className="form-input" value={projeto.nome_marca} onChange={(e) => setProjeto({ nome_marca: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Caracteristicas da Marca</label>
            <textarea className="form-textarea" value={projeto.caracteristicas_marca} onChange={(e) => setProjeto({ caracteristicas_marca: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Valores que a Marca Comunica</label>
            <textarea className="form-textarea" value={projeto.valores_marca} onChange={(e) => setProjeto({ valores_marca: e.target.value })} />
          </div>
        </DrawerSection>
        <AssetSection
          title="Logo exibida neste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="Usada na composicao principal"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'tipografia-principal' || slideType === 'tipografia-secundaria') {
    const isPrimary = slideType === 'tipografia-principal'

    return (
      <>
        {renderTypographySection('both')}
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={isPrimary ? conteudo_pdf.tipografia_principal_titulo : conteudo_pdf.tipografia_secundaria_titulo} onChange={(e) => setConteudoPdf(isPrimary ? { tipografia_principal_titulo: e.target.value } : { tipografia_secundaria_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Descricao</label>
            <textarea className="form-textarea" value={isPrimary ? conteudo_pdf.tipografia_principal_descricao : conteudo_pdf.tipografia_secundaria_descricao} onChange={(e) => setConteudoPdf(isPrimary ? { tipografia_principal_descricao: e.target.value } : { tipografia_secundaria_descricao: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'padrao-cromatico') {
    return (
      <>
        <LogoPaletteSection />
        <DrawerSection title="Narrativa deste slide" description={GLOBAL_SECTION_DESCRIPTION}>
          <div className="form-group">
            <label className="form-label">Sensacoes das Cores da Logo</label>
            <textarea className="form-textarea" value={projeto.sensacoes_cores} onChange={(e) => setProjeto({ sensacoes_cores: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'versao-mono') {
    return (
      <>
        <AssetSection
          title="Logo usada neste slide"
          fieldLabel="Logo Monocromatica"
          uploadLabel="Upload Logo Monocromatica"
          hint="Versao preta ou branca da marca"
          value={assets_base64.logo_monocromatica}
          accept={LOGO_ACCEPT}
          onChange={(value) => setAsset('logo_monocromatica', value)}
        />
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.logo_mono_titulo} onChange={(e) => setConteudoPdf({ logo_mono_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Descricao</label>
            <textarea className="form-textarea" value={conteudo_pdf.logo_mono_descricao} onChange={(e) => setConteudoPdf({ logo_mono_descricao: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'elementos') {
    return (
      <>
        <DrawerSection title="Assets usados neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
          <div className="form-group">
            <label className="form-label">Logo Principal</label>
            <UploadZone label="Upload Logo Principal" hint="Usada como primeiro elemento" value={assets_base64.logo_principal} onChange={handleLogoPrincipalChange} accept={LOGO_ACCEPT} />
          </div>
          <div className="form-group">
            <label className="form-label">Simbolo / Icone</label>
            <UploadZone label="Upload Simbolo" hint="Usado como segundo elemento" value={assets_base64.logo_simbolo} onChange={(value) => setAsset('logo_simbolo', value)} accept={LOGO_ACCEPT} />
          </div>
          <div className="form-group">
            <label className="form-label">Logo Monocromatica</label>
            <UploadZone label="Upload Logo Mono" hint="Usada como terceiro elemento" value={assets_base64.logo_monocromatica} onChange={(value) => setAsset('logo_monocromatica', value)} accept={LOGO_ACCEPT} />
          </div>
        </DrawerSection>
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.elementos_titulo} onChange={(e) => setConteudoPdf({ elementos_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Descricao</label>
            <textarea className="form-textarea" value={conteudo_pdf.elementos_descricao} onChange={(e) => setConteudoPdf({ elementos_descricao: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Elementos da Logo</label>
            <textarea className="form-textarea" value={projeto.elementos_logo} onChange={(e) => setProjeto({ elementos_logo: e.target.value })} placeholder={'Um elemento por linha.\nEx:\nSimbolo\nLettering'} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'logo-principal') {
    return (
      <>
        <DrawerSection title="Dados globais usados neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
          <div className="form-group">
            <label className="form-label">Nome da Marca</label>
            <input className="form-input" value={projeto.nome_marca} onChange={(e) => setProjeto({ nome_marca: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Logo Principal</label>
            <UploadZone label="Upload Logo Principal" hint="A mesma logo aparece nas variacoes desta pagina" value={assets_base64.logo_principal} onChange={handleLogoPrincipalChange} accept={LOGO_ACCEPT} />
          </div>
        </DrawerSection>
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.logo_principal_titulo} onChange={(e) => setConteudoPdf({ logo_principal_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Compatibilidade</label>
            <textarea className="form-textarea" value={conteudo_pdf.logo_principal_compatibilidade} onChange={(e) => setConteudoPdf({ logo_principal_compatibilidade: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Usos recomendados</label>
            <textarea className="form-textarea" value={conteudo_pdf.logo_principal_usos} onChange={(e) => setConteudoPdf({ logo_principal_usos: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Espaco de protecao</label>
            <textarea className="form-textarea" value={conteudo_pdf.logo_principal_protecao} onChange={(e) => setConteudoPdf({ logo_principal_protecao: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'simbolo') {
    return (
      <>
        <AssetSection
          title="Asset usado neste slide"
          fieldLabel="Simbolo / Icone"
          uploadLabel="Upload Simbolo"
          hint="SVG recomendado - somente o simbolo"
          value={assets_base64.logo_simbolo}
          accept={LOGO_ACCEPT}
          onChange={(value) => setAsset('logo_simbolo', value)}
        />
        <DrawerSection title="Conteudo deste slide">
          <div className="form-group">
            <label className="form-label">Titulo</label>
            <input className="form-input" value={conteudo_pdf.simbolo_titulo} onChange={(e) => setConteudoPdf({ simbolo_titulo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Descricao</label>
            <textarea className="form-textarea" value={conteudo_pdf.simbolo_descricao} onChange={(e) => setConteudoPdf({ simbolo_descricao: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Tamanho minimo</label>
            <input className="form-input" value={conteudo_pdf.simbolo_tamanho_minimo} onChange={(e) => setConteudoPdf({ simbolo_tamanho_minimo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Aplicacao</label>
            <input className="form-input" value={conteudo_pdf.simbolo_aplicacao} onChange={(e) => setConteudoPdf({ simbolo_aplicacao: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Fundo preferencial</label>
            <input className="form-input" value={conteudo_pdf.simbolo_fundo_preferencial} onChange={(e) => setConteudoPdf({ simbolo_fundo_preferencial: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'aplicacao-fundos') {
    return (
      <>
        <AssetSection
          title="Logo usada neste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="Usada nas simulacoes de aplicacao sobre fundos"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'usos-incorretos') {
    return (
      <>
        <AssetSection
          title="Logo usada neste slide"
          fieldLabel="Logo Principal"
          uploadLabel="Upload Logo Principal"
          hint="Usada nos exemplos do que nao fazer"
          value={assets_base64.logo_principal}
          accept={LOGO_ACCEPT}
          onChange={handleLogoPrincipalChange}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'mockup') {
    const currentMockup = typeof mockupIndex === 'number' ? assets_base64.mockups[mockupIndex] ?? null : null

    return (
      <>
        <AssetSection
          title="Imagem deste mockup"
          description="Troque apenas a imagem desta pagina. Se remover, a quantidade de slides de mockup pode mudar."
          fieldLabel={typeof mockupIndex === 'number' ? `Mockup ${mockupIndex + 1}` : 'Mockup'}
          uploadLabel="Upload Mockup"
          hint="PNG, JPG ou WebP"
          value={currentMockup}
          accept={MOCKUP_ACCEPT}
          onChange={(value) => {
            if (typeof mockupIndex !== 'number') return
            if (value) {
              replaceMockup(mockupIndex, value)
            } else {
              removeMockup(mockupIndex)
            }
          }}
        />
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  if (slideType === 'final') {
    return (
      <>
        <DrawerSection title="Dados globais usados neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
          <div className="form-group">
            <label className="form-label">Responsavel no Encerramento</label>
            <input className="form-input" value={projeto.responsavel_manual} onChange={(e) => setProjeto({ responsavel_manual: e.target.value })} placeholder="Ex: Joao Goncalves" />
          </div>
          <div className="form-group">
            <label className="form-label">Nome da Marca (fallback)</label>
            <input className="form-input" value={projeto.nome_marca} onChange={(e) => setProjeto({ nome_marca: e.target.value })} />
          </div>
        </DrawerSection>
        <AppearanceSection slideType={slideType} />
      </>
    )
  }

  return <AppearanceSection slideType={slideType} />
}

export function ContextDrawer() {
  const [open, setOpen] = useState(false)
  const [slideType, setSlideType] = useState<SlideType | null>(null)
  const [pageLabel, setPageLabel] = useState<string | null>(null)
  const [mockupIndex, setMockupIndex] = useState<number | null>(null)

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ContextDrawerTarget>).detail
      if (!detail?.slideType || !Object.prototype.hasOwnProperty.call(TITLES, detail.slideType)) return

      setSlideType(detail.slideType as SlideType)
      setPageLabel(detail.pageLabel ?? null)
      setMockupIndex(typeof detail.mockupIndex === 'number' ? detail.mockupIndex : null)
      setOpen(true)
    }

    window.addEventListener('open-context-drawer', handler)
    return () => window.removeEventListener('open-context-drawer', handler)
  }, [])

  const title = useMemo(() => (slideType ? TITLES[slideType] : 'Pagina'), [slideType])

  return (
    <aside className={`context-drawer ${open ? 'open' : ''}`}>
      {open ? (
        <>
          <div className="context-drawer-header">
            <div className="context-drawer-header-main">
              <div className="sidebar-logo">Slide Selecionado</div>
              <h2 className="context-drawer-title">{title}</h2>
              <p className="context-drawer-subtitle">Conteudo do slide, aparencia exclusiva e dados globais que impactam esta pagina.</p>
              {pageLabel ? <div className="context-drawer-chip">{pageLabel}</div> : null}
            </div>

            <button type="button" className="context-drawer-toggle" onClick={() => setOpen(false)} aria-label="Fechar painel da pagina">
              <PanelRightClose size={18} />
            </button>
          </div>

          <div className="context-drawer-body">
            {slideType ? (
              <ContextBody slideType={slideType} pageLabel={pageLabel} mockupIndex={mockupIndex} />
            ) : (
              <div className="context-empty">
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Clique em uma pagina no canvas para editar seu conteudo, assets e aparencia contextual.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <button type="button" className="context-drawer-rail" onClick={() => setOpen(true)} aria-label="Abrir painel da pagina">
          <div className="context-drawer-rail-icon">
            <PanelRightOpen size={18} />
          </div>
          <div className="context-drawer-rail-copy">
            <span className="context-drawer-rail-eyebrow">Drawer</span>
            <span className="context-drawer-rail-label">{slideType ? title : 'Pagina'}</span>
            <span className="context-drawer-rail-hint">{slideType ? 'Editar slide' : 'Abrir contexto'}</span>
          </div>
          <div className="context-drawer-rail-badge">
            <SlidersHorizontal size={14} />
          </div>
        </button>
      )}
    </aside>
  )
}
