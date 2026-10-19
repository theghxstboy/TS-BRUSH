import { useId } from 'react'
import type { CSSProperties } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { getLucideIcon, getSimpleIcon } from '../../lib/socialIcons'
import { getIconifyData } from '../../lib/iconGalleries'
import { isDark } from '../../lib/colorUtils'
import { globalBgStyle } from './controls'

export const DESTAQUE_W = 1080
export const DESTAQUE_H = 1920

type DestaqueDesign = { bgMode: 'photo' | 'color' | 'none' | 'global'; bgImage: string | null; bgColor: string }
type GlobalBg = { mode: 'color' | 'image'; color: string; image: string | null }

// Fundo padrão das peças de destaque (vale pro botão, placa MVV e contato).
export function destaqueBgStyle(d: DestaqueDesign, background: GlobalBg): CSSProperties {
  return d.bgMode === 'global'
    ? globalBgStyle(background)
    : d.bgMode === 'photo'
      ? d.bgImage
        ? { backgroundImage: `url(${d.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: 'linear-gradient(135deg, #f3f3f1 0%, #e7e7e4 100%)' }
      : d.bgMode === 'color'
        ? { background: d.bgColor }
        : { background: 'transparent' }
}

// Cor de texto que contrasta com o fundo da peça (branco em fundo escuro, escuro em fundo claro).
// Fundo por imagem/transparente → assume escuro (uso típico dos destaques).
export function contrastInk(d: DestaqueDesign, background: GlobalBg, primary: string): string {
  const resolved =
    d.bgMode === 'color' ? d.bgColor
      : d.bgMode === 'global' && background.mode === 'color' ? background.color
        : null
  if (!resolved) return '#FFFFFF'
  return isDark(resolved) ? '#FFFFFF' : (isDark(primary) ? primary : '#1A1A1A')
}

// Clareia (pct>0) / escurece (pct<0) um hex — pros gradientes 3D dos anéis.
export function shade(hex: string, pct: number): string {
  const c = hex.replace('#', '')
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c
  const n = parseInt(full, 16)
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const t = pct < 0 ? 0 : 255
  const p = Math.abs(pct)
  r = Math.round((t - r) * p + r)
  g = Math.round((t - g) * p + g)
  b = Math.round((t - b) * p + b)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Botão vetorial (anéis + ícone + efeito 3D). Reaproveitado na placa (MVV) e no contato.
// Larguras/gap dos anéis escalam com `size` para manter a proporção do botão padrão.
export function RingButton({ size, icon }: { size: number; icon: string }) {
  const d = useBrandStore((s) => s.social_media_data.destaque)
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const k = d.buttonSize ? size / d.buttonSize : 1
  const ow = d.ringOuterWidth * k
  const iw = d.ringInnerWidth * k
  const gap = d.gap * k

  const S = size
  const half = S / 2
  const outerR = half - ow / 2
  const innerEdgeOuter = half - ow
  const innerR = Math.max(10 * k, innerEdgeOuter - gap - iw / 2)
  const discR = Math.max(6 * k, innerR - iw / 2 - 4 * k)
  const iconSize = discR * 1.15

  const isEmoji   = icon.startsWith('emoji:')
  const isSi      = icon.startsWith('si:')
  const isSym     = icon.startsWith('sym:')
  const isIconify = icon.startsWith('ph:') || icon.startsWith('bi:') || icon.startsWith('tb:') || icon.startsWith('mdi:')
  const emoji     = isEmoji ? icon.slice(6) : isSym ? icon.slice(4) : null
  const siEntry   = isSi ? getSimpleIcon(icon.slice(3)) : null
  const iconifyData = isIconify ? getIconifyData(icon) : null
  const Icon      = (isEmoji || isSi || isSym || isIconify) ? null : (getLucideIcon(icon) ?? getLucideIcon('Image'))

  const outerGrad = `og${uid}`, innerGrad = `ig${uid}`, shadowId = `sh${uid}`
  const ringStroke = (base: string, grad: string) => (d.emboss ? `url(#${grad})` : base)
  // Traço do anel: dasharray relativo à espessura de cada anel.
  const dashProps = (w: number): { strokeDasharray?: string; strokeLinecap?: 'round' | 'butt' } =>
    d.ringStyle === 'dashed' ? { strokeDasharray: `${w * 1.8} ${w * 1.15}` }
      : d.ringStyle === 'dotted' ? { strokeDasharray: `${w * 0.01} ${w * 1.9}`, strokeLinecap: 'round' }
        : {}

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={outerGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(d.ringOuterColor, d.embossDepth)} />
          <stop offset="0.5" stopColor={d.ringOuterColor} />
          <stop offset="1" stopColor={shade(d.ringOuterColor, -d.embossDepth)} />
        </linearGradient>
        <linearGradient id={innerGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(d.ringInnerColor, d.embossDepth)} />
          <stop offset="0.5" stopColor={d.ringInnerColor} />
          <stop offset="1" stopColor={shade(d.ringInnerColor, -d.embossDepth)} />
        </linearGradient>
        {d.emboss && (
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={S * (0.012 + d.embossDepth * 0.02)} stdDeviation={S * (0.01 + d.embossDepth * 0.02)} floodColor="#000000" floodOpacity={0.15 + d.embossDepth * 0.4} />
          </filter>
        )}
      </defs>

      <g filter={d.emboss ? `url(#${shadowId})` : undefined}>
        {d.discFill === 'color' && <circle cx={half} cy={half} r={discR} fill={d.discColor} />}
        {ow > 0 && <circle cx={half} cy={half} r={outerR} fill="none" stroke={ringStroke(d.ringOuterColor, outerGrad)} strokeWidth={ow} {...dashProps(ow)} />}
        {iw > 0 && <circle cx={half} cy={half} r={innerR} fill="none" stroke={ringStroke(d.ringInnerColor, innerGrad)} strokeWidth={iw} {...dashProps(iw)} />}
      </g>

      {emoji ? (
        <text x={half} y={half + iconSize * 0.38} textAnchor="middle" fontSize={iconSize} style={{ userSelect: 'none' }}>{emoji}</text>
      ) : siEntry ? (
        <g transform={`translate(${half - iconSize / 2}, ${half - iconSize / 2}) scale(${iconSize / 24})`}>
          <path d={siEntry.path} fill={d.iconColor} />
        </g>
      ) : iconifyData ? (
        <svg
          x={half - iconSize / 2} y={half - iconSize / 2}
          width={iconSize} height={iconSize}
          viewBox={`0 0 ${iconifyData.width ?? 24} ${iconifyData.height ?? 24}`}
          fill={d.iconColor} stroke={d.iconColor} strokeWidth={0}
          dangerouslySetInnerHTML={{ __html: iconifyData.body }}
        />
      ) : Icon && (
        <g transform={`translate(${half - iconSize / 2}, ${half - iconSize / 2})`}>
          <Icon width={iconSize} height={iconSize} color={d.iconColor} strokeWidth={d.iconStrokeWidth} />
        </g>
      )}
    </svg>
  )
}

export function SmDestaque({ pageId, icon }: { pageId: string; icon: string }) {
  const { social_media_data } = useBrandStore()
  const d = social_media_data.destaque
  const background = social_media_data.background
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const btnDrag = useElementDrag(pageId, 'button', positions.button, 'translate(-50%, -50%)', { positioned: true })

  const showButton = d.showButton ?? true

  return (
    <div className="sm-piece" style={{ width: DESTAQUE_W, height: DESTAQUE_H, position: 'relative', overflow: 'hidden', ...destaqueBgStyle(d, background) }}>
      {showButton && (
        <div
          className={btnDrag.className}
          onPointerDown={btnDrag.onPointerDown}
          style={{ position: 'absolute', top: '50%', left: '50%', width: d.buttonSize, height: d.buttonSize, ...btnDrag.style }}
        >
          <RingButton size={d.buttonSize} icon={icon} />
          {btnDrag.handle}
        </div>
      )}
    </div>
  )
}
