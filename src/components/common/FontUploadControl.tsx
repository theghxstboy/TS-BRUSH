import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  EMPTY_UPLOADED_FONT,
  WINDOWS_FONTS_PATH,
  deriveFontNameFromFileName,
  getFontFamilyStack,
  inferFontFormat,
  readFileAsDataUrl,
  resolveFontName,
} from '../../lib/fontUtils'
import type { UploadedFontAsset } from '../../lib/fontUtils'

interface FontUploadControlProps {
  title: string
  optional?: boolean
  name: string
  styles?: string
  customFont: UploadedFontAsset
  onNameChange: (value: string) => void
  onStylesChange?: (value: string) => void
  onCustomFontChange: (value: UploadedFontAsset) => void
  placeholder: string
  stylesPlaceholder?: string
  previewFallback: string
  previewGeneric?: 'sans-serif' | 'monospace'
  sourceHint?: string
}

export function FontUploadControl({
  title,
  optional = false,
  name,
  styles = '',
  customFont,
  onNameChange,
  onStylesChange,
  onCustomFontChange,
  placeholder,
  stylesPlaceholder = 'Ex: Regular 400, Bold 700',
  previewFallback,
  previewGeneric = 'sans-serif',
  sourceHint = 'Digite o nome da fonte para carregar via Google Fonts ou escolha um arquivo personalizado.',
}: FontUploadControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showUpload, setShowUpload] = useState(!!customFont.data_url)
  const [isDragging, setIsDragging] = useState(false)

  const effectiveName = resolveFontName(name, customFont.file_name)
  const previewFontFamily = getFontFamilyStack(effectiveName, previewFallback, previewGeneric)

  const handleFontFile = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file)
      onCustomFontChange({
        file_name: file.name,
        data_url: dataUrl,
        format: inferFontFormat(file),
      })

      if (!name.trim()) {
        onNameChange(deriveFontNameFromFileName(file.name))
      }

      toast.success(`Fonte "${file.name}" carregada.`)
    } catch {
      toast.error('Erro ao processar a fonte personalizada.')
    }
  }

  return (
    <div className="font-control" style={{ gap: '8px' }}>
      <div className="font-control-header" style={{ marginBottom: '4px', height: '20px' }}>
        <p className="form-label" style={{ margin: 0, color: 'var(--accent)', fontSize: '10px' }}>{title}</p>
        {optional ? <span className="font-control-badge" style={{ padding: '1px 6px', fontSize: '8px' }}>opcional</span> : <div style={{height: 18}} />}
      </div>

      <div className="form-group">
        <label className="form-label">Nome da Fonte</label>
        <input className="form-input" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder={placeholder} />
        <p className="font-helper-text" style={{ marginTop: 4 }}>
          O sistema puxará do <strong>Google Fonts automaticamente</strong> (caso a fonte esteja no catálogo oficial).
        </p>
      </div>

      {effectiveName ? (
        <div className="font-preview-card" style={{ padding: '8px 12px' }}>
          <div className="font-preview-name" style={{ fontSize: '11px' }}>{effectiveName}</div>
          <div className="font-preview-sample" style={{ fontFamily: previewFontFamily, fontSize: '15px', marginTop: '4px' }}>
            Aa Bb Cc 0123456789
          </div>
        </div>
      ) : (
        <p className="font-helper-text" style={{ margin: '4px 0' }}>
          Digite o nome ou carregue um arquivo para preview.
        </p>
      )}

      {onStylesChange ? (
        <div className="form-group" style={{ gap: '3px' }}>
          <label className="form-label" style={{ fontSize: '10px' }}>Estilos / Pesos</label>
          <input className="form-input" style={{ padding: '7px 10px', fontSize: '12px' }} value={styles} onChange={(e) => onStylesChange(e.target.value)} placeholder={stylesPlaceholder} />
        </div>
      ) : null}

      <label className="np-switch-wrapper" style={{ marginTop: '4px' }}>
        <div className="np-switch">
          <input type="checkbox" checked={showUpload} onChange={(e) => setShowUpload(e.target.checked)} />
          <span className="np-switch-slider"></span>
        </div>
        <span className="np-switch-label" style={{ fontSize: '10px', opacity: 0.8 }}>Anexar Arquivo (Opcional)</span>
      </label>

      {showUpload && (
        <div 
          className={`font-upload-card ${isDragging ? 'drag-active' : ''}`} 
          style={{ marginTop: '4px', padding: '10px' }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file && (file.name.endsWith('.ttf') || file.name.endsWith('.otf') || file.name.endsWith('.woff') || file.name.endsWith('.woff2'))) {
              handleFontFile(file)
            } else {
              toast.error('Formato de fonte inválido (.ttf, .otf, .woff, .woff2)')
            }
          }}
        >
          <p className="font-helper-text" style={{ marginBottom: '8px', fontSize: '10px' }}>{sourceHint}</p>

          <div className="font-upload-actions" style={{ marginTop: 0 }}>
            <input
              ref={inputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontFile(file)
                e.target.value = ''
              }}
            />

            <button type="button" className="font-upload-button is-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => inputRef.current?.click()}>
              Escolher arquivo
            </button>

            {customFont.data_url ? (
              <button
                type="button"
                className="font-upload-button"
                style={{ padding: '6px 12px', fontSize: '11px' }}
                onClick={() => onCustomFontChange({ ...EMPTY_UPLOADED_FONT })}
              >
                Remover
              </button>
            ) : null}
          </div>

          {customFont.file_name && (
            <div className="font-upload-file" style={{ fontSize: '10px', marginTop: '6px' }}>Arquivo: {customFont.file_name}</div>
          )}
        </div>
      )}
    </div>
  )
}
