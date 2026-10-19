import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { getLucideIcon } from '../../lib/socialIcons'
import { globalBgStyle, LOGO_FILTERS, logoBgStyle } from './controls'

export const SIG_W = 900
export const SIG_H = 300

function Line({ icon, text, iconColor, textColor }: { icon: string; text: string; iconColor: string; textColor: string }) {
  const Icon = getLucideIcon(icon)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: textColor }}>
      {Icon && <Icon size={18} color={iconColor} strokeWidth={2.2} />}
      {text}
    </div>
  )
}

export function SmSignature({ pageId }: { pageId: string }) {
  const { social_media_data } = useBrandStore()
  const { company, theme, signature } = social_media_data
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const avatarDrag = useElementDrag(pageId, 'avatar', positions.avatar)
  const infoDrag = useElementDrag(pageId, 'info', positions.info)
  const logoDrag = useElementDrag(pageId, 'logo', positions.logo)

  const radius = signature.avatarShape === 'round' ? '50%' : '18px'
  const infoColor = positions.info?.color // "Cor do texto" (override por elemento)
  const logoFilter = LOGO_FILTERS[positions.logo?.logoVariant ?? company.logoVariant]

  return (
    <div className="sm-piece" style={{ width: SIG_W, height: SIG_H, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 32, padding: 40, ...globalBgStyle(signature.bg) }}>
      {signature.showAvatar && (
        <div
          className={avatarDrag.className}
          onPointerDown={avatarDrag.onPointerDown}
          style={{ width: 210, height: 210, borderRadius: radius, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6e6e6', ...avatarDrag.style }}
        >
          {signature.avatarPhoto ? (
            <img src={signature.avatarPhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
          ) : (
            <span style={{ color: '#9a9a9a', fontSize: 16 }}>Foto</span>
          )}
          {avatarDrag.handle}
        </div>
      )}

      <div style={{ width: 4, alignSelf: 'stretch', background: theme.accent, borderRadius: 2, margin: '20px 0', flexShrink: 0 }} />

      <div
        className={infoDrag.className}
        onPointerDown={infoDrag.onPointerDown}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, ...infoDrag.style }}
      >
        <div style={{ fontSize: 30, fontWeight: 800, color: infoColor ?? theme.primary }}>{company.name || 'Nome da Empresa'}</div>
        {company.phone && <Line icon="Phone" text={company.phone} iconColor={theme.accent} textColor={infoColor ?? '#333'} />}
        {company.email && <Line icon="Mail" text={company.email} iconColor={theme.accent} textColor={infoColor ?? '#333'} />}
        {company.website && <Line icon="Globe" text={company.website} iconColor={theme.accent} textColor={infoColor ?? '#333'} />}
        {infoDrag.handle}
      </div>

      <div
        className={logoDrag.className}
        onPointerDown={logoDrag.onPointerDown}
        style={{ width: 210, height: 210, marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...logoDrag.style }}
      >
        {company.logo ? (
          <div style={{ width: '100%', height: '100%', ...logoBgStyle(company.logo, logoFilter) }} />
        ) : (
          <span style={{ color: '#bbb', fontSize: 16, textAlign: 'center' }}>Logo</span>
        )}
        {logoDrag.handle}
      </div>
    </div>
  )
}
