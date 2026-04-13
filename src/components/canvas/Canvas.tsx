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

export function Canvas() {
  const { assets_base64 } = useBrandStore()

  const hasCapa = !!assets_base64.logo_principal
  const hasLogoMono = !!assets_base64.logo_monocromatica
  const hasSimbolo = !!assets_base64.logo_simbolo
  const mockupCount = assets_base64.mockups.length

  // ── Build sequential page list for sumário ───────────────────────────────
  // Order: Capa? → Sumário → Cores → Tipografia → Logo? → Mono? → Símbolo? → Mockup×N
  const sumarioEntries: SumarioEntry[] = useMemo(() => {
    const entries: SumarioEntry[] = []
    let n = 0

    if (hasCapa) n++ // Capa (not in sumário)
    n++ // Sumário itself (not listed in itself, n is still the sumário page)

    // Cores
    entries.push({ title: 'Paleta de Cores', page: ++n })
    // Tipografia
    entries.push({ title: 'Tipografia', page: ++n })
    // Logo Principal
    if (hasCapa) entries.push({ title: 'Logotipo Principal', page: ++n })
    // Logo Mono
    if (hasLogoMono) entries.push({ title: 'Versão Monocromática', page: ++n })
    // Símbolo
    if (hasSimbolo) entries.push({ title: 'Símbolo & Ícone', page: ++n })
    // Mockups — one entry per page
    for (let i = 0; i < mockupCount; i++) {
      entries.push({ title: `Aplicação — Mockup ${String(i + 1).padStart(2, '0')}`, page: ++n })
    }

    return entries
  }, [hasCapa, hasLogoMono, hasSimbolo, mockupCount])

  // ── Empty state ──────────────────────────────────────────────────────────
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

  // ── Render pages with a mutable counter ──────────────────────────────────
  // We use a plain counter (not state) because this runs synchronously in render.
  let pageNum = 0
  const pg = () => ++pageNum // increment & return

  return (
    <div className="canvas-area">

      {/* ── 1. Capa ── */}
      {hasCapa && (
        <div className="pagina-pdf-wrapper">
          <div className="page-label">Página {pg()} — Capa</div>
          <PageCapa pageNumber={pageNum} />
        </div>
      )}

      {/* ── 2. Sumário ── */}
      <div className="pagina-pdf-wrapper">
        <div className="page-label">Página {pg()} — Sumário</div>
        <PageSumario pageNumber={pageNum} entries={sumarioEntries} />
      </div>

      {/* ── 3. Paleta de Cores ── */}
      <div className="pagina-pdf-wrapper">
        <div className="page-label">Página {pg()} — Paleta de Cores</div>
        <PageCores pageNumber={pageNum} />
      </div>

      {/* ── 4. Tipografia ── */}
      <div className="pagina-pdf-wrapper">
        <div className="page-label">Página {pg()} — Tipografia</div>
        <PageTipografia pageNumber={pageNum} />
      </div>

      {/* ── 5. Logotipo Principal ── */}
      {hasCapa && (
        <div className="pagina-pdf-wrapper">
          <div className="page-label">Página {pg()} — Logotipo Principal</div>
          <PageLogoPrincipal pageNumber={pageNum} />
        </div>
      )}

      {/* ── 6. Logo Monocromática ── */}
      {hasLogoMono && (
        <div className="pagina-pdf-wrapper">
          <div className="page-label">Página {pg()} — Logo Monocromática</div>
          <PageLogoMono pageNumber={pageNum} />
        </div>
      )}

      {/* ── 7. Símbolo ── */}
      {hasSimbolo && (
        <div className="pagina-pdf-wrapper">
          <div className="page-label">Página {pg()} — Símbolo & Ícone</div>
          <PageLogoSimbolo pageNumber={pageNum} />
        </div>
      )}

      {/* ── 8+. Mockups — one page each ── */}
      {assets_base64.mockups.map((_, i) => (
        <div key={i} className="pagina-pdf-wrapper">
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
