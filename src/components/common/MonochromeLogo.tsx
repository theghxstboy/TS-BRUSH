import type { CSSProperties } from 'react'

interface MonochromeLogoProps {
  src: string
  color: string
  maxWidth?: string | number
  maxHeight?: string | number
}

export function MonochromeLogo({ src, color, maxWidth = '80%', maxHeight = 110 }: MonochromeLogoProps) {
  const style: CSSProperties = {
    width: maxWidth,
    maxWidth: '100%',
    height: maxHeight,
    maxHeight: '100%',
    background: color,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    flexShrink: 0,
  }

  return <div aria-hidden="true" style={style} />
}
