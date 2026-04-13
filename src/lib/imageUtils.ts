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
