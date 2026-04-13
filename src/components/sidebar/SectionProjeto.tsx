import { Type } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionProjeto() {
  const { projeto, setProjeto } = useBrandStore()

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Projeto & Marca" defaultOpen sectionId="projeto">
      <div className="form-group">
        <label className="form-label">Nome da Marca</label>
        <input
          id="input-nome-marca"
          className="form-input"
          placeholder="Ex: TS BRUSH"
          value={projeto.nome_marca}
          onChange={(e) => setProjeto({ nome_marca: e.target.value })}
        />
      </div>

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
        <label className="form-label">Características da Marca</label>
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
          placeholder="Ex: inovação, sofisticação, confiança"
          value={projeto.valores_marca}
          onChange={(e) => setProjeto({ valores_marca: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Sensações das Cores da Logo</label>
        <textarea
          id="input-sensacoes-cores"
          className="form-textarea"
          placeholder="Ex: energia, elegância e proximidade"
          value={projeto.sensacoes_cores}
          onChange={(e) => setProjeto({ sensacoes_cores: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Elementos da Logo</label>
        <textarea
          id="input-elementos-logo"
          className="form-textarea"
          placeholder={'Um elemento por linha.\nEx:\nSímbolo\nLettering'}
          value={projeto.elementos_logo}
          onChange={(e) => setProjeto({ elementos_logo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Responsável no Encerramento</label>
        <input
          id="input-responsavel-manual"
          className="form-input"
          placeholder="Ex: João Gonçalves"
          value={projeto.responsavel_manual}
          onChange={(e) => setProjeto({ responsavel_manual: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  )
}
