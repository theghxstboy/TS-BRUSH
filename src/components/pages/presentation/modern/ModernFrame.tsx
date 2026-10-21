import type { CSSProperties, ReactNode } from 'react'
import { useBrandStore } from '../../../../store/useBrandStore'
import type { SlideAppearance, PresentationTemplate } from '../../../../store/useBrandStore'
import { usePresentationAppearance } from '../../../../hooks/usePresentationAppearance'
import type { PresentationGlobalType } from '../../../../hooks/usePresentationAppearance'
import { usePresentationTypography } from '../../../../hooks/usePresentationTypography'
import { PresBgLayer } from '../PresBgLayer'
import { logoBgStyle, LOGO_FILTERS } from '../../../social/controls'
import type { LogoVariant } from '../../../social/controls'
import tsLogo from '../../../../logos/TS.svg'

// ============================================================================
// "Padrão Moderno" — base compartilhada dos slides (chrome + helpers de cor).
// Tudo PDF-safe: só cores sólidas, gradientes e bordas (sem blur/backdrop/blend),
// então imprime idêntico à tela (print-color-adjust:exact já é forçado no print).
// ============================================================================

// ---------- cor ----------
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** cor + alpha (só funciona em #RRGGBB, que é o que os color inputs entregam; senão devolve a cor pura) */
export function hexA(color: string, alpha: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, alpha))})`
}

export function isLight(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return false
  // luminância relativa aproximada (sRGB)
  return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255 > 0.6
}

/** texto legível sobre a cor */
export function onColor(hex: string): string {
  return isLight(hex) ? '#111111' : '#FFFFFF'
}

export function colorInfo(hex: string) {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  const k = 1 - max
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k)
  const pct = (v: number) => `${Math.round(v * 100)}%`
  return {
    hex: hex.toUpperCase(),
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    hsl: `${Math.round(h)}°, ${pct(s)}, ${pct(l)}`,
    cmyk: `${pct(c)}, ${pct(m)}, ${pct(y)}, ${pct(k)}`,
  }
}

export interface PaletteColor { name: string; hex: string }

/** Paleta derivada das cores da apresentação (sem duplicatas), primária primeiro. */
export function paletteFrom(appearance: ReturnType<typeof useBrandStore.getState>['presentation_data']['appearance']): PaletteColor[] {
  const candidates: PaletteColor[] = [
    { name: 'Primária', hex: appearance.conteudo.detalhe || appearance.capa.detalhe },
    { name: 'Fundo', hex: appearance.capa.fundo },
    { name: 'Títulos', hex: appearance.capa.titulo },
    { name: 'Texto', hex: appearance.conteudo.texto },
    { name: 'Fundo de conteúdo', hex: appearance.conteudo.fundo },
    { name: 'Apoio', hex: appearance.secao.detalhe },
    { name: 'Apoio', hex: appearance.final.detalhe },
    { name: 'Títulos', hex: appearance.conteudo.titulo },
  ]
  const seen = new Set<string>()
  const out: PaletteColor[] = []
  for (const c of candidates) {
    if (!c.hex || !hexToRgb(c.hex)) continue
    const key = c.hex.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...c, hex: c.hex.toUpperCase() })
    if (out.length === 5) break
  }
  return out
}

// ---------- temas (variações do padrão moderno) ----------
// Mesmos slides/layout; muda o "skin": fundo, cartões, chrome e enfeites.
export interface ModernTheme {
  id: Exclude<PresentationTemplate, 'classico'>
  /** raio dos cartões */
  radius: number
  /** camadas de fundo (backgroundImage) acima da imagem de fundo e abaixo do conteúdo */
  bgLayers: string
  cardBg: string
  cardBorder: string
  cardBorderAccent: string
  /** enfeites dentro dos cartões */
  halo: boolean
  grid: boolean
  corners: boolean
  /** faixa do cabeçalho preenchida com a cor de destaque */
  headerFill: boolean
  /** barra vertical sólida na borda esquerda + número de página marcado (editorial) */
  sideBar: boolean
  titleWeight: number
  titleTracking: string
}

function buildTheme(id: PresentationTemplate, fundo: string, titulo: string, detalhe: string): ModernTheme {
  const light = isLight(fundo)
  const hair = hexA(titulo, 0.12)
  const depth = light
    ? 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)'
    : 'linear-gradient(160deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.38) 100%)'
  switch (id) {
    case 'editorial':
      return {
        id, radius: 2,
        bgLayers: 'none',
        cardBg: 'transparent', cardBorder: `1px solid ${hexA(titulo, 0.3)}`, cardBorderAccent: `1px solid ${detalhe}`,
        halo: false, grid: true, corners: false, headerFill: false, sideBar: true,
        titleWeight: 800, titleTracking: '-0.02em',
      }
    case 'bold':
      return {
        id, radius: 10,
        bgLayers: `linear-gradient(135deg, ${hexA(detalhe, 0.2)} 0%, rgba(0,0,0,0) 55%)`,
        cardBg: hexA(detalhe, 0.1), cardBorder: `2px solid ${hexA(detalhe, 0.55)}`, cardBorderAccent: `3px solid ${detalhe}`,
        halo: false, grid: false, corners: false, headerFill: true, sideBar: false,
        titleWeight: 900, titleTracking: '-0.01em',
      }
    case 'minimal':
      return {
        id, radius: 16,
        bgLayers: 'none',
        cardBg: 'transparent', cardBorder: `1px solid ${hair}`, cardBorderAccent: `1px solid ${hexA(detalhe, 0.6)}`,
        halo: false, grid: false, corners: false, headerFill: false, sideBar: false,
        titleWeight: 700, titleTracking: '0',
      }
    case 'moderno':
    default:
      return {
        id: 'moderno', radius: 24,
        bgLayers: [
          `radial-gradient(ellipse 55% 60% at 88% 6%, ${hexA(detalhe, 0.26)} 0%, transparent 60%)`,
          `radial-gradient(ellipse 50% 50% at 4% 98%, ${hexA(detalhe, 0.14)} 0%, transparent 60%)`,
          depth,
        ].join(', '),
        cardBg: hexA(titulo, 0.045), cardBorder: `1px solid ${hair}`, cardBorderAccent: `1px solid ${hexA(detalhe, 0.45)}`,
        halo: true, grid: true, corners: true, headerFill: false, sideBar: false,
        titleWeight: 900, titleTracking: '-0.01em',
      }
  }
}

// ---------- contexto do slide ----------
export interface ModernCtx {
  pageId: string
  theme: ModernTheme
  fundo: string
  titulo: string
  texto: string
  detalhe: string
  sombra: string
  light: boolean
  /** linha fina (12% do título) */
  hair: string
  /** texto secundário (50% do título) */
  muted: string
  titleFont: string
  bodyFont: string
  brand: string
  responsible: string
  positions: SlideAppearance['element_positions']
  style: SlideAppearance
}

export function useModernCtx(pageId: string, globalType: PresentationGlobalType): ModernCtx {
  const { presentation_data } = useBrandStore()
  const style = usePresentationAppearance(pageId, globalType)
  const { titleFontFamily, bodyFontFamily } = usePresentationTypography()
  const titulo = style.cor_titulo
  return {
    pageId,
    theme: buildTheme(presentation_data.template ?? 'moderno', style.cor_fundo_pagina, titulo, style.cor_detalhes),
    fundo: style.cor_fundo_pagina,
    titulo,
    texto: style.cor_texto,
    detalhe: style.cor_detalhes,
    sombra: style.cor_sombra,
    light: isLight(style.cor_fundo_pagina),
    hair: hexA(titulo, 0.12),
    muted: hexA(titulo, 0.5),
    titleFont: titleFontFamily,
    bodyFont: bodyFontFamily,
    brand: presentation_data.brand_name,
    responsible: presentation_data.responsible_name,
    positions: style.element_positions,
    style,
  }
}

// ---------- chrome ----------
export const CONTENT_INSET = { top: 72, bottom: 72, left: 48, right: 48 }

interface ModernFrameProps {
  ctx: ModernCtx
  pageNumber: number
  /** rótulo da seção no cabeçalho (ex.: "Proposta 01") */
  label?: string
  children: ReactNode
  /** estilo extra do box de conteúdo */
  contentStyle?: CSSProperties
}

export function ModernFrame({ ctx, pageNumber, label, children, contentStyle }: ModernFrameProps) {
  const { fundo, titulo, detalhe, light, hair, muted, bodyFont, titleFont, brand, responsible, style, theme } = ctx
  const nn = String(pageNumber).padStart(2, '0')

  // cabeçalho preenchido (bold): texto na cor de contraste do destaque
  const headText = theme.headerFill ? hexA(onColor(detalhe), 0.8) : muted
  const headStrong = theme.headerFill ? onColor(detalhe) : titulo

  const chromeText: CSSProperties = {
    fontFamily: bodyFont,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: muted,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }
  const headerText: CSSProperties = { ...chromeText, color: headText }

  return (
    <div className="pagina-pdf" style={{ backgroundColor: fundo, color: titulo }}>
      <PresBgLayer imagem_fundo={style.imagem_fundo} opacidade={style.imagem_fundo_opacidade} blend={style.imagem_fundo_blend} />
      {/* brilho/profundidade: acima da imagem de fundo, abaixo de todo o conteúdo */}
      {theme.bgLayers !== 'none' && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', backgroundImage: theme.bgLayers }} />
      )}

      {/* editorial: barra lateral sólida + numeral marcado no canto */}
      {theme.sideBar && (
        <>
          <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: detalhe, zIndex: 20 }} />
          <div aria-hidden style={{ position: 'absolute', right: CONTENT_INSET.right - 6, bottom: 58, fontSize: 120, fontWeight: 900, lineHeight: 0.8, letterSpacing: '-0.05em', color: hexA(titulo, 0.07), fontFamily: titleFont, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }}>
            {nn}
          </div>
        </>
      )}

      {/* cabeçalho */}
      {theme.headerFill && <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 52, background: detalhe, zIndex: 19 }} />}
      <div style={{ position: 'absolute', top: theme.headerFill ? 21 : 28, left: CONTENT_INSET.left, right: CONTENT_INSET.right, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>
        <span style={headerText}>{brand || 'Sua Marca'} — Diretrizes de identidade</span>
        <span style={{ ...headerText, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{label ?? 'Identidade visual'}</span>
        <span style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <span style={headerText}>Branding</span>
          <span style={headerText}>Identidade</span>
          <span style={{ ...headerText, color: headStrong, fontWeight: 800 }}>{nn}</span>
        </span>
      </div>
      {!theme.headerFill && <div aria-hidden style={{ position: 'absolute', top: 52, left: CONTENT_INSET.left, right: CONTENT_INSET.right, height: 1, background: hair, zIndex: 20 }} />}

      {/* conteúdo */}
      <div style={{ position: 'absolute', top: CONTENT_INSET.top, bottom: CONTENT_INSET.bottom, left: CONTENT_INSET.left, right: CONTENT_INSET.right, zIndex: 10, ...contentStyle }}>
        {children}
      </div>

      {/* rodapé */}
      {theme.headerFill
        ? <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: detalhe, zIndex: 20 }} />
        : <div aria-hidden style={{ position: 'absolute', bottom: 54, left: CONTENT_INSET.left, right: CONTENT_INSET.right, height: 1, background: hair, zIndex: 20 }} />}
      <div style={{ position: 'absolute', bottom: 24, left: CONTENT_INSET.left, right: CONTENT_INSET.right, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden style={{ width: 18, height: 18, ...logoBgStyle(tsLogo, light ? LOGO_FILTERS.black : LOGO_FILTERS.white) }} />
          <span style={{ ...chromeText, letterSpacing: '0.16em' }}>{responsible || 'Agência TS'}</span>
        </span>
        <span style={chromeText}>Todos os direitos reservados</span>
      </div>
    </div>
  )
}

// ---------- peças de texto ----------
export function Eyebrow({ ctx, children, style }: { ctx: ModernCtx; children: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: ctx.detalhe, fontFamily: ctx.bodyFont, margin: 0, lineHeight: 1.2, ...style }}>
      {children}
    </p>
  )
}

export function Title({ ctx, children, size = 40, style }: { ctx: ModernCtx; children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <h2 style={{ fontSize: size, fontWeight: ctx.theme.titleWeight, lineHeight: 1.02, letterSpacing: ctx.theme.titleTracking, textTransform: 'uppercase', color: ctx.titulo, fontFamily: ctx.titleFont, margin: '14px 0 0', wordBreak: 'break-word', ...style }}>
      {children}
    </h2>
  )
}

export const bodyStyle = (ctx: ModernCtx, size = 13): CSSProperties => ({
  fontSize: size,
  lineHeight: 1.7,
  color: hexA(ctx.texto, 0.85),
  fontFamily: ctx.bodyFont,
  margin: 0,
  whiteSpace: 'pre-wrap',
  fontWeight: 500,
})

export function Body({ ctx, children, style }: { ctx: ModernCtx; children: ReactNode; style?: CSSProperties }) {
  return <p style={{ ...bodyStyle(ctx), marginTop: 18, ...style }}>{children}</p>
}

/** cartão "vidro" sem blur (só cor + borda) — visual vem do tema */
export function Card({ ctx, children, style, accent }: { ctx: ModernCtx; children?: ReactNode; style?: CSSProperties; accent?: boolean }) {
  const { theme } = ctx
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: theme.radius,
        background: theme.cardBg,
        border: accent ? theme.cardBorderAccent : theme.cardBorder,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** enfeites de cartão (halo + grade + cantos) — cada tema liga os seus */
export function CardDecor({ ctx, at = '80% 15%', alpha = 0.3 }: { ctx: ModernCtx; at?: string; alpha?: number }) {
  const { theme, detalhe, titulo } = ctx
  const edge = `1.5px solid ${detalhe}`
  return (
    <>
      {theme.halo && <Halo color={detalhe} at={at} alpha={alpha} />}
      {theme.grid && <GridPattern color={titulo} step={36} alpha={0.05} />}
      {theme.corners && (
        <>
          <span aria-hidden style={{ position: 'absolute', top: 16, left: 16, width: 14, height: 14, borderTop: edge, borderLeft: edge }} />
          <span aria-hidden style={{ position: 'absolute', top: 16, right: 16, width: 14, height: 14, borderTop: edge, borderRight: edge }} />
          <span aria-hidden style={{ position: 'absolute', bottom: 16, left: 16, width: 14, height: 14, borderBottom: edge, borderLeft: edge }} />
          <span aria-hidden style={{ position: 'absolute', bottom: 16, right: 16, width: 14, height: 14, borderBottom: edge, borderRight: edge }} />
        </>
      )}
    </>
  )
}

/** halo radial na cor de destaque (coloque dentro de um container position:relative) */
export function Halo({ color, at = '50% 50%', size = '70% 70%', alpha = 0.28 }: { color: string; at?: string; size?: string; alpha?: number }) {
  return <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse ${size} at ${at}, ${hexA(color, alpha)} 0%, transparent 65%)` }} />
}

/** grade de construção (linhas finas) */
export function GridPattern({ color, step = 28, alpha = 0.08 }: { color: string; step?: number; alpha?: number }) {
  const c = hexA(color, alpha)
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px ${step}px), repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px ${step}px)`,
      }}
    />
  )
}

/** logo renderizada como background (resolve SVG que colapsa no <img>) */
export function Logo({ src, variant = 'original', style, placeholderColor }: { src: string | null; variant?: LogoVariant; style?: CSSProperties; placeholderColor?: string }) {
  if (!src) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: placeholderColor ?? 'rgba(128,128,128,0.6)', ...style }}>
        Logo não enviada
      </div>
    )
  }
  return <div aria-label="Logo" style={{ ...logoBgStyle(src, LOGO_FILTERS[variant]), ...style }} />
}

/** rótulo pequeno em chip (usado nas variações/board) */
export function Chip({ children, color, bg, font }: { children: ReactNode; color: string; bg: string; font: string }) {
  return (
    <span style={{ position: 'absolute', left: 16, bottom: 14, fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color, background: bg, padding: '6px 10px', borderRadius: 999, fontFamily: font, lineHeight: 1 }}>
      {children}
    </span>
  )
}
