export type UploadedFontFormat = 'woff2' | 'woff' | 'truetype' | 'opentype' | ''

export interface UploadedFontAsset {
  file_name: string
  data_url: string | null
  format: UploadedFontFormat
}

export const WINDOWS_FONTS_PATH = 'C:\\Windows\\Fonts'
export const DEFAULT_BODY_FONT = "'Geist', system-ui, sans-serif"
export const DEFAULT_MONO_FONT = "'Geist Mono', monospace"
export const EMPTY_UPLOADED_FONT: UploadedFontAsset = {
  file_name: '',
  data_url: null,
  format: '',
}

function escapeFontFamily(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export function deriveFontNameFromFileName(fileName?: string) {
  if (!fileName) return ''

  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function resolveFontName(name?: string, uploadedFileName?: string) {
  const manualName = name?.trim()
  if (manualName) return manualName
  return deriveFontNameFromFileName(uploadedFileName)
}

export function getFontFamilyStack(
  name?: string,
  fallback = DEFAULT_BODY_FONT,
  genericFamily: 'sans-serif' | 'monospace' = 'sans-serif',
) {
  const resolvedName = name?.trim()
  if (!resolvedName) return fallback
  return `'${escapeFontFamily(resolvedName)}', ${genericFamily}`
}

export function inferFontFormat(source: File | string) {
  const raw = typeof source === 'string'
    ? source.toLowerCase()
    : `${source.type} ${source.name}`.toLowerCase()

  if (raw.includes('woff2') || raw.endsWith('.woff2')) return 'woff2'
  if (raw.includes('woff') || raw.endsWith('.woff')) return 'woff'
  if (raw.includes('opentype') || raw.endsWith('.otf')) return 'opentype'
  if (raw.includes('truetype') || raw.endsWith('.ttf')) return 'truetype'
  return ''
}

export function buildFontFaceCss(fontFamily: string, fontAsset: UploadedFontAsset) {
  if (!fontFamily.trim() || !fontAsset.data_url) return ''

  const formatChunk = fontAsset.format ? ` format('${fontAsset.format}')` : ''

  return `
    @font-face {
      font-family: '${escapeFontFamily(fontFamily)}';
      src: url('${fontAsset.data_url}')${formatChunk};
      font-display: swap;
    }
  `.trim()
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
