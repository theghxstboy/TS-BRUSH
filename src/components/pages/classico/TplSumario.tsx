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
  const { primaryColor, darkColor, textColor } = usePageColors('sumario')
  const { pageTitleStyle, bodyStyle, metaStyle } = usePresentationTextStyles()

  return (
    <div className="pagina-pdf" style={{ background: '#f7f5f1', position: 'relative', color: textColor }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '34%', background: darkColor }} />
        <div style={{ position: 'absolute', left: '34%', top: 0, bottom: 0, width: 6, background: primaryColor }} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '34% 1fr',
          zIndex: 5,
        }}
      >
        <div style={{ padding: '42px 28px 52px 36px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: primaryColor, ...metaStyle(11, { fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }) }}>
              Navegação
            </div>
            <div style={{ color: '#fff', fontWeight: 900, marginTop: 10, ...pageTitleStyle(44, { lineHeight: 0.95 }) }}>
              Sumário
            </div>
            <div style={{ width: 44, height: 3, background: primaryColor, borderRadius: 999, marginTop: 18 }} />
          </div>

          <div style={{ color: 'rgba(255,255,255,0.72)', ...bodyStyle(12, { lineHeight: 1.7 }) }}>
            Consulte esta estrutura para localizar rapidamente cada orientação do manual e navegar pelos capítulos do template.
          </div>
        </div>

        <div style={{ padding: '34px 38px 50px 34px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {grupos.map((grupo) => (
            <div
              key={grupo.numero}
              style={{
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 18,
                padding: '18px 18px 16px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    minWidth: 42,
                    height: 42,
                    borderRadius: 12,
                    background: darkColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  {String(grupo.numero).padStart(2, '0')}
                </div>
                <div style={{ fontWeight: 800, color: darkColor, ...pageTitleStyle(18) }}>{grupo.titulo}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grupo.itens.map((item) => (
                  <div
                    key={`${grupo.numero}-${item.titulo}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 10,
                      alignItems: 'start',
                      paddingTop: 8,
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div
                      style={{
                        color: primaryColor,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {item.pagina}
                    </div>
                    <div style={{ color: '#2f2a24', ...bodyStyle(14, { lineHeight: 1.35 }) }}>{item.titulo}</div>
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
        <div style={{ flex: 1, height: 1.5, background: darkColor, opacity: 0.2 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: darkColor }}>
          {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
