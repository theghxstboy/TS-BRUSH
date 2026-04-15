import { useRef } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { extractColorsFromDataUrl, fileToBase64 } from '../../lib/imageUtils'
import { toast } from 'sonner'

const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,.svg,.png,.webp,.jpg,.jpeg'

interface EmptyCanvasProps {
  canvasRef?: React.RefObject<HTMLDivElement>
}

export function EmptyCanvas({ canvasRef }: EmptyCanvasProps) {
  const { setAsset, replaceCores } = useBrandStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setAsset('logo_principal', base64)

      const extracted = await extractColorsFromDataUrl(base64, 4)
      if (extracted.length > 0) {
        replaceCores('logo', extracted)
        replaceCores('apresentacao', extracted)
        toast.success('Logo carregada e cores extraídas com sucesso!')
      } else {
        toast.success('Logo carregada com sucesso!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao processar o logotipo.')
    }
  }

  return (
    <div ref={canvasRef} className="canvas-area">
      <div className="canvas-empty">
        <div className="canvas-empty-icon-wrapper">
          <BookOpen size={48} className="canvas-empty-icon" />
        </div>
        <p className="canvas-empty-title">
          Comece pelo upload do Logo Principal
        </p>
        <p className="canvas-empty-description">
          A capa e as páginas de logotipo aparecerão automaticamente.<br />
          Paleta de Cores e Tipografia já estão prontas para editar.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={LOGO_ACCEPT}
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleLogoUpload(file)
            e.target.value = ''
          }}
        />
        
        <button 
          className="btn-empty-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={18} />
          Adicionar Logo
        </button>
      </div>
    </div>
  )
}
