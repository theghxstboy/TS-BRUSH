import { useBrandStore } from '../../store/useBrandStore'
import { usePageColors } from '../../hooks/usePageColors'
import { usePresentationTextStyles } from '../../hooks/usePresentationTextStyles'
import { HUD } from '../canvas/HUD'
import { DEFAULT_MONO_FONT, getFontFamilyStack, resolveFontName } from '../../lib/fontUtils'

interface PageTipografiaProps { pageNumber: number }

const ALPHABET = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
const NUMS = '0123456789 !@#$%&'

export function PageTipografia({ pageNumber }: PageTipografiaProps) {
  const { tipografia } = useBrandStore()
  const { primaryColor, darkColor, contentTitleColor, textColor, pageColor, logoBackdropColor, pageBackgroundStyle } = usePageColors('tipografia-principal')
  const { pageTitleStyle, bodyStyle } = usePresentationTextStyles()
  const primaryName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
  const secondaryName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)
  const primaryFontFamily = getFontFamilyStack(primaryName)
  const secondaryFontFamily = getFontFamilyStack(secondaryName, DEFAULT_MONO_FONT, 'monospace')

  const hasPrimary = !!primaryName
  const hasSecondary = !!secondaryName

  return (
    <div className="pagina-pdf" style={{ background: pageColor, color: textColor, ...pageBackgroundStyle }}>
      <div className="fundo" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '34%', background: logoBackdropColor }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, background: primaryColor }} />
      </div>

      <div className="conteudo tipo-layout">
        <div className="tipo-left">
          <div>
            <div style={{ ...bodyStyle(11), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: primaryColor }}>Sistema de</div>
            <div className="tipo-title" style={{ color: contentTitleColor, ...pageTitleStyle(40, { lineHeight: 1.1 }) }}>Tipo<br />grafia</div>
            <div style={{ width: 36, height: 3, background: primaryColor, marginTop: 12, borderRadius: 2 }} />
          </div>

          <div
            style={{
              fontSize: 130,
              fontWeight: 900,
              color: contentTitleColor,
              opacity: 0.08,
              lineHeight: 1,
              userSelect: 'none',
              marginBottom: -16,
              fontFamily: hasPrimary ? primaryFontFamily : 'inherit',
            }}
          >
            Aa
          </div>
        </div>

        <div className="tipo-right">
          {hasPrimary && (
            <div className="tipo-block">
              <div style={{ ...bodyStyle(10), fontWeight: 700, color: primaryColor, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Fonte Principal</div>
              <div className="tipo-block-name" style={{ color: darkColor }}>{primaryName}</div>
              {tipografia.principal_estilos && (
                <div className="tipo-block-styles" style={{ ...bodyStyle(12), color: '#71717a' }}>{tipografia.principal_estilos}</div>
              )}
              <div className="tipo-alphabet" style={{ fontFamily: primaryFontFamily, color: '#1a1a1a', fontSize: hasSecondary ? 15 : 16 }}>
                {ALPHABET}
              </div>
              <div className="tipo-alphabet" style={{ fontFamily: primaryFontFamily, fontSize: 13, color: '#52525b', marginTop: 4 }}>
                {NUMS}
              </div>

              {!hasSecondary && (
                <>
                  <div style={{ height: 12 }} />
                  {['Light', 'Regular', 'Bold', 'Black'].map((weightLabel, index) => (
                    <div
                      key={weightLabel}
                      style={{
                        fontFamily: primaryFontFamily,
                        fontSize: 15 + index * 3,
                        fontWeight: [300, 400, 700, 900][index],
                        color: '#1a1a1a',
                        lineHeight: 1.3,
                        opacity: 0.75,
                      }}
                    >
                      {primaryName} - {weightLabel}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {hasPrimary && hasSecondary && <div className="tipo-divider" />}

          {hasSecondary && (
            <div className="tipo-block">
              <div style={{ ...bodyStyle(10), fontWeight: 700, color: primaryColor, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Fonte Secundaria</div>
              <div className="tipo-block-name" style={{ fontSize: 18, color: darkColor }}>{secondaryName}</div>
              {tipografia.secundaria_estilos && (
                <div className="tipo-block-styles" style={{ ...bodyStyle(12), color: '#71717a' }}>{tipografia.secundaria_estilos}</div>
              )}
              <div className="tipo-alphabet" style={{ fontFamily: secondaryFontFamily, color: '#52525b' }}>
                {ALPHABET.slice(0, 36)}
              </div>
            </div>
          )}

          {!hasPrimary && !hasSecondary && (
            <div style={{ color: '#71717a', fontSize: 13 }}>
              Preencha as fontes da marca no painel deste slide para visualizar.
            </div>
          )}
        </div>
      </div>

      <HUD sectionTitle="Tipografia" pageNumber={pageNumber} titleColor={contentTitleColor} lineColor="rgba(0,0,0,0.1)" numColor={primaryColor} />
    </div>
  )
}
