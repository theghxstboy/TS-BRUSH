import { SectionProjeto } from './SectionProjeto'
import { SectionAssets } from './SectionAssets'
import { SectionCores } from './SectionCores'
import { SectionTipografia } from './SectionTipografia'
import { SectionAparencia } from './SectionAparencia'
import { ActionButtons } from './ActionButtons'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">TS BRUSH</div>
        <h1 className="sidebar-title">Manual de Marca</h1>
        <p className="sidebar-subtitle">Configure e exporte seu brand manual em PDF</p>
      </div>

      <div className="sidebar-body">
        <SectionProjeto />
        <SectionAssets />
        <SectionCores />
        <SectionAparencia />
        <SectionTipografia />
      </div>

      <ActionButtons />
    </aside>
  )
}
