import { useMemo } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { TplCapa }            from '../pages/classico/TplCapa'
import { TplBemVindo }        from '../pages/classico/TplBemVindo'
import { TplSumario }         from '../pages/classico/TplSumario'
import { TplSecao }           from '../pages/classico/TplSecao'
import { TplConceito }        from '../pages/classico/TplConceito'
import { TplTipografia }      from '../pages/classico/TplTipografia'
import { TplPadraoCromatico } from '../pages/classico/TplPadraoCromatico'
import { TplVersaoMono }      from '../pages/classico/TplVersaoMono'
import { TplElementos }       from '../pages/classico/TplElementos'
import { TplAplicacaoFundos } from '../pages/classico/TplAplicacaoFundos'
import { TplUsosIncorretos }  from '../pages/classico/TplUsosIncorretos'
import { TplAplicacaoMockup } from '../pages/classico/TplAplicacaoMockup'
import { TplFinal }           from '../pages/classico/TplFinal'
import { BookOpen } from 'lucide-react'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'

// ─── Tipos de slide ──────────────────────────────────────────────────────────
type Slide =
  | { type: 'capa' }
  | { type: 'bem-vindo' }
  | { type: 'sumario' }
  | { type: 'secao'; numero: string; titulo: string; subtitulo?: string }
  | { type: 'conceito' }
  | { type: 'tipografia-principal' }
  | { type: 'tipografia-secundaria' }
  | { type: 'padrao-cromatico' }
  | { type: 'versao-mono' }
  | { type: 'elementos' }
  | { type: 'aplicacao-fundos' }
  | { type: 'usos-incorretos' }
  | { type: 'mockup'; index: number; total: number }
  | { type: 'final' }

interface SumarioGrupo {
  numero: number
  titulo: string
  itens: Array<{ pagina: string; titulo: string }>
}

export function CanvasClassico() {
  const { assets_base64, tipografia } = useBrandStore()

  const hasLogo     = !!assets_base64.logo_principal
  const hasMono     = !!assets_base64.logo_monocromatica
  const hasSimbolo  = !!assets_base64.logo_simbolo
  const mockupCount = assets_base64.mockups.length

  const hasPrincipal  = !!tipografia.principal_nome
  const hasSecundaria = !!tipografia.secundaria_nome

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!hasLogo && mockupCount === 0) {
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

  return (
    <CanvasClassicoInner
      hasLogo={hasLogo}
      hasMono={hasMono}
      hasSimbolo={hasSimbolo}
      mockupCount={mockupCount}
      hasPrincipal={hasPrincipal}
      hasSecundaria={hasSecundaria}
    />
  )
}

