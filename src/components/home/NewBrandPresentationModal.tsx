import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  PlusCircle,
  Upload,
  FileText,
  ArrowRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Sparkles,
  RefreshCcw,
  Wand2
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'
import { extractColorsFromDataUrl } from '../../lib/imageUtils'
import { isDark } from '../../lib/colorUtils'
import { FontUploadControl } from '../common/FontUploadControl'
import type { UploadedFontAsset } from '../../lib/fontUtils'
import { EMPTY_UPLOADED_FONT } from '../../lib/fontUtils'

type ModalView = 'choose' | 'info' | 'versions' | 'style' | 'typography'
type ProjectType = 'new' | 'rebranding'
type StyleTab = 'capa' | 'secao' | 'final' | 'fundos'

interface VersionData {
  explanation: string
  logoNew: string | null
  mockups: string[]
}

interface NewBrandPresentationModalProps {
  onClose: () => void
}

const TEXT_NEW = "Apresentamos a nova identidade visual desenvolvida para a marca, focada em transmitir solidez, modernidade e uma presença memorável no mercado através de uma linguagem visual contemporânea."
const TEXT_REBRANDING = "Apresentamos o reposicionamento visual da marca, modernizando seus elementos fundamentais e adaptando sua identidade para os desafios do mercado atual, sem perder sua essência histórica."

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

function StepIndicator({ current, total, labels }: { current: number; total: number; labels?: string[] }) {
  return (
    <div className="np-steps" style={{ gap: '12px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`np-step ${i + 1 === current ? 'active' : i + 1 < current ? 'done' : ''}`}>
          <div className="np-step-num-container">
            <span className="np-step-num">{i + 1}</span>
          </div>
          {labels && labels[i] && (
            <span className="np-step-label">{labels[i]}</span>
          )}
        </div>
      ))}
      <div className="np-step-line" />
    </div>
  )
}

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
  type: 'cover' | 'section' | 'final'
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
          <div className="np-slide-preview-section-title" style={{ color: title }}>Apresentação</div>
          <div className="np-slide-preview-section-bar" style={{ background: accent }} />
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
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target?.result as string)
    reader.readAsDataURL(file)
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

