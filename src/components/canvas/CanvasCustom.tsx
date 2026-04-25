import React, { useState } from 'react'
import type { CSSProperties } from 'react'
import { Trash2 } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { useCanvasScale } from './useCanvasScale'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'

// Templates Manual
import { TplCapa } from '../pages/classico/TplCapa'
import { TplBemVindo } from '../pages/classico/TplBemVindo'
import { TplSumario } from '../pages/classico/TplSumario'
import { TplSecao } from '../pages/classico/TplSecao'
import { TplConceito } from '../pages/classico/TplConceito'
import { TplTipografia } from '../pages/classico/TplTipografia'
import { TplPadraoCromatico } from '../pages/classico/TplPadraoCromatico'
import { TplVersaoMono } from '../pages/classico/TplVersaoMono'
import { TplElementos } from '../pages/classico/TplElementos'
import { TplAplicacaoFundos } from '../pages/classico/TplAplicacaoFundos'
import { TplUsosIncorretos } from '../pages/classico/TplUsosIncorretos'
import { TplAplicacaoMockup } from '../pages/classico/TplAplicacaoMockup'
import { TplFinal } from '../pages/classico/TplFinal'

// Templates Presentation
import { PresCapa } from '../pages/presentation/PresCapa'
import { PresSecao } from '../pages/presentation/PresSecao'
import { PresConceptLogo } from '../pages/presentation/PresConceptLogo'
import { PresComparison } from '../pages/presentation/PresComparison'
import { PresMockup } from '../pages/presentation/PresMockup'
import { PresFinal } from '../pages/presentation/PresFinal'

export function CanvasCustom() {
  const { custom_presentation_data, addCustomSlide, removeCustomSlide } = useBrandStore()
  const { slides } = custom_presentation_data
  const { canvasRef, pageScale, scaledPageWidth, scaledPageHeight } = useCanvasScale()
  const { showAlert } = useAppStore()
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const templateId = e.dataTransfer.getData('templateId')
    if (templateId) {
      addCustomSlide(templateId)
    }
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    showAlert({
      type: 'confirm',
      title: 'Excluir Slide',
      message: 'Tem certeza que deseja remover este slide da apresentação?',
      confirmLabel: 'Sim, excluir',
      cancelLabel: 'Cancelar',
      onConfirm: () => removeCustomSlide(id)
    })
  }

  if (slides.length === 0) {
    return (
      <div 
        className="canvas-empty"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="canvas-empty-content">
          <h3>Apresentação Vazia</h3>
          <p>Arraste slides da barra lateral para começar a montar sua apresentação personalizada.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={canvasRef}
      className="canvas-area canvas-custom"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {slides.map((slide, index) => {
        const key = slide.id
        const pg = index + 1
        
        return (
          <div
            key={key}
            className="canvas-page-shell"
            style={{ width: scaledPageWidth, height: scaledPageHeight } as CSSProperties}
          >
            <div
              className={`pagina-pdf-wrapper pagina-pdf-clickable ${activeKey === key ? 'is-active' : ''}`}
              style={{ '--canvas-page-scale': pageScale } as CSSProperties}
              onClick={() => {
                setActiveKey(key)
                focusSidebarTarget(`custom-${slide.templateId}`, `Slide ${pg}: ${slide.templateId}`, { slideId: slide.id })
              }}
            >
              <div className="page-label">Página {pg} - {slide.templateId}</div>
              
              <button 
                className="custom-slide-delete-btn"
                onClick={(e) => handleDelete(slide.id, e)}
                title="Excluir Slide"
              >
                <Trash2 size={16} />
              </button>

              {/* Manual Templates */}
              {slide.templateId === 'capa' && (
                <TplCapa 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'bem-vindo' && (
                <TplBemVindo 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'sumario' && (
                <TplSumario 
                  pageNumber={pg} 
                  grupos={[]} 
                  overrideAppearance={slide.appearance}
                />
              )}
              {slide.templateId === 'logo-principal' && (
                <TplConceito 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'tipografia' && (
                <TplTipografia 
                  pageNumber={pg} 
                  variante="principal" 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'cores' && (
                <TplPadraoCromatico 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'logo-mono' && (
                <TplVersaoMono 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'simbolo' && (
                <TplElementos 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                />
              )}
              {slide.templateId === 'construcao' && (
                <TplAplicacaoFundos 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                />
              )}
              {slide.templateId === 'usos-incorretos' && (
                <TplUsosIncorretos 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                />
              )}
              {slide.templateId === 'aplicacoes' && (
                <TplAplicacaoMockup 
                  mockupIndex={0} 
                  pageNumber={pg} 
                  totalMockups={1} 
                  overrideAppearance={slide.appearance}
                />
              )}
              {slide.templateId === 'final' && (
                <TplFinal 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}

              {/* Presentation Templates */}
              {slide.templateId === 'pres-capa' && <PresCapa pageId={key} />}
              {slide.templateId === 'pres-intro' && <PresSecao pageId={key} numero="01" titulo={slide.content.title || "Introdução"} />}
              {slide.templateId === 'pres-comparison' && (
                <PresComparison 
                  pageId={key} 
                  originalLogo={slide.content.logo1 || null} 
                  newLogo={slide.content.logo2 || null} 
                />
              )}
              {slide.templateId === 'pres-concept-logo' && (
                <PresConceptLogo 
                  pageId={key} 
                  explanation={slide.content.explanation || slide.content.text1 || ""} 
                  logoSrc={slide.content.logo || null} 
                />
              )}
              {slide.templateId === 'pres-color-chart' && (
                <TplPadraoCromatico 
                  pageNumber={pg} 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'pres-typography' && (
                <TplTipografia 
                  pageNumber={pg} 
                  variante="principal" 
                  overrideAppearance={slide.appearance}
                  overrideContent={slide.content}
                />
              )}
              {slide.templateId === 'pres-mockup' && (
                <PresMockup 
                  pageId={key} 
                  mockupSrc={slide.content.mockup || null} 
                  index={0} 
                  total={1} 
                />
              )}
              {slide.templateId === 'pres-final' && <PresFinal pageId={key} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
