import type { CSSProperties } from 'react'
import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { EditableText } from '../canvas/EditableText'
import { getLucideIcon } from '../../lib/socialIcons'
import { globalBgStyle, LOGO_FILTERS, logoBgStyle } from './controls'

// Formatos de capa (dimensões oficiais aproximadas). `safe` = área visível em todos os dispositivos (ex: banner YouTube).
export const COVERS: { id: string; label: string; w: number; h: number; safe?: { w: number; h: number } }[] = [
  { id: 'facebook', label: 'Facebook', w: 1640, h: 624 },
  { id: 'linkedin-company', label: 'LinkedIn (Empresa)', w: 1128, h: 191 },
  { id: 'linkedin-personal', label: 'LinkedIn (Pessoal)', w: 1584, h: 396 },
  { id: 'youtube', label: 'YouTube (banner)', w: 2560, h: 1440, safe: { w: 1546, h: 423 } },
  { id: 'x', label: 'X (Twitter)', w: 1500, h: 500 },
  { id: 'pinterest', label: 'Pinterest Business', w: 800, h: 450 },
  { id: 'google-business', label: 'Google Business', w: 1080, h: 608 },
  { id: 'yelp', label: 'Yelp', w: 1280, h: 720 },
  { id: 'bluesky', label: 'Bluesky', w: 1500, h: 500 },
  { id: 'patreon', label: 'Patreon', w: 1600, h: 400 },
  { id: 'linkedin-events', label: 'LinkedIn Events', w: 1776, h: 888 },
  { id: 'facebook-events', label: 'Facebook Events', w: 1920, h: 1005 },
]

function Pill({ icon, text, primary, accent, k }: { icon: string; text: string; primary: string; accent: string; k: number }) {
  const Icon = getLucideIcon(icon)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 * k, background: primary, color: '#fff', borderRadius: 999, padding: `${12 * k}px ${28 * k}px ${12 * k}px ${14 * k}px`, fontSize: 26 * k, fontWeight: 700, whiteSpace: 'nowrap' }}>
      <span style={{ display: 'flex', width: 40 * k, height: 40 * k, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon && <Icon size={22 * k} color={accent} strokeWidth={2.4} />}
      </span>
      {text}
    </div>
  )
}

export function SmCover({ pageId, w, h, safe }: { pageId: string; w: number; h: number; safe?: { w: number; h: number } }) {
  const { social_media_data } = useBrandStore()
  const { company, theme, facebook_cover, background } = social_media_data
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const logoDrag = useElementDrag(pageId, 'logo', positions.logo)
  const contactDrag = useElementDrag(pageId, 'contact', positions.contact)

  // Conteúdo fica na área segura (centralizada) quando houver; senão ocupa a capa toda.
  const cw = safe?.w ?? w
  const ch = safe?.h ?? h
  const contentPos: CSSProperties = safe
    ? { left: (w - cw) / 2, top: (h - ch) / 2, width: cw, height: ch }
    : { inset: 0 }

  const k = ch / 624 // escala relativa ao design base (capa do Facebook)
  const panelW = cw * 0.46
  const contentLeft = facebook_cover.side === 'left'

  const photoStyle: CSSProperties = contentLeft ? { right: 0, width: panelW } : { left: 0, width: panelW }
  const skew = contentLeft ? 'skewX(8deg)' : 'skewX(-8deg)'
  const bluePos: CSSProperties = contentLeft ? { right: panelW - 30 * k } : { left: panelW - 30 * k }
  const accentPos: CSSProperties = contentLeft ? { right: panelW + 20 * k } : { left: panelW + 20 * k }
  const textAlign: CSSProperties['textAlign'] = facebook_cover.textAlign
  const justify = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'

  // "Fundo total": o fundo global preenche tudo, sem foto nem divisor — o conteúdo fica centralizado por cima.
  const isFull = facebook_cover.layout === 'full'
  // Sem alignItems aqui: os filhos (logo, serviços, contatos) já se alinham sozinhos. Defini-lo tiraria o
  // stretch do wrapper da logo, e aí a caixa da logo (width:70%) colapsaria por falta de largura definida.
  const panelPos: CSSProperties = isFull
    ? { inset: 0, justifyContent: 'center' }
    : contentLeft ? { left: 0, right: panelW + 60 * k } : { left: panelW + 60 * k, right: 0 }

  return (
    <div className="sm-piece" style={{ width: w, height: h, position: 'relative', overflow: 'hidden', ...globalBgStyle(background) }}>
      <div style={{ position: 'absolute', ...contentPos, overflow: 'hidden' }}>
      {!isFull && (
        <>
          <div style={{ position: 'absolute', top: 0, bottom: 0, ...photoStyle, background: facebook_cover.photo ? `url(${facebook_cover.photo}) center/cover` : 'linear-gradient(135deg,#cfd6dd,#aeb7c0)' }}>
            {!facebook_cover.photo && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6672', fontSize: 24 * k }}>Foto</div>}
          </div>
          <div style={{ position: 'absolute', top: -20, bottom: -20, width: 46 * k, background: theme.primary, transform: skew, zIndex: 2, ...bluePos }} />
          <div style={{ position: 'absolute', top: -20, bottom: -20, width: 16 * k, background: theme.accent, transform: skew, zIndex: 2, ...accentPos }} />
        </>
      )}

      <div style={{ position: 'absolute', top: 0, bottom: 0, padding: `${50 * k}px ${60 * k}px`, display: 'flex', flexDirection: 'column', gap: 18 * k, ...panelPos }}>
        {facebook_cover.showLogo !== false && (
          <div
            className={logoDrag.className}
            onPointerDown={logoDrag.onPointerDown}
            style={{ height: 120 * k, display: 'flex', alignItems: 'center', justifyContent: justify, ...logoDrag.style }}
          >
            {company.logo ? (
              // Altura fixa (= altura da caixa) e largura pela proporção: tamanho consistente em qualquer layout,
              // sem escalar junto com a largura da caixa (que diferia entre "com foto" e "fundo total").
              <div style={{ width: '100%', height: '100%', ...logoBgStyle(company.logo, LOGO_FILTERS[positions.logo?.logoVariant ?? company.logoVariant], justify === 'flex-end' ? 'right' : justify === 'center' ? 'center' : 'left'), backgroundSize: 'auto 100%' }} />
            ) : (
              <span style={{ color: '#999', fontSize: 22 * k }}>Logo</span>
            )}
            {logoDrag.handle}
          </div>
        )}

        <EditableText
          pageId={pageId}
          elementKey="services"
          positions={positions}
          value={company.services}
          placeholder={'SEUS SERVIÇOS\nAQUI'}
          onCommit={(v) => useBrandStore.getState().setSocialMediaData({ company: { ...company, services: v } })}
          as="div"
          style={{ fontSize: 40 * k, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', lineHeight: 1.12, letterSpacing: '0.01em', textAlign }}
        />

        <div
          className={contactDrag.className}
          onPointerDown={contactDrag.onPointerDown}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 * k, alignItems: justify, marginTop: 'auto', ...contactDrag.style }}
        >
          {company.phone && <Pill icon="Phone" text={company.phone} primary={theme.primary} accent={theme.accent} k={k} />}
          {company.website && <Pill icon="Globe" text={company.website} primary={theme.primary} accent={theme.accent} k={k} />}
          {company.email && <Pill icon="Mail" text={company.email} primary={theme.primary} accent={theme.accent} k={k} />}
          {contactDrag.handle}
        </div>
      </div>
      </div>
    </div>
  )
}
