import { useState } from 'react'
import { getLucideIcon, getSimpleIcon, searchIcons, EMOJI_LIST, SYMBOL_LIST, searchSimpleIcons } from '../../lib/socialIcons'
import { PH_ICONS, BI_ICONS, TB_ICONS, MDI_ICONS, searchGallery, getIconifyData, type IconGalleryEntry } from '../../lib/iconGalleries'

type Gallery = 'lucide' | 'ph' | 'bi' | 'tb' | 'mdi' | 'brands' | 'emoji' | 'symbols'

const GALLERY_LABELS: Record<Gallery, string> = {
  lucide: 'Lucide',
  ph: 'Phosphor',
  bi: 'Bootstrap',
  tb: 'Tabler',
  mdi: 'Material',
  brands: 'Marcas',
  emoji: 'Emoji',
  symbols: 'Símbolos',
}

const GALLERY_COLS: Partial<Record<Gallery, number>> = { brands: 5, emoji: 8, symbols: 8 }

export function SmIconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [gallery, setGallery] = useState<Gallery>('lucide')

  const isEmoji = value.startsWith('emoji:')
  const isSi    = value.startsWith('si:')
  const isSym   = value.startsWith('sym:')
  const isPh    = value.startsWith('ph:')
  const isBi    = value.startsWith('bi:')
  const isTb    = value.startsWith('tb:')
  const isMdi   = value.startsWith('mdi:')
  const isIconify = isPh || isBi || isTb || isMdi

  const currentEmoji = isEmoji ? value.slice(6) : null
  const currentSym   = isSym   ? value.slice(4) : null
  const Current      = (isEmoji || isSi || isSym || isIconify) ? null : getLucideIcon(value)

  function pick(val: string) { onChange(val); setOpen(false) }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn-secondary"
        style={{ justifyContent: 'flex-start' }}
        onClick={() => setOpen((o) => !o)}
      >
        <PreviewIcon value={value} currentEmoji={currentEmoji} currentSym={currentSym} Current={Current} />
        <span style={{ fontSize: 12 }}>
          {currentEmoji ?? currentSym ?? ((isSi ? value.slice(3) : isIconify ? value.split(':').slice(1).join(':') : value) || 'Escolher ícone')}
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', zIndex: 50, bottom: 'calc(100% + 6px)', left: 0,
          width: 308, maxHeight: 'min(440px, 60vh)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', padding: 10,
        }}>
          {/* Abas — 2 linhas de 4 */}
          {(['lucide','ph','bi','tb','mdi','brands','emoji','symbols'] as Gallery[]).reduce<Gallery[][]>((rows, g, i) => {
            if (i % 4 === 0) rows.push([])
            rows[rows.length - 1].push(g)
            return rows
          }, []).map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, marginBottom: 3 }}>
              {row.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { setGallery(g); setQ('') }}
                  style={{
                    padding: '4px 2px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
                    background: gallery === g ? 'var(--accent)' : 'var(--bg-input)',
                    color: gallery === g ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {GALLERY_LABELS[g]}
                </button>
              ))}
            </div>
          ))}

          <input
            className="form-input"
            autoFocus
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ marginBottom: 8, marginTop: 5 }}
          />

          <div style={{
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: `repeat(${GALLERY_COLS[gallery] ?? 7}, 1fr)`,
            gap: 4,
          }}>
            {gallery === 'lucide' && searchIcons(q, 96).map((name) => {
              const Icon = getLucideIcon(name)
              return (
                <IconBtn key={name} active={name === value} title={name} onClick={() => pick(name)}>
                  {Icon && <Icon size={18} />}
                </IconBtn>
              )
            })}

            {gallery === 'emoji' && filterText(EMOJI_LIST, q).map((emoji, i) => (
              <IconBtn key={`${emoji}-${i}`} active={`emoji:${emoji}` === value} title={emoji}
                onClick={() => pick(`emoji:${emoji}`)} style={{ fontSize: 22 }}>
                {emoji}
              </IconBtn>
            ))}

            {gallery === 'symbols' && filterText(SYMBOL_LIST, q).map((sym, i) => (
              <IconBtn key={`${sym}-${i}`} active={`sym:${sym}` === value} title={sym}
                onClick={() => pick(`sym:${sym}`)} style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                {sym}
              </IconBtn>
            ))}

            {gallery === 'brands' && searchSimpleIcons(q).map((e) => (
              <IconBtn key={e.key} active={`si:${e.key}` === value} title={e.title}
                onClick={() => pick(`si:${e.key}`)}>
                <svg viewBox="0 0 24 24" width={20} height={20} fill={`#${e.hex}`}>
                  <path d={e.path} />
                </svg>
              </IconBtn>
            ))}

            {gallery === 'ph'  && <IconifyGallery prefix="ph"  list={PH_ICONS}  q={q} value={value} pick={pick} />}
            {gallery === 'bi'  && <IconifyGallery prefix="bi"  list={BI_ICONS}  q={q} value={value} pick={pick} />}
            {gallery === 'tb'  && <IconifyGallery prefix="tb"  list={TB_ICONS}  q={q} value={value} pick={pick} />}
            {gallery === 'mdi' && <IconifyGallery prefix="mdi" list={MDI_ICONS} q={q} value={value} pick={pick} />}
          </div>
        </div>
      )}
    </div>
  )
}

