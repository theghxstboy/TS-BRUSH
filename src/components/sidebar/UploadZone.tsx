import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { fileToBase64 } from '../../lib/imageUtils'

interface UploadZoneProps {
  inputId?: string
  label: string
  hint?: string
  value: string | null
  onChange: (base64: string | null) => void
  accept?: string
  hint2?: string
}

export function UploadZone({ inputId, label, hint, value, onChange, accept = 'image/*' }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      onChange(base64)
      toast.success(`"${file.name}" carregado.`)
    } catch {
      toast.error('Erro ao processar imagem.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={`upload-zone ${value ? 'has-file' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {value ? (
        <>
          <img src={value} alt="preview" className="upload-preview" />
          <button
            className="upload-remove"
            onClick={(e) => { e.stopPropagation(); onChange(null) }}
            title="Remover"
          >
            <X size={12} />
          </button>
        </>
      ) : (
        <>
          <Upload size={20} className="upload-zone-icon" />
          <span className="upload-zone-label">{label}</span>
          {hint && <span className="upload-zone-hint">{hint}</span>}
        </>
      )}
    </div>
  )
}
