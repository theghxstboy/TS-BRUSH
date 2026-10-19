import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { RingButton, shade, destaqueBgStyle, contrastInk, DESTAQUE_W, DESTAQUE_H } from './SmDestaque'

// Placa pendurada (Missão / Visão / Valores): botão-anel no topo + título + texto.
// `isList` = valores em tópicos (uma linha vira um item "- ...").
export function SmPlaque({ pageId, icon, title, body, isList }: { pageId: string; icon: string; title: string; body: string; isList?: boolean }) {
  const { company, theme, background, destaque } = useBrandStore((s) => s.social_media_data)
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const btnDrag = useElementDrag(pageId, 'button', positions.button, 'translate(-50%, -50%)', { positioned: true })
  const textDrag = useElementDrag(pageId, 'body', positions.body, '', { positioned: true })

  const PX = 130
  const PTOP = 400
  const PW = DESTAQUE_W - PX * 2
  const PH = 1180
  const btnSize = 330
  const textColor = positions.body?.color ?? '#FFFFFF'

  const primary = theme.primary
  const plaqueBg = `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 10px), linear-gradient(155deg, ${shade(primary, 0.16)} 0%, ${primary} 48%, ${shade(primary, -0.18)} 100%)`

  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)

  return (
    <div className="sm-piece" style={{ width: DESTAQUE_W, height: DESTAQUE_H, position: 'relative', overflow: 'hidden', ...destaqueBgStyle(destaque, background) }}>
      {/* Placa */}
      <div style={{ position: 'absolute', left: PX, top: PTOP, width: PW, height: PH, borderRadius: 44, background: plaqueBg, boxShadow: '0 30px 70px rgba(0,0,0,0.33), inset 0 2px 0 rgba(255,255,255,0.12)', zIndex: 1 }} />

      {/* Texto (título + corpo) */}
      <div
        className={textDrag.className}
        onPointerDown={textDrag.onPointerDown}
        style={{
          position: 'absolute', left: PX + 30, width: PW - 60, top: PTOP + 170, height: PH - 210,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26,
          textAlign: 'center', color: textColor, zIndex: 2, ...textDrag.style,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
        {isList ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: 46, fontWeight: 500, lineHeight: 1.2 }}>- {l}</div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.32, whiteSpace: 'pre-wrap' }}>{body}</div>
        )}
        {textDrag.handle}
      </div>

      {/* Botão-anel no topo da placa */}
      <div
        className={btnDrag.className}
        onPointerDown={btnDrag.onPointerDown}
        style={{ position: 'absolute', top: PTOP, left: DESTAQUE_W / 2, width: btnSize, height: btnSize, zIndex: 3, ...btnDrag.style }}
      >
        <RingButton size={btnSize} icon={icon} />
        {btnDrag.handle}
      </div>

      {/* Marca d'água discreta (acompanha o fundo) */}
      {company.name && (
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 600, color: contrastInk(destaque, background, theme.primary), opacity: 0.3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{company.name}</div>
      )}
    </div>
  )
}
