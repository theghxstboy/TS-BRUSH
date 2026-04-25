import React from 'react'
import { useBrandStore } from '../store/useBrandStore'
import type { SlideAppearanceKey, SlideAppearance } from '../store/useBrandStore'

/**
 * Returns the two key colors and the aparencia-based background helpers
 * used across all PDF pages.
 */
export function usePageColors(slideType?: SlideAppearanceKey, override?: SlideAppearance) {
  const { aparencia, page_appearance, custom_presentation_data } = useBrandStore()
  const pageAppearance = override || (slideType ? page_appearance[slideType] : null)

  const globalCustom = custom_presentation_data.appearance
  let globalApp = aparencia.conteudo
  if (slideType === 'capa') globalApp = aparencia.capa as any
  else if (slideType === 'final') globalApp = aparencia.final as any
  else if (slideType?.startsWith('secao-')) globalApp = aparencia.secao as any

  const pageColor = pageAppearance?.cor_fundo_pagina || globalCustom.fundo || globalApp.cor_fundo_pagina || '#FFFFFF'
  const titleColor = pageAppearance?.cor_titulo || globalCustom.titulo || globalApp.cor_titulo || '#0C0C0C'
  const textColor = pageAppearance?.cor_texto || globalCustom.texto || globalApp.cor_texto || '#1A1A1A'
  const detailColor = pageAppearance?.cor_detalhes || globalCustom.detalhe || globalApp.cor_detalhes || '#FFA300'
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

