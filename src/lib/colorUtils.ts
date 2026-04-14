export function hexToRgb(hex: string): string {
  const normalized = hex.replace('#', '')
  const parts = normalized.length === 3
    ? normalized.split('').map((char) => char + char)
    : [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)]

  const [r, g, b] = parts.map((part) => parseInt(part, 16))
  if ([r, g, b].some((value) => Number.isNaN(value))) return ''
  return `${r}, ${g}, ${b}`
}

export function normalizeHex(hex: string): string | null {
  const raw = hex.trim().replace(/^#/, '')

  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const expanded = raw.split('').map((char) => char + char).join('')
    return `#${expanded.toUpperCase()}`
  }

  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toUpperCase()}`
  }

  return null
}

export function hexToHsl(hex: string): string {
  const rgb = hexToRgb(hex).split(',').map((value) => Number(value.trim()) / 255)
  if (rgb.length !== 3 || rgb.some((value) => Number.isNaN(value))) return ''

  const [r, g, b] = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}

export function buildColorMeta(hex: string) {
  return {
    hex,
    rgb: hexToRgb(hex),
    hsl: hexToHsl(hex),
    cmyk: '',
  }
}
