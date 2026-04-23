import { useMemo, useRef, useState } from 'react'
import { Download, Upload, Printer, RotateCcw, Sparkles, Clipboard, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { useBrandStore } from '../../store/useBrandStore'
import { resolveFontName } from '../../lib/fontUtils'
import { useAppStore } from '../../store/useAppStore'

export function ActionButtons() {
  const {
    exportJson,
    importJson,
    reset,
    projeto,
    tipografia,
    conteudo_pdf,
    presentation_data,
    setProjeto,
    setTipografia,
    setConteudoPdf,
  } = useBrandStore()

  const { showAlert, screen } = useAppStore()

  const importRef = useRef<HTMLInputElement>(null)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const primaryFontName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
  const secondaryFontName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)

  const automaticPrompt = useMemo(() => {
    const currentContext = {
      projeto: {
        nome_marca: projeto.nome_marca,
        conceito: projeto.conceito,
        caracteristicas_marca: projeto.caracteristicas_marca,
        valores_marca: projeto.valores_marca,
        sensacoes_cores: projeto.sensacoes_cores,
        elementos_logo: projeto.elementos_logo,
      },
      tipografia: {
        principal_nome: primaryFontName,
        secundaria_nome: secondaryFontName,
      },
      conteudo_existente: {
        boas_vindas_titulo: conteudo_pdf.boas_vindas_titulo,
        conceito_titulo: conteudo_pdf.conceito_titulo,
        elementos_titulo: conteudo_pdf.elementos_titulo,
      },
    }

    return `Você é um especialista em branding, direção de arte e redação de manuais de marca.

Sua tarefa é analisar a logo/imagem anexada e gerar textos profissionais, objetivos e prontos para um PDF de apresentação de identidade visual.

Regras:
1. Escreva em português do Brasil.
2. Use tom premium, claro, estratégico e elegante.
3. Se alguma informação não estiver explícita, faça inferências plausíveis com base na forma, tipografia, símbolo, composição, contraste e cores da logo.
4. Evite clichês genéricos e frases vazias.
5. O resultado deve parecer texto real de um brand manual.
6. Retorne SOMENTE JSON válido.
7. Não use markdown, não use crases, não explique nada fora do JSON.
8. Preencha todos os campos.

Contexto atual do projeto:
${JSON.stringify(currentContext, null, 2)}

Retorne exatamente nesta estrutura:
{
  "projeto": {
    "conceito": "string",
    "caracteristicas_marca": "string",
    "valores_marca": "string",
    "sensacoes_cores": "string",
    "elementos_logo": "string",
    "responsavel_manual": "string"
  },
  "conteudo_pdf": {
    "boas_vindas_titulo": "string",
    "boas_vindas_texto_1": "string",
    "boas_vindas_texto_2": "string",
    "boas_vindas_texto_3": "string",
    "sumario_descricao": "string",
    "conceito_titulo": "string",
    "conceito_texto_1": "string",
    "conceito_texto_2": "string",
    "conceito_texto_3": "string",
    "elementos_titulo": "string",
    "elementos_descricao": "string",
    "tipografia_principal_titulo": "string",
    "tipografia_principal_descricao": "string",
    "tipografia_secundaria_titulo": "string",
    "tipografia_secundaria_descricao": "string",
    "logo_principal_titulo": "string",
    "logo_principal_compatibilidade": "string",
    "logo_principal_usos": "string",
    "logo_principal_protecao": "string",
    "logo_mono_titulo": "string",
    "logo_mono_descricao": "string",
    "simbolo_titulo": "string",
    "simbolo_descricao": "string",
    "simbolo_tamanho_minimo": "string",
    "simbolo_aplicacao": "string",
    "simbolo_fundo_preferencial": "string"
  },
  "tipografia": {
    "principal_estilos": "string",
    "secundaria_estilos": "string"
  }
}

Orientações:
- "conceito" deve ser curto, forte e aproveitável como resumo/tagline.
- "caracteristicas_marca" deve vir como atributos separados por vírgulas.
- "valores_marca" deve descrever valores percebidos da marca.
- "sensacoes_cores" deve interpretar a sensação das cores observadas.
- "elementos_logo" deve listar os elementos visuais principais, um por linha.
- "responsavel_manual" pode repetir o nome da marca se nada melhor for identificado.
- "logo_principal_compatibilidade" deve vir em itens separados por vírgula.
- "logo_principal_usos" deve vir em itens separados por vírgula.
- As descrições de tipografia devem funcionar mesmo sem o nome exato das fontes.

Agora analise a imagem anexada e devolva apenas o JSON final.`
  }, [conteudo_pdf, primaryFontName, projeto, secondaryFontName])

  const handlePrint = () => {
    const originalTitle = document.title
    const isPresentation = screen === 'brand-presentation'
    const brandName = isPresentation 
      ? (presentation_data.brand_name || 'MARCA')
      : (projeto.nome_marca || 'MARCA')
    
    // Define o título do documento com base na tela atual
    const prefix = isPresentation ? 'APRESENTAÇÃO DE LOGO' : 'MANUAL DE MARCA'
    document.title = `${prefix} - ${brandName.toUpperCase()}`

    setTimeout(() => {
      window.print()
      setTimeout(() => {
        document.title = originalTitle
      }, 1000)
    }, 200)
  }

  const handleReset = () => {
    showAlert({
      type: 'confirm',
      title: 'Limpar Projeto',
      message: 'Tem certeza? Todo o progresso não salvo será perdido e o manual voltará ao estado inicial.',
      confirmLabel: 'Sim, limpar tudo',
      cancelLabel: 'Manter projeto',
      onConfirm: () => reset(),
    })
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(automaticPrompt)
      toast.success('Prompt automático copiado.')
    } catch {
      toast.error('Não foi possível copiar o prompt.')
    }
  }

  const handleApplyAiResponse = () => {
    try {
      const cleaned = aiResponse
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')

      const parsed = JSON.parse(cleaned) as {
        projeto?: Record<string, unknown>
        conteudo_pdf?: Record<string, unknown>
        tipografia?: Record<string, unknown>
      }

      if (parsed.projeto) {
        setProjeto({
          conceito: typeof parsed.projeto.conceito === 'string' ? parsed.projeto.conceito : projeto.conceito,
          caracteristicas_marca: typeof parsed.projeto.caracteristicas_marca === 'string' ? parsed.projeto.caracteristicas_marca : projeto.caracteristicas_marca,
          valores_marca: typeof parsed.projeto.valores_marca === 'string' ? parsed.projeto.valores_marca : projeto.valores_marca,
          sensacoes_cores: typeof parsed.projeto.sensacoes_cores === 'string' ? parsed.projeto.sensacoes_cores : projeto.sensacoes_cores,
          elementos_logo: typeof parsed.projeto.elementos_logo === 'string' ? parsed.projeto.elementos_logo : projeto.elementos_logo,
          responsavel_manual: typeof parsed.projeto.responsavel_manual === 'string' ? parsed.projeto.responsavel_manual : projeto.responsavel_manual,
        })
      }

      if (parsed.tipografia) {
        setTipografia({
          principal_estilos: typeof parsed.tipografia.principal_estilos === 'string' ? parsed.tipografia.principal_estilos : tipografia.principal_estilos,
          secundaria_estilos: typeof parsed.tipografia.secundaria_estilos === 'string' ? parsed.tipografia.secundaria_estilos : tipografia.secundaria_estilos,
        })
      }

      if (parsed.conteudo_pdf) {
        setConteudoPdf(
          Object.fromEntries(
            Object.entries(parsed.conteudo_pdf).filter(([, value]) => typeof value === 'string'),
          ) as Partial<typeof conteudo_pdf>,
        )
      }

      toast.success('Textos da apresentação aplicados automaticamente.')
      setAiResponse('')
      setAiPanelOpen(false)
    } catch {
      toast.error('Resposta inválida. Cole o JSON retornado pelo Gem.')
    }
  }

  return (
    <aside className="action-buttons ui-controls">
      <button
        id="btn-gerar-pdf"
        className="btn btn-primary"
        onClick={handlePrint}
      >
        <Printer size={15} />
        Gerar PDF
      </button>

      <div className="btn-row">
        <button
          id="btn-prompt-automatico"
          className="btn btn-secondary"
          onClick={() => setAiPanelOpen((value) => !value)}
        >
          <Sparkles size={14} />
          Prompt Automático
        </button>

        <button
          id="btn-exportar-json"
          className="btn btn-secondary"
          onClick={() => exportJson(screen)}
        >
          <Download size={14} />
          Exportar .json
        </button>
      </div>

      <div className="btn-row">
        <button
          id="btn-importar-json"
          className="btn btn-secondary"
          onClick={() => importRef.current?.click()}
        >
          <Upload size={14} />
          Importar
        </button>
      </div>

      {aiPanelOpen && (
        <div className="ai-panel">
          <div className="ai-panel-title">Geração Automática de Texto</div>
          <div className="ai-panel-subtitle">
            Copie o prompt, cole no Gem com a logo anexada e depois cole aqui o JSON de resposta.
          </div>

          <button className="btn btn-secondary" onClick={handleCopyPrompt}>
            <Clipboard size={14} />
            Copiar Prompt
          </button>

          <textarea
            className="form-textarea ai-response-input"
            value={aiResponse}
            onChange={(e) => setAiResponse(e.target.value)}
            placeholder="Cole aqui o JSON retornado pelo Gem."
          />

          <button className="btn btn-primary" onClick={handleApplyAiResponse}>
            <Wand2 size={14} />
            Aplicar Textos Automáticos
          </button>
        </div>
      )}

      <button
        id="btn-reset"
        className="btn btn-ghost"
        onClick={handleReset}
        style={{ fontSize: 12, padding: '8px 16px' }}
      >
        <RotateCcw size={13} />
        Limpar projeto
      </button>

      <input
        ref={importRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) importJson(file)
          e.target.value = ''
        }}
      />
    </aside>
  )
}
