import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { useCanvasScale } from './useCanvasScale'
import { EmptyCanvas } from './EmptyCanvas'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'
import { PresDragProvider } from './presentationDrag'

import { PresCapa } from '../pages/presentation/PresCapa'
import { PresSecao } from '../pages/presentation/PresSecao'
import { PresConceptLogo } from '../pages/presentation/PresConceptLogo'
import { PresComparison } from '../pages/presentation/PresComparison'
import { PresMockup } from '../pages/presentation/PresMockup'
import { PresFinal } from '../pages/presentation/PresFinal'
import { ModCapa, ModSecao, ModConcept, ModComparison, ModMockup, ModFinal } from '../pages/presentation/modern/ModernSlides'
import { ModClearSpace, ModVariations, ModPalette, ModTypography, ModBoard } from '../pages/presentation/modern/ModernBrandSlides'

type PresentationSlide =
  | { type: 'capa' }
  | { type: 'secao'; numero: string; titulo: string }
  | { type: 'concept-logo'; explanation: string; logoNew: string | null; versionIndex: number }
  | { type: 'comparison'; originalLogo: string | null; logoNew: string | null; versionIndex: number }
  | { type: 'mockup'; src: string; index: number; total: number; versionIndex: number }
  | { type: 'final' }
  // exclusivos do padrão moderno
  | { type: 'clear-space'; logoNew: string | null; versionIndex: number }
  | { type: 'variations'; logoNew: string | null; photo: string | null; versionIndex: number }
  | { type: 'palette' }
  | { type: 'typography' }
  | { type: 'board'; logoNew: string | null; photos: string[]; versionIndex: number }

const num = (i: number) => String(i + 1).padStart(2, '0')

export function CanvasPresentation() {
  const { presentation_data, setPresentationData } = useBrandStore()
  const { canvasRef, pageScale, scaledPageWidth, scaledPageHeight } = useCanvasScale()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  // JSON antigo sem `template` cai no clássico
  const modern = (presentation_data.template ?? 'classico') !== 'classico'

  const slides = useMemo<PresentationSlide[]>(() => {
    const list: PresentationSlide[] = []
    const data = presentation_data

    // 1. Capa
    list.push({ type: 'capa' })

    // 2. Propostas
    data.versions.forEach((version, vIndex) => {
      list.push({ type: 'secao', numero: num(vIndex), titulo: 'Identidade Visual' })
      list.push({ type: 'concept-logo', explanation: version.explanation, logoNew: version.logoNew, versionIndex: vIndex })

      if (data.show_comparison) {
        list.push({ type: 'comparison', originalLogo: data.original_logo || null, logoNew: version.logoNew, versionIndex: vIndex })
      }

      if (modern) {
        list.push({ type: 'clear-space', logoNew: version.logoNew, versionIndex: vIndex })
        list.push({ type: 'variations', logoNew: version.logoNew, photo: version.mockups[0] ?? null, versionIndex: vIndex })
      }

      version.mockups.forEach((mSrc, mIndex) => {
        list.push({ type: 'mockup', src: mSrc, index: mIndex, total: version.mockups.length, versionIndex: vIndex })
      })
    })

    // 3. Estilo + brand boards (só no moderno)
    if (modern) {
      list.push({ type: 'palette' })
      list.push({ type: 'typography' })
      data.versions.forEach((version, vIndex) => {
        list.push({ type: 'board', logoNew: version.logoNew, photos: version.mockups.slice(0, 2), versionIndex: vIndex })
      })
    }

    // 4. Final
    list.push({ type: 'final' })

    return list
  }, [presentation_data, modern])

  if (slides.length === 0) {
    return <EmptyCanvas canvasRef={canvasRef} />
  }

  const commitExplanation = (versionIndex: number) => (v: string) => {
    const versions = [...presentation_data.versions]
    if (!versions[versionIndex]) return
    versions[versionIndex] = { ...versions[versionIndex], explanation: v }
    setPresentationData({ ...presentation_data, versions })
  }

  const renderSlide = (slide: PresentationSlide, pageId: string, pageNumber: number) => {
    const vn = 'versionIndex' in slide ? num(slide.versionIndex) : '01'
    if (modern) {
      switch (slide.type) {
        case 'capa': return <ModCapa pageId={pageId} pageNumber={pageNumber} />
        case 'secao': return <ModSecao pageId={pageId} pageNumber={pageNumber} numero={slide.numero} titulo={slide.titulo} />
        case 'concept-logo': return <ModConcept pageId={pageId} pageNumber={pageNumber} explanation={slide.explanation} logoSrc={slide.logoNew} onExplanationCommit={commitExplanation(slide.versionIndex)} numero={vn} />
        case 'comparison': return <ModComparison pageId={pageId} pageNumber={pageNumber} originalLogo={slide.originalLogo} newLogo={slide.logoNew} numero={vn} />
        case 'clear-space': return <ModClearSpace pageId={pageId} pageNumber={pageNumber} logoSrc={slide.logoNew} numero={vn} />
        case 'variations': return <ModVariations pageId={pageId} pageNumber={pageNumber} logoSrc={slide.logoNew} photo={slide.photo} numero={vn} />
        case 'mockup': return <ModMockup pageId={pageId} pageNumber={pageNumber} mockupSrc={slide.src} index={slide.index} total={slide.total} numero={vn} />
        case 'palette': return <ModPalette pageId={pageId} pageNumber={pageNumber} />
        case 'typography': return <ModTypography pageId={pageId} pageNumber={pageNumber} />
        case 'board': return <ModBoard pageId={pageId} pageNumber={pageNumber} logoSrc={slide.logoNew} photos={slide.photos} numero={vn} />
        case 'final': return <ModFinal pageId={pageId} pageNumber={pageNumber} />
      }
    }
    switch (slide.type) {
      case 'capa': return <PresCapa pageId={pageId} />
      case 'secao': return <PresSecao pageId={pageId} numero={slide.numero} titulo={slide.titulo} />
      case 'concept-logo': return <PresConceptLogo pageId={pageId} explanation={slide.explanation} logoSrc={slide.logoNew} onExplanationCommit={commitExplanation(slide.versionIndex)} />
      case 'comparison': return <PresComparison pageId={pageId} originalLogo={slide.originalLogo} newLogo={slide.logoNew} />
      case 'mockup': return <PresMockup pageId={pageId} mockupSrc={slide.src} index={slide.index} total={slide.total} />
      case 'final': return <PresFinal pageId={pageId} />
      default: return null
    }
  }

  return (
    <PresDragProvider scale={pageScale}>
    <div ref={canvasRef} className="canvas-area">
      {slides.map((slide, i) => {
        const key = `${slide.type}-${i}`
        // Sufixo "-mod": posições/aparência do padrão moderno ficam separadas do clássico
        // (o ContextDrawer remove "-índice(-mod)" para achar o tipo base).
        const pageId = `pres-${slide.type}-${i}${modern ? '-mod' : ''}`

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
              {renderSlide(slide, pageId, i + 1)}
            </div>
          </div>
        )
      })}
    </div>
    </PresDragProvider>
  )
}
