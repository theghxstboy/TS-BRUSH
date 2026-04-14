import type { CSSProperties } from 'react'
import { Sidebar } from './components/sidebar/Sidebar'
import { Canvas } from './components/canvas/Canvas'
import { ContextDrawer } from './components/context/ContextDrawer'
import { usePresentationTypography } from './hooks/usePresentationTypography'
import { useBrandStore } from './store/useBrandStore'

export default function App() {
  const { bodyFontFamily, titleFontFamily } = usePresentationTypography()
  const { aparencia, tipografia } = useBrandStore()
  const layoutStyle = {
    '--presentation-body-font': bodyFontFamily,
    '--presentation-title-font': titleFontFamily,
    '--presentation-bg-image': aparencia.imagem_fundo ? `url(${aparencia.imagem_fundo})` : 'none',
    '--presentation-bg-opacity': aparencia.imagem_fundo ? '0.16' : '0',
    '--presentation-text-align': tipografia.apresentacao_alinhamento,
  } as CSSProperties

  return (
    <div className="app-layout" style={layoutStyle}>
      <Sidebar />
      <Canvas />
      <ContextDrawer />
    </div>
  )
}
