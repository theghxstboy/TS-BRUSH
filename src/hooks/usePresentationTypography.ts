import { useBrandStore } from '../store/useBrandStore'
import {
  DEFAULT_BODY_FONT,
  DEFAULT_MONO_FONT,
  getFontFamilyStack,
  resolveFontName,
} from '../lib/fontUtils'

export function usePresentationTypography() {
  const { tipografia } = useBrandStore()
  const primaryName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
  const secondaryName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)
  const presentationTitleName = resolveFontName(tipografia.apresentacao_titulos, tipografia.apresentacao_titulos_custom.file_name)
  const presentationTextName = resolveFontName(tipografia.apresentacao_textos, tipografia.apresentacao_textos_custom.file_name)

  const titleFontFamily = getFontFamilyStack(
    presentationTitleName || primaryName,
    DEFAULT_BODY_FONT,
  )

  const bodyFontFamily = getFontFamilyStack(
    presentationTextName || presentationTitleName || primaryName,
    DEFAULT_BODY_FONT,
  )

  const accentFontFamily = getFontFamilyStack(
    presentationTextName || secondaryName,
    DEFAULT_MONO_FONT,
    'monospace',
  )

  return {
    titleFontFamily,
    bodyFontFamily,
    accentFontFamily,
  }
}
