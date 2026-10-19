import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { logoBgStyle } from './controls'

export const AVATAR_SIZE = 1080

export type AvatarBg = 'white' | 'black' | 'bw' | 'none'

// bg do círculo + filtro aplicado na logo (recolorir)
const VARIANTS: Record<AvatarBg, { bg: string; filter?: string; emptyColor: string }> = {
  white: { bg: '#FFFFFF', emptyColor: '#aaa' },
  black: { bg: '#0C0C0C', filter: 'brightness(0) invert(1)', emptyColor: '#777' },
  bw: { bg: '#FFFFFF', filter: 'brightness(0)', emptyColor: '#aaa' },
  none: { bg: 'transparent', emptyColor: '#aaa' },
}

export function SmAvatar({ pageId, bg }: { pageId: string; bg: AvatarBg }) {
  const { social_media_data } = useBrandStore()
  const { avatar, company } = social_media_data
  const v = VARIANTS[bg]
  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const logoDrag = useElementDrag(pageId, 'logo', positions.logo, 'translate(-50%, -50%)', { positioned: true })

  return (
    <div className="sm-piece" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'relative', overflow: 'hidden', background: v.bg }}>
      <div
        className={logoDrag.className}
        onPointerDown={logoDrag.onPointerDown}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: AVATAR_SIZE * avatar.logoScale,
          height: AVATAR_SIZE * avatar.logoScale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...logoDrag.style,
        }}
      >
        {company.logo ? (
          <div style={{ width: '100%', height: '100%', ...logoBgStyle(company.logo, v.filter) }} />
        ) : (
          <span style={{ color: v.emptyColor, fontSize: 40, textAlign: 'center' }}>Envie a logo</span>
        )}
        {logoDrag.handle}
      </div>
    </div>
  )
}
