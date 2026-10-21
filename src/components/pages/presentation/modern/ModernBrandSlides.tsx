import type { CSSProperties } from 'react'
import { useBrandStore } from '../../../../store/useBrandStore'
import { useElementDrag } from '../../../canvas/presentationDrag'
import { resolveFontName } from '../../../../lib/fontUtils'
import { ModernFrame, useModernCtx, Eyebrow, Title, Body, Card, Halo, GridPattern, Logo, Chip, hexA, isLight, onColor, colorInfo, paletteFrom } from './ModernFrame'

// Slides exclusivos do "Padrão Moderno": área de proteção, variações da logo, paleta, tipografia e brand board.
// Todos derivados dos dados já existentes (logo da versão, mockups, cores da aparência, fontes) — nada novo a preencher.

const LIGHT_BG = '#F4F3EE'
const DARK_BG = '#0D0D0D'

// ---------------------------------------------------------------- ÁREA DE PROTEÇÃO
export function ModClearSpace({ pageId, pageNumber, logoSrc, numero }: { pageId: string; pageNumber: number; logoSrc: string | null; numero: string }) {
  const c = useModernCtx(pageId, 'conteudo')
  const logoDrag = useElementDrag(pageId, 'logo', c.positions.logo, 'translateY(-50%)', { positioned: true })
  const textDrag = useElementDrag(pageId, 'concept', c.positions.concept, 'translateY(-50%)', { positioned: true })

  const corner = (st: CSSProperties) => <span aria-hidden style={{ position: 'absolute', width: 14, height: 14, background: c.titulo, ...st }} />
  const x = (st: CSSProperties) => <span aria-hidden style={{ position: 'absolute', fontSize: 11, fontWeight: 800, color: c.detalhe, fontFamily: c.bodyFont, fontStyle: 'italic', ...st }}>x</span>

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Construção`}>
      <div className={textDrag.className} onPointerDown={textDrag.onPointerDown} style={{ position: 'absolute', left: 0, top: '50%', width: 430, ...textDrag.style }}>
        <Eyebrow ctx={c}>Construção</Eyebrow>
        <Title ctx={c}>Área de proteção</Title>
        <Body ctx={c}>
          A área de proteção é o espaço mínimo ao redor da logo que deve permanecer livre de textos, gráficos, imagens ou bordas. Ela garante máxima visibilidade, clareza e consistência da marca em todas as aplicações.
        </Body>
        <Body ctx={c} style={{ marginTop: 12 }}>
          A margem mínima equivale à altura <b style={{ color: c.detalhe }}>x</b> do símbolo e deve ser respeitada em todos os lados, em qualquer orientação ou tamanho.
        </Body>
        <Body ctx={c} style={{ marginTop: 12, color: c.muted }}>Nenhum outro elemento deve invadir essa área.</Body>
        {textDrag.handle}
      </div>

      {/* diagrama */}
      <div className={logoDrag.className} onPointerDown={logoDrag.onPointerDown} style={{ position: 'absolute', right: 30, top: '50%', width: 480, height: 360, ...logoDrag.style }}>
        <div style={{ position: 'absolute', inset: 0, border: `1.5px dashed ${hexA(c.titulo, 0.55)}` }} />
        {corner({ top: -7, left: -7 })}
        {corner({ top: -7, right: -7 })}
        {corner({ bottom: -7, left: -7 })}
        {corner({ bottom: -7, right: -7 })}
        {/* margem interna (linha fina) */}
        <div style={{ position: 'absolute', inset: 64, border: `1px solid ${hexA(c.detalhe, 0.35)}` }} />
        {x({ top: 24, left: '50%', transform: 'translateX(-50%)' })}
        {x({ bottom: 24, left: '50%', transform: 'translateX(-50%)' })}
        {x({ left: 28, top: '50%', transform: 'translateY(-50%)' })}
        {x({ right: 28, top: '50%', transform: 'translateY(-50%)' })}
        <div style={{ position: 'absolute', inset: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Logo src={logoSrc} style={{ width: '100%', height: '100%' }} placeholderColor={c.muted} />
        </div>
        {logoDrag.handle}
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- VARIAÇÕES
export function ModVariations({ pageId, pageNumber, logoSrc, photo, numero }: { pageId: string; pageNumber: number; logoSrc: string | null; photo: string | null; numero: string }) {
  const c = useModernCtx(pageId, 'conteudo')
  const accentOn = isLight(c.detalhe) ? 'black' : 'white'

  const tile = (bg: CSSProperties, variant: 'original' | 'white' | 'black', label: string, labelColor: string, overlay?: boolean) => (
    <div style={{ position: 'relative', borderRadius: Math.max(4, c.theme.radius * 0.75), overflow: 'hidden', border: `1px solid ${c.hair}`, ...bg }}>
      {overlay && <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo src={logoSrc} variant={variant} style={{ width: '52%', height: '50%' }} placeholderColor={labelColor} />
      </div>
      <Chip color={labelColor} bg={hexA(labelColor === '#111111' ? '#FFFFFF' : '#000000', 0.35)} font={c.bodyFont}>{label}</Chip>
    </div>
  )

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Versões`}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Eyebrow ctx={c}>Versões</Eyebrow>
          <Title ctx={c}>Variações da logo</Title>
        </div>
        <Body ctx={c} style={{ marginTop: 0, maxWidth: 360, textAlign: 'right', color: c.muted, fontSize: 12 }}>
          Aplicação sobre fundo claro, fundo escuro, cor de destaque e fotografia.
        </Body>
      </div>

      <div style={{ position: 'absolute', top: 112, bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14 }}>
        {tile({ background: LIGHT_BG }, 'original', 'Versão principal', '#111111')}
        {tile({ background: DARK_BG }, 'white', 'Versão negativa', '#FFFFFF')}
        {tile({ background: c.detalhe }, accentOn, 'Sobre cor de destaque', onColor(c.detalhe))}
        {tile(
          photo
            ? { backgroundImage: `url("${photo}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundImage: `linear-gradient(135deg, ${c.detalhe} 0%, ${DARK_BG} 100%)` },
          'white',
          'Sobre fotografia',
          '#FFFFFF',
          !!photo,
        )}
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- PALETA
export function ModPalette({ pageId, pageNumber }: { pageId: string; pageNumber: number }) {
  const { presentation_data } = useBrandStore()
  const c = useModernCtx(pageId, 'conteudo')
  const colors = paletteFrom(presentation_data.appearance)
  const from = colors[1]?.hex ?? c.fundo
  const to = colors[0]?.hex ?? c.detalhe

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label="Estilo · Cores">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Eyebrow ctx={c}>Cores</Eyebrow>
          <Title ctx={c}>Paleta de cores</Title>
        </div>
        <Body ctx={c} style={{ marginTop: 0, maxWidth: 360, textAlign: 'right', color: c.muted, fontSize: 12 }}>
          Valores de referência para impressão (CMYK) e tela (RGB / HSL / HEX).
        </Body>
      </div>

      <div style={{ position: 'absolute', top: 112, left: 0, right: 0, height: 380, display: 'flex', gap: 14 }}>
        {colors.map((col, i) => {
          const info = colorInfo(col.hex)
          const fg = onColor(col.hex)
          const sub = hexA(fg, 0.72)
          return (
            <div key={col.hex + i} style={{ flex: i === 0 ? 1.5 : 1, borderRadius: 20, background: col.hex, border: `1px solid ${c.hair}`, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: fg, fontFamily: c.bodyFont }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: sub }}>{col.name}</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: sub }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <div style={{ fontSize: i === 0 ? 30 : 22, fontWeight: 900, letterSpacing: '-0.01em', fontFamily: c.titleFont, lineHeight: 1 }}>{info.hex}</div>
                <div style={{ marginTop: 14, display: 'grid', gap: 5, fontSize: 10, color: sub, lineHeight: 1.2 }}>
                  <span>CMYK: {info.cmyk}</span>
                  <span>HSL: {info.hsl}</span>
                  <span>RGB: {info.rgb}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* gradiente de marca */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 510, height: 96, borderRadius: 18, backgroundImage: `linear-gradient(90deg, ${from} 0%, ${to} 100%)`, border: `1px solid ${c.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', fontFamily: c.bodyFont }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: onColor(from) }}>{from.toUpperCase()}</span>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: hexA(onColor(to), 0.7) }}>Gradiente de marca</span>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: onColor(to) }}>{to.toUpperCase()}</span>
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- TIPOGRAFIA
function useFontNames() {
  const { presentation_data, tipografia } = useBrandStore()
  const t = presentation_data.typography
  const title = resolveFontName(t.titulosNome, t.titulosCustom.file_name) || resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name) || 'Manrope'
  const body = resolveFontName(t.textosNome, t.textosCustom.file_name) || title
  return { title, body }
}

export function ModTypography({ pageId, pageNumber }: { pageId: string; pageNumber: number }) {
  const c = useModernCtx(pageId, 'conteudo')
  const names = useFontNames()
  const weights: Array<[string, number]> = [['Regular', 400], ['Semibold', 600], ['Bold', 800]]

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label="Estilo · Tipografia">
      <div>
        <Eyebrow ctx={c}>Tipografia</Eyebrow>
        <Title ctx={c}>Família tipográfica</Title>
      </div>

      <div style={{ position: 'absolute', top: 112, bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: '440px 1fr', gap: 14 }}>
        <Card ctx={c} style={{ padding: 26, display: 'flex', flexDirection: 'column', borderRadius: 20 }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: c.muted, fontFamily: c.bodyFont }}>Fonte principal</span>
          <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: c.titulo, fontFamily: c.titleFont, marginTop: 14, wordBreak: 'break-word' }}>{names.title}</div>
          <div style={{ height: 1, background: c.hair, margin: '20px 0 16px' }} />
          <p style={{ fontSize: 12, lineHeight: 1.65, color: hexA(c.texto, 0.85), fontFamily: c.bodyFont, margin: 0 }}>
            <b style={{ color: c.titulo }}>{names.title}</b> é a tipografia principal da identidade: usada em títulos, chamadas e elementos de destaque. Pesos recomendados: Regular, Semibold e Bold.
          </p>
          <div style={{ marginTop: 'auto', display: 'grid', gap: 6, fontSize: 12, letterSpacing: '0.04em', color: hexA(c.texto, 0.9), fontFamily: c.titleFont, lineHeight: 1.3 }}>
            <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
            <span>abcdefghijklmnopqrstuvwxyz</span>
            <span>0123456789 !@#$%&amp;</span>
          </div>
          {names.body !== names.title && (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${c.hair}`, fontFamily: c.bodyFont }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: c.detalhe }}>Fonte secundária</span>
              <div style={{ fontSize: 13, color: hexA(c.texto, 0.85), marginTop: 6 }}><b style={{ color: c.titulo }}>{names.body}</b> — textos corridos e legendas.</div>
            </div>
          )}
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 14 }}>
          {weights.map(([label, w], i) => (
            <Card key={label} ctx={c} accent={i === 2} style={{ borderRadius: 20 }}>
              {i === 2 && c.theme.halo && <Halo color={c.detalhe} at="80% 10%" alpha={0.3} />}
              <span style={{ position: 'absolute', top: 20, left: 22, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: i === 2 ? c.detalhe : c.muted, fontFamily: c.bodyFont }}>{label}</span>
              <span style={{ position: 'absolute', top: 20, right: 22, fontSize: 10, fontWeight: 700, color: c.muted, fontFamily: c.bodyFont }}>{w}</span>
              <span aria-hidden style={{ position: 'absolute', left: 14, bottom: -46, fontSize: i === 2 ? 300 : 230, fontWeight: w, lineHeight: 1, letterSpacing: '-0.05em', color: c.titulo, fontFamily: c.titleFont, whiteSpace: 'nowrap' }}>Aa</span>
            </Card>
          ))}
        </div>
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- BRAND BOARD
export function ModBoard({ pageId, pageNumber, logoSrc, photos, numero }: { pageId: string; pageNumber: number; logoSrc: string | null; photos: string[]; numero: string }) {
  const { presentation_data } = useBrandStore()
  const c = useModernCtx(pageId, 'conteudo')
  const names = useFontNames()
  const colors = paletteFrom(presentation_data.appearance)
  const accentOn = isLight(c.detalhe) ? 'black' : 'white'
  const [p1, p2] = photos

  const tile: CSSProperties = { position: 'relative', borderRadius: Math.max(2, c.theme.radius * 0.6), overflow: 'hidden', border: `1px solid ${c.hair}` }
  const center: CSSProperties = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  const mark = (st: CSSProperties) => <span aria-hidden style={{ position: 'absolute', width: 16, height: 16, ...st }} />

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Brand board`}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 44 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Eyebrow ctx={c}>Brand board</Eyebrow>
          <span style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: c.titulo, fontFamily: c.titleFont, lineHeight: 1 }}>Resumo da identidade</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.muted, fontFamily: c.bodyFont }}>{c.brand || 'Sua Marca'} · v.{numero}</span>
      </div>

      <div style={{ position: 'absolute', top: 62, bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 12 }}>
        {/* A — logo sobre claro com grade de construção */}
        <div style={{ ...tile, gridColumn: '1 / 3', gridRow: '1 / 3', background: LIGHT_BG }}>
          <GridPattern color="#000000" step={32} alpha={0.07} />
          {mark({ top: 18, left: 18, borderTop: '1.5px solid rgba(0,0,0,0.4)', borderLeft: '1.5px solid rgba(0,0,0,0.4)' })}
          {mark({ top: 18, right: 18, borderTop: '1.5px solid rgba(0,0,0,0.4)', borderRight: '1.5px solid rgba(0,0,0,0.4)' })}
          {mark({ bottom: 18, left: 18, borderBottom: '1.5px solid rgba(0,0,0,0.4)', borderLeft: '1.5px solid rgba(0,0,0,0.4)' })}
          {mark({ bottom: 18, right: 18, borderBottom: '1.5px solid rgba(0,0,0,0.4)', borderRight: '1.5px solid rgba(0,0,0,0.4)' })}
          <div style={center}><Logo src={logoSrc} style={{ width: '54%', height: '56%' }} placeholderColor="#777" /></div>
          <Chip color="#111111" bg="rgba(255,255,255,0.6)" font={c.bodyFont}>Logo principal</Chip>
        </div>

        {/* B — negativa */}
        <div style={{ ...tile, gridColumn: '3 / 4', gridRow: '1 / 2', background: DARK_BG }}>
          <div style={center}><Logo src={logoSrc} variant="white" style={{ width: '60%', height: '58%' }} placeholderColor="#888" /></div>
        </div>

        {/* C — sobre destaque */}
        <div style={{ ...tile, gridColumn: '4 / 5', gridRow: '1 / 2', background: c.detalhe }}>
          <div style={center}><Logo src={logoSrc} variant={accentOn} style={{ width: '60%', height: '58%' }} placeholderColor={onColor(c.detalhe)} /></div>
        </div>

        {/* D — tipografia */}
        <div style={{ ...tile, gridColumn: '3 / 5', gridRow: '2 / 3', background: hexA(c.titulo, 0.045), padding: '16px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: c.detalhe, fontFamily: c.bodyFont }}>Tipografia</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.titulo, fontFamily: c.titleFont, marginTop: 6, lineHeight: 1 }}>{names.title}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: c.muted, fontFamily: c.bodyFont, marginTop: 8 }}>Regular · Semibold · Bold</div>
          </div>
          <span aria-hidden style={{ fontSize: 96, fontWeight: 800, lineHeight: 0.8, letterSpacing: '-0.05em', color: c.titulo, fontFamily: c.titleFont, marginBottom: -8 }}>Aa</span>
        </div>

        {/* E — paleta */}
        <div style={{ ...tile, gridColumn: '1 / 3', gridRow: '3 / 4', display: 'flex' }}>
          {colors.map((col, i) => (
            <div key={col.hex + i} style={{ flex: i === 0 ? 1.6 : 1, background: col.hex, position: 'relative', fontFamily: c.bodyFont }}>
              <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', color: onColor(col.hex) }}>{col.hex}</span>
              {i === 0 && <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: hexA(onColor(col.hex), 0.7) }}>{col.name}</span>}
            </div>
          ))}
        </div>

        {/* F — sobre fotografia */}
        <div style={{ ...tile, gridColumn: '3 / 4', gridRow: '3 / 4', background: p1 ? undefined : DARK_BG, backgroundImage: p1 ? `url("${p1}")` : `linear-gradient(135deg, ${c.detalhe} 0%, ${DARK_BG} 100%)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {p1 && <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />}
          <div style={center}><Logo src={logoSrc} variant="white" style={{ width: '58%', height: '56%' }} placeholderColor="#fff" /></div>
        </div>

        {/* G — aplicação */}
        <div style={{ ...tile, gridColumn: '4 / 5', gridRow: '3 / 4', background: p2 ? undefined : LIGHT_BG, backgroundImage: p2 ? `url("${p2}")` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {!p2 && (
            <>
              <Halo color={c.detalhe} at="50% 50%" size="90% 90%" alpha={0.5} />
              <div style={center}><Logo src={logoSrc} style={{ width: '58%', height: '56%' }} placeholderColor="#777" /></div>
            </>
          )}
        </div>
      </div>
    </ModernFrame>
  )
}
