import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { HUD } from '../canvas/HUD'

interface PageTipografiaProps { pageNumber: number }

const ALPHABET = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
const NUMS = '0123456789 !@#$%&'

export function PageTipografia({ pageNumber }: PageTipografiaProps) {
  const { tipografia } = useBrandStore()
  const { primaryColor, darkColor, BgOverlay } = usePageColors()

  const hasPrimary  = !!tipografia.principal_nome
  const hasSecondary = !!tipografia.secundaria_nome

  return (
    <div className="pagina-pdf" style={{ background: '#fff' }}>
      {/* Fundo */}
      <div className="fundo" style={{ zIndex: 0 }}>
        {/* Light left strip */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '34%', background: '#f4f4f5' }} />
        {/* Accent right strip */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, background: primaryColor }} />
      </div>

      {/* Conteudo */}
      <div className="conteudo tipo-layout">
        {/* Left — light bg, dark text */}
        <div className="tipo-left">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Sistema de</div>
            <div className="tipo-title" style={{ color: darkColor }}>Tipo<br />grafia</div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 12, borderRadius: 2 }} />
          </div>
          {/* Big letter showcase — uses the primary font if set */}
          <div style={{
            fontSize: 130, fontWeight: 900, color: darkColor, opacity: 0.08,
            lineHeight: 1, userSelect: 'none', marginBottom: -16,
            fontFamily: hasPrimary ? `'${tipografia.principal_nome}', sans-serif` : 'inherit',
          }}>
            Aa
          </div>
        </div>

        {/* Right — white bg, dark text */}
        <div className="tipo-right">
          {hasPrimary && (
            <div className="tipo-block">
              <div style={{ fontSize: 10, fontWeight: 700, color: primaryColor, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Fonte Principal</div>
              <div className="tipo-block-name" style={{ color: darkColor }}>{tipografia.principal_nome}</div>
              {tipografia.principal_estilos && (
                <div className="tipo-block-styles" style={{ color: '#71717a' }}>{tipografia.principal_estilos}</div>
              )}
              <div className="tipo-alphabet" style={{ fontFamily: `'${tipografia.principal_nome}', sans-serif`, color: '#1a1a1a', fontSize: hasSecondary ? 15 : 16 }}>
                {ALPHABET}
              </div>
              <div className="tipo-alphabet" style={{ fontFamily: `'${tipografia.principal_nome}', sans-serif`, fontSize: 13, color: '#52525b', marginTop: 4 }}>
                {NUMS}
              </div>
              {/* When no secondary, show more specimen sizes */}
              {!hasSecondary && (
                <>
                  <div style={{ height: 12 }} />
                  {['Light', 'Regular', 'Bold', 'Black'].map((w, i) => (
                    <div key={w} style={{
                      fontFamily: `'${tipografia.principal_nome}', sans-serif`,
                      fontSize: 15 + i * 3,
                      fontWeight: [300, 400, 700, 900][i],
                      color: '#1a1a1a',
                      lineHeight: 1.3,
                      opacity: 0.75,
                    }}>
                      {tipografia.principal_nome} — {w}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {hasPrimary && hasSecondary && <div className="tipo-divider" />}

          {hasSecondary && (
            <div className="tipo-block">
              <div style={{ fontSize: 10, fontWeight: 700, color: primaryColor, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Fonte Secundária</div>
              <div className="tipo-block-name" style={{ fontSize: 18, color: darkColor }}>{tipografia.secundaria_nome}</div>
              {tipografia.secundaria_estilos && (
                <div className="tipo-block-styles" style={{ color: '#71717a' }}>{tipografia.secundaria_estilos}</div>
              )}
              <div className="tipo-alphabet" style={{ fontFamily: `'${tipografia.secundaria_nome}', monospace`, color: '#52525b' }}>
                {ALPHABET.slice(0, 36)}
              </div>
            </div>
          )}

          {!hasPrimary && !hasSecondary && (
            <div style={{ color: '#71717a', fontSize: 13 }}>
              Preencha os campos de tipografia na barra lateral para visualizar.
            </div>
          )}
        </div>
      </div>

      {/* HUD */}
      <HUD sectionTitle="Tipografia" pageNumber={pageNumber} titleColor={darkColor} lineColor="rgba(0,0,0,0.1)" numColor={primaryColor} />
    </div>
  )
}
