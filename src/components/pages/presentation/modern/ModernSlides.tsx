import { useBrandStore } from '../../../../store/useBrandStore'
import { useElementDrag } from '../../../canvas/presentationDrag'
import { EditableText } from '../../../canvas/EditableText'
import tsLogo from '../../../../logos/TS.svg'
import { ModernFrame, useModernCtx, Eyebrow, Title, Card, CardDecor, Logo, bodyStyle, hexA, onColor } from './ModernFrame'

// Slides do "Padrão Moderno" equivalentes aos clássicos (capa, seção, conceito, comparação, mockup, final).
// Mesmos dados, mesmas edições (EditableText) e arrastos (useElementDrag) — só o desenho muda.

const YEAR = new Date().getFullYear()

// ---------------------------------------------------------------- CAPA
export function ModCapa({ pageId, pageNumber }: { pageId: string; pageNumber: number }) {
  const { presentation_data, setPresentationData } = useBrandStore()
  const c = useModernCtx(pageId, 'capa')
  const { brand_name, subtitle } = presentation_data
  // Capa sempre com a logo da TS: a apresentação é nossa, a logo do cliente é revelada nos slides seguintes.

  const logoDrag = useElementDrag(pageId, 'logo', c.positions.logo, 'translateY(-50%)', { positioned: true })
  const titleSize = brand_name.length > 18 ? 54 : brand_name.length > 11 ? 66 : 80

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label="Capa">
      {/* bloco de texto */}
      <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 560, display: 'flex', flexDirection: 'column' }}>
        <EditableText
          pageId={pageId}
          elementKey="subtitle"
          positions={c.positions}
          value={subtitle}
          placeholder="Apresentação de Identidade Visual"
          onCommit={(v) => setPresentationData({ ...presentation_data, subtitle: v })}
          as="p"
          style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.34em', textTransform: 'uppercase', color: c.detalhe, fontFamily: c.bodyFont, margin: 0 }}
        />
        <EditableText
          pageId={pageId}
          elementKey="title"
          positions={c.positions}
          value={brand_name}
          placeholder="Sua Marca"
          onCommit={(v) => setPresentationData({ ...presentation_data, brand_name: v })}
          as="h1"
          style={{ fontSize: titleSize, fontWeight: 900, lineHeight: 0.96, letterSpacing: '-0.02em', textTransform: 'uppercase', color: c.titulo, fontFamily: c.titleFont, margin: '20px 0 0', wordBreak: 'break-word' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30 }}>
          <span style={{ width: 44, height: 2, background: c.detalhe, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.muted, fontFamily: c.bodyFont }}>
            Proposta de identidade · {YEAR}
          </span>
        </div>
      </div>

      {/* cartão da logo */}
      <div
        className={logoDrag.className}
        onPointerDown={logoDrag.onPointerDown}
        style={{ position: 'absolute', right: 0, top: '50%', width: 400, height: 400, ...logoDrag.style }}
      >
        <Card ctx={c} style={{ width: '100%', height: '100%' }}>
          <CardDecor ctx={c} at="80% 15%" alpha={0.32} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo src={tsLogo} style={{ width: 260, height: 260, filter: `drop-shadow(0 24px 40px ${c.sombra})` }} />
          </div>
        </Card>
        {logoDrag.handle}
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- SEÇÃO
export function ModSecao({ pageId, pageNumber, numero, titulo }: { pageId: string; pageNumber: number; numero: string; titulo: string }) {
  const c = useModernCtx(pageId, 'secao')
  const contentDrag = useElementDrag(pageId, 'content', c.positions.content, 'translateY(-50%)', { positioned: true })

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero}`}>
      {/* numeral vazado ao fundo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 440,
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: c.titleFont,
          color: 'transparent',
          WebkitTextStroke: `1px ${hexA(c.titulo, 0.22)}`,
          letterSpacing: '-0.06em',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {numero}
      </div>

      <div className={contentDrag.className} onPointerDown={contentDrag.onPointerDown} style={{ position: 'absolute', left: 0, top: '50%', maxWidth: 680, ...contentDrag.style }}>
        <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em', color: c.detalhe, fontFamily: c.titleFont }}>{numero}</div>
        <Eyebrow ctx={c} style={{ marginTop: 26 }}>Proposta {numero}</Eyebrow>
        <Title ctx={c} size={60}>{titulo}</Title>
        <div style={{ width: 80, height: 4, background: c.detalhe, borderRadius: 2, marginTop: 26 }} />
        {contentDrag.handle}
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- CONCEITO + LOGO
export function ModConcept({ pageId, pageNumber, explanation, logoSrc, onExplanationCommit, numero }: { pageId: string; pageNumber: number; explanation: string; logoSrc: string | null; onExplanationCommit?: (v: string) => void; numero: string }) {
  const c = useModernCtx(pageId, 'conteudo')
  const conceptDrag = useElementDrag(pageId, 'concept', c.positions.concept, '', { positioned: true })
  const logoDrag = useElementDrag(pageId, 'logo', c.positions.logo, '', { positioned: true })
  const size = explanation.length > 1500 ? 10.5 : explanation.length > 1000 ? 12 : explanation.length > 600 ? 13 : 15

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Conceito`}>
      <div className={conceptDrag.className} onPointerDown={conceptDrag.onPointerDown} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 470, display: 'flex', flexDirection: 'column', overflow: 'hidden', ...conceptDrag.style }}>
        <Eyebrow ctx={c}>Conceito criativo</Eyebrow>
        <Title ctx={c}>A ideia por trás da marca</Title>
        <div style={{ width: 44, height: 2, background: c.detalhe, marginTop: 18 }} />
        <div style={{ flex: 1, overflow: 'hidden', marginTop: 18 }}>
          <EditableText
            pageId={pageId}
            elementKey="explanation"
            positions={c.positions}
            value={explanation}
            placeholder="Nenhuma explicação fornecida para esta versão."
            onCommit={onExplanationCommit ?? (() => {})}
            as="p"
            draggable={false}
            style={bodyStyle(c, size)}
          />
        </div>
        {conceptDrag.handle}
      </div>

      <div className={logoDrag.className} onPointerDown={logoDrag.onPointerDown} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 500, ...logoDrag.style }}>
        <Card ctx={c} style={{ width: '100%', height: '100%' }}>
          <CardDecor ctx={c} at="85% 10%" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo src={logoSrc} style={{ width: 320, height: 320, filter: `drop-shadow(0 24px 44px ${c.sombra})` }} placeholderColor={c.muted} />
          </div>
          <span style={{ position: 'absolute', left: 22, bottom: 18, fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: c.muted, fontFamily: c.bodyFont }}>
            Logo principal
          </span>
          <span style={{ position: 'absolute', right: 22, bottom: 18, fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color: c.detalhe, fontFamily: c.bodyFont }}>
            v.{numero}
          </span>
        </Card>
        {logoDrag.handle}
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- COMPARAÇÃO
export function ModComparison({ pageId, pageNumber, originalLogo, newLogo, numero }: { pageId: string; pageNumber: number; originalLogo: string | null; newLogo: string | null; numero: string }) {
  const c = useModernCtx(pageId, 'conteudo')
  const logoOldDrag = useElementDrag(pageId, 'logoOld', c.positions.logoOld)
  const logoNewDrag = useElementDrag(pageId, 'logoNew', c.positions.logoNew)

  const label = (text: string, color: string) => (
    <span style={{ position: 'absolute', left: 22, top: 18, fontSize: 9, fontWeight: 800, letterSpacing: '0.26em', textTransform: 'uppercase', color, fontFamily: c.bodyFont }}>{text}</span>
  )

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Evolução`}>
      <div>
        <Eyebrow ctx={c}>Rebranding</Eyebrow>
        <Title ctx={c}>Antes & depois</Title>
      </div>

      <div style={{ position: 'absolute', top: 120, bottom: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className={logoOldDrag.className} onPointerDown={logoOldDrag.onPointerDown} style={{ ...logoOldDrag.style }}>
          <Card ctx={c} style={{ width: '100%', height: '100%' }}>
            {label('Versão anterior', c.muted)}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Logo src={originalLogo} style={{ width: 300, height: 260 }} placeholderColor={c.muted} />
            </div>
          </Card>
          {logoOldDrag.handle}
        </div>

        <div className={logoNewDrag.className} onPointerDown={logoNewDrag.onPointerDown} style={{ ...logoNewDrag.style }}>
          <Card ctx={c} accent style={{ width: '100%', height: '100%' }}>
            <CardDecor ctx={c} at="80% 15%" />
            {label('Nova versão', c.detalhe)}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Logo src={newLogo} style={{ width: 320, height: 280, filter: `drop-shadow(0 24px 44px ${c.sombra})` }} placeholderColor={c.muted} />
            </div>
          </Card>
          {logoNewDrag.handle}
        </div>
      </div>

      {/* seta central */}
      <div aria-hidden style={{ position: 'absolute', left: '50%', top: 'calc(50% + 60px)', transform: 'translate(-50%, -50%)', width: 46, height: 46, borderRadius: '50%', background: c.detalhe, color: onColor(c.detalhe), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, zIndex: 5, boxShadow: `0 10px 24px ${c.sombra}` }}>
        →
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- MOCKUP
export function ModMockup({ pageId, pageNumber, mockupSrc, index, total, numero }: { pageId: string; pageNumber: number; mockupSrc: string; index: number; total: number; numero: string }) {
  const c = useModernCtx(pageId, 'conteudo')
  const badgeDrag = useElementDrag(pageId, 'badge', c.positions.badge, '', { positioned: true })
  const nn = String(index + 1).padStart(2, '0')
  const tt = String(total).padStart(2, '0')

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label={`Proposta ${numero} · Aplicação ${nn}`}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', border: `1px solid ${c.hair}`, boxShadow: `0 30px 60px ${c.sombra}`, background: hexA(c.titulo, 0.04) }}>
        {mockupSrc ? (
          <img src={mockupSrc} alt={`Aplicação ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: c.muted, fontSize: 13 }}>Mockup não disponível</div>
        )}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 42%)', pointerEvents: 'none' }} />

        <div className={badgeDrag.className} onPointerDown={badgeDrag.onPointerDown} style={{ position: 'absolute', left: 28, bottom: 24, color: '#fff', ...badgeDrag.style }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.detalhe, fontFamily: c.bodyFont }}>Aplicação {nn} / {tt}</div>
          <div style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', fontFamily: c.titleFont, marginTop: 6, lineHeight: 1 }}>{c.brand || 'Sua Marca'}</div>
          {badgeDrag.handle}
        </div>

        <div style={{ position: 'absolute', right: 24, top: 20, padding: '7px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.24em', fontFamily: c.bodyFont }}>
          {nn}/{tt}
        </div>
      </div>
    </ModernFrame>
  )
}

