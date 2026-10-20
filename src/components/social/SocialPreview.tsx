import { useState, useRef, createContext, useContext } from 'react'
import type { CSSProperties, ReactNode, DragEvent, PointerEvent as ReactPointerEvent } from 'react'
import {
  ChevronLeft, Search, Home, Compass, Film, Send, PlusSquare, Heart, Menu, ChevronDown,
  Grid3x3, Clapperboard, Bookmark, Contact as TagIcon, MoreHorizontal, Settings, UserPlus, Camera, Image as ImageIcon,
  Video, MessageCircle, Bell, Globe, Phone, Mail, Plus, X, RotateCcw, Download,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'
import { getSimpleIcon } from '../../lib/socialIcons'
import { fileToBase64 } from '../../lib/imageUtils'
import { downloadPng } from '../../lib/exportPng'
import { SmCover } from './SmCover'

// Pré-visualização interna + editável: réplica dos perfis Instagram/Facebook (desktop+mobile, claro+escuro),
// com visão de Dono (edita) e Público. Clica/arrasta imagens, edita textos e números. Uso interno.

type Platform = 'instagram' | 'facebook'
type Device = 'desktop' | 'mobile'
interface Post { url: string; aspect: number }
interface Highlight { id: string; label: string; image: string | null }
interface Stats { posts: number | null; followers: number; following: number; likes: number }

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const DEFAULT_ASPECT = 1080 / 1350 // padrão do post (4:5)
const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9._]+/g, '').slice(0, 30)

// Número no estilo 1,2k / 1,2mi.
function fmt(n: number): string {
  const abbr = (x: number, suf: string) => (x >= 100 ? Math.round(x).toString() : x.toFixed(1).replace(/\.0$/, '')).replace('.', ',') + suf
  if (n < 1000) return String(n)
  if (n < 1_000_000) return abbr(n / 1000, 'k')
  return abbr(n / 1_000_000, 'mi')
}
// Detecta a proporção da imagem (1080x1350≈0.8, 1000x1000=1, 1080x1440=0.75). Padrão 4:5.
function loadAspect(url: string): Promise<number> {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => res(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : DEFAULT_ASPECT)
    img.onerror = () => res(DEFAULT_ASPECT)
    img.src = url
  })
}

// Arrastar e soltar imagem — reaproveitado em cada feature (avatar, capa, destaque, posts).
const imgFiles = (e: DragEvent) => Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
const dropHandlers = (onFiles: (files: File[]) => void) => ({
  onDragOver: (e: DragEvent) => e.preventDefault(),
  onDrop: (e: DragEvent) => { e.preventDefault(); const fs = imgFiles(e); if (fs.length) onFiles(fs) },
})

interface Preview {
  editable: boolean
  posts: Post[]; addPost: () => void; addFiles: (files: File[]) => void; removePost: (i: number) => void
  highlights: Highlight[]; addHighlight: () => void; updateHighlight: (id: string, patch: Partial<Highlight>) => void; removeHighlight: (id: string) => void
  stats: Stats; setStat: (k: keyof Stats, v: number) => void
  followed: boolean; toggleFollow: () => void
}
const Ctx = createContext<Preview>({
  editable: true, posts: [], addPost: () => {}, addFiles: () => {}, removePost: () => {},
  highlights: [], addHighlight: () => {}, updateHighlight: () => {}, removeHighlight: () => {},
  stats: { posts: null, followers: 0, following: 0, likes: 0 }, setStat: () => {}, followed: false, toggleFollow: () => {},
})
const usePreview = () => useContext(Ctx)

function useProfile() {
  const { social_media_data: sm, setSocialMediaData } = useBrandStore()
  const c = sm.company
  const about = sm.mvv.mission || ''
  const bio = c.services || ''
  const highlights = sm.destaques.filter((d) => (d.kind ?? 'button') !== 'contact').slice(0, 10)
  const setCompany = (k: keyof typeof c, v: string) => setSocialMediaData({ company: { ...c, [k]: v } })
  const setMvv = (k: 'mission' | 'vision' | 'values', v: string) => setSocialMediaData({ mvv: { ...sm.mvv, [k]: v } })
  const setCover = (photo: string) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, photo, layout: 'split' } })
  const updateDestaque = (id: string, patch: Partial<typeof sm.destaques[number]>) => setSocialMediaData({ destaques: sm.destaques.map((d) => (d.id === id ? { ...d, ...patch } : d)) })
  const addDestaque = () => setSocialMediaData({ destaques: [...sm.destaques, { id: `d${Date.now()}`, label: 'Novo', icon: 'Star' }] })
  const removeDestaque = (id: string) => setSocialMediaData({ destaques: sm.destaques.filter((d) => d.id !== id) })
  return { c, bio, about, highlights, sm, setCompany, setMvv, setCover, updateDestaque, addDestaque, removeDestaque }
}

