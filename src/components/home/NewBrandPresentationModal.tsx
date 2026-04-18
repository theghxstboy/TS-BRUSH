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
  RefreshCcw
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

type ModalView = 'choose' | 'info' | 'versions' | 'style' | 'typography'
type ProjectType = 'new' | 'rebranding'

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

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="np-steps" style={{ gap: '12px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`np-step ${i + 1 === current ? 'active' : i + 1 < current ? 'done' : ''}`}>
          <span className="np-step-num">{i + 1}</span>
        </div>
      ))}
      <div className="np-step-line" />
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
    <div className="np-asset-card" style={compact ? { padding: '10px 14px' } : {}}>
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
          <button type="button" className="np-asset-remove" onClick={onRemove}>
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="np-asset-dropzone" onClick={() => fileRef.current?.click()} style={compact ? { height: '60px' } : {}}>
          <Upload size={compact ? 14 : 18} />
          <span style={compact ? { fontSize: '9px' } : {}}>upload</span>
        </div>
      )}
    </div>
  )
}

export function NewBrandPresentationModal({ onClose }: NewBrandPresentationModalProps) {
  const { setScreen } = useAppStore()
  
  // Navigation State
  const [view, setView] = useState<ModalView>('choose')
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)

  // Project Info State
  const [projectType, setProjectType] = useState<ProjectType>('new')
  const [showComparison, setShowComparison] = useState(false)
  const [brandName, setBrandName] = useState('')
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
      // Advance to customization view
      alert('Avançando para personalização de estilo...')
    }
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
  const currentTotalSteps = 2 + qtdVersions // simplified indicator

  return (
    <div className="home-modal-overlay" onClick={onClose}>
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
              <button type="button" className="np-close-btn" onClick={onClose}><X size={16} /></button>
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
                onClick={() => {}} 
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
                <h3 className="home-modal-title">Configurações Iniciais</h3>
                <p className="np-modal-subtitle">Defina os parâmetros básicos da apresentação</p>
              </div>
              <StepIndicator current={1} total={currentTotalSteps - 1} />
              <button type="button" className="np-close-btn" onClick={onClose}><X size={16} /></button>
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

              <div className="np-field-group" style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                <label className="np-label">Nome da Marca</label>
                <input 
                  className="np-input" 
                  type="text" 
                  placeholder="Ex: TS Tools" 
                  value={brandName} 
                  onChange={(e) => setBrandName(e.target.value)} 
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
                <p className="np-modal-subtitle">Explicação e assets da proposta {currentVersionIndex + 1}</p>
              </div>
              <StepIndicator current={2 + currentVersionIndex} total={currentTotalSteps - 1} />
              <button type="button" className="np-close-btn" onClick={onClose}><X size={16} /></button>
            </div>

            <div className="np-form-grid">
              <div className="np-form-fields">
                <div className="np-field-group">
                  <label className="np-label">Explicação da Proposta</label>
                  <textarea 
                    className="np-input np-textarea" 
                    style={{ height: '140px' }}
                    placeholder="Descreva o conceito desta versão específica..."
                    value={versions[currentVersionIndex].explanation} 
                    onChange={(e) => updateVersion({ explanation: e.target.value })} 
                  />
                </div>

                <div className="np-field-group">
                   <label className="np-label">Mockups de Aplicação</label>
                   <div className="np-mockup-list" style={{ marginTop: '8px' }}>
                    {versions[currentVersionIndex].mockups.map((m, i) => (
                      <div key={i} className="np-mockup-item">
                        <img src={m} alt={`Mockup ${i + 1}`} />
                        <button type="button" className="np-mockup-remove" onClick={() => removeMockup(i)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="np-mockup-add" onClick={() => mockupRef.current?.click()}>
                      <Plus size={20} />
                      <span>Adicionar</span>
                    </button>
                    <input ref={mockupRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleAddMockups} />
                   </div>
                </div>
              </div>

              <div className="np-assets-panel">
                <AssetUploadCard 
                  title="Logo Nova" 
                  value={versions[currentVersionIndex].logoNew} 
                  onUpload={(b64) => updateVersion({ logoNew: b64 })} 
                  onRemove={() => updateVersion({ logoNew: null })} 
                />
                
                {showComparison && logoAntigaGlobal && (
                   <div className="np-asset-card" style={{ opacity: 0.6, background: 'rgba(255,255,255,0.01)' }}>
                      <div className="np-asset-header">
                        <span className="np-asset-title">Logo Antiga (Ref)</span>
                      </div>
                      <div className="np-asset-preview-wrap" style={{ height: '60px' }}>
                        <img src={logoAntigaGlobal} alt="Antiga" className="np-asset-preview" />
                      </div>
                   </div>
                )}
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
