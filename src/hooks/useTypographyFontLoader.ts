import { useEffect } from 'react'
import { buildFontFaceCss, resolveFontName } from '../lib/fontUtils'
import { useBrandStore } from '../store/useBrandStore'

type FontSlot = 'principal' | 'secundaria' | 'apresentacao-titulos' | 'apresentacao-textos'

function removeElement(id: string) {
  document.getElementById(id)?.remove()
}

function syncGoogleFont(slot: FontSlot, fontName: string) {
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

function syncCustomFont(slot: FontSlot, fontName: string, dataUrl: string | null, format: string) {
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

export function useTypographyFontLoader() {
  const { tipografia } = useBrandStore()

  useEffect(() => {
    const primaryName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
    const secondaryName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)
    const presentationTitleName = resolveFontName(tipografia.apresentacao_titulos, tipografia.apresentacao_titulos_custom.file_name)
    const presentationTextName = resolveFontName(tipografia.apresentacao_textos, tipografia.apresentacao_textos_custom.file_name)

    syncCustomFont('principal', primaryName, tipografia.principal_custom.data_url, tipografia.principal_custom.format)
    syncCustomFont('secundaria', secondaryName, tipografia.secundaria_custom.data_url, tipografia.secundaria_custom.format)
    syncCustomFont('apresentacao-titulos', presentationTitleName, tipografia.apresentacao_titulos_custom.data_url, tipografia.apresentacao_titulos_custom.format)
    syncCustomFont('apresentacao-textos', presentationTextName, tipografia.apresentacao_textos_custom.data_url, tipografia.apresentacao_textos_custom.format)

    if (tipografia.principal_custom.data_url) {
      removeElement('gfont-slot-principal')
    } else {
      syncGoogleFont('principal', primaryName)
    }

    if (tipografia.secundaria_custom.data_url) {
      removeElement('gfont-slot-secundaria')
    } else {
      syncGoogleFont('secundaria', secondaryName)
    }

    if (tipografia.apresentacao_titulos_custom.data_url) {
      removeElement('gfont-slot-apresentacao-titulos')
    } else {
      syncGoogleFont('apresentacao-titulos', presentationTitleName)
    }

    if (tipografia.apresentacao_textos_custom.data_url) {
      removeElement('gfont-slot-apresentacao-textos')
    } else {
      syncGoogleFont('apresentacao-textos', presentationTextName)
    }
  }, [
    tipografia.principal_nome,
    tipografia.principal_custom.file_name,
    tipografia.principal_custom.data_url,
    tipografia.principal_custom.format,
    tipografia.secundaria_nome,
    tipografia.secundaria_custom.file_name,
    tipografia.secundaria_custom.data_url,
    tipografia.secundaria_custom.format,
    tipografia.apresentacao_titulos,
    tipografia.apresentacao_titulos_custom.file_name,
    tipografia.apresentacao_titulos_custom.data_url,
    tipografia.apresentacao_titulos_custom.format,
    tipografia.apresentacao_textos,
    tipografia.apresentacao_textos_custom.file_name,
    tipografia.apresentacao_textos_custom.data_url,
    tipografia.apresentacao_textos_custom.format,
  ])
}
