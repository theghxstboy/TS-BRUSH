import { useMemo } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { PageCapa } from '../pages/PageCapa'
import { PageSumario, type SumarioEntry } from '../pages/PageSumario'
import { PageLogoPrincipal } from '../pages/PageLogoPrincipal'
import { PageLogoMono } from '../pages/PageLogoMono'
import { PageLogoSimbolo } from '../pages/PageLogoSimbolo'
import { PageCores } from '../pages/PageCores'
import { PageTipografia } from '../pages/PageTipografia'
import { PageMockup } from '../pages/PageMockup'
import { BookOpen } from 'lucide-react'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'

/** Canvas original do TS-BRUSH — Template "Moderno" */
export function CanvasModerno() {
  const { assets_base64 } = useBrandStore()

  const hasCapa     = !!assets_base64.logo_principal
  const hasLogoMono = !!assets_base64.logo_monocromatica
  const hasSimbolo  = !!assets_base64.logo_simbolo
  const mockupCount = assets_base64.mockups.length

  const sumarioEntries: SumarioEntry[] = useMemo(() => {
    const entries: SumarioEntry[] = []
    let n = 0

    if (hasCapa) n++
    n++

    entries.push({ title: 'Paleta de Cores', page: ++n })
    entries.push({ title: 'Tipografia', page: ++n })
    if (hasCapa)     entries.push({ title: 'Logotipo Principal',    page: ++n })
    if (hasLogoMono) entries.push({ title: 'Versão Monocromática',  page: ++n })
    if (hasSimbolo)  entries.push({ title: 'Símbolo & Ícone',       page: ++n })
    for (let i = 0; i < mockupCount; i++) {
      entries.push({ title: `Aplicação — Mockup ${String(i + 1).padStart(2, '0')}`, page: ++n })
    }

    return entries
  }, [hasCapa, hasLogoMono, hasSimbolo, mockupCount])

  const isEmpty = !hasCapa && mockupCount === 0

  if (isEmpty) {
    return (
      <div className="canvas-area">
        <div className="canvas-empty">
          <BookOpen size={48} className="canvas-empty-icon" />
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Comece pelo upload do Logo Principal
          </p>
          <p style={{ fontSize: 13, color: '#52525b', maxWidth: 340, textAlign: 'center', lineHeight: 1.6 }}>
            A capa e as páginas de logotipo aparecerão automaticamente.<br />
            Paleta de Cores e Tipografia já estão prontas para editar.
          </p>
        </div>
      </div>
    )
  }

  let pageNum = 0
  const pg = () => ++pageNum
  const clickableProps = (slideType: string) => ({
    className: 'pagina-pdf-wrapper pagina-pdf-clickable',
    onClick: () => focusSidebarTarget(slideType),
  })

  return (
    <div className="canvas-area">

      {hasCapa && (
        <div {...clickableProps('capa')}>
          <div className="page-label">Página {pg()} — Capa</div>
          <PageCapa pageNumber={pageNum} />
        </div>
      )}

      <div {...clickableProps('sumario')}>
        <div className="page-label">Página {pg()} — Sumário</div>
        <PageSumario pageNumber={pageNum} entries={sumarioEntries} />
      </div>

      <div {...clickableProps('padrao-cromatico')}>
        <div className="page-label">Página {pg()} — Paleta de Cores</div>
        <PageCores pageNumber={pageNum} />
      </div>

      <div {...clickableProps('tipografia-principal')}>
        <div className="page-label">Página {pg()} — Tipografia</div>
        <PageTipografia pageNumber={pageNum} />
      </div>

      {hasCapa && (
        <div {...clickableProps('capa')}>
          <div className="page-label">Página {pg()} — Logotipo Principal</div>
          <PageLogoPrincipal pageNumber={pageNum} />
        </div>
      )}

      {hasLogoMono && (
        <div {...clickableProps('versao-mono')}>
          <div className="page-label">Página {pg()} — Logo Monocromática</div>
          <PageLogoMono pageNumber={pageNum} />
        </div>
      )}

      {hasSimbolo && (
        <div {...clickableProps('elementos')}>
          <div className="page-label">Página {pg()} — Símbolo & Ícone</div>
          <PageLogoSimbolo pageNumber={pageNum} />
        </div>
      )}

      {assets_base64.mockups.map((_, i) => (
        <div key={i} {...clickableProps('mockup')}>
          <div className="page-label">Página {pg()} — Mockup {i + 1}/{mockupCount}</div>
          <PageMockup
            mockupIndex={i}
            pageNumber={pageNum}
            totalMockups={mockupCount}
          />
        </div>
      ))}

    </div>
  )
}
