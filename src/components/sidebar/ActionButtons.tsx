import { useRef } from 'react'
import { Download, Upload, Printer, RotateCcw } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'

export function ActionButtons() {
  const { exportJson, importJson, reset } = useBrandStore()
  const importRef = useRef<HTMLInputElement>(null)

  const handlePrint = () => {
    setTimeout(() => window.print(), 200)
  }

  const handleReset = () => {
    if (confirm('Tem certeza? Todo o progresso não salvo será perdido.')) {
      reset()
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
          id="btn-exportar-json"
          className="btn btn-secondary"
          onClick={exportJson}
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
