import React from 'react'
import { useBrandStore } from '../store/useBrandStore'
import type { SlideAppearanceKey } from '../store/useBrandStore'

/**
 * Returns the two key colors and the aparencia-based background helpers
 * used across all PDF pages.
 */
export function usePageColors(slideType?: SlideAppearanceKey) {
  const { aparencia, page_appearance } = useBrandStore()
  const pageAppearance = slideType ? page_appearance[slideType] : null

  let globalApp = aparencia.conteudo
  if (slideType === 'capa') globalApp = aparencia.capa as any
  else if (slideType === 'final') globalApp = aparencia.final as any
  else if (slideType?.startsWith('secao-')) globalApp = aparencia.secao as any

  const pageColor = pageAppearance?.cor_fundo_pagina || globalApp.cor_fundo_pagina || '#FFFFFF'
  const titleColor = pageAppearance?.cor_titulo || globalApp.cor_titulo || '#0C0C0C'
  const textColor = pageAppearance?.cor_texto || globalApp.cor_texto || '#1A1A1A'
  const detailColor = pageAppearance?.cor_detalhes || globalApp.cor_detalhes || '#F97316'
  const shadowColor = pageAppearance?.cor_sombra || globalApp.cor_sombra || 'rgba(0,0,0,0.5)'


  // Backward compatibility mappings
  const primaryColor = detailColor
  const darkColor = detailColor
  const dividerTitleColor = titleColor
  const contentTitleColor = titleColor
  const logoBackdropColor = pageColor // Deprecated cor_fundo_logo defaults to page color

  const backgroundImage = 
    pageAppearance?.imagem_fundo 
    || globalApp?.imagem_fundo 
    || aparencia.imagem_fundo 
    || null

  let backgroundOpacity = 0
  if (backgroundImage) {
    if (pageAppearance?.imagem_fundo === backgroundImage) {
      backgroundOpacity = pageAppearance?.imagem_fundo_opacidade ?? 0
    } else if (globalApp?.imagem_fundo === backgroundImage) {
      backgroundOpacity = globalApp?.imagem_fundo_opacidade ?? 0
    } else {
      backgroundOpacity = aparencia.imagem_fundo_opacidade ?? 0
    }
  }

  const pageBackgroundStyle = {
    '--presentation-bg-image': backgroundImage ? `url(${backgroundImage})` : 'none',
    '--presentation-bg-opacity': String(backgroundOpacity),
  } as React.CSSProperties

  const darkPanelStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    position: 'relative',
    background: detailColor,
    overflow: 'hidden',
    ...extra,
  })

  const exibirLogoFundo = pageAppearance?.exibir_logo_fundo !== false

  return {
    pageColor,
    titleColor,
    textColor,
    detailColor,
    shadowColor,
    primaryColor,
    darkColor,
    dividerTitleColor,
    contentTitleColor,
    logoBackdropColor,
    darkPanelStyle,
    backgroundImage,
    backgroundOpacity,
    pageBackgroundStyle,
    exibirLogoFundo,
  }
}

