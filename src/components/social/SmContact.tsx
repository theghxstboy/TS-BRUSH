import type { ReactNode } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { getLucideIcon } from '../../lib/socialIcons'
import { RingButton, destaqueBgStyle, contrastInk, DESTAQUE_W, DESTAQUE_H } from './SmDestaque'

function Pill({ iconName, text, ink, accent, full }: { iconName: string; text: string; ink: string; accent: string; full?: boolean }) {
  const Icon = getLucideIcon(iconName)
  const wrap: ReactNode = (
    <span style={{ width: 64, height: 64, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {Icon && <Icon size={34} color="#fff" strokeWidth={2.4} />}
    </span>
  )
  return (
    <div style={{ display: full ? 'flex' : 'inline-flex', width: full ? '100%' : 'auto', alignSelf: 'center', alignItems: 'center', gap: 20, border: `4px solid ${ink}`, borderRadius: 999, padding: '12px 40px 12px 12px', justifyContent: full ? 'flex-start' : 'center', boxSizing: 'border-box' }}>
      {wrap}
      <span style={{ color: ink, fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
    </div>
  )
}

// Capa de contato (Contact Globais): moldura com abertura no topo + botão-anel + pílulas.
export function SmContact({ pageId, icon }: { pageId: string; icon: string }) {
  const { company, theme, background, destaque } = useBrandStore((s) => s.social_media_data)
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const btnDrag = useElementDrag(pageId, 'button', positions.button, 'translate(-50%, -50%)', { positioned: true })
  const infoDrag = useElementDrag(pageId, 'info', positions.info, '', { positioned: true })

  const btnSize = 330
  const btnCy = 360
  const showButton = destaque.showButton ?? true
  const accent = destaque.accentColor ?? theme.accent
  // Texto/moldura acompanham o fundo (contraste automático), com override pela "Cor do texto".
  const ink = positions.info?.color ?? contrastInk(destaque, background, theme.primary)
  // Moldura: com ou sem abertura para o botão
  const framePath = showButton
    ? `M 690 ${btnCy} H 996 Q 1040 ${btnCy} 1040 404 V 1556 Q 1040 1600 996 1600 H 84 Q 40 1600 40 1556 V 404 Q 40 ${btnCy} 84 ${btnCy} H 390`
    : `M 84 40 H 996 Q 1040 40 1040 84 V 1556 Q 1040 1600 996 1600 H 84 Q 40 1600 40 1556 V 84 Q 40 40 84 40 Z`
  const infoTop = showButton ? 560 : 200

  return (
    <div className="sm-piece" style={{ width: DESTAQUE_W, height: DESTAQUE_H, position: 'relative', overflow: 'hidden', ...destaqueBgStyle(destaque, background) }}>
      <svg width={DESTAQUE_W} height={DESTAQUE_H} viewBox={`0 0 ${DESTAQUE_W} ${DESTAQUE_H}`} style={{ position: 'absolute', inset: 0 }}>
        <path d={framePath} fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      </svg>

      {/* Conteúdo: título + pílulas */}
      <div
        className={infoDrag.className}
        onPointerDown={infoDrag.onPointerDown}
        style={{ position: 'absolute', left: 90, width: DESTAQUE_W - 180, top: infoTop, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, ...infoDrag.style }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: ink, marginBottom: 20 }}>Contact Us:</div>
        {company.phone && <Pill iconName="Phone" text={company.phone} ink={ink} accent={accent} />}
        {company.website && <Pill iconName="Globe" text={company.website} ink={ink} accent={accent} full />}
        {company.email && <Pill iconName="Mail" text={company.email} ink={ink} accent={accent} full />}
        {infoDrag.handle}
      </div>

      {/* Botão-anel na abertura do topo */}
      {showButton && (
        <div
          className={btnDrag.className}
          onPointerDown={btnDrag.onPointerDown}
          style={{ position: 'absolute', top: btnCy, left: DESTAQUE_W / 2, width: btnSize, height: btnSize, zIndex: 3, ...btnDrag.style }}
        >
          <RingButton size={btnSize} icon={icon} />
          {btnDrag.handle}
        </div>
      )}
    </div>
  )
}
