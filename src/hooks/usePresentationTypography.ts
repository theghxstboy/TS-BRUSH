import { useBrandStore } from '../store/useBrandStore'
import {
  DEFAULT_BODY_FONT,
  DEFAULT_MONO_FONT,
  getFontFamilyStack,
  resolveFontName,
} from '../lib/fontUtils'

export function usePresentationTypography() {
  const { tipografia, presentation_data, custom_presentation_data } = useBrandStore()
  const { typography: brandTypography } = presentation_data
  const { typography: customTypography } = custom_presentation_data
  
  const primaryName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
  const secondaryName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)
  
  const presentationTitleName = resolveFontName(customTypography.titulosNome, customTypography.titulosCustom.file_name)
    || resolveFontName(brandTypography.titulosNome, brandTypography.titulosCustom.file_name)
    
  const presentationTextName = resolveFontName(customTypography.textosNome, customTypography.textosCustom.file_name)
    || resolveFontName(brandTypography.textosNome, brandTypography.textosCustom.file_name)

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
