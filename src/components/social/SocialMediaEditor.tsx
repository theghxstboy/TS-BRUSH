import { useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { ChevronLeft, Download, Upload, Plus, Trash2, Package, FolderDown, Image as ImageIcon, Circle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'
import { fileToBase64, extractBrandTheme } from '../../lib/imageUtils'
import { downloadPng, exportNodesZip } from '../../lib/exportPng'
import { PresDragProvider } from '../canvas/presentationDrag'
import { SmIconPicker } from './SmIconPicker'
import { SmDestaque, DESTAQUE_W, DESTAQUE_H } from './SmDestaque'
import { SmPlaque } from './SmPlaque'
import { SmContact } from './SmContact'
import { SmReviews } from './SmReviews'
import { SmAvatar, AVATAR_SIZE } from './SmAvatar'
import type { AvatarBg } from './SmAvatar'
import { SmCover, COVERS } from './SmCover'
import { SmSignature, SIG_W, SIG_H } from './SmSignature'
import { SmDrawer } from './SmDrawer'
import { Field, ImageField, IconSegmented } from './controls'

type Tab = 'avatar' | 'capas' | 'destaques' | 'assinatura'
const TABS: { id: Tab; label: string }[] = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'capas', label: 'Capas' },
  { id: 'destaques', label: 'Destaques' },
  { id: 'assinatura', label: 'Assinatura' },
]

// Quadriculado claro estilo Photoshop (só no preview; o PNG sai transparente).
const CHECKER = `
  linear-gradient(45deg, #c9c9c9 25%, transparent 25%),
  linear-gradient(-45deg, #c9c9c9 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #c9c9c9 75%),
  linear-gradient(-45deg, transparent 75%, #c9c9c9 75%)`

interface SmPiece { tab: Tab; folder: string; name: string; w: number; h: number; render: () => ReactNode }

