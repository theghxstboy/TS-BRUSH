import type { CSSProperties } from 'react'
import { useBrandStore } from '../store/useBrandStore'

export function usePresentationTextStyles() {
  const { tipografia } = useBrandStore()

  const align = tipografia.apresentacao_alinhamento
  const bodyScale = tipografia.apresentacao_tamanho_texto || 1
  const titleScale = tipografia.apresentacao_tamanho_titulo || 1
  const pageTitleScale = tipografia.apresentacao_tamanho_titulo_pagina || 1
  const lineHeight = tipografia.apresentacao_entrelinha || 1.7
  const letterSpacing = tipografia.apresentacao_espacamento_letras || 0

  const titleStyle = (baseSize: number, extra: CSSProperties = {}): CSSProperties => ({
    textAlign: align,
    fontSize: baseSize * titleScale,
    ...extra,
  })

  const bodyStyle = (baseSize: number, extra: CSSProperties = {}): CSSProperties => ({
    textAlign: align,
    fontSize: baseSize * bodyScale,
    lineHeight,
    letterSpacing: `${letterSpacing}em`,
    ...extra,
  })

  const pageTitleStyle = (baseSize: number, extra: CSSProperties = {}): CSSProperties => ({
    textAlign: align,
    fontSize: baseSize * pageTitleScale,
    ...extra,
  })

  const metaStyle = (baseSize: number, extra: CSSProperties = {}): CSSProperties => ({
    textAlign: align,
    fontSize: baseSize * bodyScale,
    ...extra,
  })

  return {
    align,
    bodyScale,
    titleScale,
    lineHeight,
    letterSpacing,
    titleStyle,
    pageTitleStyle,
    bodyStyle,
    metaStyle,
  }
}
