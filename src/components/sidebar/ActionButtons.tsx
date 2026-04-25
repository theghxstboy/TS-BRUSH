import { useMemo, useRef, useState } from 'react'
import { Download, Upload, Printer, RotateCcw } from 'lucide-react'
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

  const primaryFontName = resolveFontName(tipografia.principal_nome, tipografia.principal_custom.file_name)
  const secondaryFontName = resolveFontName(tipografia.secundaria_nome, tipografia.secundaria_custom.file_name)



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
          id="btn-exportar-json"
          className="btn btn-secondary"
          onClick={() => exportJson(screen)}
        >
          <Download size={14} />
          Exportar .json
        </button>

        <button
          id="btn-importar-json"
          className="btn btn-secondary"
          onClick={() => importRef.current?.click()}
        >
          <Upload size={14} />
          Importar
        </button>
      </div>

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