// Texto editável inline (só no modo Dono).
function Editable({ value, onCommit, multiline, placeholder, style, accent = '#f0a500' }: {
  value: string; onCommit: (v: string) => void; multiline?: boolean; placeholder?: string; style?: CSSProperties; accent?: string
}) {
  const { editable } = usePreview()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  if (!editable) return <span style={style}>{value || <span style={{ opacity: 0.5 }}>{placeholder}</span>}</span>
  const common = {
    autoFocus: true, value: draft,
    onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
    onBlur: () => { setEditing(false); if (draft !== value) onCommit(draft) },
    style: { font: 'inherit', color: 'inherit', background: 'rgba(127,127,127,0.14)', border: `1px solid ${accent}`, borderRadius: 5, padding: '2px 6px', width: '100%', outline: 'none', resize: 'vertical' as const, ...style },
  }
  if (editing) return multiline ? <textarea {...common} rows={3} /> : <input {...common} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} />
  return (
    <span onClick={() => { setDraft(value); setEditing(true) }} title="Clique para editar" style={{ cursor: 'text', whiteSpace: multiline ? 'pre-wrap' : undefined, borderRadius: 4, ...style }}>
      {value || <span style={{ opacity: 0.45 }}>{placeholder}</span>}
    </span>
  )
}

// Número editável SEMPRE (inclusive no modo Público). Mostra formatado (1,2k), edita cru.
function EditNum({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  if (editing) return (
    <input autoFocus value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ''))}
      onBlur={() => { setEditing(false); onChange(Number(draft) || 0) }}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      style={{ width: 62, font: 'inherit', fontWeight: 700, color: 'inherit', background: 'rgba(127,127,127,0.16)', border: '1px solid #f0a500', borderRadius: 4, padding: '0 4px', outline: 'none' }} />
  )
  return <b onClick={() => { setDraft(String(value)); setEditing(true) }} title="Clique para editar o número" style={{ cursor: 'pointer' }}>{fmt(value)}</b>
}

function CamBadge({ size = 18, pos = 3 }: { size?: number; pos?: number }) {
  return (
    <div style={{ position: 'absolute', bottom: pos, right: pos, width: size, height: size, borderRadius: '50%', background: '#0095f6', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.4)', pointerEvents: 'none' }}>
      <Camera size={size * 0.55} color="#fff" />
    </div>
  )
}

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

// Avatar = foto de perfil (logo). Com editUpload (modo Dono): clica ou solta imagem pra trocar.
function Avatar({ size, ring, ringColor = '#fff', editUpload }: { size: number; ring?: boolean; ringColor?: string; editUpload?: boolean }) {
  const { c, setCompany } = useProfile()
  const { editable } = usePreview()
  const ref = useRef<HTMLInputElement>(null)
  const canEdit = editable && editUpload
  const setLogo = async (files: File[]) => { if (files[0]) setCompany('logo', await fileToBase64(files[0])) }
  return (
    <div
      onClick={canEdit ? () => ref.current?.click() : undefined}
      title={canEdit ? 'Clique ou arraste pra trocar a foto' : undefined}
      {...(canEdit ? dropHandlers(setLogo) : {})}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, cursor: canEdit ? 'pointer' : undefined }}
    >
      <div style={{ position: 'relative', width: size, height: size, boxSizing: 'border-box', borderRadius: '50%', background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: ring ? `4px solid ${ringColor}` : '1px solid rgba(0,0,0,0.1)' }}>
        {c.logo
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${c.logo}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          : <span style={{ fontSize: size * 0.4, fontWeight: 700, color: '#bbb' }}>{(c.name || 'M').charAt(0).toUpperCase()}</span>}
      </div>
      {canEdit && <CamBadge size={Math.max(20, Math.round(size * 0.2))} pos={Math.round(size * 0.04)} />}
      {canEdit && <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) await setLogo([f]); e.target.value = '' }} />}
    </div>
  )
}

