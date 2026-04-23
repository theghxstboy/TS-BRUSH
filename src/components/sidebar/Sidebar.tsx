import { useAppStore } from '../../store/useAppStore'
import { SectionOrdemPaginas } from './SectionOrdemPaginas'
import { SectionProjeto } from './SectionProjeto'
import { SectionAssets } from './SectionAssets'
import { SectionCores } from './SectionCores'
import { SectionTipografia } from './SectionTipografia'
import { SectionAparencia } from './SectionAparencia'
import { ActionButtons } from './ActionButtons'

export function Sidebar() {
  const { screen } = useAppStore()
  const isPres = screen === 'brand-presentation'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {isPres ? 'Apresentação de Identidade' : 'Estrutura do Manual'}
        </div>
        <h1 className="sidebar-title">
          {isPres ? 'Identidade Visual' : 'Base da Apresentação'}
        </h1>
        <p className="sidebar-subtitle">
          {isPres 
            ? 'Configure os dados globais da proposta, logos base, cores e tipografia da apresentação.'
            : 'Template, assets, tipografia, ordem e regras globais do brand manual.'}
        </p>
      </div>

      <div className="sidebar-body">
        <div className="sidebar-guide-card">
          <div className="sidebar-guide-eyebrow">Lado esquerdo</div>
          <p className="sidebar-guide-text">
            Tudo aqui vale para a estrutura geral {isPres ? 'da proposta' : 'da apresentação'}. 
            O drawer da direita concentra o que pertence ao slide selecionado.
          </p>
        </div>

        {!isPres && <SectionOrdemPaginas />}
        <SectionProjeto />
        <SectionAssets />
        {!isPres && <SectionCores />}
        <SectionAparencia />
        <SectionTipografia />
      </div>

      <ActionButtons />
    </aside>
  )
}