function PieceFrame({ title, filename, w, h, targetW, checker, safe, children }: { title: string; filename: string; w: number; h: number; targetW: number; checker?: boolean; safe?: { w: number; h: number }; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const scale = targetW / w
  const checkerStyle = checker ? { backgroundImage: CHECKER, backgroundSize: '28px 28px', backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0', backgroundColor: '#ffffff' } : undefined
  return (
    <div className="sm-frame">
      <div className="sm-frame-head">
        <span>{title} <small style={{ color: 'var(--text-secondary)' }}>{w}×{h}{safe ? ' · área segura tracejada' : ''}</small></span>
        <button type="button" className="btn btn-secondary" style={{ width: 'auto', padding: '7px 12px' }} onClick={() => ref.current && downloadPng(ref.current, filename)}>
          <Download size={14} /> PNG
        </button>
      </div>
      <PresDragProvider scale={scale}>
        <div style={{ position: 'relative', width: w * scale, height: h * scale, overflow: 'hidden', borderRadius: 6, boxShadow: '0 0 0 1px rgba(255,255,255,0.18), 0 8px 30px rgba(0,0,0,0.4)', ...checkerStyle }}>
          <div ref={ref} style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {children}
          </div>
          {safe && (
            <div style={{ position: 'absolute', left: ((w - safe.w) / 2) * scale, top: ((h - safe.h) / 2) * scale, width: safe.w * scale, height: safe.h * scale, border: '1px dashed rgba(255,0,0,0.7)', pointerEvents: 'none', boxSizing: 'border-box' }} />
          )}
        </div>
      </PresDragProvider>
    </div>
  )
}

export function SocialMediaEditor() {
  const { setScreen } = useAppStore()
  const { social_media_data: sm, setSocialMediaData, exportJson, importJson } = useBrandStore()
  const importRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const stageRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [tab, setTab] = useState<Tab>('avatar')
  const [coverId, setCoverId] = useState<string>('facebook')

  const setCompany = (k: keyof typeof sm.company, v: string) => setSocialMediaData({ company: { ...sm.company, [k]: v } })
  const setMvv = (k: keyof typeof sm.mvv, v: string) => setSocialMediaData({ mvv: { ...sm.mvv, [k]: v } })
  // Tipo do destaque (com fallback por id pra estados já salvos sem `kind`).
  const kindOf = (dq: typeof sm.destaques[number]): 'button' | 'plaque' | 'contact' | 'logo' =>
    dq.kind ?? (dq.id === 'contact-globais' ? 'contact' : dq.id === 'reviews' ? 'logo' : ['mission', 'vision', 'values'].includes(dq.id) ? 'plaque' : 'button')
  const renderDestaque = (dq: typeof sm.destaques[number]) => {
    const pid = `sm-destaque-${dq.id}`
    const kind = kindOf(dq)
    if (kind === 'contact') return <SmContact pageId={pid} icon={dq.icon} />
    if (kind === 'logo') return <SmReviews pageId={pid} />
    if (kind === 'plaque') {
      const content = dq.content ?? (['mission', 'vision', 'values'].includes(dq.id) ? (dq.id as 'mission' | 'vision' | 'values') : 'mission')
      return <SmPlaque pageId={pid} icon={dq.icon} title={`${dq.label}:`} body={sm.mvv[content]} isList={content === 'values'} />
    }
    return <SmDestaque pageId={pid} icon={dq.icon} />
  }
  const updateDestaque = (id: string, patch: Partial<{ label: string; icon: string; kind: 'button' | 'plaque' | 'contact' | 'logo'; content: 'mission' | 'vision' | 'values' }>) =>
    setSocialMediaData({ destaques: sm.destaques.map((d) => (d.id === id ? { ...d, ...patch } : d)) })

  // Upload da logo + extração automática do tema (cores da logo).
  const handleLogo = async (f: File) => {
    const b64 = await fileToBase64(f)
    setSocialMediaData({ company: { ...sm.company, logo: b64 } })
    const theme = await extractBrandTheme(b64)
    if (theme) setSocialMediaData({
      theme,
      destaque: { ...sm.destaque, ringOuterColor: theme.primary, ringInnerColor: theme.accent, iconColor: theme.accent },
    })
  }

  const d = sm.destaque
  const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'peca'
  const fontStack = sm.font ? `'${sm.font}', 'Geist', system-ui, sans-serif` : `'Geist', system-ui, sans-serif`

  // Catálogo de peças (export stage oculto + downloads em lote).
  const PIECES: SmPiece[] = [
    ...(['white', 'black', 'bw', 'none'] as AvatarBg[]).map((bg) => ({
      tab: 'avatar' as const, folder: 'Avatar',
      name: `avatar-${bg === 'bw' ? 'pb' : bg === 'none' ? 'sem-fundo' : bg === 'black' ? 'preto' : 'branco'}`,
      w: AVATAR_SIZE, h: AVATAR_SIZE, render: () => <SmAvatar pageId="sm-avatar" bg={bg} />,
    })),
    ...COVERS.map((cov) => ({
      tab: 'capas' as const, folder: 'Capas', name: `capa-${cov.id}`, w: cov.w, h: cov.h,
      render: () => <SmCover pageId={`sm-cover-${cov.id}`} w={cov.w} h={cov.h} safe={cov.safe} />,
    })),
    { tab: 'assinatura' as const, folder: 'Assinatura', name: 'assinatura-email', w: SIG_W, h: SIG_H, render: () => <SmSignature pageId="sm-signature" /> },
    ...sm.destaques.map((dq) => ({
      tab: 'destaques' as const, folder: 'Destaques', name: `destaque-${slug(dq.label || dq.id)}`,
      w: DESTAQUE_W, h: DESTAQUE_H, render: () => renderDestaque(dq),
    })),
  ]

  const downloadAll = () => exportNodesZip(PIECES.map((p) => ({ path: `${p.folder}/${p.name}.png`, node: stageRefs.current.get(p.name) ?? null })), `redes-sociais-${slug(sm.company.name || 'marca')}`)
  const downloadTab = (t: Tab) => {
    const list = PIECES.filter((p) => p.tab === t)
    if (list.length === 1) { const n = stageRefs.current.get(list[0].name); if (n) downloadPng(n, list[0].name); return }
    exportNodesZip(list.map((p) => ({ path: `${p.name}.png`, node: stageRefs.current.get(p.name) ?? null })), t)
  }

  return (
    <div className="sm-editor" style={{ ['--sm-font' as string]: fontStack } as CSSProperties}>
      {/* Export stage oculto: todas as peças em tamanho natural, pros downloads em lote. */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        {PIECES.map((p) => (
          <div key={p.name} ref={(el) => { if (el) stageRefs.current.set(p.name, el); else stageRefs.current.delete(p.name) }} style={{ width: p.w, height: p.h }}>
            {p.render()}
          </div>
        ))}
      </div>
      <div className="sm-topbar">
        <button type="button" className="editor-nav-back" onClick={() => setScreen('home')}><ChevronLeft size={16} /><span>Menu</span></button>
        <div className="sm-tabs">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`sm-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <button type="button" className="btn btn-primary" style={{ width: 'auto' }} onClick={downloadAll}>
          <Package size={15} /> Baixar tudo (ZIP)
        </button>
      </div>

      <div className="sm-body">
        <aside className="sm-sidebar">
          <h4 className="sm-sec-title">Dados da empresa</h4>
          <Field label="Logo (cores da marca são extraídas dela)">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => logoRef.current?.click()}>
                <Upload size={14} /> {sm.company.logo ? 'Trocar' : 'Enviar'}
              </button>
              {sm.company.logo && (
                <>
                  <div style={{ width: 34, height: 34, borderRadius: 6, background: '#fff', backgroundImage: `url(${sm.company.logo})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', border: '1px solid var(--border)' }} />
                  <button type="button" className="btn btn-danger" style={{ width: 'auto', padding: '8px 10px' }} onClick={() => setSocialMediaData({ company: { ...sm.company, logo: null } })}><Trash2 size={14} /></button>
                </>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogo(f); e.target.value = '' }} />
          </Field>
          <IconSegmented
            label="Versão da logo (padrão de todas)"
            value={sm.company.logoVariant}
            onChange={(logoVariant) => setSocialMediaData({ company: { ...sm.company, logoVariant } })}
            options={[
              { value: 'original', icon: <ImageIcon size={16} />, title: 'Original (cores da logo)' },
              { value: 'white', icon: <Circle size={16} color="#8a8a8a" fill="#ffffff" />, title: 'Branca — logo clara p/ fundo escuro' },
              { value: 'black', icon: <Circle size={16} color="#8a8a8a" fill="#111111" />, title: 'Preta — logo escura p/ fundo claro' },
            ]}
          />
          <Field label="Nome"><input className="form-input" value={sm.company.name} onChange={(e) => setCompany('name', e.target.value)} /></Field>
          <Field label="Serviços (capa)"><textarea className="form-textarea" rows={2} value={sm.company.services} onChange={(e) => setCompany('services', e.target.value)} /></Field>
          <Field label="Telefone"><input className="form-input" value={sm.company.phone} onChange={(e) => setCompany('phone', e.target.value)} /></Field>
          <Field label="E-mail"><input className="form-input" value={sm.company.email} onChange={(e) => setCompany('email', e.target.value)} /></Field>
          <Field label="Site"><input className="form-input" value={sm.company.website} onChange={(e) => setCompany('website', e.target.value)} /></Field>
          <Field label="Instagram"><input className="form-input" value={sm.company.instagram} onChange={(e) => setCompany('instagram', e.target.value)} /></Field>
          <Field label="Facebook"><input className="form-input" value={sm.company.facebook} onChange={(e) => setCompany('facebook', e.target.value)} /></Field>

          <h4 className="sm-sec-title">Missão, Visão e Valores</h4>
          <Field label="Missão"><textarea className="form-textarea" rows={3} value={sm.mvv.mission} onChange={(e) => setMvv('mission', e.target.value)} /></Field>
          <Field label="Visão"><textarea className="form-textarea" rows={3} value={sm.mvv.vision} onChange={(e) => setMvv('vision', e.target.value)} /></Field>
          <Field label="Valores (um por linha)"><textarea className="form-textarea" rows={6} value={sm.mvv.values} onChange={(e) => setMvv('values', e.target.value)} /></Field>

          <h4 className="sm-sec-title">Tema (auto da logo)</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Primária"><input type="color" className="form-input" value={sm.theme.primary} onChange={(e) => setSocialMediaData({ theme: { ...sm.theme, primary: e.target.value } })} /></Field>
            <Field label="Destaque"><input type="color" className="form-input" value={sm.theme.accent} onChange={(e) => setSocialMediaData({ theme: { ...sm.theme, accent: e.target.value } })} /></Field>
          </div>
          <Field label="Fonte do canvas (Google Fonts)">
            <input className="form-input" value={sm.font} onChange={(e) => setSocialMediaData({ font: e.target.value })} placeholder="Ex: Poppins, Montserrat, Inter" />
          </Field>

          <h4 className="sm-sec-title">Fundo global do painel</h4>
          <Field label="Tipo">
            <select className="form-input" value={sm.background.mode} onChange={(e) => setSocialMediaData({ background: { ...sm.background, mode: e.target.value as 'color' | 'image' } })}>
              <option value="color">Cor sólida</option>
              <option value="image">Imagem / textura</option>
            </select>
          </Field>
          {sm.background.mode === 'color'
            ? <Field label="Cor"><input type="color" className="form-input" value={sm.background.color} onChange={(e) => setSocialMediaData({ background: { ...sm.background, color: e.target.value } })} /></Field>
            : <ImageField label="Imagem de fundo" value={sm.background.image} onChange={(v) => setSocialMediaData({ background: { ...sm.background, image: v } })} maxPx={3200} quality={0.92} />}

          <h4 className="sm-sec-title">Projeto</h4>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={() => exportJson('social-media')}><Download size={14} /> Exportar .json</button>
            <button type="button" className="btn btn-secondary" onClick={() => importRef.current?.click()}><Upload size={14} /> Importar</button>
          </div>
          <input ref={importRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = '' }} />
        </aside>

        <main className="sm-canvas">
          <div className="sm-tab-toolbar">
            <span className="sm-hint">Arraste os elementos • duplo-clique nos textos • PNG em alta resolução (2×).</span>
            <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => downloadTab(tab)}>
              <FolderDown size={14} /> Baixar todos da aba
            </button>
          </div>

          {tab === 'avatar' && (
            <div className="sm-pieces-row">
                {([['white', 'Fundo branco'], ['black', 'Fundo preto (logo branca)'], ['bw', 'Preto & branco'], ['none', 'Sem fundo']] as [AvatarBg, string][]).map(([bg, label]) => (
                  <PieceFrame key={bg} title={label} filename={`avatar-${bg}`} w={AVATAR_SIZE} h={AVATAR_SIZE} targetW={260} checker={bg === 'none'}>
                    <SmAvatar pageId="sm-avatar" bg={bg} />
                  </PieceFrame>
                ))}
            </div>
          )}

          {tab === 'capas' && (() => {
            const cov = COVERS.find((c) => c.id === coverId) ?? COVERS[0]
            return (
              <>
                <div className="sm-cover-chips">
                  {COVERS.map((c) => (
                    <button key={c.id} type="button" className={`sm-chip ${coverId === c.id ? 'active' : ''}`} onClick={() => setCoverId(c.id)}>
                      {c.label} <small>{c.w}×{c.h}</small>
                    </button>
                  ))}
                </div>
                <PieceFrame title={cov.label} filename={`capa-${cov.id}`} w={cov.w} h={cov.h} targetW={Math.min(820, cov.w)} safe={cov.safe}>
                  <SmCover pageId={`sm-cover-${cov.id}`} w={cov.w} h={cov.h} safe={cov.safe} />
                </PieceFrame>
              </>
            )
          })()}

          {tab === 'assinatura' && (
            <PieceFrame title="Assinatura de e-mail" filename="assinatura-email" w={SIG_W} h={SIG_H} targetW={560}>
              <SmSignature pageId="sm-signature" />
            </PieceFrame>
          )}

          {tab === 'destaques' && (
            <div className="sm-destaques-grid">
                {sm.destaques.map((dq) => (
                  <div key={dq.id} className="sm-destaque-cell">
                    <PieceFrame title={dq.label} filename={`destaque-${dq.label || dq.id}`} w={DESTAQUE_W} h={DESTAQUE_H} targetW={220} checker={kindOf(dq) === 'button' && d.bgMode === 'none'}>
                      {renderDestaque(dq)}
                    </PieceFrame>
                    <input className="form-input" value={dq.label} onChange={(e) => updateDestaque(dq.id, { label: e.target.value })} style={{ marginTop: 6 }} />
                    <select className="form-input" value={kindOf(dq)} onChange={(e) => updateDestaque(dq.id, { kind: e.target.value as 'button' | 'plaque' | 'contact' | 'logo' })} style={{ marginTop: 4 }}>
                      <option value="button">Ícone (botão)</option>
                      <option value="plaque">Placa (MVV)</option>
                      <option value="contact">Contato</option>
                      <option value="logo">Logo apenas</option>
                    </select>
                    {kindOf(dq) === 'plaque' && (
                      <select className="form-input" value={dq.content ?? 'mission'} onChange={(e) => updateDestaque(dq.id, { content: e.target.value as 'mission' | 'vision' | 'values' })} style={{ marginTop: 4 }}>
                        <option value="mission">Texto: Missão</option>
                        <option value="vision">Texto: Visão</option>
                        <option value="values">Texto: Valores</option>
                      </select>
                    )}
                    <SmIconPicker value={dq.icon} onChange={(name) => updateDestaque(dq.id, { icon: name })} />
                    <button type="button" className="btn btn-danger" style={{ marginTop: 4 }} onClick={() => setSocialMediaData({ destaques: sm.destaques.filter((x) => x.id !== dq.id) })}>
                      <Trash2 size={14} /> Remover
                    </button>
                  </div>
                ))}
                <button type="button" className="sm-add-destaque" onClick={() => {
                  const id = `d${Date.now()}`
                  const icon = (sm.iconDefaults ?? {})[id] ?? 'Star'
                  setSocialMediaData({ destaques: [...sm.destaques, { id, label: 'Novo', icon }] })
                }}>
                  <Plus size={22} /> Adicionar destaque
                </button>
            </div>
          )}
        </main>

        <SmDrawer tab={tab} />
      </div>
    </div>
  )
}
