import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Sidebar } from './components/sidebar/Sidebar'
import { Canvas } from './components/canvas/Canvas'
import { ContextDrawer } from './components/context/ContextDrawer'
import { HomeScreen } from './components/home/HomeScreen'
import { SocialMediaEditor } from './components/social/SocialMediaEditor'
import { SocialPreview } from './components/social/SocialPreview'
import { EditorNav } from './components/common/EditorNav'
import { useTypographyFontLoader } from './hooks/useTypographyFontLoader'
import { usePresentationTypography } from './hooks/usePresentationTypography'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, useBrandStore } from './store/useBrandStore'
import { useAppStore } from './store/useAppStore'
import { toast } from 'sonner'

export default function App() {
  useTypographyFontLoader()
  const { bodyFontFamily, titleFontFamily } = usePresentationTypography()
  const { aparencia, tipografia, presentation_data } = useBrandStore()
  const { screen, setHasUnsavedChanges } = useAppStore()

  const [sidebarWidth, setSidebarWidth] = useState(420)
  const [isResizing, setIsResizing] = useState(false)

  // Track unsaved changes: mark dirty whenever any store key changes after entering editor
  const prevStateRef = useRef<string | null>(null)
  const storeSnapshot = useBrandStore((s) => JSON.stringify({
    projeto: s.projeto,
    conteudo_pdf: s.conteudo_pdf,
    tipografia: s.tipografia,
    cores_logo: s.cores_logo,
    aparencia: s.aparencia,
    assets_base64: s.assets_base64,
  }))

  useEffect(() => {
    if (screen === 'home') {
      // Reset unsaved flag and baseline when we're at home
      prevStateRef.current = null
      setHasUnsavedChanges(false)
      return
    }

    if (prevStateRef.current === null) {
      // First render in editor — capture baseline
      prevStateRef.current = storeSnapshot
      return
    }

    setHasUnsavedChanges(storeSnapshot !== prevStateRef.current)
  }, [screen, storeSnapshot, setHasUnsavedChanges])

  // Guard global de drag-and-drop: impede o navegador de abrir a imagem quando o drop cai
  // fora de uma zona de upload. Sem isso, um drop "errado" navega pra imagem e parece quebrado.
  useEffect(() => {
    const prevent = (e: DragEvent) => {
      // Só intercepta arrasto de arquivos (deixa drag-and-drop interno, ex: reordenar, intacto).
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault()
      }
    }
    window.addEventListener('dragover', prevent)
    window.addEventListener('drop', prevent)
    return () => {
      window.removeEventListener('dragover', prevent)
      window.removeEventListener('drop', prevent)
    }
  }, [])

  // Undo / Redo global sobre o estado do projeto (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const k = e.key.toLowerCase()
      if (k !== 'z' && k !== 'y') return
      // Em campos de texto, respeita o undo nativo do input/textarea.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return

      const temporal = useBrandStore.temporal.getState()
      const isRedo = k === 'y' || (k === 'z' && e.shiftKey)
      if (isRedo) {
        if (temporal.futureStates.length) {
          e.preventDefault()
          temporal.redo()
          toast('Refeito')
        }
      } else if (temporal.pastStates.length) {
        e.preventDefault()
        temporal.undo()
        toast('Desfeito')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Sidebar resizing
  const startResizing = useCallback(() => setIsResizing(true), [])
  const stopResizing = useCallback(() => setIsResizing(false), [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const minLimit = Math.max(340, window.innerWidth * 0.18)
      const maxLimit = window.innerWidth * 0.45
      const newWidth = e.clientX
      if (newWidth >= minLimit && newWidth <= maxLimit) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const isPres = screen === 'brand-presentation'
  const currentBg = isPres ? presentation_data.appearance.fundos.conteudo : aparencia.imagem_fundo
  const currentBgOpacity = isPres ? DEFAULT_BACKGROUND_IMAGE_OPACITY : (aparencia.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY)

  const layoutStyle = {
    '--sidebar-width': `${sidebarWidth}px`,
    '--presentation-body-font': bodyFontFamily,
    '--presentation-title-font': titleFontFamily,
    '--presentation-bg-image': currentBg ? `url(${currentBg})` : 'none',
    '--presentation-bg-opacity': String(currentBg ? currentBgOpacity : 0),
    '--presentation-text-align': tipografia.apresentacao_alinhamento,
    '--presentation-title-scale': String(tipografia.apresentacao_tamanho_titulo || 1),
    '--presentation-page-title-scale': String(tipografia.apresentacao_tamanho_titulo_pagina || 1),
    '--presentation-body-scale': String(tipografia.apresentacao_tamanho_texto || 1),
    '--presentation-line-height': String(tipografia.apresentacao_entrelinha || 1.7),
    '--presentation-letter-spacing': `${tipografia.apresentacao_espacamento_letras || 0}em`,
  } as CSSProperties

  if (screen === 'home') {
    return <HomeScreen />
  }

  if (screen === 'social-media') {
    return <SocialMediaEditor />
  }

  if (screen === 'social-preview') {
    return <SocialPreview />
  }

  return (
    <div className="app-root" style={layoutStyle}>
      <EditorNav />
      <div className="app-layout">
        <Sidebar />
        <div
          className={`sidebar-resizer ${isResizing ? 'is-resizing' : ''}`}
          onMouseDown={startResizing}
        />
        <Canvas />
        <ContextDrawer />
      </div>
    </div>
  )
}
