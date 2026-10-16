import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useElementDrag } from './presentationDrag'
import { useAppStore } from '../../store/useAppStore'

type ElementPositions = Record<string, { x: number; y: number; scale?: number; ls?: number }>

interface EditableTextProps {
  pageId: string
  elementKey: string
  positions: ElementPositions
  value: string
  onCommit: (value: string) => void
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span'
  style?: CSSProperties
  placeholder?: string
  positioned?: boolean
  baseTransform?: string
  draggable?: boolean // false = só edita no duplo-clique; a posição é controlada pelo container pai
  children?: never
}

// Texto arrastável + redimensionável + editável no duplo-clique (estilo Canva).
export function EditableText({
  pageId,
  elementKey,
  positions,
  value,
  onCommit,
  as = 'div',
  style = {},
  placeholder = '',
  positioned,
  baseTransform = '',
  draggable = true,
}: EditableTextProps) {
  const Tag = as as any
  const drag = useElementDrag(pageId, elementKey, positions[elementKey], baseTransform, { positioned })
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLElement>(null)
  // Letter-spacing é por-elemento (não por-slide): só o elemento afetado muda.
  const lsOffset = positions[elementKey]?.ls ?? 0

  useEffect(() => {
    if (!editing || !ref.current) return
    const el = ref.current
    el.focus()
    const sel = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [editing])

  const commit = () => {
    const text = (ref.current?.innerText ?? '').replace(/\n$/, '')
    setEditing(false)
    if (text !== value) onCommit(text)
  }

  // Soma o offset por-slide ao tracking base do elemento (funciona com base em em ou px).
  const lsBase = (style.letterSpacing as string | undefined) ?? '0em'
  const letterSpacing = lsOffset ? `calc(${lsBase} + ${lsOffset}em)` : style.letterSpacing
  // pre-wrap preserva as quebras de linha digitadas, tanto editando quanto exibindo.
  const baseStyle: CSSProperties = { ...style, letterSpacing, whiteSpace: style.whiteSpace ?? 'pre-wrap' }

  if (editing) {
    return (
      <Tag
        ref={ref}
        className={draggable ? drag.className : 'pres-draggable'}
        contentEditable
        suppressContentEditableWarning
        onBlur={commit}
        onPointerDown={(e: React.PointerEvent) => e.stopPropagation()} // placa o cursor sem arrastar o container
        onKeyDown={(e: React.KeyboardEvent) => {
          // Enter = quebra de linha (padrão do contentEditable). Escape cancela. Commit ao clicar fora (blur).
          if (e.key === 'Escape') {
            e.preventDefault()
            setEditing(false)
          }
          e.stopPropagation() // não disparar atalhos globais (ex: Ctrl+Z) enquanto edita
        }}
        style={{
          ...baseStyle,
          ...(draggable ? drag.style : {}),
          cursor: 'text',
          outlineStyle: 'solid',
        }}
      >
        {value}
      </Tag>
    )
  }

  if (!draggable) {
    return (
      <Tag
        className="pres-draggable"
        onPointerDown={(e: React.PointerEvent) => {
          // Seleciona este texto (pro controle de letter-spacing) sem acionar o arraste do container pai.
          e.stopPropagation()
          useAppStore.getState().setSelectedElement({ pageId, key: elementKey })
        }}
        onDoubleClick={() => setEditing(true)}
        style={{ ...baseStyle, cursor: 'text' }}
      >
        {value || placeholder}
      </Tag>
    )
  }

  return (
    <Tag
      className={drag.className}
      onPointerDown={drag.onPointerDown}
      onDoubleClick={() => setEditing(true)}
      style={{ ...baseStyle, ...drag.style }}
    >
      {value || placeholder}
      {drag.handle}
    </Tag>
  )
}
