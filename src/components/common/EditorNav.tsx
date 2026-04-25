import { useState } from 'react'
import { ChevronLeft, AlertTriangle, Download } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'

export function EditorNav() {
  const { setScreen, hasUnsavedChanges, screen } = useAppStore()
  const { exportJson, projeto, presentation_data } = useBrandStore()
  const [showExitModal, setShowExitModal] = useState(false)

  const isPresentation = screen === 'brand-presentation'
  const isCustom = screen === 'custom-presentation'
  const projectName = isPresentation ? presentation_data.brand_name : projeto.nome_marca

  const getBreadcrumbs = () => {
    if (isCustom) {
      return <span className="editor-nav-crumb-current">Apresentação Personalizada</span>
    }
    if (isPresentation) {
      return (
        <span className="editor-nav-crumb-current">
          Apresentação de Logo{projectName ? ` - ${projectName}` : ''}
        </span>
      )
    }
    return (
      <>
        <span className="editor-nav-crumb-current">Manual de Marca</span>
        {projectName && (
          <>
            <span className="editor-nav-crumb-sep">/</span>
            <span className="editor-nav-crumb-project">{projectName}</span>
          </>
        )}
      </>
    )
  }

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
    } else {
      setScreen('home')
    }
  }

  const handleSaveAndExit = () => {
    exportJson(screen)
    setShowExitModal(false)
    setScreen('home')
  }

  const handleExitWithoutSaving = () => {
    setShowExitModal(false)
    setScreen('home')
  }

  return (
    <>
      <nav className="editor-nav">
        <button
          type="button"
          className="editor-nav-back"
          onClick={handleBackClick}
          aria-label="Voltar ao menu principal"
        >
          <ChevronLeft size={16} />
          <span>Menu</span>
        </button>

        <div className="editor-nav-breadcrumb">
          <span className="editor-nav-crumb-parent">TS BRUSH</span>
          <span className="editor-nav-crumb-sep">/</span>
          {getBreadcrumbs()}
        </div>
      </nav>

      {/* Exit confirmation modal */}
      {showExitModal && (
        <div className="home-modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="home-modal" onClick={(e) => e.stopPropagation()}>
            <div className="home-modal-icon home-modal-icon-warning">
              <AlertTriangle size={22} />
            </div>
            <h3 className="home-modal-title">Sair sem salvar?</h3>
            <p className="home-modal-subtitle">
              Você tem alterações não salvas no projeto
              {projectName ? <strong> "{projectName}"</strong> : ''}.
              {' '}Exporte o arquivo .json para não perder seu trabalho.
            </p>
            <div className="home-modal-actions">
              <button
                type="button"
                className="home-modal-btn home-modal-btn-danger"
                onClick={handleExitWithoutSaving}
              >
                Sair sem salvar
              </button>
              <button
                type="button"
                className="home-modal-btn home-modal-btn-secondary"
                onClick={() => setShowExitModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="home-modal-btn home-modal-btn-primary"
                onClick={handleSaveAndExit}
              >
                <Download size={14} />
                Salvar e sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
