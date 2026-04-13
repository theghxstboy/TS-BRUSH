import { Type } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionProjeto() {
  const { projeto, setProjeto } = useBrandStore()

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Projeto & Marca" defaultOpen>
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
    </CollapsibleSection>
  )
}
