import { useEffect, useRef, useState } from 'react'

const PAGE_WIDTH_PX = 1123
const PAGE_HEIGHT_PX = 794

export function useCanvasScale() {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [pageScale, setPageScale] = useState(1)

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return

    const updateScale = () => {
      const availableWidth = Math.max(200, element.clientWidth - 56)
      const nextScale = Math.min(1, Math.max(0.2, availableWidth / PAGE_WIDTH_PX))
      setPageScale(nextScale)
    }

    updateScale()

    const observer = new ResizeObserver(() => updateScale())
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return {
    canvasRef,
    pageScale,
    scaledPageWidth: Math.round(PAGE_WIDTH_PX * pageScale),
    scaledPageHeight: Math.round(PAGE_HEIGHT_PX * pageScale),
  }
}
