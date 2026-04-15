import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { BookOpen } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
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
import { EmptyCanvas } from './EmptyCanvas'
import { focusSidebarTarget } from '../../lib/sidebarNavigation'
import { useCanvasScale } from './useCanvasScale'
import { resolveFontName } from '../../lib/fontUtils'

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

interface ChapterBlock {
  id: string
  chapterTitle: string
  chapterSubtitle?: string
  items: Array<{ type: Slide['type']; title: string }>
}

export function CanvasClassico() {
  const { assets_base64, tipografia, page_order } = useBrandStore()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { canvasRef, pageScale, scaledPageWidth, scaledPageHeight } = useCanvasScale()

  const hasLogo = !!assets_base64.logo_principal
  const hasMono = !!assets_base64.logo_monocromatica
  const mockupCount = assets_base64.mockups.length
  const hasPrincipal = true
  const hasSecundaria = !!resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)

  const chapterBlocks = useMemo<ChapterBlock[]>(() => {
    const blocks: ChapterBlock[] = []

    for (const blockId of page_order.classico) {
      if (blockId === 'logo' && hasLogo) {
        blocks.push({
          id: 'logo',
          chapterTitle: 'Logo',
          items: [{ type: 'conceito', title: 'Conceito' }],
        })
      }

      if (blockId === 'tipografia') {
        blocks.push({
          id: 'tipografia',
          chapterTitle: 'Tipografia',
          items: [
            { type: 'tipografia-principal' as const, title: 'Principal' },
            ...(hasSecundaria ? [{ type: 'tipografia-secundaria' as const, title: 'Secundaria' }] : []),
          ],
        })
      }

      if (blockId === 'cores') {
        blocks.push({
          id: 'cores',
          chapterTitle: 'Cores',
          items: [
            { type: 'padrao-cromatico', title: 'Padrao Cromatico' },
            ...(hasMono || hasLogo ? [{ type: 'versao-mono' as const, title: 'Versao Monocromatica' }] : []),
          ],
        })
      }

      if (blockId === 'construcao' && hasLogo) {
        blocks.push({
          id: 'construcao',
          chapterTitle: 'Construcao',
          chapterSubtitle: 'de Marca',
          items: [
            { type: 'elementos', title: 'Elementos' },
            { type: 'aplicacao-fundos', title: 'Aplicacao Sobre Fundos' },
          ],
        })
      }

      if (blockId === 'usos-incorretos' && hasLogo) {
        blocks.push({
          id: 'usos-incorretos',
          chapterTitle: 'Usos',
          chapterSubtitle: 'Incorretos',
          items: [{ type: 'usos-incorretos', title: 'O Que Nao Fazer' }],
        })
      }

      if (blockId === 'aplicacoes' && mockupCount > 0) {
        blocks.push({
          id: 'aplicacoes',
          chapterTitle: 'Aplicacoes',
          items: [{ type: 'mockup', title: 'Aplicacoes Gerais' }],
        })
      }
    }

    return blocks
  }, [hasLogo, hasMono, mockupCount, hasPrincipal, hasSecundaria, page_order.classico])

  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = []

    for (const blockId of page_order.classico) {
      if (blockId === 'capa' && hasLogo) list.push({ type: 'capa' })
      if (blockId === 'bem-vindo') list.push({ type: 'bem-vindo' })
      if (blockId === 'sumario') list.push({ type: 'sumario' })

      const chapterIndex = chapterBlocks.findIndex((block) => block.id === blockId)
      if (chapterIndex >= 0) {
        const chapter = chapterBlocks[chapterIndex]
        list.push({
          type: 'secao',
          numero: String(chapterIndex + 1).padStart(2, '0'),
          titulo: chapter.chapterTitle,
          subtitulo: chapter.chapterSubtitle,
        })

        for (const item of chapter.items) {
          if (item.type === 'mockup') {
            for (let i = 0; i < mockupCount; i++) {
              list.push({ type: 'mockup', index: i, total: mockupCount })
            }
          } else {
            list.push({ type: item.type } as Slide)
          }
        }
      }

      if (blockId === 'final') list.push({ type: 'final' })
    }

    return list
  }, [chapterBlocks, hasLogo, mockupCount, page_order.classico])

  const pageNumbers = useMemo(() => {
    const map: number[] = Array(slides.length).fill(0)
    let n = 0

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      if (slide.type === 'secao' || slide.type === 'final') {
        map[i] = 0
      } else {
        map[i] = ++n
      }
    }

    return map
  }, [slides])

  const sumarioGrupos = useMemo<SumarioGrupo[]>(() => {
    const getPage = (type: string, mockupIndex?: number) => {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        if (slide.type !== type) continue
        if (type === 'mockup' && typeof mockupIndex === 'number' && slide.type === 'mockup' && slide.index !== mockupIndex) continue
        return pageNumbers[i] > 0 ? String(pageNumbers[i]).padStart(2, '0') : '-'
      }
      return '-'
    }

    return chapterBlocks.map((block, index) => ({
      numero: index + 1,
      titulo: block.chapterSubtitle ? `${block.chapterTitle} ${block.chapterSubtitle}` : block.chapterTitle,
      itens: block.items.map((item) => ({
        pagina: item.type === 'mockup' ? getPage('mockup', 0) : getPage(item.type),
        titulo: item.title,
      })),
    }))
  }, [chapterBlocks, slides, pageNumbers])

  if (slides.length === 0) {
    return <EmptyCanvas canvasRef={canvasRef} />
  }

  return (
    <div ref={canvasRef} className="canvas-area">
      {slides.map((slide, i) => {
        const pg = pageNumbers[i]
        const key = `${slide.type}-${i}`
        const label = slide.type
        const contextLabel = slide.type === 'mockup'
          ? `Mockup ${slide.index + 1}/${slide.total}`
          : slide.type === 'secao'
            ? [slide.titulo, slide.subtitulo].filter(Boolean).join(' ')
            : label
        const clickType: string = slide.type === 'secao'
          ? ({
              Logo: 'secao-logo',
              Tipografia: 'secao-tipografia',
              Cores: 'secao-cores',
              Construcao: 'secao-construcao',
              Usos: 'secao-usos-incorretos',
              Aplicacoes: 'secao-aplicacoes',
            }[slide.titulo] ?? 'sumario')
          : slide.type

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
                focusSidebarTarget(clickType, contextLabel, slide.type === 'mockup' ? { mockupIndex: slide.index } : undefined)
              }}
            >
              {pg > 0 && <div className="page-label">Pagina {pg} - {label}</div>}
              {pg === 0 && <div className="page-label">{label}</div>}

              {slide.type === 'capa' && <TplCapa pageNumber={pg} />}
              {slide.type === 'bem-vindo' && <TplBemVindo pageNumber={pg} />}
              {slide.type === 'sumario' && <TplSumario pageNumber={pg} grupos={sumarioGrupos} />}
              {slide.type === 'secao' && <TplSecao numero={slide.numero} titulo={slide.titulo} subtitulo={slide.subtitulo} />}
              {slide.type === 'conceito' && <TplConceito pageNumber={pg} />}
              {slide.type === 'tipografia-principal' && <TplTipografia pageNumber={pg} variante="principal" />}
              {slide.type === 'tipografia-secundaria' && <TplTipografia pageNumber={pg} variante="secundaria" />}
              {slide.type === 'padrao-cromatico' && <TplPadraoCromatico pageNumber={pg} />}
              {slide.type === 'versao-mono' && <TplVersaoMono pageNumber={pg} />}
              {slide.type === 'elementos' && <TplElementos pageNumber={pg} />}
              {slide.type === 'aplicacao-fundos' && <TplAplicacaoFundos pageNumber={pg} />}
              {slide.type === 'usos-incorretos' && <TplUsosIncorretos pageNumber={pg} />}
              {slide.type === 'mockup' && <TplAplicacaoMockup mockupIndex={slide.index} pageNumber={pg} totalMockups={slide.total} />}
              {slide.type === 'final' && <TplFinal />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