// Capa real (SmCover) escalada. No modo Dono: botão de câmera ou arrastar imagem troca a foto.
function FbCover({ width, editable }: { width: number; editable: boolean }) {
  const { setCover } = useProfile()
  const ref = useRef<HTMLInputElement>(null)
  const scale = width / 1640
  const set = async (files: File[]) => { if (files[0]) setCover(await fileToBase64(files[0], 3200, 0.92)) }
  return (
    <div style={{ width, height: 624 * scale, overflow: 'hidden', position: 'relative' }} {...(editable ? dropHandlers(set) : {})}>
      <div style={{ width: 1640, height: 624, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <SmCover pageId="sm-cover-facebook" w={1640} h={624} />
      </div>
      {editable && (
        <>
          <button onClick={() => ref.current?.click()} title="Editar foto da capa (ou arraste uma imagem)" style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.92)', color: '#050505', border: 'none', borderRadius: 7, padding: '7px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}><Camera size={16} /> Editar capa</button>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) await set([f]); e.target.value = '' }} />
        </>
      )}
    </div>
  )
}

function Highlights({ mobile, t, dark }: { mobile: boolean; t: { text: string; sec: string; border: string }; dark: boolean }) {
  const { editable, highlights, addHighlight, updateHighlight, removeHighlight } = usePreview()
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingId = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const moved = useRef(false)
  const d = mobile ? 56 : 78
  const onPick = (id: string) => { pendingId.current = id; fileRef.current?.click() }
  const setImg = async (id: string, files: File[]) => { if (files[0]) updateHighlight(id, { image: await fileToBase64(files[0]) }) }

  // Arrastar na horizontal pra rolar (como no Instagram). Limiar: clique sem mover não rola nem bloqueia o clique.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el || e.button !== 0) return
    const startX = e.clientX, startLeft = el.scrollLeft
    moved.current = false
    const mv = (ev: PointerEvent) => { const dx = ev.clientX - startX; if (Math.abs(dx) > 4) moved.current = true; if (moved.current) el.scrollLeft = startLeft - dx }
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', mv)
    window.addEventListener('pointerup', up)
  }
  const guard = (fn: () => void) => () => { if (!moved.current) fn() }

  // Começa limpo (sem puxar os destaques padrão). No Público sem destaques, não mostra a faixa.
  if (!editable && highlights.length === 0) return null

  return (
    <div ref={scrollRef} onPointerDown={onPointerDown} className="sp-scroll" style={{ display: 'flex', gap: mobile ? 16 : 22, padding: mobile ? '14px 14px 10px' : '28px 2px 14px', overflowX: 'auto', alignItems: 'flex-start', cursor: 'grab' }}>
      {highlights.map((h) => (
        <div key={h.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0, position: 'relative' }}>
          {editable && <button onClick={guard(() => removeHighlight(h.id))} title="Remover destaque" style={{ position: 'absolute', top: -3, right: 4, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, padding: 0 }}><X size={11} /></button>}
          <div
            onClick={editable ? guard(() => onPick(h.id)) : undefined}
            title={editable ? 'Clique ou arraste pra colocar a imagem' : h.label}
            {...(editable ? dropHandlers((fs) => setImg(h.id, fs)) : {})}
            style={{ width: d, height: d, borderRadius: '50%', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? '#121212' : '#fafafa', overflow: 'hidden', position: 'relative', cursor: editable ? 'pointer' : 'default' }}
          >
            {h.image
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${h.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              : <ImageIcon size={mobile ? 20 : 26} color={t.sec} strokeWidth={1.6} />}
          </div>
          <Editable value={h.label} onCommit={(v) => updateHighlight(h.id, { label: v })} placeholder="Título" style={{ fontSize: 12, color: t.text, maxWidth: mobile ? 66 : 82, textAlign: 'center' }} />
        </div>
      ))}
      {editable && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <button onClick={guard(addHighlight)} title="Adicionar destaque" style={{ width: d, height: d, borderRadius: '50%', border: `1px dashed ${t.sec}`, background: 'transparent', color: t.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={mobile ? 22 : 28} /></button>
          <span style={{ fontSize: 12, color: t.sec }}>Novo</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f && pendingId.current) await setImg(pendingId.current, [f]); e.target.value = '' }} />
    </div>
  )
}

