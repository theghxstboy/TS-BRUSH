import { createContext, useContext, useState, useCallback } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'

export interface DragGuideState {
  vx: number | null // posição X (px de tela) da linha-guia vertical de centro
  hy: number | null // posição Y (px de tela) da linha-guia horizontal de centro
}

interface PresDragContextValue {
  scale: number
  setGuides: (g: DragGuideState | null) => void
}

const PresDragCtx = createContext<PresDragContextValue | null>(null)

// Provider: fica no canvas da apresentação, guarda a escala e desenha as guias de centro.
export function PresDragProvider({ scale, children }: { scale: number; children: ReactNode }) {
  const [guides, setGuides] = useState<DragGuideState | null>(null)
  const set = useCallback((g: DragGuideState | null) => setGuides(g), [])

  return (
    <PresDragCtx.Provider value={{ scale, setGuides: set }}>
      {children}
      {guides?.vx != null && (
        <div style={{ position: 'fixed', left: guides.vx, top: 0, bottom: 0, width: 1, background: 'var(--accent)', zIndex: 9999, pointerEvents: 'none' }} />
      )}
      {guides?.hy != null && (
        <div style={{ position: 'fixed', top: guides.hy, left: 0, right: 0, height: 1, background: 'var(--accent)', zIndex: 9999, pointerEvents: 'none' }} />
      )}
    </PresDragCtx.Provider>
  )
}

const SNAP_PX = 6 // limiar de snap ao centro, em px de tela

type Pos = { x: number; y: number; scale?: number }

// Torna um elemento arrastável e redimensionável. Retorna style, className, handlers e o handle de resize (canto).
// `pos` = deslocamento+escala salvos; `baseTransform` preserva transforms próprios (ex: translate(-50%,-50%)).
// `opts.positioned` = true quando o elemento já tem position própria (ex: absolute) — evita sobrescrever com relative.
export function useElementDrag(
  pageId: string,
  elKey: string,
  pos: Pos | undefined,
  baseTransform = '',
  opts: { positioned?: boolean } = {},
) {
  const ctx = useContext(PresDragCtx)
  const setElementPosition = useBrandStore((s) => s.setElementPosition)
  const [live, setLive] = useState<Pos | null>(null)

  const cur = live ?? pos ?? { x: 0, y: 0 }
  const scale = cur.scale ?? 1

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    useAppStore.getState().setSelectedElement({ pageId, key: elKey })
    const vScale = ctx?.scale ?? 1
    const startX = e.clientX
    const startY = e.clientY
    const startPos = { ...cur }

    const el = e.currentTarget as HTMLElement
    const pageEl = el.closest('.pagina-pdf') as HTMLElement | null
    const er0 = el.getBoundingClientRect()
    const startCenterX = er0.left + er0.width / 2
    const startCenterY = er0.top + er0.height / 2
    let pCenterX = 0
    let pCenterY = 0
    if (pageEl) {
      const pr = pageEl.getBoundingClientRect()
      pCenterX = pr.left + pr.width / 2
      pCenterY = pr.top + pr.height / 2
    }

    const move = (ev: PointerEvent) => {
      let dX = ev.clientX - startX
      let dY = ev.clientY - startY
      let vx: number | null = null
      let hy: number | null = null
      if (pageEl) {
        if (Math.abs(startCenterX + dX - pCenterX) < SNAP_PX) {
          dX = pCenterX - startCenterX
          vx = pCenterX
        }
        if (Math.abs(startCenterY + dY - pCenterY) < SNAP_PX) {
          dY = pCenterY - startCenterY
          hy = pCenterY
        }
      }
      ctx?.setGuides(vx != null || hy != null ? { vx, hy } : null)
      setLive({ x: startPos.x + dX / vScale, y: startPos.y + dY / vScale, scale: startPos.scale })
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      ctx?.setGuides(null)
      setLive((prev) => {
        if (prev) setElementPosition(pageId, elKey, prev)
        return null
      })
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // Resize uniforme a partir do canto: escala proporcional à distância do ponteiro ao centro do elemento.
  const onResizeStart = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation() // não inicia o arraste
    useAppStore.getState().setSelectedElement({ pageId, key: elKey })
    const el = (e.currentTarget as HTMLElement).closest('.pres-draggable') as HTMLElement | null
    if (!el) return
    const startPos = { ...cur }
    const startScale = startPos.scale ?? 1
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1

    const move = (ev: PointerEvent) => {
      const d = Math.hypot(ev.clientX - cx, ev.clientY - cy)
      const ns = Math.max(0.2, Math.min(5, startScale * (d / startDist)))
      setLive({ x: startPos.x, y: startPos.y, scale: ns })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setLive((prev) => {
        if (prev) setElementPosition(pageId, elKey, prev)
        return null
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const transform = `${baseTransform} translate(${cur.x}px, ${cur.y}px) scale(${scale})`.trim()
  const style: CSSProperties = {
    transform,
    cursor: live ? 'grabbing' : 'move',
    touchAction: 'none',
    ...(opts.positioned ? {} : { position: 'relative' as const }),
  }
  const className = `pres-draggable${live ? ' is-dragging' : ''}`

  // Handle de resize no canto inferior-direito (contra-escalado para manter tamanho visual constante).
  const handle = (
    <span
      className="pres-resize-handle"
      onPointerDown={onResizeStart}
      style={{ transform: `scale(${1 / scale})` }}
    />
  )

  return { onPointerDown, style, className, handle }
}
