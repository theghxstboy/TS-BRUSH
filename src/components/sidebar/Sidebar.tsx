
import { SectionOrdemPaginas } from './SectionOrdemPaginas'
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
        <div className="sidebar-logo">Estrutura do Manual</div>
        <h1 className="sidebar-title">Base da Apresentacao</h1>
        <p className="sidebar-subtitle">Template, assets, tipografia, ordem e regras globais do brand manual.</p>
      </div>

      <div className="sidebar-body">
        <div className="sidebar-guide-card">
          <div className="sidebar-guide-eyebrow">Lado esquerdo</div>
          <p className="sidebar-guide-text">
            Tudo aqui vale para a estrutura geral da apresentacao. O drawer da direita concentra o que pertence ao slide selecionado.
          </p>
        </div>

        <SectionOrdemPaginas />
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
