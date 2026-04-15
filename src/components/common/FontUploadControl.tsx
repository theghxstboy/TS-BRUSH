import { useRef } from 'react'
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
    <div className="font-control">
      <div className="font-control-header">
        <p className="form-label" style={{ margin: 0, color: 'var(--accent)' }}>{title}</p>
        {optional ? <span className="font-control-badge">opcional</span> : null}
      </div>

      <div className="form-group">
        <label className="form-label">Nome da Fonte</label>
        <input className="form-input" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder={placeholder} />
      </div>

      {effectiveName ? (
        <div className="font-preview-card">
          <div className="font-preview-name">{effectiveName}</div>
          <div className="font-preview-sample" style={{ fontFamily: previewFontFamily }}>
            Aa Bb Cc 0123456789
          </div>
        </div>
      ) : (
        <p className="font-helper-text">
          Digite o nome da fonte ou carregue um arquivo para ver o preview desta tipografia.
        </p>
      )}

      {onStylesChange ? (
        <div className="form-group">
          <label className="form-label">Estilos / Pesos</label>
          <input className="form-input" value={styles} onChange={(e) => onStylesChange(e.target.value)} placeholder={stylesPlaceholder} />
        </div>
      ) : null}

      <div className="font-upload-card">
        <div className="form-group">
          <label className="form-label">Pasta Padrao das Fontes no Windows</label>
          <input className="form-input" value={WINDOWS_FONTS_PATH} readOnly />
        </div>

        <p className="font-helper-text">{sourceHint}</p>
        <p className="font-helper-text">
          Use arquivos <code>.ttf</code>, <code>.otf</code>, <code>.woff</code> ou <code>.woff2</code>.
        </p>

        <div className="font-upload-actions">
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

          <button type="button" className="font-upload-button is-primary" onClick={() => inputRef.current?.click()}>
            Escolher arquivo
          </button>

          {customFont.data_url ? (
            <button
              type="button"
              className="font-upload-button"
              onClick={() => onCustomFontChange({ ...EMPTY_UPLOADED_FONT })}
            >
              Remover arquivo
            </button>
          ) : null}
        </div>

        {customFont.file_name ? (
          <div className="font-upload-file">Arquivo atual: {customFont.file_name}</div>
        ) : (
          <p className="font-helper-text" style={{ marginTop: 2 }}>
            Sem arquivo carregado. Nesse caso, o sistema usa o nome digitado como referencia.
          </p>
        )}
      </div>
    </div>
  )
}
