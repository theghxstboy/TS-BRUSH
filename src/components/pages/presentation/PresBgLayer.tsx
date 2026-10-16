import type { CSSProperties } from 'react'

interface PresBgLayerProps {
  imagem_fundo: string | null
  opacidade?: number
  blend?: string
}

// Camada de fundo da página de apresentação: fica atrás do conteúdo (z-index:-1 dentro do
// .pagina-pdf, que é isolation:isolate) e aplica opacidade + mix-blend-mode nativos.
export function PresBgLayer({ imagem_fundo, opacidade = 1, blend = 'normal' }: PresBgLayerProps) {
  if (!imagem_fundo) return null

  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundImage: `url(${imagem_fundo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: opacidade,
    mixBlendMode: blend as CSSProperties['mixBlendMode'],
    pointerEvents: 'none',
  }

  return <div aria-hidden style={style} />
}