// Grade de posts do Instagram (mock local). Clique ou solte várias imagens; grade sempre quadrada (padrão IG).
function IgGrid({ t, mobile }: { t: { text: string; sec: string; border: string }; mobile: boolean }) {
  const { editable, posts, addPost, addFiles, removePost } = usePreview()
  const drop = editable ? dropHandlers(addFiles) : {}
  if (posts.length === 0) {
    return (
      <div {...drop} style={{ borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: mobile ? '42px 24px' : '66px 24px', textAlign: 'center' }}>
        <div style={{ width: mobile ? 62 : 72, height: mobile ? 62 : 72, borderRadius: '50%', border: `2px solid ${t.text}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera size={mobile ? 30 : 36} color={t.text} /></div>
        <div style={{ fontSize: mobile ? 22 : 30, fontWeight: 800, color: t.text }}>Compartilhe fotos</div>
        <div style={{ fontSize: 14, color: t.sec, maxWidth: 360 }}>{editable ? 'Clique no botão ou arraste imagens aqui (várias de uma vez).' : 'Quando você compartilhar fotos, elas aparecerão no seu perfil.'}</div>
        {editable && <button onClick={addPost} style={{ marginTop: 4, background: '#0095f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Adicionar publicações</button>}
      </div>
    )
  }
  return (
    <div {...drop} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: mobile ? 2 : 4, marginTop: mobile ? 2 : 4 }}>
      {posts.map((p, i) => (
        <div key={i} style={{ aspectRatio: '1', background: `url("${p.url}") center/cover`, position: 'relative' }}>
          {editable && <button onClick={() => removePost(i)} title="Remover" style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={13} /></button>}
        </div>
      ))}
      {editable && <button onClick={addPost} title="Adicionar publicações (várias de uma vez)" style={{ aspectRatio: '1', border: `1px dashed ${t.sec}`, background: 'transparent', color: t.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={30} /></button>}
    </div>
  )
}

// ───────────────────────────── Instagram ─────────────────────────────
function Instagram({ device, dark }: { device: Device; dark: boolean }) {
  const { c, bio, setCompany } = useProfile()
  const { editable, posts, stats, setStat, followed, toggleFollow } = usePreview()
  const mobile = device === 'mobile'
  const link = c.website?.replace(/^https?:\/\//, '')
  const t = dark
    ? { bg: '#000', text: '#fafafa', sec: '#a8a8a8', border: '#262626', chip: '#363636', link: '#e0f1ff' }
    : { bg: '#fff', text: '#262626', sec: '#737373', border: '#dbdbdb', chip: '#efefef', link: '#00376b' }
  const statVal = { posts: stats.posts ?? posts.length, followers: stats.followers, following: stats.following }

  const Stat = ({ k, l }: { k: 'posts' | 'followers' | 'following'; l: string }) => (
    <div style={{ textAlign: mobile ? 'center' : 'left', fontSize: mobile ? 14 : 16, color: t.text }}>
      <EditNum value={statVal[k]} onChange={(v) => setStat(k, v)} />{mobile ? <><br /><span style={{ color: t.sec }}>{l}</span></> : <span> {l}</span>}
    </div>
  )
  const chip: CSSProperties = { background: t.chip, border: 'none', borderRadius: 8, padding: mobile ? '7px 10px' : '7px 16px', fontSize: mobile ? 13 : 14, fontWeight: 600, color: t.text, cursor: 'default', whiteSpace: 'nowrap' }
  const blue: CSSProperties = { background: '#0095f6', color: '#fff', border: 'none', borderRadius: 8, padding: mobile ? '7px 10px' : '7px 20px', fontSize: mobile ? 13 : 14, fontWeight: 600, cursor: 'default', whiteSpace: 'nowrap' }
  const username = <Editable value={c.instagram} onCommit={(v) => setCompany('instagram', v)} placeholder={slug(c.name) || 'usuario'} />

  const Buttons = () => editable ? (
    <>
      <button style={{ ...chip, flex: mobile ? 1 : undefined, minWidth: 0 }}>Editar perfil</button>
      <button style={{ ...chip, flex: mobile ? 1 : undefined, minWidth: 0 }}>Compartilhar</button>
      {mobile && <button style={{ ...chip, padding: 8, display: 'flex' }}><UserPlus size={18} color={t.text} /></button>}
    </>
  ) : (
    <>
      <button onClick={toggleFollow} style={{ ...(followed ? chip : blue), flex: mobile ? 1 : undefined, cursor: 'pointer' }}>{followed ? 'Seguindo' : 'Seguir'}</button>
      <button style={{ ...chip, flex: mobile ? 1 : undefined }}>Mensagem</button>
      {mobile && <button style={{ ...chip, padding: 8, display: 'flex' }}><ChevronDown size={18} color={t.text} /></button>}
    </>
  )

  if (mobile) {
    return (
      <div style={{ fontFamily: FONT, color: t.text, background: t.bg, minHeight: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 20, fontWeight: 700 }}>{username} <ChevronDown size={16} /></div>
          <div style={{ display: 'flex', gap: 20 }}><PlusSquare size={24} color={t.text} /><Menu size={24} color={t.text} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 16px 6px' }}>
          <Avatar size={86} editUpload />
          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around' }}><Stat k="posts" l="posts" /><Stat k="followers" l="seguidores" /><Stat k="following" l="seguindo" /></div>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}><Editable value={c.name} onCommit={(v) => setCompany('name', v)} placeholder="Sua Marca" /></div>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}><Editable value={bio} multiline onCommit={(v) => setCompany('services', v)} placeholder="Escreva a bio…" /></div>
          {link && <div style={{ fontSize: 14, color: t.link, fontWeight: 600 }}>{link}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', alignItems: 'stretch' }}><Buttons /></div>
        <Highlights mobile t={t} dark={dark} />
        <div style={{ display: 'flex', borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
          {[Grid3x3, Clapperboard, TagIcon].map((Ic, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '11px 0', borderTop: i === 0 ? `1px solid ${t.text}` : 'none', marginTop: -1, color: i === 0 ? t.text : t.sec }}><Ic size={24} /></div>
          ))}
        </div>
        <IgGrid t={t} mobile />
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
          <div style={{ flex: '0 0 150px', display: 'flex', justifyContent: 'center' }}><Avatar size={150} editUpload /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{username}</span>
              <Buttons />
              {editable && <Settings size={22} color={t.text} />}
            </div>
            <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}><Stat k="posts" l="publicações" /><Stat k="followers" l="seguidores" /><Stat k="following" l="seguindo" /></div>
            <div style={{ fontWeight: 600 }}><Editable value={c.name} onCommit={(v) => setCompany('name', v)} placeholder="Sua Marca" /></div>
            <div style={{ lineHeight: 1.4 }}><Editable value={bio} multiline onCommit={(v) => setCompany('services', v)} placeholder="Escreva a bio…" /></div>
            {link && <div style={{ color: t.link, fontWeight: 600 }}>{link}</div>}
          </div>
        </div>
        <Highlights mobile={false} t={t} dark={dark} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, borderTop: `1px solid ${t.border}`, marginTop: 12 }}>
          {([[Grid3x3, 'PUBLICAÇÕES'], [Clapperboard, 'REELS'], [Bookmark, 'SALVOS'], [TagIcon, 'MARCAÇÕES']] as [typeof Grid3x3, string][]).map(([Ic, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 0', fontSize: 12, fontWeight: 600, letterSpacing: 1, color: i === 0 ? t.text : t.sec, borderTop: i === 0 ? `1px solid ${t.text}` : 'none', marginTop: -1 }}><Ic size={12} /> {label}</div>
          ))}
        </div>
        <IgGrid t={t} mobile={false} />
      </div>
    </div>
  )
}

// ───────────────────────────── Facebook ─────────────────────────────
function Facebook({ device, dark }: { device: Device; dark: boolean }) {
  const { c, about, setCompany, setMvv } = useProfile()
  const { editable, posts, addPost, addFiles, removePost, stats, setStat, followed, toggleFollow } = usePreview()
  const mobile = device === 'mobile'
  const coverW = mobile ? 368 : 940
  const avSize = mobile ? 88 : 168
  const BLUE = '#1877f2'
  const t = dark
    ? { app: '#18191a', card: '#242526', text: '#e4e6eb', sec: '#b0b3b8', border: '#3e4042', chip: '#3a3b3c', nav: '#242526' }
    : { app: '#f0f2f5', card: '#fff', text: '#050505', sec: '#65676b', border: '#dadde1', chip: '#e4e6eb', nav: '#fff' }
  const cardShadow = dark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
  const cardBorder = dark ? `1px solid ${t.border}` : 'none'

  const GreyBtn = ({ children }: { children: ReactNode }) => (
    <button style={{ background: t.chip, color: t.text, border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default', whiteSpace: 'nowrap' }}>{children}</button>
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
    <div {...(editable ? dropHandlers(addFiles) : {})}>
      <div onClick={editable ? addPost : undefined} style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, padding: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', cursor: editable ? 'pointer' : 'default' }}>
        <Avatar size={40} />
        <div style={{ flex: 1, background: t.chip, borderRadius: 50, padding: '10px 16px', color: t.sec, fontSize: 15 }}>{editable ? 'Criar publicação — clique ou arraste fotos…' : 'No que você está pensando?'}</div>
      </div>
      {posts.length === 0
        ? <div style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, padding: '40px 16px', textAlign: 'center', color: t.sec, fontSize: 15 }}>Nenhuma publicação ainda.</div>
        : posts.map((p, i) => (
          <div key={i} style={{ background: t.card, borderRadius: 8, boxShadow: cardShadow, border: cardBorder, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12 }}>
              <Avatar size={40} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15, color: t.text }}>{c.name || 'Sua Marca'}</div><div style={{ fontSize: 12, color: t.sec }}>Agora · 🌎</div></div>
              {editable && <button onClick={() => removePost(i)} title="Remover" style={{ background: 'transparent', border: 'none', color: t.sec, cursor: 'pointer', display: 'flex' }}><X size={18} /></button>}
            </div>
            <div style={{ width: '100%', aspectRatio: String(p.aspect), background: `url("${p.url}") center/cover` }} />
          </div>
        ))}
    </div>
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
          <FbCover width={coverW} editable={editable} />
          <div style={{ position: 'absolute', left: mobile ? '50%' : 24, bottom: mobile ? -avSize / 2 : -22, transform: mobile ? 'translateX(-50%)' : undefined }}>
            <Avatar size={avSize} ring ringColor={t.card} editUpload />
          </div>
        </div>
        <div style={{ maxWidth: coverW, margin: '0 auto', padding: mobile ? `${avSize / 2 + 12}px 16px 0` : '14px 24px 0' }}>
          <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'center' : 'flex-end', justifyContent: 'space-between', gap: 12, paddingLeft: mobile ? 0 : avSize + 20, textAlign: mobile ? 'center' : 'left' }}>
            <div>
              <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 800, color: t.text }}><Editable value={c.name} onCommit={(v) => setCompany('name', v)} placeholder="Sua Marca" /></div>
              <div style={{ fontSize: 15, color: t.sec, marginTop: 2 }}><EditNum value={stats.likes} onChange={(v) => setStat('likes', v)} /> curtidas · <EditNum value={stats.followers} onChange={(v) => setStat('followers', v)} /> seguidores</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editable
                ? <><button style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default', whiteSpace: 'nowrap' }}><Plus size={18} /> Criar story</button><GreyBtn>Editar perfil</GreyBtn><GreyBtn><MoreHorizontal size={18} /></GreyBtn></>
                : <><button onClick={toggleFollow} style={{ background: followed ? t.chip : BLUE, color: followed ? t.text : '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}>{followed ? <><UserPlus size={18} /> Seguindo</> : <><Plus size={18} /> Seguir</>}</button><GreyBtn><MessageCircle size={18} /> Mensagem</GreyBtn><GreyBtn><MoreHorizontal size={18} /></GreyBtn></>}
            </div>
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
  const [owner, setOwner] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [stats, setStats] = useState<Stats>({ posts: null, followers: 0, following: 0, likes: 0 })
  const [followed, setFollowed] = useState(false)
  const postRef = useRef<HTMLInputElement>(null)
  const mockRef = useRef<HTMLDivElement>(null)
  // Snapshot do estado ao abrir o preview. "Resetar" restaura tudo pra cá (desfaz edições da sessão + cache).
  const snapshot = useRef(useBrandStore.getState().social_media_data)

  const addPost = () => postRef.current?.click()
  const addFiles = async (files: File[]) => {
    const items = await Promise.all(files.map(async (f) => { const url = await fileToBase64(f, 1600, 0.9); return { url, aspect: await loadAspect(url) } }))
    if (items.length) setPosts((p) => [...items, ...p])
  }
  const removePost = (i: number) => setPosts((p) => p.filter((_, j) => j !== i))
  const addHighlight = () => setHighlights((h) => [...h, { id: `h${Date.now()}`, label: 'Novo', image: null }])
  const updateHighlight = (id: string, patch: Partial<Highlight>) => setHighlights((h) => h.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  const removeHighlight = (id: string) => setHighlights((h) => h.filter((x) => x.id !== id))
  const setStat = (k: keyof Stats, v: number) => setStats((s) => ({ ...s, [k]: v }))
  const reset = () => {
    setPosts([]); setHighlights([]); setStats({ posts: null, followers: 0, following: 0, likes: 0 }); setFollowed(false)
    useBrandStore.getState().setSocialMediaData(snapshot.current)
  }
  const print = () => { if (mockRef.current) downloadPng(mockRef.current, `preview-${platform}-${device}`) }

  const seg = (active: boolean): CSSProperties => ({
    padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: active ? 'var(--accent)' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)',
  })
  const tool: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

  return (
    <Ctx.Provider value={{ editable: owner, posts, addPost, addFiles, removePost, highlights, addHighlight, updateHighlight, removeHighlight, stats, setStat, followed, toggleFollow: () => setFollowed((f) => !f) }}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base, #0d0d0d)' }}>
        <div className="sm-topbar" style={{ flexWrap: 'wrap', gap: 10 }}>
          <button type="button" className="editor-nav-back" onClick={() => setScreen('home')}><ChevronLeft size={16} /><span>Menu</span></button>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <div className="sm-tabs">
              <button type="button" style={seg(platform === 'instagram')} onClick={() => setPlatform('instagram')}>Instagram</button>
              <button type="button" style={seg(platform === 'facebook')} onClick={() => setPlatform('facebook')}>Facebook</button>
            </div>
            <div className="sm-tabs">
              <button type="button" style={seg(device === 'desktop')} onClick={() => setDevice('desktop')}>Desktop</button>
              <button type="button" style={seg(device === 'mobile')} onClick={() => setDevice('mobile')}>Celular</button>
            </div>
            <div className="sm-tabs">
              <button type="button" style={seg(owner)} onClick={() => setOwner(true)}>Dono</button>
              <button type="button" style={seg(!owner)} onClick={() => setOwner(false)}>Público</button>
            </div>
            <div className="sm-tabs">
              <button type="button" style={seg(!dark)} onClick={() => setDark(false)}>Claro</button>
              <button type="button" style={seg(dark)} onClick={() => setDark(true)}>Escuro</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={tool} onClick={reset} title="Desfazer edições da sessão e limpar posts/números"><RotateCcw size={15} /> Resetar</button>
            <button type="button" style={tool} onClick={print} title="Baixar print da tela (PNG)"><Download size={15} /> Printar</button>
          </div>
        </div>

        <div className="sp-scroll" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: device === 'mobile' ? '32px 16px' : '24px 16px' }}>
          {device === 'mobile' ? (
            <div ref={mockRef} style={{ width: 390, height: 788, borderRadius: 44, border: '11px solid #111', overflow: 'hidden', background: dark ? '#000' : '#fff', boxShadow: '0 24px 70px rgba(0,0,0,0.6)', flexShrink: 0 }}>
              <div className="sp-scroll" style={{ height: '100%', overflowY: 'auto' }}>
                {platform === 'instagram' ? <Instagram device="mobile" dark={dark} /> : <Facebook device="mobile" dark={dark} />}
              </div>
            </div>
          ) : (
            <div ref={mockRef} style={{ width: '100%', maxWidth: 1180, borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              {platform === 'instagram' ? <Instagram device="desktop" dark={dark} /> : <Facebook device="desktop" dark={dark} />}
            </div>
          )}
        </div>

        <input ref={postRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => { const files = Array.from(e.target.files ?? []); if (files.length) await addFiles(files); e.target.value = '' }} />
      </div>
    </Ctx.Provider>
  )
}
