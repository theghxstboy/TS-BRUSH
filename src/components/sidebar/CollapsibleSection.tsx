import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  icon: React.ReactNode
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({ icon, label, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="s-section">
      <div className="s-section-header" onClick={() => setOpen(!open)}>
        <div className="s-section-icon">{icon}</div>
        <span className="s-section-label">{label}</span>
        <ChevronDown size={16} className={`s-section-chevron ${open ? 'open' : ''}`} />
      </div>
      {open && <div className="s-section-body" style={{ paddingTop: 14 }}>{children}</div>}
    </div>
  )
}
