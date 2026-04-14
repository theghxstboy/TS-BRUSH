import React from 'react'
import { useBrandStore } from '../store/useBrandStore'
import type { SlideAppearanceKey } from '../store/useBrandStore'

/**
 * Returns the two key colors and the aparencia-based background helpers
 * used across all PDF pages.
 */
export function usePageColors(slideType?: SlideAppearanceKey) {
  const { cores_apresentacao, aparencia, page_appearance } = useBrandStore()
  const pageAppearance = slideType ? page_appearance[slideType] : null

  const primaryColor = pageAppearance?.cor_destaque || aparencia.cor_destaque || cores_apresentacao[0]?.hex || '#F97316'
  const darkColor = pageAppearance?.cor_paineis || aparencia.cor_paineis || cores_apresentacao[1]?.hex || '#0C0C0C'
  const dividerTitleColor = pageAppearance?.cor_titulo || aparencia.cor_titulos_divisoria || darkColor
  const contentTitleColor = pageAppearance?.cor_titulo || aparencia.cor_titulos_conteudo || darkColor
  const textColor = pageAppearance?.cor_texto || '#1A1A1A'
  const pageColor = pageAppearance?.cor_fundo_pagina || aparencia.cor_fundo_pagina || '#FFFFFF'
  const logoBackdropColor = pageAppearance?.cor_fundo_logo || aparencia.cor_fundo_logo || '#F4F4F5'

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

  return { primaryColor, darkColor, dividerTitleColor, contentTitleColor, textColor, pageColor, logoBackdropColor, darkPanelStyle, BgOverlay, aparencia }
}
