import { toPng, toBlob } from 'html-to-image'
import JSZip from 'jszip'

// Exporta o nó no tamanho NATURAL (ignora o scale de exibição do pai) → PNG em resolução cheia.
export async function downloadPng(node: HTMLElement, filename: string, pixelRatio = 2) {
  document.body.classList.add('export-mode')
  try {
    const dataUrl = await toPng(node, {
      pixelRatio,
      cacheBust: true,
      width: node.offsetWidth,
      height: node.offsetHeight,
      style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`
    a.click()
  } finally {
    document.body.classList.remove('export-mode')
  }
}

// Gera um .zip com os PNGs (os nós já são tamanho natural, sem transform → export direto).
export async function exportNodesZip(entries: { path: string; node: HTMLElement | null }[], zipName: string, pixelRatio = 2) {
  document.body.classList.add('export-mode')
  try {
    const zip = new JSZip()
    for (const e of entries) {
      if (!e.node) continue
      const blob = await toBlob(e.node, { pixelRatio, cacheBust: true })
      if (blob) zip.file(e.path.toLowerCase().endsWith('.png') ? e.path : `${e.path}.png`, blob)
    }
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = zipName.toLowerCase().endsWith('.zip') ? zipName : `${zipName}.zip`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    document.body.classList.remove('export-mode')
  }
}