function filterText(list: string[], q: string) {
  const t = q.trim()
  return t ? list.filter((s) => s.includes(t)) : list
}

function IconifyGallery({ prefix, list, q, value, pick }: {
  prefix: string; list: IconGalleryEntry[]; q: string; value: string; pick: (v: string) => void
}) {
  return (
    <>
      {searchGallery(prefix, list, q).map((e) => {
        const id = `${prefix}:${e.key}`
        const vb = `0 0 ${e.data.width ?? 24} ${e.data.height ?? 24}`
        return (
          <IconBtn key={id} active={id === value} title={e.label} onClick={() => pick(id)}>
            <svg viewBox={vb} width={20} height={20} fill="currentColor" stroke="currentColor" strokeWidth={0}
              dangerouslySetInnerHTML={{ __html: e.data.body }}
            />
          </IconBtn>
        )
      })}
    </>
  )
}

function IconBtn({ children, active, title, onClick, style }: {
  children: React.ReactNode; active: boolean; title: string
  onClick: () => void; style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        aspectRatio: '1', borderRadius: 6, cursor: 'pointer',
        border: active ? '1px solid var(--accent)' : '1px solid transparent',
        background: 'var(--bg-input)', color: 'var(--text-primary)',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function PreviewIcon({ value, currentEmoji, currentSym, Current }: {
  value: string; currentEmoji: string | null; currentSym: string | null
  Current: ReturnType<typeof getLucideIcon>
}) {
  if (currentEmoji) return <span style={{ fontSize: 18, lineHeight: 1 }}>{currentEmoji}</span>
  if (currentSym)   return <span style={{ fontSize: 16, lineHeight: 1 }}>{currentSym}</span>
  if (value.startsWith('si:')) {
    const si = getSimpleIcon(value.slice(3))
    if (si) return <svg viewBox="0 0 24 24" width={18} height={18} fill={`#${si.hex}`}><path d={si.path} /></svg>
  }
  const iconify = (value.startsWith('ph:') || value.startsWith('bi:') || value.startsWith('tb:') || value.startsWith('mdi:'))
    ? getIconifyData(value) : null
  if (iconify) {
    const vb = `0 0 ${iconify.width ?? 24} ${iconify.height ?? 24}`
    return <svg viewBox={vb} width={18} height={18} fill="currentColor" dangerouslySetInnerHTML={{ __html: iconify.body }} />
  }
  if (Current) return <Current size={18} />
  return null
}
