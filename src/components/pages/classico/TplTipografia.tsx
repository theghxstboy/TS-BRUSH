import { useBrandStore } from '../../../store/useBrandStore'
import { usePageColors } from '../../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../../hooks/usePresentationTextStyles'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS = '0123456789'
const SYMS = '#%$@/|&!?()*'

interface TplTipografiaProps {
  pageNumber: number
  variante: 'principal' | 'secundaria'
}

export function TplTipografia({ pageNumber, variante }: TplTipografiaProps) {
  const { tipografia, conteudo_pdf } = useBrandStore()
  const { darkColor, contentTitleColor, textColor, pageColor } = usePageColors(variante === 'principal' ? 'tipografia-principal' : 'tipografia-secundaria')
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()

  const isPrincipal = variante === 'principal'
  const nome = isPrincipal ? tipografia.principal_nome : tipografia.secundaria_nome
  const estilos = isPrincipal ? tipografia.principal_estilos : tipografia.secundaria_estilos
  const titulo = isPrincipal
    ? (conteudo_pdf.tipografia_principal_titulo || 'Principal')
    : (conteudo_pdf.tipografia_secundaria_titulo || 'Secundária')
  const descricaoPadrao = isPrincipal
    ? `A tipografia principal da marca é ${nome || 'a fonte definida como principal'}. Moderna e versátil, ela garante legibilidade e personalidade à comunicação visual. Seu uso deve ser prioritário em títulos e peças institucionais para manter a identidade da marca consistente.`
    : `A tipografia secundária, ${nome || 'quando cadastrada'}, complementa a principal ao oferecer variações que se adaptam a diferentes contextos, como textos longos e materiais de suporte. Seu uso deve seguir as diretrizes para preservar a harmonia visual da marca.`
  const descricao = isPrincipal
    ? (conteudo_pdf.tipografia_principal_descricao || descricaoPadrao)
    : (conteudo_pdf.tipografia_secundaria_descricao || descricaoPadrao)

  const fontFamily = nome ? `'${nome}', sans-serif` : 'inherit'
  const weightLabels = estilos
    ? estilos.split(/[,;]/).map((item) => item.trim()).filter(Boolean)
    : ['Thin', 'Light', 'Regular', 'Medium', 'Bold', 'ExtraBold', 'Black']

  const weightMap: Record<string, number> = {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  }

  return (
    <div
      className="pagina-pdf"
      style={{ background: pageColor, position: 'relative', overflow: 'hidden', color: textColor }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '46% 1fr',
          padding: '40px 0 52px 40px',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, paddingRight: 24 }}>
          <h2 style={{ fontWeight: 900, color: contentTitleColor, margin: 0, ...pageTitleStyle(40) }}>{titulo}</h2>
          <p style={{ color: '#222', margin: 0, ...bodyStyle(13.5, { lineHeight: 1.75 }) }}>&nbsp;&nbsp;{descricao}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, paddingRight: 36, paddingLeft: 8 }}>
          <div style={{ fontFamily, fontSize: 72, fontWeight: 400, color: darkColor, lineHeight: 1 }}>Aa</div>
          <div style={{ fontFamily, fontSize: 13, fontWeight: 700, color: darkColor, letterSpacing: '0.05em', textAlign: 'center' }}>{UPPER}</div>
          <div style={{ fontFamily, fontSize: 13, fontWeight: 700, color: darkColor, letterSpacing: '0.05em', textAlign: 'center' }}>{LOWER}</div>
          <div style={{ fontFamily, fontSize: 13, fontWeight: 700, color: darkColor, letterSpacing: '0.05em', textAlign: 'center' }}>{NUMS}</div>
          <div style={{ fontFamily, fontSize: 13, fontWeight: 700, color: darkColor, letterSpacing: '0.04em', textAlign: 'center' }}>{SYMS}</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 38,
          left: 40,
          right: 40,
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          flexWrap: 'wrap',
          zIndex: 6,
        }}
      >
        {weightLabels.map((weight, index) => {
          const key = weight.toLowerCase().replace(/\s/g, '')
          const fw = weightMap[key] ?? (300 + index * 100)
          return (
            <span key={weight} style={{ fontFamily, fontSize: 15, fontWeight: fw, color: darkColor }}>
              {index > 0 && <span style={{ fontWeight: 300, color: '#aaa', marginRight: 2 }}>,</span>}
              {weight}
            </span>
          )
        })}
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
