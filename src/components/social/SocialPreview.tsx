import { useState, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ChevronLeft, Search, Home, Compass, Film, Send, PlusSquare, Heart, Menu, ChevronDown,
  Grid3x3, Clapperboard, Bookmark, Contact as TagIcon, MoreHorizontal, Settings, UserPlus, Camera,
  Video, MessageCircle, Bell, Globe, Phone, Mail, Plus, X,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'
import { getLucideIcon, getSimpleIcon } from '../../lib/socialIcons'
import { fileToBase64 } from '../../lib/imageUtils'
import { logoBgStyle } from './controls'
import { SmCover } from './SmCover'

// Pré-visualização interna + editável: réplica dos perfis Instagram/Facebook (desktop+mobile, claro+escuro)
// com os assets reais da marca. Clique pra editar textos, trocar/adicionar destaques. Escreve no mesmo estado. Uso interno.

type Platform = 'instagram' | 'facebook'
type Device = 'desktop' | 'mobile'

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9._]+/g, '').slice(0, 30)

function useProfile() {
  const { social_media_data: sm, setSocialMediaData } = useBrandStore()
  const c = sm.company
  const handle = slug(c.instagram || c.facebook || c.name) || 'suamarca'
  const bio = c.services || ''
  const about = sm.mvv.mission || ''
  const highlights = sm.destaques.filter((d) => (d.kind ?? 'button') !== 'contact').slice(0, 10)
  const setCompany = (k: keyof typeof c, v: string) => setSocialMediaData({ company: { ...c, [k]: v } })
  const setMvv = (k: 'mission' | 'vision' | 'values', v: string) => setSocialMediaData({ mvv: { ...sm.mvv, [k]: v } })
  const updateDestaque = (id: string, patch: Partial<typeof sm.destaques[number]>) => setSocialMediaData({ destaques: sm.destaques.map((d) => (d.id === id ? { ...d, ...patch } : d)) })
  const addDestaque = () => setSocialMediaData({ destaques: [...sm.destaques, { id: `d${Date.now()}`, label: 'Novo', icon: 'Star' }] })
  const removeDestaque = (id: string) => setSocialMediaData({ destaques: sm.destaques.filter((d) => d.id !== id) })
  return { c, handle, bio, about, highlights, sm, setCompany, setMvv, updateDestaque, addDestaque, removeDestaque }
}

// Texto editável inline: clica → edita → salva no blur. Enter confirma (input) ou quebra linha (textarea).
function Editable({ value, onCommit, multiline, placeholder, style, accent = '#f0a500' }: {
  value: string; onCommit: (v: string) => void; multiline?: boolean; placeholder?: string; style?: CSSProperties; accent?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const common = {
    autoFocus: true, value: draft,
    onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
    onBlur: () => { setEditing(false); if (draft !== value) onCommit(draft) },
    style: { font: 'inherit', color: 'inherit', background: 'rgba(127,127,127,0.14)', border: `1px solid ${accent}`, borderRadius: 5, padding: '2px 6px', width: '100%', outline: 'none', resize: 'vertical' as const, ...style },
  }
  if (editing) {
    return multiline
      ? <textarea {...common} rows={3} />
      : <input {...common} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} />
  }
  return (
    <span onClick={() => { setDraft(value); setEditing(true) }} title="Clique para editar" style={{ cursor: 'text', whiteSpace: multiline ? 'pre-wrap' : undefined, borderRadius: 4, ...style }}>
      {value || <span style={{ opacity: 0.45 }}>{placeholder}</span>}
    </span>
  )
}

// ── Logos oficiais (simple-icons) ──
function IgLogo({ size }: { size: number }) {
  const si = getSimpleIcon('siInstagram')
  if (!si) return null
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Instagram">
      <defs>
        <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#feda75" /><stop offset=".25" stopColor="#fa7e1e" />
          <stop offset=".5" stopColor="#d62976" /><stop offset=".75" stopColor="#962fbf" /><stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <path d={si.path} fill="url(#igGrad)" />
    </svg>
  )
}
function FbLogo({ size }: { size: number }) {
  const si = getSimpleIcon('siFacebook')
  if (!si) return null
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="#1877f2" aria-label="Facebook"><path d={si.path} /></svg>
}

