import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { useCanvasScale } from './useCanvasScale'
import { EmptyCanvas } from './EmptyCanvas'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'

import { PresCapa } from '../pages/presentation/PresCapa'
import { PresSecao } from '../pages/presentation/PresSecao'
import { PresConceptLogo } from '../pages/presentation/PresConceptLogo'
import { PresComparison } from '../pages/presentation/PresComparison'
import { PresMockup } from '../pages/presentation/PresMockup'
import { PresFinal } from '../pages/presentation/PresFinal'

type PresentationSlide =
  | { type: 'capa' }
  | { type: 'secao'; numero: string; titulo: string }
  | { type: 'concept-logo'; explanation: string; logoNew: string | null; versionIndex: number }
  | { type: 'comparison'; originalLogo: string | null; logoNew: string | null; versionIndex: number }
  | { type: 'mockup'; src: string; index: number; total: number; versionIndex: number }
  | { type: 'final' }

export function CanvasPresentation() {
  const { presentation_data } = useBrandStore()
  const { canvasRef, pageScale, scaledPageWidth, scaledPageHeight } = useCanvasScale()
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const slides = useMemo<PresentationSlide[]>(() => {
    const list: PresentationSlide[] = []
    const data = presentation_data

    // 1. Capa
    list.push({ type: 'capa' })

    // 2. Propostas
    data.versions.forEach((version, vIndex) => {
      const numStr = String(vIndex + 1).padStart(2, '0')
      
      // Divider
      list.push({ type: 'secao', numero: numStr, titulo: 'Identidade Visual' })
      
      // Concept + Logo
      list.push({ 
        type: 'concept-logo', 
        explanation: version.explanation, 
        logoNew: version.logoNew,
        versionIndex: vIndex
      })

      // Comparison (only if enabled)
      if (data.show_comparison) {
        list.push({ 
          type: 'comparison', 
          originalLogo: data.original_logo || null, 
          logoNew: version.logoNew,
          versionIndex: vIndex
        })
      }

      // Mockups
      version.mockups.forEach((mSrc, mIndex) => {
        list.push({ 
          type: 'mockup', 
          src: mSrc, 
          index: mIndex, 
          total: version.mockups.length,
          versionIndex: vIndex
        })
      })
    })

    // 3. Final
    list.push({ type: 'final' })

    return list
  }, [presentation_data])

  if (slides.length === 0) {
    return <EmptyCanvas canvasRef={canvasRef} />
  }

  return (
    <div ref={canvasRef} className="canvas-area">
      {slides.map((slide, i) => {
        const key = `${slide.type}-${i}`
        const pageId = `pres-${slide.type}-${i}`
        
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
                
                const label = slide.type === 'concept-logo' ? `Versão ${slide.versionIndex + 1}` : slide.type
                const meta: any = {}
                
                if ('versionIndex' in slide) meta.versionIndex = slide.versionIndex
                if ('index' in slide) meta.mockupIndex = slide.index
                
                focusSidebarTarget(pageId, label, meta)
              }}
            >
              <div className="page-label">Página {i + 1} - {slide.type}</div>

              {slide.type === 'capa' && <PresCapa pageId={pageId} />}
              {slide.type === 'secao' && <PresSecao pageId={pageId} numero={slide.numero} titulo={slide.titulo} />}
              {slide.type === 'concept-logo' && <PresConceptLogo pageId={pageId} explanation={slide.explanation} logoSrc={slide.logoNew} />}
              {slide.type === 'comparison' && <PresComparison pageId={pageId} originalLogo={slide.originalLogo} newLogo={slide.logoNew} />}
              {slide.type === 'mockup' && <PresMockup pageId={pageId} mockupSrc={slide.src} index={slide.index} total={slide.total} />}
              {slide.type === 'final' && <PresFinal pageId={pageId} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
