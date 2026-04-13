/**
 * Converts an image File to a Base64 data URL.
 *
 * - SVG → read directly as data URL (no canvas, no quality loss, perfect transparency)
 * - PNG → canvas round-trip at full PNG quality (preserves transparency)
 * - JPEG/WebP/others → canvas resize + JPEG compression
 *
 * @param file    - Image file from <input>
 * @param maxPx   - Max width/height for raster images (default 1800px)
 * @param quality - JPEG quality 0–1 for raster non-PNG files (default 0.85)
 */
export async function fileToBase64(
  file: File,
  maxPx = 1800,
  quality = 0.85
): Promise<string> {
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')

  // ── SVG: read raw, no canvas ─────────────────────────────────────────────
  if (isSvg) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Erro ao ler arquivo SVG.'))
      reader.readAsDataURL(file)
    })
  }

  // ── Raster (PNG / JPEG / WebP) ───────────────────────────────────────────
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        const ratio = Math.min(maxPx / width, maxPx / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!

      // PNG: clear to transparent before drawing — preserves alpha channel
      const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
      if (isPng) {
        ctx.clearRect(0, 0, width, height)
      }

      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl = isPng
        ? canvas.toDataURL('image/png')               // lossless + transparency
        : canvas.toDataURL('image/jpeg', quality)     // compressed, no alpha

      resolve(dataUrl)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível carregar a imagem.'))
    }

    img.src = objectUrl
  })
}

function componentToHex(value: number) {
  return value.toString(16).padStart(2, '0').toUpperCase()
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

function normalizeHex(raw: string) {
  const value = raw.trim()
  if (!value.startsWith('#')) return null
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toUpperCase()
  }
  if (value.length === 7) return value.toUpperCase()
  return null
}

function parseRgbColor(raw: string) {
  const match = raw.match(/rgba?\(([^)]+)\)/i)
  if (!match) return null

  const [r, g, b] = match[1]
    .split(',')
    .slice(0, 3)
    .map((value) => Number.parseFloat(value.trim()))

  if ([r, g, b].some((value) => Number.isNaN(value))) return null
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b))
}

function decodeSvgDataUrl(dataUrl: string) {
  const [, payload = ''] = dataUrl.split(',', 2)
  if (!payload) return ''

  try {
    if (dataUrl.includes(';base64,')) {
      return atob(payload)
    }
    return decodeURIComponent(payload)
  } catch {
    return ''
  }
}

function distinctHexColors(colors: string[], maxColors: number) {
  const chosen: string[] = []

  for (const color of colors) {
    const normalized = normalizeHex(color)
    if (!normalized || chosen.includes(normalized)) continue

    const rgb = hexToRgb(normalized).split(',').map((value) => Number(value.trim()))
    const isTooClose = chosen.some((existing) => {
      const existingRgb = hexToRgb(existing).split(',').map((value) => Number(value.trim()))
      const distance = Math.sqrt(
        (rgb[0] - existingRgb[0]) ** 2 +
        (rgb[1] - existingRgb[1]) ** 2 +
        (rgb[2] - existingRgb[2]) ** 2,
      )
      return distance < 42
    })

    if (!isTooClose) chosen.push(normalized)
    if (chosen.length === maxColors) break
  }

  return chosen
}

function colorsToPalette(colors: string[]) {
  return colors.map((hex) => buildColorMeta(hex))
}

function extractSvgColors(dataUrl: string, maxColors: number) {
  const svgText = decodeSvgDataUrl(dataUrl)
  if (!svgText) return []

  const foundColors: string[] = []
  const hexMatches = svgText.match(/#[0-9a-fA-F]{3,6}/g) ?? []
  const rgbMatches = svgText.match(/rgba?\([^)]+\)/gi) ?? []

  foundColors.push(...hexMatches)
  foundColors.push(...rgbMatches.map((raw) => parseRgbColor(raw)).filter(Boolean) as string[])

  return colorsToPalette(distinctHexColors(foundColors, maxColors))
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Nao foi possivel carregar a imagem para extrair as cores.'))
    image.src = src
  })
}

function quantize(value: number) {
  return Math.round(value / 24) * 24
}

export async function extractColorsFromDataUrl(dataUrl: string, maxColors = 4) {
  if (!dataUrl) return []
  if (dataUrl.startsWith('data:image/svg+xml')) {
    return extractSvgColors(dataUrl, maxColors)
  }

  try {
    const image = await loadImage(dataUrl)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return []

    const maxSize = 80
    const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1)
    canvas.width = Math.max(1, Math.round(image.width * ratio))
    canvas.height = Math.max(1, Math.round(image.height * ratio))
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const counts = new Map<string, number>()

    for (let index = 0; index < data.length; index += 16) {
      const alpha = data[index + 3]
      if (alpha < 40) continue

      const r = quantize(data[index])
      const g = quantize(data[index + 1])
      const b = quantize(data[index + 2])
      const hex = rgbToHex(r, g, b)
      counts.set(hex, (counts.get(hex) ?? 0) + 1)
    }

    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([hex]) => hex)

    return colorsToPalette(distinctHexColors(sorted, maxColors))
  } catch {
    return []
  }
}
import { buildColorMeta, hexToRgb } from './colorUtils'
