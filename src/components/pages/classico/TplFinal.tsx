import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

export function TplFinal() {
  const { projeto } = useBrandStore()
  const { primaryColor, darkColor } = usePageColors()
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()

  const currentYear = new Date().getFullYear()
  const responsibleName = projeto.responsavel_manual || projeto.nome_marca || 'Seu nome'

  return (
    <div
      className="pagina-pdf"
      style={{
        background: primaryColor,
        position: 'relative',
        overflow: 'hidden',
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
        <div style={{ fontWeight: 900, color: darkColor, ...pageTitleStyle(72, { lineHeight: 1, letterSpacing: '-0.04em' }) }}>
          OBRIGADO
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
        <div style={{ fontWeight: 800, color: darkColor, marginBottom: 4, ...bodyStyle(13) }}>
          © {currentYear} Todos os Direitos Reservados
        </div>
        <div style={{ color: darkColor, ...bodyStyle(13) }}>
          <strong>Desenvolvido por:</strong> Trajetória Do Sucesso | Designer{' '}
          <span style={{ color: darkColor, fontWeight: 700 }}>{responsibleName}</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 28,
          right: 28,
          height: 2,
          background: darkColor,
          opacity: 0.25,
          zIndex: 10,
        }}
      />
    </div>
  )
}
