import React from 'react'
import { useBrandStore } from '../store/useBrandStore'

/**
 * Returns the two key colors and the aparencia-based background helpers
 * used across all PDF pages.
 */
export function usePageColors() {
  const { cores_apresentacao, aparencia } = useBrandStore()

  const primaryColor = cores_apresentacao[0]?.hex ?? '#F97316'
  const darkColor    = aparencia.cor_fundo   // comes from aparencia, NOT cores[1]

  /**
   * Returns the CSS style for a "dark panel" element.
   * Applies cor_fundo + optional imagem_fundo overlay.
   */
  const darkPanelStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    position: 'relative',
    background: darkColor,
    overflow: 'hidden',
    ...extra,
  })

  /**
   * Background image overlay element — place inside a darkPanel as first child.
   * Returns null if no image is set.
   */
  const BgOverlay = aparencia.imagem_fundo
    ? () => (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${aparencia.imagem_fundo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            mixBlendMode: 'luminosity',
            pointerEvents: 'none',
          }}
        />
      )
    : null

  return { primaryColor, darkColor, darkPanelStyle, BgOverlay, aparencia }
}
