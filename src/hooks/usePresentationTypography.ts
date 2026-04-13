import { useBrandStore } from '../store/useBrandStore'

const DEFAULT_BODY_FONT = "'Geist', system-ui, sans-serif"
const DEFAULT_MONO_FONT = "'Geist Mono', monospace"

export function getFontFamily(name?: string, fallback = DEFAULT_BODY_FONT) {
  return name?.trim() ? `'${name.trim()}', sans-serif` : fallback
}

export function usePresentationTypography() {
  const { tipografia } = useBrandStore()

  const titleFontFamily = getFontFamily(
    tipografia.apresentacao_titulos || tipografia.principal_nome,
    DEFAULT_BODY_FONT,
  )

  const bodyFontFamily = getFontFamily(
    tipografia.apresentacao_textos || tipografia.apresentacao_titulos || tipografia.principal_nome,
    DEFAULT_BODY_FONT,
  )

  const accentFontFamily = getFontFamily(
    tipografia.apresentacao_textos || tipografia.secundaria_nome,
    DEFAULT_MONO_FONT,
  )

  return {
    titleFontFamily,
    bodyFontFamily,
    accentFontFamily,
  }
}