// ---------------------------------------------------------------- FINAL
export function ModFinal({ pageId, pageNumber }: { pageId: string; pageNumber: number }) {
  const { presentation_data, setPresentationData } = useBrandStore()
  const c = useModernCtx(pageId, 'final')
  const titleDrag = useElementDrag(pageId, 'title', c.positions.title, 'translateY(-50%)', { positioned: true })
  const badgeDrag = useElementDrag(pageId, 'badge', c.positions.badge, 'translateY(-50%)', { positioned: true })
  // Encerramento também assina com a logo da TS (igual à capa).

  return (
    <ModernFrame ctx={c} pageNumber={pageNumber} label="Encerramento">
      <div className={titleDrag.className} onPointerDown={titleDrag.onPointerDown} style={{ position: 'absolute', left: 0, top: '50%', width: 600, ...titleDrag.style }}>
        <Eyebrow ctx={c}>Agradecimento</Eyebrow>
        <h2 style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase', color: c.titulo, fontFamily: c.titleFont, margin: '14px 0 0' }}>
          Obrigado.
        </h2>
        <div style={{ width: 44, height: 2, background: c.detalhe, marginTop: 28 }} />
        <EditableText
          pageId={pageId}
          elementKey="finalBrand"
          positions={c.positions}
          value={presentation_data.brand_name}
          placeholder="Projeto Concluído"
          onCommit={(v) => setPresentationData({ ...presentation_data, brand_name: v })}
          as="p"
          draggable={false}
          style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.detalhe, fontFamily: c.bodyFont, margin: '22px 0 0' }}
        />
        <p style={{ ...bodyStyle(c, 12), marginTop: 10, color: c.muted }}>
          © {YEAR} · Agência TS · Autor da logo: {presentation_data.responsible_name || 'Não informado'}
        </p>
        {titleDrag.handle}
      </div>

      <div className={badgeDrag.className} onPointerDown={badgeDrag.onPointerDown} style={{ position: 'absolute', right: 0, top: '50%', width: 320, height: 320, ...badgeDrag.style }}>
        <Card ctx={c} style={{ width: '100%', height: '100%' }}>
          <CardDecor ctx={c} at="50% 50%" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo src={tsLogo} style={{ width: 200, height: 200, filter: `drop-shadow(0 20px 36px ${c.sombra})` }} />
          </div>
        </Card>
        {badgeDrag.handle}
      </div>
    </ModernFrame>
  )
}
