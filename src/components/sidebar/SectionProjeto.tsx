import { Type } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionProjeto() {
  const { screen } = useAppStore()
  const { projeto, setProjeto, presentation_data, setPresentationData } = useBrandStore()

  const isPres = screen === 'brand-presentation'

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Projeto & Marca" sectionId="projeto">
      <div className="form-group">
        <label className="form-label">Nome da Marca</label>
        <input
          id="input-nome-marca"
          className="form-input"
          placeholder="Ex: TS BRUSH"
          value={isPres ? presentation_data.brand_name : projeto.nome_marca}
          onChange={(e) => {
            if (isPres) {
              setPresentationData({ ...presentation_data, brand_name: e.target.value })
            } else {
              setProjeto({ nome_marca: e.target.value })
            }
          }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {isPres ? 'Responsável pela Logo' : 'Responsável pelo Manual'}
        </label>
        <input
          id="input-responsavel"
          className="form-input"
          placeholder="Ex: Designer / Agência"
          value={isPres ? presentation_data.responsible_name : projeto.responsavel_manual}
          onChange={(e) => {
            if (isPres) {
              setPresentationData({ ...presentation_data, responsible_name: e.target.value })
            } else {
              setProjeto({ responsavel_manual: e.target.value })
            }
          }}
        />
      </div>

      {!isPres && (
        <>
          <div className="form-group">
            <label className="form-label">Conceito / Tagline</label>
            <textarea
              id="input-conceito"
              className="form-textarea"
              placeholder="Descreva o conceito central da marca..."
              value={projeto.conceito}
              onChange={(e) => setProjeto({ conceito: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Caracteristicas da Marca</label>
            <textarea
              id="input-caracteristicas-marca"
              className="form-textarea"
              placeholder="Ex: criatividade, movimento, exclusividade"
              value={projeto.caracteristicas_marca}
              onChange={(e) => setProjeto({ caracteristicas_marca: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Valores que a Marca Comunica</label>
            <textarea
              id="input-valores-marca"
              className="form-textarea"
              placeholder="Ex: inovacao, sofisticacao, confianca"
              value={projeto.valores_marca}
              onChange={(e) => setProjeto({ valores_marca: e.target.value })}
            />
          </div>
        </>
      )}

      <p style={{ fontSize: 11, color: '#71717a', lineHeight: 1.6 }}>
        {isPres
          ? 'Configurações de nome e responsável que aparecem na capa e no slide final da proposta.'
          : 'Campos contextuais, como narrativa da paleta, elementos da logo e assinatura do encerramento, agora aparecem no drawer da direita ao selecionar o slide correspondente.'}
      </p>
    </CollapsibleSection>
  )
}
