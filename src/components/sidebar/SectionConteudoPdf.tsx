import { FileText } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionConteudoPdf() {
  const { conteudo_pdf, setConteudoPdf } = useBrandStore()

  return (
    <CollapsibleSection icon={<FileText size={14} />} label="Conteúdo do PDF" sectionId="conteudo-pdf">
      <div className="form-group">
        <label className="form-label">Título de Boas-vindas</label>
        <input
          id="input-pdf-boas-vindas-titulo"
          className="form-input"
          value={conteudo_pdf.boas_vindas_titulo}
          onChange={(e) => setConteudoPdf({ boas_vindas_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Boas-vindas Texto 1</label>
        <textarea
          id="input-pdf-boas-vindas-1"
          className="form-textarea"
          value={conteudo_pdf.boas_vindas_texto_1}
          onChange={(e) => setConteudoPdf({ boas_vindas_texto_1: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Boas-vindas Texto 2</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.boas_vindas_texto_2}
          onChange={(e) => setConteudoPdf({ boas_vindas_texto_2: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Boas-vindas Texto 3</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.boas_vindas_texto_3}
          onChange={(e) => setConteudoPdf({ boas_vindas_texto_3: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição do Sumário</label>
        <textarea
          id="input-pdf-sumario-descricao"
          className="form-textarea"
          placeholder="Opcional. Se vazio, usa o conceito da marca."
          value={conteudo_pdf.sumario_descricao}
          onChange={(e) => setConteudoPdf({ sumario_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título da Página Conceito</label>
        <input
          id="input-pdf-conceito-titulo"
          className="form-input"
          value={conteudo_pdf.conceito_titulo}
          onChange={(e) => setConteudoPdf({ conceito_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Conceito Texto 1</label>
        <textarea
          id="input-pdf-conceito-1"
          className="form-textarea"
          value={conteudo_pdf.conceito_texto_1}
          onChange={(e) => setConteudoPdf({ conceito_texto_1: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Conceito Texto 2</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.conceito_texto_2}
          onChange={(e) => setConteudoPdf({ conceito_texto_2: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Conceito Texto 3</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.conceito_texto_3}
          onChange={(e) => setConteudoPdf({ conceito_texto_3: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título da Página Elementos</label>
        <input
          className="form-input"
          value={conteudo_pdf.elementos_titulo}
          onChange={(e) => setConteudoPdf({ elementos_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição dos Elementos</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.elementos_descricao}
          onChange={(e) => setConteudoPdf({ elementos_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título Tipografia Principal</label>
        <input
          className="form-input"
          value={conteudo_pdf.tipografia_principal_titulo}
          onChange={(e) => setConteudoPdf({ tipografia_principal_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição Tipografia Principal</label>
        <textarea
          id="input-pdf-tipografia-principal"
          className="form-textarea"
          placeholder="Se vazio, será gerada automaticamente."
          value={conteudo_pdf.tipografia_principal_descricao}
          onChange={(e) => setConteudoPdf({ tipografia_principal_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título Tipografia Secundária</label>
        <input
          className="form-input"
          value={conteudo_pdf.tipografia_secundaria_titulo}
          onChange={(e) => setConteudoPdf({ tipografia_secundaria_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição Tipografia Secundária</label>
        <textarea
          id="input-pdf-tipografia-secundaria"
          className="form-textarea"
          placeholder="Se vazio, será gerada automaticamente."
          value={conteudo_pdf.tipografia_secundaria_descricao}
          onChange={(e) => setConteudoPdf({ tipografia_secundaria_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título Logo Principal</label>
        <input
          className="form-input"
          value={conteudo_pdf.logo_principal_titulo}
          onChange={(e) => setConteudoPdf({ logo_principal_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Compatibilidade do Logo Principal</label>
        <textarea
          className="form-textarea"
          placeholder="Ex: Claro, Escuro, Colorido"
          value={conteudo_pdf.logo_principal_compatibilidade}
          onChange={(e) => setConteudoPdf({ logo_principal_compatibilidade: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Usos Recomendados do Logo Principal</label>
        <textarea
          className="form-textarea"
          placeholder="Ex: Alta Resolução, Digital & Print, Fundo Transparente"
          value={conteudo_pdf.logo_principal_usos}
          onChange={(e) => setConteudoPdf({ logo_principal_usos: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Espaço de Proteção do Logo Principal</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.logo_principal_protecao}
          onChange={(e) => setConteudoPdf({ logo_principal_protecao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título Logo Monocromático</label>
        <input
          className="form-input"
          value={conteudo_pdf.logo_mono_titulo}
          onChange={(e) => setConteudoPdf({ logo_mono_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição Logo Monocromático</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.logo_mono_descricao}
          onChange={(e) => setConteudoPdf({ logo_mono_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Título Símbolo</label>
        <input
          className="form-input"
          value={conteudo_pdf.simbolo_titulo}
          onChange={(e) => setConteudoPdf({ simbolo_titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrição do Símbolo</label>
        <textarea
          className="form-textarea"
          value={conteudo_pdf.simbolo_descricao}
          onChange={(e) => setConteudoPdf({ simbolo_descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tamanho Mínimo do Símbolo</label>
        <input
          className="form-input"
          value={conteudo_pdf.simbolo_tamanho_minimo}
          onChange={(e) => setConteudoPdf({ simbolo_tamanho_minimo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Aplicações do Símbolo</label>
        <input
          className="form-input"
          value={conteudo_pdf.simbolo_aplicacao}
          onChange={(e) => setConteudoPdf({ simbolo_aplicacao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Fundo Preferencial do Símbolo</label>
        <input
          className="form-input"
          value={conteudo_pdf.simbolo_fundo_preferencial}
          onChange={(e) => setConteudoPdf({ simbolo_fundo_preferencial: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  )
}
