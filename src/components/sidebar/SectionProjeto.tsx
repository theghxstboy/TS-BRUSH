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

      <p style={{ fontSize: 11, color: '#71717a', lineHeight: 1.6 }}>
        Campos contextuais, como narrativa da paleta, elementos da logo e assinatura do encerramento, agora aparecem no drawer da direita ao selecionar o slide correspondente.
      </p>
    </CollapsibleSection>
  )
}