function Avatar({ size, ring, ringColor = '#fff' }: { size: number; ring?: boolean; ringColor?: string }) {
  const { c } = useProfile()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: '#fff', flexShrink: 0,
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: ring ? `4px solid ${ringColor}` : '1px solid rgba(0,0,0,0.1)',
    }}>
      {c.logo
        ? <div style={{ width: '84%', height: '84%', ...logoBgStyle(c.logo) }} />
        : <span style={{ fontSize: size * 0.4, fontWeight: 700, color: '#bbb' }}>{(c.name || 'M').charAt(0).toUpperCase()}</span>}
    </div>
  )
}

function HiIcon({ name, size = 24, color }: { name: string; size?: number; color: string }) {
  if (name?.startsWith('emoji:')) return <span style={{ fontSize: size * 0.9 }}>{name.slice(6)}</span>
  const Icon = getLucideIcon(name)
  return Icon ? <Icon size={size} color={color} strokeWidth={1.8} /> : <span style={{ fontSize: size * 0.8, color }}>★</span>
}

function FbCover({ width }: { width: number }) {
  const scale = width / 1640
  return (
    <div style={{ width, height: 624 * scale, overflow: 'hidden', position: 'relative', pointerEvents: 'none' }}>
      <div style={{ width: 1640, height: 624, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <SmCover pageId="sm-cover-facebook" w={1640} h={624} />
      </div>
    </div>
  )
}

// Destaques editáveis (highlights): clique na bolha troca a imagem, no título renomeia, × remove, + adiciona.
function Highlights({ mobile, t, dark }: { mobile: boolean; t: { text: string; sec: string; border: string }; dark: boolean }) {
  const { highlights, updateDestaque, addDestaque, removeDestaque } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingId = useRef<string | null>(null)
  const d = mobile ? 56 : 78

  const onPick = (id: string) => { pendingId.current = id; fileRef.current?.click() }

  return (
    <div className="sp-scroll" style={{ display: 'flex', gap: mobile ? 16 : 22, padding: mobile ? '14px 14px 10px' : '28px 2px 14px', overflowX: 'auto', alignItems: 'flex-start' }}>
      {highlights.map((h) => (
        <div key={h.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0, position: 'relative' }}>
          <button onClick={() => removeDestaque(h.id)} title="Remover destaque" style={{ position: 'absolute', top: -3, right: 4, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: 0 }}><X size={11} /></button>
          <div onClick={() => onPick(h.id)} title="Trocar imagem do destaque" style={{ width: d, height: d, borderRadius: '50%', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? '#121212' : '#fafafa', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
            {h.image
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${h.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              : <HiIcon name={h.icon} size={mobile ? 22 : 30} color={t.text} />}
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera size={9} color="#fff" /></div>
          </div>
          <Editable value={h.label} onCommit={(v) => updateDestaque(h.id, { label: v })} placeholder="Título" style={{ fontSize: 12, color: t.text, maxWidth: mobile ? 66 : 82, textAlign: 'center' }} />
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <button onClick={addDestaque} title="Adicionar destaque" style={{ width: d, height: d, borderRadius: '50%', border: `1px dashed ${t.sec}`, background: 'transparent', color: t.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={mobile ? 22 : 28} /></button>
        <span style={{ fontSize: 12, color: t.sec }}>Novo</span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f && pendingId.current) updateDestaque(pendingId.current, { image: await fileToBase64(f) }); e.target.value = '' }} />
    </div>
  )
}

// ───────────────────────────── Instagram ─────────────────────────────
function Instagram({ device, dark }: { device: Device; dark: boolean }) {
  const { c, handle, bio, setCompany } = useProfile()
  const mobile = device === 'mobile'
  const link = c.website?.replace(/^https?:\/\//, '')
  const t = dark
    ? { bg: '#000', text: '#fafafa', sec: '#a8a8a8', border: '#262626', chip: '#363636', link: '#e0f1ff' }
    : { bg: '#fff', text: '#262626', sec: '#737373', border: '#dbdbdb', chip: '#efefef', link: '#00376b' }

  const Stat = ({ n, l }: { n: string; l: string }) => (
    <div style={{ textAlign: mobile ? 'center' : 'left', fontSize: mobile ? 14 : 16, color: t.text }}>
      <b>{n}</b>{mobile ? <><br /><span style={{ color: t.sec }}>{l}</span></> : <span> {l}</span>}
    </div>
  )
  const chipBtn = (label: string, grow?: boolean): ReactNode => (
    <button style={{ flex: grow ? 1 : undefined, background: t.chip, border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 14, fontWeight: 600, color: t.text, cursor: 'default' }}>{label}</button>
  )
  const NameBio = () => (
    <>
      <div style={{ fontWeight: 600, fontSize: mobile ? 14 : undefined, color: t.text }}><Editable value={c.name} onCommit={(v) => setCompany('name', v)} placeholder="Sua Marca" /></div>
      <div style={{ fontSize: mobile ? 14 : undefined, lineHeight: 1.4, color: t.text }}><Editable value={bio} multiline onCommit={(v) => setCompany('services', v)} placeholder="Escreva a bio…" /></div>
      {link && <div style={{ fontSize: mobile ? 14 : undefined, color: t.link, fontWeight: 600 }}>{link}</div>}
    </>
  )
  const Empty = () => (
    <div style={{ borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: mobile ? '46px 24px' : '72px 24px', textAlign: 'center' }}>
      <div style={{ width: mobile ? 62 : 72, height: mobile ? 62 : 72, borderRadius: '50%', border: `2px solid ${t.text}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera size={mobile ? 30 : 36} color={t.text} /></div>
      <div style={{ fontSize: mobile ? 22 : 30, fontWeight: 800, color: t.text }}>Compartilhe fotos</div>
      <div style={{ fontSize: 14, color: t.sec, maxWidth: 360 }}>Quando você compartilhar fotos, elas aparecerão no seu perfil.</div>
    </div>
  )

  if (mobile) {
    return (
      <div style={{ fontFamily: FONT, color: t.text, background: t.bg, minHeight: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 20, fontWeight: 700 }}>{handle} <ChevronDown size={16} /></div>
          <div style={{ display: 'flex', gap: 20 }}><PlusSquare size={24} color={t.text} /><Menu size={24} color={t.text} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 16px 6px' }}>
          <Avatar size={86} />
          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around' }}><Stat n="0" l="posts" /><Stat n="0" l="seguidores" /><Stat n="0" l="seguindo" /></div>
        </div>
        <div style={{ padding: '0 16px' }}><NameBio /></div>
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', alignItems: 'center' }}>{chipBtn('Editar perfil', true)}{chipBtn('Compartilhar perfil', true)}<button style={{ background: t.chip, border: 'none', borderRadius: 8, padding: 8, cursor: 'default', display: 'flex' }}><UserPlus size={18} color={t.text} /></button></div>
        <Highlights mobile t={t} dark={dark} />
        <div style={{ display: 'flex', borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
          {[Grid3x3, Clapperboard, TagIcon].map((Ic, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '11px 0', borderTop: i === 0 ? `1px solid ${t.text}` : 'none', marginTop: -1, color: i === 0 ? t.text : t.sec }}><Ic size={24} /></div>
          ))}
        </div>
        <Empty />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: FONT, color: t.text, background: t.bg, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, background: t.bg, zIndex: 2 }}>
        <IgLogo size={29} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.chip, borderRadius: 8, padding: '8px 14px', width: 268, color: t.sec }}><Search size={16} /> <span style={{ fontSize: 14 }}>Pesquisar</span></div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', color: t.text }}><Home size={24} /><Send size={24} /><PlusSquare size={24} /><Compass size={24} /><Film size={24} /><Heart size={24} /><Avatar size={26} /></div>
      </div>
      <div style={{ maxWidth: 935, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ display: 'flex', gap: 90, paddingLeft: 30, marginBottom: 10 }}>
          <div style={{ flex: '0 0 150px', display: 'flex', justifyContent: 'center' }}><Avatar size={150} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{handle}</span>
              {chipBtn('Editar perfil')}{chipBtn('Ver arquivo')}<Settings size={22} color={t.text} />
            </div>
            <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}><Stat n="0" l="publicações" /><Stat n="0" l="seguidores" /><Stat n="0" l="seguindo" /></div>
            <NameBio />
          </div>
        </div>
        <Highlights mobile={false} t={t} dark={dark} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, borderTop: `1px solid ${t.border}`, marginTop: 12 }}>
          {([[Grid3x3, 'PUBLICAÇÕES'], [Clapperboard, 'REELS'], [Bookmark, 'SALVOS'], [TagIcon, 'MARCAÇÕES']] as [typeof Grid3x3, string][]).map(([Ic, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 0', fontSize: 12, fontWeight: 600, letterSpacing: 1, color: i === 0 ? t.text : t.sec, borderTop: i === 0 ? `1px solid ${t.text}` : 'none', marginTop: -1 }}><Ic size={12} /> {label}</div>
          ))}
        </div>
        <Empty />
      </div>
    </div>
  )
}

// ───────────────────────────── Facebook ─────────────────────────────
function Facebook({ device, dark }: { device: Device; dark: boolean }) {
  const { c, about, setCompany, setMvv } = useProfile()
  const mobile = device === 'mobile'
  const coverW = mobile ? 368 : 940
  const avSize = mobile ? 88 : 168
  const BLUE = '#1877f2'
  const t = dark
    ? { app: '#18191a', card: '#242526', text: '#e4e6eb', sec: '#b0b3b8', border: '#3e4042', chip: '#3a3b3c', nav: '#242526' }
    : { app: '#f0f2f5', card: '#fff', text: '#050505', sec: '#65676b', border: '#dadde1', chip: '#e4e6eb', nav: '#fff' }
  const cardShadow = dark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
  const cardBorder = dark ? `1px solid ${t.border}` : 'none'

  const BlueBtn = ({ children }: { children: ReactNode }) => (
    <button style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>{children}</button>
  )
  const GreyBtn = ({ children }: { children: ReactNode }) => (
    <button style={{ background: t.chip, color: t.text, border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>{children}</button>
  )

  const tabs = ['Publicações', 'Sobre', 'Amigos', 'Fotos', 'Vídeos', 'Mais']
  const Tabs = () => (
    <div className="sp-scroll" style={{ display: 'flex', gap: 2, padding: mobile ? '0 8px' : '0 16px', borderTop: `1px solid ${t.border}`, overflowX: 'auto' }}>
      {tabs.map((tb, i) => (
        <div key={tb} style={{ padding: '15px 14px', fontSize: 15, fontWeight: 600, color: i === 0 ? BLUE : t.sec, borderBottom: i === 0 ? `3px solid ${BLUE}` : '3px solid transparent', whiteSpace: 'nowrap' }}>{tb}</div>
      ))}
    </div>
  )

  const Intro = () => (
    <div style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: t.text }}>Introdução</div>
      <div style={{ fontSize: 15, textAlign: 'center', color: t.text, marginBottom: 12 }}><Editable value={about} multiline onCommit={(v) => setMvv('mission', v)} placeholder="Escreva uma descrição…" /></div>
      {([[Globe, c.website], [Mail, c.email], [Phone, c.phone]] as [typeof Globe, string][]).filter(([, v]) => v).map(([Ic, v], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: t.text, padding: '5px 0' }}><Ic size={20} color={t.sec} /> {v}</div>
      ))}
    </div>
  )

  const Feed = () => (
    <>
      <div style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, padding: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar size={40} />
        <div style={{ flex: 1, background: t.chip, borderRadius: 50, padding: '10px 16px', color: t.sec, fontSize: 15 }}>No que você está pensando?</div>
      </div>
      <div style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, padding: '40px 16px', textAlign: 'center', color: t.sec, fontSize: 15 }}>Nenhuma publicação ainda.</div>
    </>
  )

  return (
    <div style={{ fontFamily: FONT, background: t.app, minHeight: '100%', color: t.text }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: t.nav, borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FbLogo size={40} />
          {!mobile && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.chip, borderRadius: 50, padding: '10px 14px', width: 240, color: t.sec }}><Search size={16} /> <span style={{ fontSize: 15 }}>Pesquisar no Facebook</span></div>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[Home, Video, MessageCircle, Bell, Menu].map((Ic, i) => (
            <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: t.chip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={20} color={t.text} /></div>
          ))}
        </div>
      </div>

      <div style={{ background: t.card }}>
        <div style={{ position: 'relative', margin: '0 auto', maxWidth: coverW, borderRadius: mobile ? 0 : '0 0 8px 8px', overflow: 'hidden' }}>
          <FbCover width={coverW} />
          <div style={{ position: 'absolute', left: mobile ? '50%' : 24, bottom: mobile ? -avSize / 2 : -22, transform: mobile ? 'translateX(-50%)' : undefined }}>
            <Avatar size={avSize} ring ringColor={t.card} />
          </div>
        </div>
        <div style={{ maxWidth: coverW, margin: '0 auto', padding: mobile ? `${avSize / 2 + 12}px 16px 0` : '14px 24px 0' }}>
          <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'center' : 'flex-end', justifyContent: 'space-between', gap: 12, paddingLeft: mobile ? 0 : avSize + 20, textAlign: mobile ? 'center' : 'left' }}>
            <div>
              <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 800, color: t.text }}><Editable value={c.name} onCommit={(v) => setCompany('name', v)} placeholder="Sua Marca" /></div>
              <div style={{ fontSize: 15, color: t.sec, marginTop: 2 }}>0 curtidas · 0 seguidores</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><BlueBtn><Plus size={18} /> Criar story</BlueBtn><GreyBtn>Editar perfil</GreyBtn><GreyBtn><MoreHorizontal size={18} /></GreyBtn></div>
          </div>
          <div style={{ marginTop: 14 }}><Tabs /></div>
        </div>
      </div>

      <div style={{ maxWidth: coverW, margin: '16px auto', padding: '0 16px', display: mobile ? 'block' : 'grid', gridTemplateColumns: mobile ? undefined : '2fr 3fr', gap: 16 }}>
        <div style={{ marginBottom: mobile ? 16 : 0 }}><Intro /></div>
        <div><Feed /></div>
      </div>
    </div>
  )
}

// ───────────────────────────── Screen ─────────────────────────────
export function SocialPreview() {
  const setScreen = useAppStore((s) => s.setScreen)
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [device, setDevice] = useState<Device>('desktop')
  const [dark, setDark] = useState(true)

  const seg = (active: boolean): CSSProperties => ({
    padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: active ? 'var(--accent)' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)',
  })

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base, #0d0d0d)' }}>
      <div className="sm-topbar">
        <button type="button" className="editor-nav-back" onClick={() => setScreen('home')}><ChevronLeft size={16} /><span>Menu</span></button>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="sm-tabs">
            <button type="button" style={seg(platform === 'instagram')} onClick={() => setPlatform('instagram')}>Instagram</button>
            <button type="button" style={seg(platform === 'facebook')} onClick={() => setPlatform('facebook')}>Facebook</button>
          </div>
          <div className="sm-tabs">
            <button type="button" style={seg(device === 'desktop')} onClick={() => setDevice('desktop')}>Desktop</button>
            <button type="button" style={seg(device === 'mobile')} onClick={() => setDevice('mobile')}>Celular</button>
          </div>
          <div className="sm-tabs">
            <button type="button" style={seg(!dark)} onClick={() => setDark(false)}>Claro</button>
            <button type="button" style={seg(dark)} onClick={() => setDark(true)}>Escuro</button>
          </div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Clique nos textos e destaques pra editar</span>
      </div>

      <div className="sp-scroll" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: device === 'mobile' ? '32px 16px' : '24px 16px' }}>
        {device === 'mobile' ? (
          <div style={{ width: 390, height: 788, borderRadius: 44, border: '11px solid #111', overflow: 'hidden', background: dark ? '#000' : '#fff', boxShadow: '0 24px 70px rgba(0,0,0,0.6)', flexShrink: 0 }}>
            <div className="sp-scroll" style={{ height: '100%', overflowY: 'auto' }}>
              {platform === 'instagram' ? <Instagram device="mobile" dark={dark} /> : <Facebook device="mobile" dark={dark} />}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 1180, borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {platform === 'instagram' ? <Instagram device="desktop" dark={dark} /> : <Facebook device="desktop" dark={dark} />}
          </div>
        )}
      </div>
    </div>
  )
}
