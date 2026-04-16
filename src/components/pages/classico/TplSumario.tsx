import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

interface TplSumarioProps {
  pageNumber: number
  grupos: Array<{
    numero: number
    titulo: string
    itens: Array<{ pagina: string; titulo: string }>
  }>
}

export function TplSumario({ pageNumber, grupos }: TplSumarioProps) {
  const { pageColor, titleColor, textColor, detailColor, pageBackgroundStyle } = usePageColors('sumario')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  return (
    <div className="pagina-pdf" style={{ background: pageColor, position: 'relative', color: textColor, ...pageBackgroundStyle }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '44px 48px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div style={{ color: detailColor, ...metaStyle(12, { fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }) }}>
            Guia de Navegação
          </div>
          <div style={{ color: titleColor, fontWeight: 900, marginTop: 10, ...pageTitleStyle(48, { lineHeight: 0.95 }) }}>
            Sumário
          </div>
          <div style={{ width: 60, height: 4, background: detailColor, borderRadius: 999, marginTop: 20 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
          {grupos.map((grupo) => (
            <div
              key={grupo.numero}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderBottom: `2px solid ${detailColor}`, paddingBottom: 6 }}>
                <div
                  style={{
                    color: detailColor,
                    ...bodyStyle(20),
                    fontWeight: 900,
                  }}
                >
                  {String(grupo.numero).padStart(2, '0')}
                </div>
                <div style={{ fontWeight: 800, color: titleColor, ...pageTitleStyle(20), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {grupo.titulo}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {grupo.itens.map((item) => (
                  <div
                    key={`${grupo.numero}-${item.titulo}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ color: textColor, ...bodyStyle(15, { fontWeight: 500 }) }}>{item.titulo}</div>
                    <div style={{ flex: 1, borderBottom: `1.5px dotted ${textColor}`, opacity: 0.25, marginTop: 4 }} />
                    <div
                      style={{
                        color: detailColor,
                        ...metaStyle(14),
                        fontWeight: 800,
                      }}
                    >
                      {item.pagina}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 28,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 10,
        }}
      >
        <div style={{ flex: 1, height: 1.5, background: detailColor, opacity: 0.2 }} />
        <span style={{ ...bodyStyle(15), fontWeight: 800, color: detailColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
