import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { SectionOrdemPaginas } from './SectionOrdemPaginas'
import { SectionProjeto } from './SectionProjeto'
import { SectionAssets } from './SectionAssets'
import { SectionCores } from './SectionCores'
import { SectionTipografia } from './SectionTipografia'
import { SectionAparencia } from './SectionAparencia'
import { SectionTemplates } from './SectionTemplates'
import { ActionButtons } from './ActionButtons'
import { FontUploadControl } from '../common/FontUploadControl'

export function Sidebar() {
  const { screen } = useAppStore()
  const { custom_presentation_data, setCustomPresentationData } = useBrandStore()
  
  const isPres = screen === 'brand-presentation'
  const isCustom = screen === 'custom-presentation'

  const getTitle = () => {
    if (isCustom) return 'Apresentação Custom'
    if (isPres) return 'Apresentação de Identidade'
    return 'Estrutura do Manual'
  }

  const getEyebrow = () => {
    if (isCustom) return 'Criação Livre'
    if (isPres) return 'Identidade Visual'
    return 'Base da Apresentação'
  }

  const getSubtitle = () => {
    if (isCustom) return 'Monte sua apresentação arrastando os templates desejados para o canvas.'
    if (isPres) return 'Configure os dados globais da proposta, logos base, cores e tipografia da apresentação.'
    return 'Template, assets, tipografia, ordem e regras globais do brand manual.'
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {getTitle()}
        </div>
        <h1 className="sidebar-title">
          {getEyebrow()}
        </h1>
        <p className="sidebar-subtitle">
          {getSubtitle()}
        </p>
      </div>

      <div className="sidebar-body">
        {screen === 'custom-presentation' ? (
          <>
            <div className="custom-global-config">
              <div className="custom-global-config-header">
                Configuração Global
              </div>
              <div className="custom-global-grid">
                <div className="custom-global-item">
                  <label>Fundo</label>
                  <div className="custom-global-color-wrap">
                    <input 
                      type="color" 
                      value={custom_presentation_data.appearance.fundo}
                      onChange={(e) => setCustomPresentationData({
                        appearance: { ...custom_presentation_data.appearance, fundo: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="custom-global-item">
                  <label>Títulos</label>
                  <div className="custom-global-color-wrap">
                    <input 
                      type="color" 
                      value={custom_presentation_data.appearance.titulo}
                      onChange={(e) => setCustomPresentationData({
                        appearance: { ...custom_presentation_data.appearance, titulo: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="custom-global-item">
                  <label>Detalhes</label>
                  <div className="custom-global-color-wrap">
                    <input 
                      type="color" 
                      value={custom_presentation_data.appearance.detalhe}
                      onChange={(e) => setCustomPresentationData({
                        appearance: { ...custom_presentation_data.appearance, detalhe: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="custom-global-typography">
                <FontUploadControl
                  title="Fonte Títulos"
                  name={custom_presentation_data.typography.titulosNome}
                  customFont={custom_presentation_data.typography.titulosCustom}
                  onNameChange={(value) => setCustomPresentationData({
                    typography: { ...custom_presentation_data.typography, titulosNome: value }
                  })}
                  onCustomFontChange={(value) => setCustomPresentationData({
                    typography: { ...custom_presentation_data.typography, titulosCustom: value }
                  })}
                  placeholder="Ex: Sora, Montserrat, Outfit"
                  previewFallback="sans-serif"
                  compact={true}
                />
                
                <div style={{ marginTop: 8 }}>
                  <FontUploadControl
                    title="Fonte Textos"
                    name={custom_presentation_data.typography.textosNome}
                    customFont={custom_presentation_data.typography.textosCustom}
                    onNameChange={(value) => setCustomPresentationData({
                      typography: { ...custom_presentation_data.typography, textosNome: value }
                    })}
                    onCustomFontChange={(value) => setCustomPresentationData({
                      typography: { ...custom_presentation_data.typography, textosCustom: value }
                    })}
                    placeholder="Ex: Inter, Roboto, Outfit"
                    previewFallback="sans-serif"
                    compact={true}
                  />
                </div>
              </div>
            </div>
            <SectionTemplates />
          </>
        ) : (
          <>
            {screen === 'brand-manual' && <SectionOrdemPaginas />}
            <SectionProjeto />
            <SectionAssets />
            {screen === 'brand-manual' && <SectionCores />}
            <SectionAparencia />
            <SectionTipografia />
          </>
        )}
      </div>

      <ActionButtons />
    </aside>
  )
}