function AssetUploadCard({
  title,
  value,
  optional,
  onUpload,
  onRemove,
  compact
}: {
  title: string
  value: string | null
  optional?: boolean
  onUpload: (b64: string) => void
  onRemove: () => void
  compact?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={`np-asset-card ${value ? 'has-value' : ''}`} style={compact ? { padding: '10px 14px' } : {}}>
      <div className="np-asset-header">
        <span className="np-asset-title">{title}</span>
        {optional && <span className="np-asset-optional">Opcional</span>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {value ? (
        <div className="np-asset-preview-wrap" style={compact ? { height: '60px' } : {}}>
          <img src={value} alt={title} className="np-asset-preview" />
          <div className="np-asset-actions">
            <button type="button" className="np-asset-btn" onClick={() => fileRef.current?.click()} title="Trocar">
              <RefreshCcw size={12} />
            </button>
            <button type="button" className="np-asset-btn remove" onClick={onRemove} title="Remover">
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="np-asset-dropzone" onClick={() => fileRef.current?.click()} style={compact ? { height: '60px' } : {}}>
          <div className="np-dropzone-icon">
            <Upload size={compact ? 14 : 20} />
          </div>
          <span style={compact ? { fontSize: '9px' } : {}}>upload logo</span>
        </div>
      )}
    </div>
  )
}

export function NewBrandPresentationModal({ onClose }: NewBrandPresentationModalProps) {
  const { setScreen } = useAppStore()
  const { setPresentationData } = useBrandStore()

  // Navigation State
  const [view, setView] = useState<ModalView>('choose')
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)

  // Project Info State
  const [projectType, setProjectType] = useState<ProjectType>('new')
  const [showComparison, setShowComparison] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [clientName, setClientName] = useState('')
  const [logoAntigaGlobal, setLogoAntigaGlobal] = useState<string | null>(null)
  const [qtdVersions, setQtdVersions] = useState(3)

  // Versions Data State
  const [versions, setVersions] = useState<VersionData[]>(
    Array.from({ length: 10 }, () => ({
      explanation: '',
      logoNew: null,
      mockups: []
    }))
  )

  const mockupRef = useRef<HTMLInputElement>(null)

  // ── Style & Design State ──
  const [styleTab, setStyleTab] = useState<StyleTab>('capa')
  const [sampledColors, setSampledColors] = useState<string[]>([])
  
  const [capaFundo, setCapaFundo] = useState('#0C0C0C')
  const [capaDetalhe, setCapaDetalhe] = useState('#FFA300')
  const [secaoFundo, setSecaoFundo] = useState('#0C0C0C')
  const [secaoTitulo, setSecaoTitulo] = useState('#FFFFFF')
  const [secaoDetalhe, setSecaoDetalhe] = useState('#FFA300')
  const [finalFundo, setFinalFundo] = useState('#0C0C0C')
  const [finalTitulo, setFinalTitulo] = useState('#FFFFFF')
  const [finalTexto, setFinalTexto] = useState('#D4D4D4')
  const [finalDetalhe, setFinalDetalhe] = useState('#FFA300')
  const [bgCapaSecao, setBgCapaSecao] = useState<string | null>(null)
  const [bgConteudo, setBgConteudo] = useState<string | null>(null)

  // ── Typography State ──
  const [apresentacaoTitulosNome, setApresentacaoTitulosNome] = useState('')
  const [apresentacaoTitulosCustom, setApresentacaoTitulosCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)
  const [apresentacaoTextosNome, setApresentacaoTextosNome] = useState('')
  const [apresentacaoTextosCustom, setApresentacaoTextosCustom] = useState<UploadedFontAsset>(EMPTY_UPLOADED_FONT)

  // ── Modal Safety ──
  const handleSafeClose = () => {
    const hasData = brandName || versions.some(v => v.explanation || v.logoNew || v.mockups.length > 0)
    if (hasData) {
      if (window.confirm('Tem certeza que deseja fechar? Todo o progresso não salvo será perdido.')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleProjectTypeChange = (type: ProjectType) => {
    setProjectType(type)
    if (type === 'rebranding') setShowComparison(true)
  }

  const handleAdvanceFromInfo = () => {
    if (!brandName) return alert('Por favor, insira o nome da marca.')
    setView('versions')
  }

  const handleVersionNext = () => {
    if (currentVersionIndex < qtdVersions - 1) {
      setCurrentVersionIndex(prev => prev + 1)
    } else {
      handleExtractColors() // Attempt to extract colors from all logos
      setView('style')
    }
  }

  const handleStyleNext = () => {
    setView('typography')
  }

  const handleStyleBack = () => {
    setView('versions')
    setCurrentVersionIndex(qtdVersions - 1)
  }

  const handleTypographyBack = () => {
    setView('style')
  }

  const handleEnterEditor = () => {
    // Save everything to the store before switching screens
    setPresentationData({
      brand_name: brandName,
      client_name: clientName,
      project_type: projectType,
      original_logo: logoAntigaGlobal,
      versions: versions.slice(0, qtdVersions).map(v => ({
        explanation: v.explanation,
        logoNew: v.logoNew,
        mockups: v.mockups
      })),
      appearance: {
        capa: { fundo: capaFundo, detalhe: capaDetalhe },
        secao: { fundo: secaoFundo, titulo: secaoTitulo, detalhe: secaoDetalhe },
        final: { fundo: finalFundo, titulo: finalTitulo, texto: finalTexto, detalhe: finalDetalhe },
        fundos: { capaSecao: bgCapaSecao, conteudo: bgConteudo },
      },
      typography: {
        titulosNome: apresentacaoTitulosNome,
        titulosCustom: apresentacaoTitulosCustom,
        textosNome: apresentacaoTextosNome,
        textosCustom: apresentacaoTextosCustom,
      }
    })

    onClose()
    setScreen('brand-presentation')
  }

  const handleVersionBack = () => {
    if (currentVersionIndex > 0) {
      setCurrentVersionIndex(prev => prev - 1)
    } else {
      setView('info')
    }
  }

  const updateVersion = (data: Partial<VersionData>) => {
    setVersions(prev => {
      const newArr = [...prev]
      newArr[currentVersionIndex] = { ...newArr[currentVersionIndex], ...data }
      return newArr
    })
  }

  const handleExtractColors = async () => {
    const allLogos = versions.filter(v => v.logoNew).map(v => v.logoNew as string)
    if (allLogos.length === 0) return

    let combinedColors: string[] = []
    
    // Extract from all logos
    for (const dataUrl of allLogos) {
      const colors = await extractColorsFromDataUrl(dataUrl, 4)
      combinedColors.push(...colors.map(c => c.hex))
    }

    // Dedup and pick top
    const unique = [...new Set(combinedColors)]
    setSampledColors(unique)
    applyPalette(unique)
  }

  const applyPalette = (colors: string[]) => {
    if (colors.length === 0) return
    const main = colors[0]
    const dark = isDark(main)

    const defaultBg = dark ? '#FFFFFF' : '#0C0C0C'
    const defaultTitle = dark ? '#0C0C0C' : '#FFFFFF'
    const defaultText = dark ? '#1A1A1A' : '#D4D4D4'
    const defaultAccent = main

    setCapaFundo(defaultBg); setCapaDetalhe(defaultAccent)
    setSecaoFundo(defaultBg); setSecaoTitulo(defaultTitle); setSecaoDetalhe(defaultAccent)
    setFinalFundo(defaultBg); setFinalTitulo(defaultTitle); setFinalTexto(defaultText); setFinalDetalhe(defaultAccent)
  }

  const handleAddMockups = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        updateVersion({ mockups: [...versions[currentVersionIndex].mockups, ev.target?.result as string] })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  const removeMockup = (idx: number) => {
    updateVersion({ mockups: versions[currentVersionIndex].mockups.filter((_, i) => i !== idx) })
  }

  const isWide = view !== 'choose'
  const currentTotalSteps = 4 // Static steps: 1.Config, 2.Versions, 3.Style, 4.Typography
  const STEP_LABELS = ['Tipo de projeto', 'Versões da logo', 'Apresentação', 'Fonte']

  const STYLE_TABS: { id: StyleTab; label: string; desc: string }[] = [
    { id: 'capa', label: 'Capa', desc: 'Primeiro slide da apresentação' },
    { id: 'secao', label: 'Seção', desc: 'Slides divisórios de seção' },
    { id: 'final', label: 'Final', desc: 'Slide de encerramento' },
    { id: 'fundos', label: 'Fundos', desc: 'Texturas e imagens de fundo' },
  ]

  return (
    <div className="home-modal-overlay" onClick={handleSafeClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`np-modal ${isWide ? 'np-modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── CHOOSE VIEW ── */}
        {view === 'choose' && (
          <>
            <div className="np-modal-header">
              <div className="home-modal-icon"><FileText size={22} /></div>
              <div>
                <h3 className="home-modal-title">Apresentação de Marca</h3>
                <p className="np-modal-subtitle">Como você quer começar?</p>
              </div>
              <button type="button" className="np-close-btn" onClick={handleSafeClose}><X size={16} /></button>
            </div>

            <div className="np-options">
              <OptionCard
                icon={<PlusCircle size={20} />} title="Criar projeto"
                description="Preencha as informações da marca e use o prompt automático para gerar os textos com IA."
                badge="RECOMENDADO" onClick={() => setView('info')}
              />
              <OptionCard
                icon={<Upload size={20} />} title="Importar projeto"
                description="Carregue um arquivo .json exportado anteriormente e continue de onde parou."
                onClick={() => { }}
              />
              <OptionCard
                icon={<FileText size={20} />} title="Projeto em branco"
                description="Abra o editor com todos os campos vazios e configure tudo manualmente."
                onClick={() => {
                  onClose()
                  setScreen('brand-presentation')
                }}
              />
            </div>
          </>
        )}

        {/* ── INFO VIEW (Simplified & Centered) ── */}
        {view === 'info' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={() => setView('choose')}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Tipo de Projeto</h3>
                <p className="np-modal-subtitle">Defina os parâmetros básicos da apresentação</p>
              </div>
              <StepIndicator current={1} total={4} labels={STEP_LABELS} />
              <button type="button" className="np-close-btn" onClick={handleSafeClose}><X size={16} /></button>
            </div>

            <div className="np-form-centered">
              <div className="np-field-group">
                <label className="np-label">Tipo de Projeto</label>
                <div className="np-segmented-control">
                  <button
                    type="button"
                    className={`np-segment ${projectType === 'new' ? 'active' : ''}`}
                    onClick={() => handleProjectTypeChange('new')}
                  >
                    <Sparkles size={14} /> Nova Versão
                  </button>
                  <button
                    type="button"
                    className={`np-segment ${projectType === 'rebranding' ? 'active' : ''}`}
                    onClick={() => handleProjectTypeChange('rebranding')}
                  >
                    <RefreshCcw size={14} /> Rebranding
                  </button>
                </div>
              </div>

              <div className="np-field-group" style={{ margin: '0 auto', width: '100%', maxWidth: '540px' }}>
                <label className="np-label">Nome da Marca</label>
                <input
                  className="np-input"
                  type="text"
                  placeholder="Ex: TS Tools"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              <div className="np-field-group" style={{ margin: '0 auto', width: '100%', maxWidth: '540px' }}>
                <label className="np-label">Nome do Cliente</label>
                <input
                  className="np-input"
                  type="text"
                  placeholder="Ex: João Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="np-field-group">
                <label className="np-label">Quantas versões desenvolvidas?</label>
                <div className="np-version-selector" style={{ margin: '0 auto' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`np-version-btn ${qtdVersions === n ? 'active' : ''}`}
                      onClick={() => setQtdVersions(n)}
                      style={{ width: '44px' }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="np-checkbox-group" onClick={() => setShowComparison(!showComparison)}>
                <div className={`np-checkbox-box ${showComparison ? 'checked' : ''}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="np-checkbox-label">Habilitar comparativo de logos</span>
              </div>

              <AnimatePresence>
                {showComparison && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}
                  >
                    <AssetUploadCard
                      compact
                      title="Logo Antiga (Referência)"
                      value={logoAntigaGlobal}
                      onUpload={setLogoAntigaGlobal}
                      onRemove={() => setLogoAntigaGlobal(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="np-modal-footer">
              <button
                type="button"
                className="home-modal-btn home-modal-btn-primary"
                onClick={handleAdvanceFromInfo}
              >
                Avançar <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* ── VERSIONS VIEW ── */}
        {view === 'versions' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={handleVersionBack}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Versão {currentVersionIndex + 1}</h3>
                <p className="np-modal-subtitle">Assets da proposta {currentVersionIndex + 1}</p>
              </div>
              <StepIndicator current={2} total={4} labels={STEP_LABELS} />
              <button type="button" className="np-close-btn" onClick={handleSafeClose}><X size={16} /></button>
            </div>

            <div className="np-workspace-v3">
              <div className="np-row-top">
                <div className="np-card-glass np-editor-card" style={{ flex: 1.8, position: 'relative' }}>
                  <div className="np-editor-header">
                    <Sparkles size={16} className="vibe-icon" />
                    <span className="np-editor-tag">Conceito Criativo</span>
                    <button type="button" className="np-ia-btn-corner" title="Gerar com IA">
                      <Sparkles size={14} />
                      <span>Gerar com IA</span>
                    </button>
                  </div>

                  <div className="np-field-group">
                    <label className="np-label">Explicação da Proposta</label>
                    <textarea
                      className="np-input np-textarea"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                      placeholder="Descreva o conceito, as cores e a tipografia escolhida para esta versão específica..."
                      value={versions[currentVersionIndex].explanation}
                      onChange={(e) => updateVersion({ explanation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="np-logo-workspace">
                  <AssetUploadCard
                    title="Logo Nova"
                    value={versions[currentVersionIndex].logoNew}
                    onUpload={(b64) => updateVersion({ logoNew: b64 })}
                    onRemove={() => updateVersion({ logoNew: null })}
                  />
                </div>
              </div>

              <div className="np-row-bottom">
                <div className="np-card-glass np-mockups-panel-v3">
                  <div className="np-section-header">
                    <label className="np-label">Mockups de Aplicação</label>
                    <span className="np-count-badge">{versions[currentVersionIndex].mockups.length} / 10</span>
                  </div>

                  <div className="np-mockup-grid-v3">
                    {versions[currentVersionIndex].mockups.map((m, i) => (
                      <div key={i} className="np-mockup-item-v2">
                        <img src={m} alt={`Mockup ${i + 1}`} />
                        <button type="button" className="np-mockup-del" onClick={() => removeMockup(i)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {versions[currentVersionIndex].mockups.length < 10 && (
                      <button type="button" className="np-mockup-add-v3" onClick={() => mockupRef.current?.click()}>
                        <Plus size={24} />
                        <span>Adicionar Mockup</span>
                      </button>
                    )}
                  </div>
                  <input ref={mockupRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleAddMockups} />
                </div>
              </div>
            </div>

            <div className="np-modal-footer">
              <button
                type="button"
                className="home-modal-btn home-modal-btn-primary"
                onClick={handleVersionNext}
              >
                {currentVersionIndex < qtdVersions - 1 ? 'Próxima Versão' : 'Próximo (Layout)'} <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
        {/* ── STYLE VIEW (Apresentação) ── */}
        {view === 'style' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={handleStyleBack}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Estilo da Apresentação</h3>
                <p className="np-modal-subtitle">Personalize as cores e fundos da sua apresentação</p>
              </div>
              <StepIndicator current={3} total={4} labels={STEP_LABELS} />
              <button type="button" className="np-close-btn" onClick={handleSafeClose}><X size={16} /></button>
            </div>

            <div className="np-style-tabs">
              {STYLE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`np-style-tab ${styleTab === t.id ? 'active' : ''}`}
                  onClick={() => setStyleTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="np-style-tabpanel">
              {/* ── CAPA ── */}
              {styleTab === 'capa' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">{STYLE_TABS[0].desc}</p>
                    {sampledColors.length > 0 && (
                      <div className="np-sampled-row">
                        <span className="np-sampled-label">Da marca:</span>
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
                    <ColorField label="Cor dos Detalhes" color={capaDetalhe} onChange={setCapaDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="cover" bg={capaFundo} accent={capaDetalhe} title={capaDetalhe} logoSrc={versions[0].logoNew} />
                  </div>
                </div>
              )}

              {/* ── SEÇÃO ── */}
              {styleTab === 'secao' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">{STYLE_TABS[1].desc}</p>
                    <ColorField label="Fundo da Página" color={secaoFundo} onChange={setSecaoFundo} presets={sampledColors} />
                    <ColorField label="Cor do Título" color={secaoTitulo} onChange={setSecaoTitulo} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" color={secaoDetalhe} onChange={setSecaoDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="section" bg={secaoFundo} accent={secaoDetalhe} title={secaoTitulo} />
                  </div>
                </div>
              )}

              {/* ── FINAL ── */}
              {styleTab === 'final' && (
                <div className="np-style-layout">
                  <div className="np-style-fields">
                    <p className="np-style-desc">{STYLE_TABS[2].desc}</p>
                    <ColorField label="Fundo da Página" color={finalFundo} onChange={setFinalFundo} presets={sampledColors} />
                    <ColorField label="Cor do Título" color={finalTitulo} onChange={setFinalTitulo} presets={sampledColors} />
                    <ColorField label="Cor dos Textos" color={finalTexto} onChange={setFinalTexto} presets={sampledColors} />
                    <ColorField label="Cor dos Detalhes" color={finalDetalhe} onChange={setFinalDetalhe} presets={sampledColors} />
                  </div>
                  <div className="np-style-preview-col">
                    <span className="np-style-preview-label">Preview</span>
                    <SlidePreview type="final" bg={finalFundo} accent={finalDetalhe} title={finalTitulo} logoSrc={versions[0].logoNew} />
                  </div>
                </div>
              )}

              {/* ── FUNDOS ── */}
              {styleTab === 'fundos' && (
                <div className="np-style-fundos">
                  <p className="np-style-desc">{STYLE_TABS[3].desc}</p>
                  <BgUploadRow
                    label="Fundo de Destaque"
                    hint="Capa, Seções e Final"
                    value={bgCapaSecao}
                    onUpload={setBgCapaSecao}
                    onRemove={() => setBgCapaSecao(null)}
                  />
                  <BgUploadRow
                    label="Fundo de Conteúdo"
                    hint="Para slides informativos"
                    value={bgConteudo}
                    onUpload={setBgConteudo}
                    onRemove={() => setBgConteudo(null)}
                  />
                </div>
              )}
            </div>

            <div className="np-modal-footer">
              <button type="button" className="home-modal-btn home-modal-btn-primary" onClick={handleStyleNext}>
                Próximo: Fonte <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* ── TYPOGRAPHY VIEW (Fonte) ── */}
        {view === 'typography' && (
          <>
            <div className="np-modal-header">
              <button type="button" className="np-back-btn" onClick={handleTypographyBack}><ChevronLeft size={16} /></button>
              <div style={{ flex: 1 }}>
                <h3 className="home-modal-title">Fonte da Apresentação</h3>
                <p className="np-modal-subtitle">Escolha as fontes oficiais para o design do deck</p>
              </div>
              <StepIndicator current={4} total={4} labels={STEP_LABELS} />
              <button type="button" className="np-close-btn" onClick={handleSafeClose}><X size={16} /></button>
            </div>

            <div className="np-style-tabpanel" style={{ padding: '24px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
                <FontUploadControl
                  title="Títulos da Apresentação"
                  name={apresentacaoTitulosNome}
                  customFont={apresentacaoTitulosCustom}
                  onNameChange={setApresentacaoTitulosNome}
                  onCustomFontChange={setApresentacaoTitulosCustom}
                  placeholder="Ex: Sora, Montserrat"
                  previewFallback="sans-serif"
                />
                <FontUploadControl
                  title="Textos da Apresentação"
                  name={apresentacaoTextosNome}
                  customFont={apresentacaoTextosCustom}
                  onNameChange={setApresentacaoTextosNome}
                  onCustomFontChange={setApresentacaoTextosCustom}
                  placeholder="Ex: DMSans, Inter"
                  previewFallback="sans-serif"
                />
              </div>
            </div>

            <div className="np-modal-footer">
              <button type="button" className="home-modal-btn home-modal-btn-primary" onClick={handleEnterEditor}>
                Gerar Apresentação <Sparkles size={14} />
              </button>
            </div>
          </>
        )}
      </motion.div>

      <style>{`
        .np-version-selector {
          display: flex;
          gap: 8px;
        }
        .np-version-btn {
          flex: 1;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .np-version-btn.active {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
          box-shadow: 0 0 10px rgba(255, 163, 0, 0.3);
        }
        .np-mockup-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }
        .np-mockup-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
        }
        .np-mockup-item img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
        .np-mockup-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .np-mockup-add {
          aspect-ratio: 1;
          border-radius: 8px;
          border: 1px dashed var(--glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .np-mockup-add span { font-size: 10px; font-weight: 500; }
        .np-mockup-add:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </div>
  )
}
