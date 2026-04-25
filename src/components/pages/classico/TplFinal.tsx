import { useBrandStore } from '../../../store/useBrandStore'
import type { SlideAppearance } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplFinalProps {
  overrideAppearance?: SlideAppearance
  overrideContent?: Record<string, any>
}

export function TplFinal({ overrideAppearance, overrideContent }: TplFinalProps) {
  const { projeto } = useBrandStore()
  const { pageColor, titleColor, textColor, detailColor, pageBackgroundStyle } = usePageColors('final', overrideAppearance)
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()

  const currentYear = new Date().getFullYear()
  const title = overrideContent?.title || 'OBRIGADO'
  const description = overrideContent?.description || `© ${currentYear} Todos os Direitos Reservados`
  const responsibleName = projeto.responsavel_manual || projeto.nome_marca || 'Seu nome'

  return (
    <div
      className="pagina-pdf"
      style={{
        background: pageColor,
        position: 'relative',
        overflow: 'hidden',
        color: textColor,
        ...pageBackgroundStyle,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          zIndex: 5,
        }}
      >
        <div style={{ fontWeight: 900, color: titleColor, ...pageTitleStyle(72, { lineHeight: 1, letterSpacing: '-0.04em', textAlign: 'center' }) }}>
          {title}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: 800, color: textColor, marginBottom: 4, ...bodyStyle(13, { textAlign: 'center' }) }}>
          {description}
        </div>
        <div style={{ color: textColor, ...bodyStyle(13, { textAlign: 'center' }) }}>
          <strong>Desenvolvido por:</strong> Agência TS | Designer{' '}
          <span style={{ color: detailColor, fontWeight: 700 }}>{responsibleName}</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 28,
          right: 28,
          height: 2,
          background: detailColor,
          opacity: 0.25,
          zIndex: 10,
        }}
      />
    </div>
  )
}
