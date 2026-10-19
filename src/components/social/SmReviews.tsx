import { useBrandStore } from '../../store/useBrandStore'
import { usePresentationAppearance } from '../../hooks/usePresentationAppearance'
import { useElementDrag } from '../canvas/presentationDrag'
import { destaqueBgStyle, DESTAQUE_W, DESTAQUE_H } from './SmDestaque'
import { logoBgStyle } from './controls'

export function SmReviews({ pageId }: { pageId: string }) {
  const { social_media_data } = useBrandStore()
  const d = social_media_data.destaque
  const background = social_media_data.background
  const logo = social_media_data.company.logo
  const logoScale = social_media_data.avatar.logoScale

  const positions = usePresentationAppearance(pageId, 'conteudo').element_positions
  const logoDrag = useElementDrag(pageId, 'logo', positions.logo, 'translate(-50%, -50%)', { positioned: true })

  const logoW = DESTAQUE_W * 0.6 * logoScale

  return (
    <div className="sm-piece" style={{ width: DESTAQUE_W, height: DESTAQUE_H, position: 'relative', overflow: 'hidden', ...destaqueBgStyle(d, background) }}>
      {logo && (
        <div
          className={logoDrag.className}
          onPointerDown={logoDrag.onPointerDown}
          style={{ position: 'absolute', top: '35%', left: '50%', ...logoDrag.style }}
        >
          <div style={{ width: logoW, height: logoW, ...logoBgStyle(logo) }} />
          {logoDrag.handle}
        </div>
      )}
      {!logo && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          color: '#888', fontSize: 60, textAlign: 'center', lineHeight: 1.4,
        }}>
          Logo<br />não<br />definida
        </div>
      )}
    </div>
  )
}
