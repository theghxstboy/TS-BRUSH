import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Sidebar } from './components/sidebar/Sidebar'
import { Canvas } from './components/canvas/Canvas'
import { ContextDrawer } from './components/context/ContextDrawer'
import { HomeScreen } from './components/home/HomeScreen'
import { EditorNav } from './components/common/EditorNav'
import { useTypographyFontLoader } from './hooks/useTypographyFontLoader'
import { usePresentationTypography } from './hooks/usePresentationTypography'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, useBrandStore } from './store/useBrandStore'
import { useAppStore } from './store/useAppStore'

export default function App() {
  useTypographyFontLoader()
  const { bodyFontFamily, titleFontFamily } = usePresentationTypography()
  const { aparencia, tipografia } = useBrandStore()
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

  const layoutStyle = {
    '--sidebar-width': `${sidebarWidth}px`,
    '--presentation-body-font': bodyFontFamily,
    '--presentation-title-font': titleFontFamily,
    '--presentation-bg-image': aparencia.imagem_fundo ? `url(${aparencia.imagem_fundo})` : 'none',
    '--presentation-bg-opacity': aparencia.imagem_fundo ? String(aparencia.imagem_fundo_opacidade ?? DEFAULT_BACKGROUND_IMAGE_OPACITY) : '0',
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
