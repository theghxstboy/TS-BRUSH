import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { PageCapa } from '../pages/PageCapa'
import { PageSumario, type SumarioEntry } from '../pages/PageSumario'
import { PageLogoPrincipal } from '../pages/PageLogoPrincipal'
import { PageLogoMono } from '../pages/PageLogoMono'
import { PageLogoSimbolo } from '../pages/PageLogoSimbolo'
import { PageCores } from '../pages/PageCores'
import { PageTipografia } from '../pages/PageTipografia'
import { PageMockup } from '../pages/PageMockup'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'
import { useCanvasScale } from './useCanvasScale'

interface OrderedModernPage {
  key: string
  slideType: string
  label: string
  mockupIndex?: number
  render: (pageNumber: number, entries: SumarioEntry[]) => ReactNode
}

export function CanvasModerno() {
  const { assets_base64, page_order } = useBrandStore()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { canvasRef, pageScale, scaledPageWidth, scaledPageHeight } = useCanvasScale()

  const hasCapa = !!assets_base64.logo_principal
  const hasLogoMono = !!assets_base64.logo_monocromatica
  const hasSimbolo = !!assets_base64.logo_simbolo
  const mockupCount = assets_base64.mockups.length

  const orderedPages = useMemo<OrderedModernPage[]>(() => {
    const list: OrderedModernPage[] = []

    for (const blockId of page_order.moderno) {
      if (blockId === 'capa' && hasCapa) {
        list.push({
          key: 'capa',
          slideType: 'capa',
          label: 'Capa',
          render: (pageNumber) => <PageCapa pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'sumario') {
        list.push({
          key: 'sumario',
          slideType: 'sumario',
          label: 'Sumario',
          render: (pageNumber, entries) => <PageSumario pageNumber={pageNumber} entries={entries} />,
        })
      }

      if (blockId === 'cores') {
        list.push({
          key: 'cores',
          slideType: 'padrao-cromatico',
          label: 'Paleta de Cores',
          render: (pageNumber) => <PageCores pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'tipografia') {
        list.push({
          key: 'tipografia',
          slideType: 'tipografia-principal',
          label: 'Tipografia',
          render: (pageNumber) => <PageTipografia pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'logo-principal' && hasCapa) {
        list.push({
          key: 'logo-principal',
          slideType: 'logo-principal',
          label: 'Logotipo Principal',
          render: (pageNumber) => <PageLogoPrincipal pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'logo-mono' && hasLogoMono) {
        list.push({
          key: 'logo-mono',
          slideType: 'versao-mono',
          label: 'Logo Monocromatica',
          render: (pageNumber) => <PageLogoMono pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'simbolo' && hasSimbolo) {
        list.push({
          key: 'simbolo',
          slideType: 'simbolo',
          label: 'Simbolo e Icone',
          render: (pageNumber) => <PageLogoSimbolo pageNumber={pageNumber} />,
        })
      }

      if (blockId === 'mockups') {
        for (let i = 0; i < mockupCount; i++) {
          list.push({
            key: `mockup-${i}`,
            slideType: 'mockup',
            label: `Mockup ${i + 1}/${mockupCount}`,
            mockupIndex: i,
            render: (pageNumber) => <PageMockup mockupIndex={i} pageNumber={pageNumber} totalMockups={mockupCount} />,
          })
        }
      }
    }

    return list
  }, [hasCapa, hasLogoMono, hasSimbolo, mockupCount, page_order.moderno])

  const sumarioEntries: SumarioEntry[] = useMemo(() => {
    const entries: SumarioEntry[] = []

    orderedPages.forEach((page, index) => {
      if (page.key === 'sumario') return
      entries.push({ title: page.label, page: index + 1 })
    })

    return entries
  }, [orderedPages])

  let pageNum = 0
  const pg = () => ++pageNum
  const clickableProps = (key: string, slideType: string, pageLabel: string, mockupIndex?: number) => ({
    className: `pagina-pdf-wrapper pagina-pdf-clickable ${activeKey === key ? 'is-active' : ''}`,
    onClick: () => {
      setActiveKey(key)
      focusSidebarTarget(slideType, pageLabel, typeof mockupIndex === 'number' ? { mockupIndex } : undefined)
    },
  })

  const isEmpty = !hasCapa && mockupCount === 0

  if (isEmpty) {
    return (
      <div ref={canvasRef} className="canvas-area">
        <div className="canvas-empty">
          <BookOpen size={48} className="canvas-empty-icon" />
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Comece pelo upload do Logo Principal
          </p>
          <p style={{ fontSize: 13, color: '#52525b', maxWidth: 340, textAlign: 'center', lineHeight: 1.6 }}>
            A capa e as paginas de logotipo aparecerao automaticamente.<br />
            Paleta de Cores e Tipografia ja estao prontas para editar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={canvasRef} className="canvas-area">
      {orderedPages.map((page) => (
        <div
          key={page.key}
          className="canvas-page-shell"
          style={{ width: scaledPageWidth, height: scaledPageHeight } as CSSProperties}
        >
          <div
            {...clickableProps(page.key, page.slideType, page.label, page.mockupIndex)}
            style={{ '--canvas-page-scale': pageScale } as CSSProperties}
          >
            <div className="page-label">Pagina {pg()} - {page.label}</div>
            {page.render(pageNum, sumarioEntries)}
          </div>
        </div>
      ))}
    </div>
  )
}
