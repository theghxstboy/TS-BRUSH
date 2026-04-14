import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { PanelRightClose, PanelRightOpen, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { UploadZone } from '../sidebar/UploadZone'
import { hexToHsl, hexToRgb } from '../../lib/colorUtils'
import { extractColorsFromDataUrl } from '../../lib/imageUtils'
import type { ContextDrawerTarget } from '../../lib/sidebarNavigation'
import { useBrandStore } from '../../store/useBrandStore'
import type { BrandColor, SlideAppearanceKey } from '../../store/useBrandStore'

type SlideType = SlideAppearanceKey

type AppearanceFieldKey =
  | 'cor_destaque'
  | 'cor_paineis'
  | 'cor_titulo'
  | 'cor_texto'
  | 'cor_fundo_pagina'
  | 'cor_fundo_logo'

const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,.svg,.png,.webp,.jpg,.jpeg'
const MOCKUP_ACCEPT = 'image/*'
const GLOBAL_SECTION_DESCRIPTION = 'Estes controles continuam sendo globais e podem refletir em outras paginas do manual.'

const APPEARANCE_FIELDS: Record<SlideType, Array<{ key: AppearanceFieldKey; label: string }>> = {
  capa: [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_texto', label: 'Cor do texto' },
  ],
  'bem-vindo': [
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  sumario: [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  conceito: [
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  'tipografia-principal': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da tipografia' },
  ],
  'tipografia-secundaria': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da tipografia' },
  ],
  'padrao-cromatico': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  'versao-mono': [
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da logo' },
  ],
  elementos: [
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da logo' },
  ],
  'aplicacao-fundos': [
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  'usos-incorretos': [
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
  ],
  mockup: [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_texto', label: 'Cor do texto' },
  ],
  final: [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_texto', label: 'Cor do texto' },
  ],
  'logo-principal': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor dos paineis' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da logo' },
  ],
  simbolo: [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
    { key: 'cor_texto', label: 'Cor do texto' },
    { key: 'cor_fundo_pagina', label: 'Cor do fundo da pagina' },
    { key: 'cor_fundo_logo', label: 'Cor do fundo atras da logo' },
  ],
  'secao-logo': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
  'secao-tipografia': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
  'secao-cores': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
  'secao-construcao': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
  'secao-usos-incorretos': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
  'secao-aplicacoes': [
    { key: 'cor_destaque', label: 'Cor de destaque' },
    { key: 'cor_paineis', label: 'Cor da linha inferior' },
    { key: 'cor_titulo', label: 'Cor do titulo' },
  ],
}

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
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="semantic-color-field">
        <input className="semantic-color-native" type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} />
        <span className="semantic-color-label">Livre</span>
        <input className="form-input semantic-color-input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
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
  const { page_appearance, setPageAppearance } = useBrandStore()
  const appearance = page_appearance[slideType]
  const fields = APPEARANCE_FIELDS[slideType]

  return (
    <DrawerSection title="Aparencia deste slide" description="Somente os controles que afetam esta pagina em especifico.">
      {fields.map((field) => (
        <DrawerColorField
          key={`${slideType}-${field.key}`}
          label={field.label}
          value={appearance[field.key]}
          onChange={(hex) => setPageAppearance(slideType, { [field.key]: hex })}
        />
      ))}
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
        {cores_logo.map((color) => (
          <div key={color.id} className="color-item">
            <input className="semantic-color-native" type="color" value={color.hex} onChange={(e) => handleHexChange(color, e.target.value.toUpperCase())} />

            <div className="color-inputs">
              <input className="form-input" style={{ height: 28, padding: '0 8px', fontSize: 12, fontFamily: "'Geist Mono', monospace" }} value={color.hex} onChange={(e) => handleHexChange(color, e.target.value)} placeholder="#FFFFFF" />
              <input className="color-meta-input" value={color.rgb} onChange={(e) => setCor('logo', color.id, { rgb: e.target.value })} placeholder="RGB: 255, 255, 255" />
              <input className="color-meta-input" value={color.hsl} onChange={(e) => setCor('logo', color.id, { hsl: e.target.value })} placeholder="HSL: 0deg, 0%, 0%" />
              <input className="color-meta-input" value={color.cmyk} onChange={(e) => setCor('logo', color.id, { cmyk: e.target.value })} placeholder="CMYK: 0, 0, 0, 0" />
            </div>

            <button type="button" className="btn-icon" onClick={() => removeCor('logo', color.id)} title="Remover cor">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
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
    <DrawerSection title="Tipografia usada neste slide" description={GLOBAL_SECTION_DESCRIPTION}>
      {(mode === 'primary' || mode === 'both') && (
        <>
          <div className="form-group">
            <label className="form-label">Fonte Principal</label>
            <input className="form-input" value={tipografia.principal_nome} onChange={(e) => setTipografia({ principal_nome: e.target.value })} placeholder="Ex: Geist, Inter, Montserrat" />
          </div>
          <div className="form-group">
            <label className="form-label">Estilos / Pesos da Principal</label>
            <input className="form-input" value={tipografia.principal_estilos} onChange={(e) => setTipografia({ principal_estilos: e.target.value })} placeholder="Ex: Light 300, Regular 400, Bold 700" />
          </div>
        </>
      )}

      {(mode === 'secondary' || mode === 'both') && (
        <>
          <div className="form-group">
            <label className="form-label">Fonte Secundaria</label>
            <input className="form-input" value={tipografia.secundaria_nome} onChange={(e) => setTipografia({ secundaria_nome: e.target.value })} placeholder="Ex: DM Sans, Space Grotesk, Mono" />
          </div>
          <div className="form-group">
            <label className="form-label">Estilos / Pesos da Secundaria</label>
            <input className="form-input" value={tipografia.secundaria_estilos} onChange={(e) => setTipografia({ secundaria_estilos: e.target.value })} placeholder="Ex: Regular 400, Medium 500" />
          </div>
        </>
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
    const typographyMode = pageLabel === 'Tipografia' ? 'both' : isPrimary ? 'primary' : 'secondary'

    return (
      <>
        {renderTypographySection(typographyMode)}
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
