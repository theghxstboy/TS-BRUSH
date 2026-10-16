import { useEffect } from 'react'
import { buildFontFaceCss, resolveFontName } from '../lib/fontUtils'
import type { UploadedFontAsset } from '../lib/fontUtils'
import { useBrandStore } from '../store/useBrandStore'

function removeElement(id: string) {
  document.getElementById(id)?.remove()
}

function syncGoogleFont(slot: string, fontName: string) {
  const id = `gfont-slot-${slot}`
  const existing = document.getElementById(id) as HTMLLinkElement | null

  if (!fontName.trim()) {
    removeElement(id)
    return
  }

  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`
  if (existing) {
    existing.href = href
    return
  }

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function syncCustomFont(slot: string, fontName: string, dataUrl: string | null, format: string) {
  const id = `custom-font-slot-${slot}`
  const existing = document.getElementById(id) as HTMLStyleElement | null

  if (!fontName.trim() || !dataUrl) {
    removeElement(id)
    return
  }

  const nextCss = buildFontFaceCss(fontName, {
    file_name: '',
    data_url: dataUrl,
    format: format as '' | 'woff2' | 'woff' | 'truetype' | 'opentype',
  })

  if (existing) {
    existing.textContent = nextCss
    return
  }

  const style = document.createElement('style')
  style.id = id
  style.textContent = nextCss
  document.head.appendChild(style)
}

// Carrega a fonte do slot: @font-face se for upload custom, senão Google Fonts pelo nome.
function syncSlot(slot: string, name: string, custom: UploadedFontAsset) {
  syncCustomFont(slot, name, custom.data_url, custom.format)
  if (custom.data_url) {
    removeElement(`gfont-slot-${slot}`)
  } else {
    syncGoogleFont(slot, name)
  }
}

export function useTypographyFontLoader() {
  const { tipografia, presentation_data, custom_presentation_data } = useBrandStore()
  const presTypography = presentation_data.typography
  const customPresTypography = custom_presentation_data.typography

  useEffect(() => {
    // Manual de marca
    syncSlot('principal', resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name), tipografia.principal_custom)
    syncSlot('secundaria', resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name), tipografia.secundaria_custom)
    syncSlot('apresentacao-titulos', resolveFontName(tipografia.apresentacao_titulos, tipografia.apresentacao_titulos_custom.file_name), tipografia.apresentacao_titulos_custom)
    syncSlot('apresentacao-textos', resolveFontName(tipografia.apresentacao_textos, tipografia.apresentacao_textos_custom.file_name), tipografia.apresentacao_textos_custom)

    // Apresentação de marca (campos que as páginas Pres* realmente usam)
    syncSlot('pres-titulos', resolveFontName(presTypography.titulosNome, presTypography.titulosCustom.file_name), presTypography.titulosCustom)
    syncSlot('pres-textos', resolveFontName(presTypography.textosNome, presTypography.textosCustom.file_name), presTypography.textosCustom)

    // Apresentação personalizada
    syncSlot('custom-pres-titulos', resolveFontName(customPresTypography.titulosNome, customPresTypography.titulosCustom.file_name), customPresTypography.titulosCustom)
    syncSlot('custom-pres-textos', resolveFontName(customPresTypography.textosNome, customPresTypography.textosCustom.file_name), customPresTypography.textosCustom)
  }, [tipografia, presTypography, customPresTypography])
}
