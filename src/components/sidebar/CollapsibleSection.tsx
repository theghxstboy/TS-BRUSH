import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  icon: React.ReactNode
  label: string
  defaultOpen?: boolean
  sectionId?: string
  children: React.ReactNode
}

export function CollapsibleSection({ icon, label, defaultOpen = false, sectionId, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    if (!sectionId) return

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ sectionId: string }>).detail
      if (detail?.sectionId === sectionId) setOpen(true)
    }

    window.addEventListener('open-sidebar-section', handler)
    return () => window.removeEventListener('open-sidebar-section', handler)
  }, [sectionId])

  return (
    <div className="s-section" id={sectionId ? `sidebar-section-${sectionId}` : undefined}>
      <div className="s-section-header" onClick={() => setOpen(!open)}>
        <div className="s-section-icon">{icon}</div>
        <span className="s-section-label">{label}</span>
        <ChevronDown size={16} className={`s-section-chevron ${open ? 'open' : ''}`} />
      </div>
      {open && <div className="s-section-body" style={{ paddingTop: 14 }}>{children}</div>}
    </div>
  )
}
