import type { CSSProperties } from 'react'
import { Sidebar } from './components/sidebar/Sidebar'
import { Canvas } from './components/canvas/Canvas'
import { ContextDrawer } from './components/context/ContextDrawer'
import { useTypographyFontLoader } from './hooks/useTypographyFontLoader'
import { usePresentationTypography } from './hooks/usePresentationTypography'
import { DEFAULT_BACKGROUND_IMAGE_OPACITY, useBrandStore } from './store/useBrandStore'

export default function App() {
  useTypographyFontLoader()
  const { bodyFontFamily, titleFontFamily } = usePresentationTypography()
  const { aparencia, tipografia } = useBrandStore()
  const layoutStyle = {
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

  return (
    <div className="app-layout" style={layoutStyle}>
      <Sidebar />
      <Canvas />
      <ContextDrawer />
    </div>
  )
}