// ─── Inner: usa useMemo para calcular slides ──────────────────────────────────
function CanvasClassicoInner({
  hasLogo, hasMono, hasSimbolo, mockupCount, hasPrincipal, hasSecundaria,
}: {
  hasLogo: boolean; hasMono: boolean; hasSimbolo: boolean
  mockupCount: number; hasPrincipal: boolean; hasSecundaria: boolean
}) {

  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = []

    // 1. Capa
    if (hasLogo) list.push({ type: 'capa' })

    // 2. Bem Vindo
    list.push({ type: 'bem-vindo' })

    // 3. Sumário (gerado depois, mas reservamos sua posição)
    list.push({ type: 'sumario' })

    // ── Seção 01: Logo ──────────────────────────────────────────────────
    list.push({ type: 'secao', numero: '01', titulo: 'Logo' })
    list.push({ type: 'conceito' })

    // ── Seção 02: Tipografia ─────────────────────────────────────────────
    list.push({ type: 'secao', numero: '02', titulo: 'Tipografia' })
    if (hasPrincipal)  list.push({ type: 'tipografia-principal' })
    if (hasSecundaria) list.push({ type: 'tipografia-secundaria' })

    // ── Seção 03: Cores ───────────────────────────────────────────────────
    list.push({ type: 'secao', numero: '03', titulo: 'Cores' })
    list.push({ type: 'padrao-cromatico' })
    if (hasMono || hasLogo) list.push({ type: 'versao-mono' })

    // ── Seção 04: Construção da Marca ─────────────────────────────────────
    list.push({ type: 'secao', numero: '04', titulo: 'Construção', subtitulo: 'de Marca' })
    list.push({ type: 'elementos' })
    list.push({ type: 'aplicacao-fundos' })

    // ── Seção 05: Usos Incorretos ─────────────────────────────────────────
    list.push({ type: 'secao', numero: '05', titulo: 'Usos', subtitulo: 'Incorretos' })
    list.push({ type: 'usos-incorretos' })

    // ── Seção 06: Aplicações ──────────────────────────────────────────────
    if (mockupCount > 0) {
      list.push({ type: 'secao', numero: '06', titulo: 'Aplicações' })
      for (let i = 0; i < mockupCount; i++) {
        list.push({ type: 'mockup', index: i, total: mockupCount })
      }
    }

    // Final
    list.push({ type: 'final' })

    return list
  }, [hasLogo, hasMono, hasSimbolo, mockupCount, hasPrincipal, hasSecundaria])

  // ── Calcular números de página ────────────────────────────────────────────
  // Slides sem número: secao, final
  // Capa não conta número visível no slide
  const pageNumbers = useMemo(() => {
    const map: number[] = Array(slides.length).fill(0)
    let n = 0
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i]
      if (s.type === 'secao' || s.type === 'final') {
        map[i] = 0 // sem número
      } else {
        map[i] = ++n
      }
    }
    return map
  }, [slides])

  // ── Sumário: grupos dinâmicos ──────────────────────────────────────────────
  const sumarioGrupos = useMemo<SumarioGrupo[]>(() => {
    // Mapeia pageNumbers para slides de conteúdo
    const getPage = (type: string, extra?: number) => {
      let found = -1
      let count = 0
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i]
        if (s.type === type) {
          if (type === 'mockup') {
            if ((s as { type: 'mockup'; index: number }).index === extra) {
              found = pageNumbers[i]; break
            }
          } else {
            if (count === (extra ?? 0)) { found = pageNumbers[i]; break }
            count++
          }
        }
      }
      return found > 0 ? String(found).padStart(2, '0') : '—'
    }

    const grupos: SumarioGrupo[] = [
      {
        numero: 1, titulo: 'Logo',
        itens: [{ pagina: getPage('conceito'), titulo: 'Conceito' }],
      },
      {
        numero: 2, titulo: 'Tipografia',
        itens: [
          ...(hasPrincipal  ? [{ pagina: getPage('tipografia-principal'),  titulo: 'Principal'  }] : []),
          ...(hasSecundaria ? [{ pagina: getPage('tipografia-secundaria'), titulo: 'Secundária' }] : []),
        ],
      },
      {
        numero: 3, titulo: 'Cores',
        itens: [
          { pagina: getPage('padrao-cromatico'), titulo: 'Padrão Cromático'      },
          { pagina: getPage('versao-mono'),       titulo: 'Versão Monocromática' },
        ],
      },
      {
        numero: 4, titulo: 'Construção da marca',
        itens: [
          { pagina: getPage('elementos'),       titulo: 'Elementos'              },
          { pagina: getPage('aplicacao-fundos'), titulo: 'Aplicação Sobre Fundos' },
        ],
      },
      {
        numero: 5, titulo: 'Usos incorretos',
        itens: [{ pagina: getPage('usos-incorretos'), titulo: 'O Que Não Fazer' }],
      },
      ...(mockupCount > 0 ? [{
        numero: 6, titulo: 'Aplicações',
        itens: [{ pagina: getPage('mockup', 0), titulo: 'Aplicações Gerais' }],
      }] : []),
    ]
    return grupos
  }, [slides, pageNumbers, hasPrincipal, hasSecundaria, mockupCount])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="canvas-area">
      {slides.map((slide, i) => {
        const pg = pageNumbers[i]
        const key = `${slide.type}-${i}`
        const label = slide.type
        const clickType = slide.type === 'secao' ? 'sumario' : slide.type

        return (
          <div key={key} className="pagina-pdf-wrapper pagina-pdf-clickable" onClick={() => focusSidebarTarget(clickType)}>
            {pg > 0 && <div className="page-label">Página {pg} — {label}</div>}
            {pg === 0 && <div className="page-label">{label}</div>}

            {slide.type === 'capa'                 && <TplCapa pageNumber={pg} />}
            {slide.type === 'bem-vindo'             && <TplBemVindo pageNumber={pg} />}
            {slide.type === 'sumario'               && <TplSumario pageNumber={pg} grupos={sumarioGrupos} />}
            {slide.type === 'secao'                 && <TplSecao numero={slide.numero} titulo={slide.titulo} subtitulo={slide.subtitulo} />}
            {slide.type === 'conceito'              && <TplConceito pageNumber={pg} />}
            {slide.type === 'tipografia-principal'  && <TplTipografia pageNumber={pg} variante="principal" />}
            {slide.type === 'tipografia-secundaria' && <TplTipografia pageNumber={pg} variante="secundaria" />}
            {slide.type === 'padrao-cromatico'      && <TplPadraoCromatico pageNumber={pg} />}
            {slide.type === 'versao-mono'           && <TplVersaoMono pageNumber={pg} />}
            {slide.type === 'elementos'             && <TplElementos pageNumber={pg} />}
            {slide.type === 'aplicacao-fundos'      && <TplAplicacaoFundos pageNumber={pg} />}
            {slide.type === 'usos-incorretos'       && <TplUsosIncorretos pageNumber={pg} />}
            {slide.type === 'mockup'                && (
              <TplAplicacaoMockup mockupIndex={slide.index} pageNumber={pg} totalMockups={slide.total} />
            )}
            {slide.type === 'final'                 && <TplFinal />}
          </div>
        )
      })}
    </div>
  )
}
