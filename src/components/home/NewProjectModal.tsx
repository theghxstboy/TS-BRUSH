import { useEffect, useRef, useState } from 'react'
import {
  PlusCircle,
  Upload,
  FileText,
  ChevronLeft,
  ExternalLink,
  Wand2,
  ArrowRight,
  X,
  Trash2,
  ImageIcon,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import type { UploadedFontAsset } from '../../lib/fontUtils'
import { EMPTY_UPLOADED_FONT } from '../../lib/fontUtils'
import { FontUploadControl } from '../common/FontUploadControl'

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalView = 'choose' | 'create' | 'typography-brand' | 'style' | 'typography-layout'
type StyleTab = 'capa' | 'secao' | 'conteudo' | 'final' | 'fundos' | 'mockups'

import { extractColorsFromDataUrl } from '../../lib/imageUtils'
import { isDark, getLuminance } from '../../lib/colorUtils'
import type { BrandColor } from '../../store/useBrandStore'

// ─── Color extraction from logo ──────────────────────────────────────────────

// Removed manual sampleColors to use exact extraction from lib

// ─── Helper ───────────────────────────────────────────────────────────────────

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Mini Slide Preview ───────────────────────────────────────────────────────

function SlidePreview({
  bg,
  accent,
  title,
  text,
  logoSrc,
  type,
}: {
  bg: string
  accent: string
  title: string
  text?: string
  logoSrc?: string | null
  type: 'cover' | 'section' | 'content' | 'final'
}) {
  return (
    <div
      className="np-slide-preview"
      style={{ background: bg }}
    >
      {type === 'cover' && (
        <>
          <div className="np-slide-preview-accent-bar" style={{ background: accent }} />
          {logoSrc ? (
            <img src={logoSrc} alt="logo" className="np-slide-preview-logo" />
          ) : (
            <div className="np-slide-preview-logo-placeholder" style={{ borderColor: accent }} />
          )}
          <div className="np-slide-preview-title-block" style={{ color: title }}>
            <div className="np-slide-preview-brand-line" style={{ background: accent }} />
            <div className="np-slide-preview-brand-txt" style={{ background: title }} />
          </div>
        </>
      )}
      {type === 'section' && (
        <>
          <div className="np-slide-preview-section-num" style={{ color: accent, borderColor: accent }}>01</div>
          <div className="np-slide-preview-section-title" style={{ color: title }}>Tipografia</div>
          <div className="np-slide-preview-section-bar" style={{ background: accent }} />
        </>
      )}
      {type === 'content' && (
        <>
          <div className="np-slide-preview-content-header" style={{ background: accent }} />
          <div className="np-slide-preview-content-title" style={{ background: title }} />
          <div className="np-slide-preview-content-text" style={{ background: text ?? '#888' }} />
          <div className="np-slide-preview-content-text np-slide-preview-content-text-sm" style={{ background: text ?? '#888' }} />
        </>
      )}
      {type === 'final' && (
        <>
          {logoSrc ? (
            <img src={logoSrc} alt="logo" className="np-slide-preview-logo np-slide-preview-logo-final" />
          ) : (
            <div className="np-slide-preview-logo-placeholder" style={{ borderColor: accent }} />
          )}
          <div className="np-slide-preview-final-title" style={{ color: title }}>Obrigado</div>
          <div className="np-slide-preview-final-bar" style={{ background: accent }} />
        </>
      )}
    </div>
  )
}

// ─── ColorField ───────────────────────────────────────────────────────────────

function ColorField({
  label,
  hint,
  color,
  onChange,
  presets,
}: {
  label: string
  hint?: string
  color: string
  onChange: (hex: string) => void
  presets?: string[]
}) {
  const safeColor = color && /^#[0-9A-Fa-f]{6}$/i.test(color) ? color : '#000000'
  return (
    <div className="np-color-field">
      <div className="np-color-field-header">
        <label className="np-color-label">{label}</label>
        {hint && <span className="np-color-hint">{hint}</span>}
      </div>
      <div className="semantic-color-field">
        <input
          className="semantic-color-native"
          type="color"
          value={safeColor}
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
      {presets && presets.length > 0 && (
        <div className="np-color-presets">
          {presets.map((c) => (
            <button
              key={c}
              type="button"
              className={`np-color-preset-dot ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              title={c}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Asset Upload Card ────────────────────────────────────────────────────────

function AssetUploadCard({
  title,
  optional,
  value,
  onUpload,
  onRemove,
}: {
  title: string
  optional?: boolean
  value: string | null
  onUpload: (base64: string) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(await readFileAsBase64(file))
  }
  return (
    <div className="np-asset-card">
      <div className="np-asset-header">
        <span className="np-asset-title">{title}</span>
        {optional && <span className="np-asset-optional">(Opcional)</span>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value ? (
        <div className="np-asset-preview-wrap">
          <img src={value} alt={title} className="np-asset-preview" />
          <button type="button" className="np-asset-remove" onClick={onRemove}>
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        <div className="np-asset-dropzone" onClick={() => fileRef.current?.click()}>
          <Upload size={20} />
          <span>Fazer upload</span>
        </div>
      )}
    </div>
  )
}

// ─── Bg Upload Row ────────────────────────────────────────────────────────────

function BgUploadRow({
  label,
  hint,
  value,
  onUpload,
  onRemove,
}: {
  label: string
  hint: string
  value: string | null
  onUpload: (b64: string) => void
  onRemove: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(await readFileAsBase64(file))
  }
  return (
    <div className="np-bg-row">
      <div className="np-bg-row-info">
        <span className="np-bg-row-label">{label}</span>
        <span className="np-bg-row-hint">{hint}</span>
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value ? (
        <div className="np-bg-row-right">
          <div className="np-bg-row-thumb" style={{ backgroundImage: `url(${value})` }} />
          <button type="button" className="np-bg-row-remove" onClick={onRemove}>
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        <button type="button" className="np-bg-row-btn" onClick={() => ref.current?.click()}>
          <Upload size={13} />
          Upload
        </button>
      )}
    </div>
  )
}

// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({ icon, title, description, badge, onClick }: {
  icon: React.ReactNode; title: string; description: string; badge?: string; onClick: () => void
}) {
  return (
    <button type="button" className="np-option-card" onClick={onClick}>
      <div className="np-option-icon">{icon}</div>
      <div className="np-option-body">
        <div className="np-option-header">
          <span className="np-option-title">{title}</span>
          {badge && <span className="np-option-badge">{badge}</span>}
        </div>
        <p className="np-option-description">{description}</p>
      </div>
      <ArrowRight size={16} className="np-option-arrow" />
    </button>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="np-steps">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={`np-step ${n === current ? 'active' : n < current ? 'done' : ''}`}>
          <span className="np-step-num">{n}</span>
          <span className="np-step-label" style={{ textAlign: 'center' }}>
            {n === 1 ? 'Marca' : 
             n === 2 ? 'Tipografia' : 
             n === 3 ? 'Apresentação' : 
             <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
               Fonte
               <span style={{ fontSize: '8px', opacity: 0.7, fontWeight: 500 }}>(Apresentação)</span>
             </span>}
          </span>
        </div>
      ))}
      <div className="np-step-line" />
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface NewProjectModalProps { onClose: () => void }

export function NewProjectModal({ onClose }: NewProjectModalProps) {
  const { setProjeto, setConteudoPdf, setTipografia, setAsset, setAparencia, addMockup, importJson, reset } = useBrandStore()
  const { setScreen } = useAppStore()
  const importRef = useRef<HTMLInputElement>(null)
  const mockupRef = useRef<HTMLInputElement>(null)

  const [view, setView] = useState<ModalView>('choose')
  const [styleTab, setStyleTab] = useState<StyleTab>('capa')

  // ── Step 1 ─────────────────────────────────────────────────────────────────
  const [nomeMarca, setNomeMarca] = useState('')
  const [conceito, setConceito] = useState('')
  const [caracteristicas, setCaracteristicas] = useState('')
  const [valores, setValores] = useState('')
  const [sensacoes, setSensacoes] = useState('')
  const [elementos, setElementos] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [logoPrincipal, setLogoPrincipal] = useState<string | null>(null)
  const [logoVariante, setLogoVariante] = useState<string | null>(null)
  const [logoIcone, setLogoIcone] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState('')

  // ── Step 2: colors ─────────────────────────────────────────────────────────
  const [sampledColors, setSampledColors] = useState<string[]>([])
  const [extractedBrandColors, setExtractedBrandColors] = useState<Omit<BrandColor, 'id'>[]>([])
  const [capaFundo, setCapaFundo] = useState('#0C0C0C')
  const [capaDetalhe, setCapaDetalhe] = useState('#FFA300')
  const [secaoFundo, setSecaoFundo] = useState('#0C0C0C')
  const [secaoTitulo, setSecaoTitulo] = useState('#FFFFFF')
  const [secaoDetalhe, setSecaoDetalhe] = useState('#FFA300')
  const [conteudoFundo, setConteudoFundo] = useState('#141414')
  const [conteudoTitulo, setConteudoTitulo] = useState('#FFFFFF')
  const [conteudoTexto, setConteudoTexto] = useState('#D4D4D4')
  const [conteudoDetalhe, setConteudoDetalhe] = useState('#FFA300')
  const [finalFundo, setFinalFundo] = useState('#0C0C0C')
  const [finalTitulo, setFinalTitulo] = useState('#FFFFFF')
  const [finalTexto, setFinalTexto] = useState('#D4D4D4')
  const [finalDetalhe, setFinalDetalhe] = useState('#FFA300')
  const [bgCapaSecao, setBgCapaSecao] = useState<string | null>(null)
  const [bgConteudo, setBgConteudo] = useState<string | null>(null)

  // ── Step 3: mockups ────────────────────────────────────────────────────────
  const [mockups, setMockups] = useState<string[]>([])

  // ── Step 2: tipografia da marca ─────────────────────────────────────────────
  const [tipoPrincipalNome, setTipoPrincipalNome] = useState('')
  const [tipoPrincipalEstilos, setTipoPrincipalEstilos] = useState('')
  const [tipoPrincipalCustom, setTipoPrincipalCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)

  const [tipoSecundariaNome, setTipoSecundariaNome] = useState('')
  const [tipoSecundariaEstilos, setTipoSecundariaEstilos] = useState('')
  const [tipoSecundariaCustom, setTipoSecundariaCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)

  // ── Step 4: tipografia da apresentação ──────────────────────────────────────
  const [apresentacaoTitulosNome, setApresentacaoTitulosNome] = useState('')
  const [apresentacaoTitulosCustom, setApresentacaoTitulosCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)

  const [apresentacaoTextosNome, setApresentacaoTextosNome] = useState('')
  const [apresentacaoTextosCustom, setApresentacaoTextosCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)


  // Apply detected colors to all states
  const applyPalette = (colors: string[]) => {
    if (colors.length === 0) return

    // 1. Identify main color
    const brandMain = colors[0]
    
    // 2. Decide background based on main color lightness
    const mainIsDark = brandMain ? isDark(brandMain) : false
    
    // If brand is light (like yellow), use dark background. If brand is dark, use light background.
    const defaultBg = mainIsDark ? '#FFFFFF' : '#0C0C0C'
    const defaultTitle = mainIsDark ? '#0C0C0C' : '#FFFFFF'
    const defaultText = mainIsDark ? '#1A1A1A' : '#D4D4D4'
    const defaultAccent = brandMain
    
    // Content can have a slightly different feel (e.g. softer dark or silver light)
    const contentBg = mainIsDark ? '#F5F5F5' : '#141414'
    
    setCapaFundo(defaultBg); setCapaDetalhe(defaultAccent)
    setSecaoFundo(defaultBg); setSecaoTitulo(defaultTitle); setSecaoDetalhe(defaultAccent)
    setConteudoFundo(contentBg); setConteudoTitulo(defaultTitle); setConteudoTexto(defaultText); setConteudoDetalhe(defaultAccent)
    setFinalFundo(defaultBg); setFinalTitulo(defaultTitle); setFinalTexto(defaultText); setFinalDetalhe(defaultAccent)
  }

  // Extract colors from logo
  useEffect(() => {
    if (!logoPrincipal) return
    extractColorsFromDataUrl(logoPrincipal, 5).then((colors) => {
      setExtractedBrandColors(colors)
      const hexes = colors.map((c) => c.hex)
      setSampledColors(hexes)
      // Only auto-apply if we haven't set custom colors yet or if it's the first run
      if (hexes.length > 0) applyPalette(hexes)
    })
  }, [logoPrincipal])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const { showAlert } = useAppStore()

  function handleConfirmClose() {
    const hasData = nomeMarca || conceito || caracteristicas || valores || sensacoes || elementos || responsavel || aiResponse;
    if (hasData) {
      showAlert({
        type: 'confirm',
        title: 'Progresso não salvo',
        message: 'Você tem progresso não salvo. Deseja realmente fechar e perder os dados?',
        confirmLabel: 'Sim, fechar',
        cancelLabel: 'Continuar editando',
        onConfirm: () => onClose(),
      })
    } else {
      onClose()
    }
  }

  function handleBlankProject() { reset(); onClose(); setScreen('brand-manual') }
  function handleImportFile(file: File) { importJson(file); onClose(); setScreen('brand-manual') }

  function handleApplyAiResponse() {
    try {
      const cleaned = aiResponse.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
      const parsed = JSON.parse(cleaned) as {
        projeto?: Record<string, unknown>
        conteudo_pdf?: Record<string, unknown>
        tipografia?: Record<string, unknown>
      }
      if (parsed.projeto) {
        const brandName = typeof parsed.projeto.nome_marca === 'string' ? parsed.projeto.nome_marca : nomeMarca
        setNomeMarca(brandName)
        setConceito(typeof parsed.projeto.conceito === 'string' ? parsed.projeto.conceito : conceito)
        setCaracteristicas(typeof parsed.projeto.caracteristicas_marca === 'string' ? parsed.projeto.caracteristicas_marca : caracteristicas)
        setValores(typeof parsed.projeto.valores_marca === 'string' ? parsed.projeto.valores_marca : valores)
        setSensacoes(typeof parsed.projeto.sensacoes_cores === 'string' ? parsed.projeto.sensacoes_cores : sensacoes)
        setElementos(typeof parsed.projeto.elementos_logo === 'string' ? parsed.projeto.elementos_logo : elementos)
        setResponsavel(typeof parsed.projeto.responsavel_manual === 'string' ? parsed.projeto.responsavel_manual : responsavel)
        
        setProjeto({
          nome_marca: brandName,
          conceito: typeof parsed.projeto.conceito === 'string' ? parsed.projeto.conceito : '',
          caracteristicas_marca: typeof parsed.projeto.caracteristicas_marca === 'string' ? parsed.projeto.caracteristicas_marca : '',
          valores_marca: typeof parsed.projeto.valores_marca === 'string' ? parsed.projeto.valores_marca : '',
          sensacoes_cores: typeof parsed.projeto.sensacoes_cores === 'string' ? parsed.projeto.sensacoes_cores : '',
          elementos_logo: typeof parsed.projeto.elementos_logo === 'string' ? parsed.projeto.elementos_logo : '',
          responsavel_manual: typeof parsed.projeto.responsavel_manual === 'string' ? parsed.projeto.responsavel_manual : '',
        })
      }
      if (parsed.tipografia) {
        setTipoPrincipalEstilos(typeof parsed.tipografia.principal_estilos === 'string' ? parsed.tipografia.principal_estilos : '')
        setTipoSecundariaEstilos(typeof parsed.tipografia.secundaria_estilos === 'string' ? parsed.tipografia.secundaria_estilos : '')
      }
      if (parsed.conteudo_pdf) {
        setConteudoPdf(
          (Object.fromEntries(Object.entries(parsed.conteudo_pdf).filter(([, v]) => typeof v === 'string'))) as Parameters<typeof setConteudoPdf>[0],
        )
      }
      toast.success('Textos aplicados com sucesso!')
      setAiResponse('')
    } catch {
      toast.error('Resposta inválida. Cole exatamente o JSON retornado pelo Gem.')
    }
  }

  function handleAdvanceToBrandTypography() {
    reset()
    if (nomeMarca) setProjeto({ nome_marca: nomeMarca })
    if (conceito) setProjeto({ conceito })
    if (caracteristicas) setProjeto({ caracteristicas_marca: caracteristicas })
    if (valores) setProjeto({ valores_marca: valores })
    if (sensacoes) setProjeto({ sensacoes_cores: sensacoes })
    if (elementos) setProjeto({ elementos_logo: elementos })
    if (responsavel) setProjeto({ responsavel_manual: responsavel })
    if (logoPrincipal) setAsset('logo_principal', logoPrincipal)
    if (logoVariante) setAsset('logo_monocromatica', logoVariante)
    if (logoIcone) setAsset('logo_simbolo', logoIcone)
    setView('typography-brand')
  }

  function handleAdvanceToStyle() {
    setView('style')
  }



  function handleAdvanceToLayoutTypography() {
    setView('typography-layout')
  }

  function handleEnterEditor() {
    const { replaceCores } = useBrandStore.getState()
    
    if (extractedBrandColors.length > 0) {
      replaceCores('logo', extractedBrandColors)
      replaceCores('apresentacao', extractedBrandColors)
    }

    setAparencia({
      capa: { cor_fundo_pagina: capaFundo, cor_detalhes: capaDetalhe, imagem_fundo: bgCapaSecao, imagem_fundo_opacidade: 0.16 },
      secao: { cor_fundo_pagina: secaoFundo, cor_titulo: secaoTitulo, cor_detalhes: secaoDetalhe, imagem_fundo: bgCapaSecao, imagem_fundo_opacidade: 0.16 },
      conteudo: { cor_fundo_pagina: conteudoFundo, cor_titulo: conteudoTitulo, cor_texto: conteudoTexto, cor_detalhes: conteudoDetalhe, cor_sombra: 'rgba(0,0,0,0.4)', imagem_fundo: bgConteudo, imagem_fundo_opacidade: 0.16 },
      final: { cor_fundo_pagina: finalFundo, cor_titulo: finalTitulo, cor_texto: finalTexto, cor_detalhes: finalDetalhe, cor_sombra: 'rgba(0,0,0,0.4)', imagem_fundo: bgCapaSecao, imagem_fundo_opacidade: 0.16 },
    })
    mockups.forEach((m) => addMockup(m))

    // Brand Typography
    if (tipoPrincipalNome || tipoPrincipalEstilos || tipoPrincipalCustom.data_url || tipoSecundariaNome || tipoSecundariaEstilos || tipoSecundariaCustom.data_url) {
      setTipografia({
        principal_nome: tipoPrincipalNome,
        principal_estilos: tipoPrincipalEstilos,
        principal_custom: tipoPrincipalCustom,
        secundaria_nome: tipoSecundariaNome,
        secundaria_estilos: tipoSecundariaEstilos,
        secundaria_custom: tipoSecundariaCustom,
      })
    }

    // Layout typography
    if (apresentacaoTitulosNome || apresentacaoTitulosCustom.data_url || apresentacaoTextosNome || apresentacaoTextosCustom.data_url) {
      setTipografia({
        apresentacao_titulos: apresentacaoTitulosNome,
        apresentacao_titulos_custom: apresentacaoTitulosCustom,
        apresentacao_textos: apresentacaoTextosNome,
        apresentacao_textos_custom: apresentacaoTextosCustom,      
      })
    }

    onClose()
    setScreen('brand-manual')
  }

  async function handleAddMockup(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) {
      const b64 = await readFileAsBase64(file)
      setMockups((prev) => [...prev, b64])
    }
    e.target.value = ''
  }

  // ─── Style-tab metadata ──────────────────────────────────────────────────

  const STYLE_TABS: { id: StyleTab; label: string; desc: string }[] = [
    { id: 'capa', label: 'Capa', desc: 'Primeiro slide da apresentação' },
    { id: 'secao', label: 'Seção', desc: 'Slides divisórios de seção' },
    { id: 'conteudo', label: 'Conteúdo', desc: 'Slides informativos e de texto' },
    { id: 'final', label: 'Final', desc: 'Slide de encerramento' },
    { id: 'fundos', label: 'Fundos', desc: 'Texturas e imagens de fundo' },
    { id: 'mockups', label: 'Mockups', desc: 'Imagens de aplicação da marca' },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────────

  const isWide = view !== 'choose'

  return (
    <div className="home-modal-overlay">
      <div
        className={`np-modal ${isWide ? 'np-modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── CHOOSE VIEW ── */}
        {view === 'choose' && (
          <>
            <div className="np-modal-header">
              <div className="home-modal-icon"><FileText size={22} /></div>
              <div>
                <h3 className="home-modal-title">Manual de Marca</h3>
                <p className="np-modal-subtitle">Como você quer começar?</p>
              </div>
              <button type="button" className="np-close-btn" onClick={handleConfirmClose}><X size={16} /></button>
            </div>
            <div className="np-options">
              <OptionCard icon={<PlusCircle size={20} />} title="Criar projeto"
                description="Preencha as informações da marca e use o prompt automático para gerar os textos com IA."
                badge="Recomendado" onClick={() => setView('create')} />
              <OptionCard icon={<Upload size={20} />} title="Importar projeto"
                description="Carregue um arquivo .json exportado anteriormente e continue de onde parou."
                onClick={() => importRef.current?.click()} />
              <OptionCard icon={<FileText size={20} />} title="Projeto em branco"
                description="Abra o editor com todos os campos vazios e configure tudo manualmente."
                onClick={handleBlankProject} />
            </div>
            <input ref={importRef} type="file" accept=".json,application/json" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = '' }} />
          </>
        )}

        {/* ── CREATE VIEW (step 1) ── */}
        {view === 'create' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={() => setView('choose')}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Criar projeto</h3>
                <p className="np-modal-subtitle">Preencha as informações básicas da marca</p>
              </div>
              <StepIndicator current={1} />
              <button type="button" className="np-close-btn" onClick={handleConfirmClose}><X size={16} /></button>
            </div>

            <div className="np-form-grid">
              <div className="np-form-fields">
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-nome-marca">Nome da Marca <span className="np-required">*</span></label>
                  <input id="np-nome-marca" className="np-input" type="text" placeholder="Ex: TS Tools" value={nomeMarca} onChange={(e) => setNomeMarca(e.target.value)} />
                </div>
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-conceito">Conceito / Tagline</label>
                  <input id="np-conceito" className="np-input" type="text" placeholder="Ex: Inteligência que escala resultados" value={conceito} onChange={(e) => setConceito(e.target.value)} />
                </div>
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-caracteristicas">Características da Marca</label>
                  <input id="np-caracteristicas" className="np-input" type="text" placeholder="Ex: Inovadora, Premium, Confiável" value={caracteristicas} onChange={(e) => setCaracteristicas(e.target.value)} />
                </div>
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-valores">Valores da Marca</label>
                  <input id="np-valores" className="np-input" type="text" placeholder="Ex: Excelência, Clareza, Resultados" value={valores} onChange={(e) => setValores(e.target.value)} />
                </div>
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-sensacoes">Sensações das Cores</label>
                  <input id="np-sensacoes" className="np-input" type="text" placeholder="Ex: Energia, Confiança, Sofisticação" value={sensacoes} onChange={(e) => setSensacoes(e.target.value)} />
                </div>
                <div className="np-field-group">
                  <label className="np-label" htmlFor="np-elementos">Elementos do Logo</label>
                  <textarea id="np-elementos" className="np-input np-textarea" placeholder="Ex: Símbolo geométrico abstrato&#10;Tipografia sans-serif bold" value={elementos} onChange={(e) => setElementos(e.target.value)} />
                </div>
              </div>

              <div className="np-assets-panel">
                <AssetUploadCard title="Logo Principal" value={logoPrincipal} onUpload={setLogoPrincipal} onRemove={() => setLogoPrincipal(null)} />
                <AssetUploadCard title="Monocromático" optional value={logoVariante} onUpload={setLogoVariante} onRemove={() => setLogoVariante(null)} />
                <AssetUploadCard title="Ícone / Símbolo" optional value={logoIcone} onUpload={setLogoIcone} onRemove={() => setLogoIcone(null)} />
              </div>

              <div className="np-ai-panel">
                <div className="np-ai-panel-header">
                  <div className="np-ai-badge"><span className="np-ai-dot" />Geração com IA</div>
                  <p className="np-ai-description">Acesse o <strong>Gem exclusivo</strong> da TS, anexe a logo da marca e cole aqui o JSON retornado para preencher todos os campos automaticamente.</p>
                </div>
                <a href="https://gemini.google.com/gem/1_0L-aHhgw6bM0Vevls_IOg4CQnYA5AFi?usp=sharing" target="_blank" rel="noopener noreferrer" className="np-ai-copy-btn">
                  <ExternalLink size={14} />Abrir Gem — Gerador de Textos
                </a>
                <div className="np-ai-divider"><span>ou cole o JSON aqui</span></div>
                <textarea className="np-ai-textarea" placeholder='{"projeto": {"conceito": "...", ...}}' value={aiResponse} onChange={(e) => setAiResponse(e.target.value)} />
                <button type="button" className="np-ai-apply-btn" onClick={handleApplyAiResponse} disabled={!aiResponse.trim()}>
                  <Wand2 size={14} />Aplicar textos automáticos
                </button>
              </div>
            </div>

            <div className="np-modal-footer">
              <div className="np-modal-footer-left">
                <label className="np-label" htmlFor="np-responsavel">Responsável pelo Manual</label>
                <input id="np-responsavel" className="np-input" type="text" placeholder="Ex: TS Tools" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} style={{ height: '40px' }} />
              </div>
              <button type="button" className="home-modal-btn home-modal-btn-primary" onClick={handleAdvanceToBrandTypography}>
                Próximo: Tipografia <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* ── STYLE VIEW (step 2) ── */}
        {view === 'style' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={() => setView('typography-brand')}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Estilo Visual</h3>
                <p className="np-modal-subtitle">Personalize cada tipo de slide da apresentação</p>
              </div>
              <StepIndicator current={3} />
              <button type="button" className="np-close-btn" onClick={handleConfirmClose}><X size={16} /></button>
            </div>

            {/* Tab bar */}
            <div className="np-style-tabs">
              {STYLE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`np-style-tab ${styleTab === t.id ? 'active' : ''}`}
                  onClick={() => setStyleTab(t.id)}
                >
                  {t.label}
                  {t.id === 'mockups' && mockups.length > 0 && (
                    <span className="np-style-tab-badge">{mockups.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="np-style-tabpanel">
              {/* ── CAPA ── */}
              {styleTab === 'capa' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">Primeiro slide da apresentação — onde a logo e o nome da marca são apresentados.</p>
                    {sampledColors.length > 0 && (
                      <div className="np-sampled-row">
                        <span className="np-sampled-label">Da logo:</span>
                        <div className="np-sampled-dots">
                          {sampledColors.map((c) => (
                            <div key={c} className="np-sampled-dot" style={{ background: c }} title={c} />
                          ))}
                        </div>
                        <button type="button" className="np-sampled-apply" onClick={() => applyPalette(sampledColors)}>
                          <Wand2 size={11} />
                          Reaplicar
                        </button>
                      </div>
                    )}
                    <ColorField label="Fundo da Página" color={capaFundo} onChange={setCapaFundo} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" hint="Linhas, badges e elementos decorativos" color={capaDetalhe} onChange={setCapaDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="cover" bg={capaFundo} accent={capaDetalhe} title={capaDetalhe} logoSrc={logoPrincipal} />
                  </div>
                </div>
              )}

              {/* ── SEÇÃO ── */}
              {styleTab === 'secao' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">Slides de abertura de cada seção do manual (ex: "01 Tipografia", "02 Cores").</p>
                    {sampledColors.length > 0 && (
                      <div className="np-sampled-row">
                        <span className="np-sampled-label">Da logo:</span>
                        <div className="np-sampled-dots">
                          {sampledColors.map((c) => (
                            <div key={c} className="np-sampled-dot" style={{ background: c }} title={c} />
                          ))}
                        </div>
                        <button type="button" className="np-sampled-apply" onClick={() => applyPalette(sampledColors)}>
                          <Wand2 size={11} />
                          Reaplicar
                        </button>
                      </div>
                    )}
                    <ColorField label="Fundo da Página" color={secaoFundo} onChange={setSecaoFundo} presets={sampledColors} />
                    <ColorField label="Cor do Título" hint="Nome da seção" color={secaoTitulo} onChange={setSecaoTitulo} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" hint="Número e linha decorativa" color={secaoDetalhe} onChange={setSecaoDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="section" bg={secaoFundo} accent={secaoDetalhe} title={secaoTitulo} />
                  </div>
                </div>
              )}

              {/* ── CONTEÚDO ── */}
              {styleTab === 'conteudo' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">Slides de Bem-vindo, Sumário, Conceito, Tipografia, Cores, Logo etc.</p>
                    {sampledColors.length > 0 && (
                      <div className="np-sampled-row">
                        <span className="np-sampled-label">Da logo:</span>
                        <div className="np-sampled-dots">
                          {sampledColors.map((c) => (
                            <div key={c} className="np-sampled-dot" style={{ background: c }} title={c} />
                          ))}
                        </div>
                        <button type="button" className="np-sampled-apply" onClick={() => applyPalette(sampledColors)}>
                          <Wand2 size={11} />
                          Reaplicar
                        </button>
                      </div>
                    )}
                    <ColorField label="Fundo da Página" color={conteudoFundo} onChange={setConteudoFundo} presets={sampledColors} />
                    <ColorField label="Cor do Título" color={conteudoTitulo} onChange={setConteudoTitulo} presets={sampledColors} />
                    <ColorField label="Cor dos Textos" hint="Parágrafos e descrições" color={conteudoTexto} onChange={setConteudoTexto} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" hint="Badges, linhas e destaques" color={conteudoDetalhe} onChange={setConteudoDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="content" bg={conteudoFundo} accent={conteudoDetalhe} title={conteudoTitulo} text={conteudoTexto} />
                  </div>
                </div>
              )}

              {/* ── FINAL ── */}
              {styleTab === 'final' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">Slide de encerramento — geralmente exibe a logo e uma mensagem de agradecimento.</p>
                    {sampledColors.length > 0 && (
                      <div className="np-sampled-row">
                        <span className="np-sampled-label">Da logo:</span>
                        <div className="np-sampled-dots">
                          {sampledColors.map((c) => (
                            <div key={c} className="np-sampled-dot" style={{ background: c }} title={c} />
                          ))}
                        </div>
                        <button type="button" className="np-sampled-apply" onClick={() => applyPalette(sampledColors)}>
                          <Wand2 size={11} />
                          Reaplicar
                        </button>
                      </div>
                    )}
                    <ColorField label="Fundo da Página" color={finalFundo} onChange={setFinalFundo} presets={sampledColors} />
                    <ColorField label="Cor do Título" color={finalTitulo} onChange={setFinalTitulo} presets={sampledColors} />
                    <ColorField label="Cor dos Textos" color={finalTexto} onChange={setFinalTexto} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" color={finalDetalhe} onChange={setFinalDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="final" bg={finalFundo} accent={finalDetalhe} title={finalTitulo} logoSrc={logoPrincipal} />
                  </div>
                </div>
              )}

              {/* ── FUNDOS ── */}
              {styleTab === 'fundos' && (
                <div className="np-style-fundos">
                  <p className="np-style-desc">Adicione imagens aplicadas sutilmente como textura sobre os slides. Ambas são opcionais — os slides ficam sólidos se omitidas.</p>
                  <BgUploadRow
                    label="Fundo de Destaque"
                    hint="Aplicado na Capa, Seções e Slide Final"
                    value={bgCapaSecao}
                    onUpload={setBgCapaSecao}
                    onRemove={() => setBgCapaSecao(null)}
                  />
                  <BgUploadRow
                    label="Fundo de Conteúdo"
                    hint="Aplicado nos slides informativos e de texto"
                    value={bgConteudo}
                    onUpload={setBgConteudo}
                    onRemove={() => setBgConteudo(null)}
                  />
                </div>
              )}

              {/* ── MOCKUPS ── */}
              {styleTab === 'mockups' && (
                <div className="np-style-mockups">
                  <p className="np-style-desc">Adicione fotos de aplicação da marca — camisetas, cartões, embalagens, etc. Elas aparecerão no slide de Mockups da apresentação.</p>
                  <div className="np-mockup-grid">
                    {mockups.map((m, i) => (
                      <div key={i} className="np-mockup-thumb">
                        <img src={m} alt={`Mockup ${i + 1}`} />
                        <button
                          type="button"
                          className="np-mockup-remove"
                          onClick={() => setMockups((prev) => prev.filter((_, idx) => idx !== i))}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="np-mockup-add" onClick={() => mockupRef.current?.click()}>
                      <Plus size={20} />
                      <span>Adicionar</span>
                    </button>
                    <input
                      ref={mockupRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleAddMockup}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="np-modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="np-style-tab-prev"
                style={{ height: '40px', padding: '0 20px' }}
                onClick={() => {
                  const idx = STYLE_TABS.findIndex(t => t.id === styleTab)
                  if (idx > 0) setStyleTab(STYLE_TABS[idx - 1].id)
                }}
                disabled={styleTab === STYLE_TABS[0].id}
              >
                <ChevronLeft size={14} />
                {STYLE_TABS[Math.max(0, STYLE_TABS.findIndex(t => t.id === styleTab) - 1)].label}
              </button>
              
              <div className="np-style-tab-dots">
                {STYLE_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`np-style-tab-dot ${styleTab === t.id ? 'active' : ''}`}
                    onClick={() => setStyleTab(t.id)}
                    title={t.label}
                  />
                ))}
              </div>

              {styleTab !== STYLE_TABS[STYLE_TABS.length - 1].id ? (
                <button
                  type="button"
                  className="np-style-tab-next"
                  style={{ height: '40px', padding: '0 20px' }}
                  onClick={() => {
                    const idx = STYLE_TABS.findIndex(t => t.id === styleTab)
                    if (idx < STYLE_TABS.length - 1) setStyleTab(STYLE_TABS[idx + 1].id)
                  }}
                >
                  {STYLE_TABS[Math.min(STYLE_TABS.length - 1, STYLE_TABS.findIndex(t => t.id === styleTab) + 1)].label}
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  className="home-modal-btn home-modal-btn-primary"
                  onClick={handleAdvanceToLayoutTypography}
                >
                  Próximo <ArrowRight size={14} />
                </button>
              )}
            </div>
          </>
        )}

        {/* ── BRAND TYPOGRAPHY VIEW (step 2) ── */}
        {view === 'typography-brand' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={() => setView('create')}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Tipografia da Marca</h3>
                <p className="np-modal-subtitle">Configure as duas fontes oficias ou secundárias associadas unicamente à marca</p>
              </div>
              <StepIndicator current={2} />
              <button type="button" className="np-close-btn" onClick={handleConfirmClose}><X size={16} /></button>
            </div>

            <div className="np-style-tabpanel" style={{ padding: '24px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
                <FontUploadControl
                  title="Tipografia Principal"
                  name={tipoPrincipalNome}
                  styles={tipoPrincipalEstilos}
                  customFont={tipoPrincipalCustom}
                  onNameChange={setTipoPrincipalNome}
                  onStylesChange={setTipoPrincipalEstilos}
                  onCustomFontChange={setTipoPrincipalCustom}
                  placeholder="Ex: Inter, Roboto"
                  previewFallback="sans-serif"
                />
                <FontUploadControl
                  title="Tipografia Secundária"
                  optional
                  name={tipoSecundariaNome}
                  styles={tipoSecundariaEstilos}
                  customFont={tipoSecundariaCustom}
                  onNameChange={setTipoSecundariaNome}
                  onStylesChange={setTipoSecundariaEstilos}
                  onCustomFontChange={setTipoSecundariaCustom}
                  placeholder="Ex: Lora, Merriweather"
                  previewFallback="serif"
                />
              </div>
            </div>

            <div className="np-modal-footer">
              <button
                type="button"
                className="home-modal-btn home-modal-btn-primary"
                onClick={handleAdvanceToStyle}
              >
                Próximo (Estilo Visual) <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* ── LAYOUT TYPOGRAPHY VIEW (step 4) ── */}
        {view === 'typography-layout' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={() => setView('style')}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Tipografia da Apresentação</h3>
                <p className="np-modal-subtitle">Configure as fontes que serão aplicadas sobre o PDF globalmente</p>
              </div>
              <StepIndicator current={4} />
              <button type="button" className="np-close-btn" onClick={onClose}><X size={16} /></button>
            </div>

            <div className="np-style-tabpanel" style={{ padding: '24px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
                <FontUploadControl
                  title="Apresentação · Títulos"
                  name={apresentacaoTitulosNome}
                  customFont={apresentacaoTitulosCustom}
                  onNameChange={setApresentacaoTitulosNome}
                  onCustomFontChange={setApresentacaoTitulosCustom}
                  placeholder="Ex: Sora, Montserrat"
                  previewFallback="sans-serif"
                />
                <FontUploadControl
                  title="Apresentação · Textos"
                  name={apresentacaoTextosNome}
                  customFont={apresentacaoTextosCustom}
                  onNameChange={setApresentacaoTextosNome}
                  onCustomFontChange={setApresentacaoTextosCustom}
                  placeholder="Ex: DMSans, Outfit"
                  previewFallback="sans-serif"
                />
              </div>
            </div>

            <div className="np-modal-footer">
              <button
                type="button"
                className="home-modal-btn home-modal-btn-primary"
                onClick={handleEnterEditor}
              >
                Gerar Manual <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
