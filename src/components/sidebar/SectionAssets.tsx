import { ImageIcon, X } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'
import { extractColorsFromDataUrl, fileToBase64 } from '../../lib/imageUtils'
import { toast } from 'sonner'
import { useRef } from 'react'

const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,.svg,.png,.webp,.jpg,.jpeg'
const MOCKUP_ACCEPT = 'image/*'

export function SectionAssets() {
  const { screen } = useAppStore()
  const { 
    assets_base64, 
    setAsset, 
    addMockup, 
    removeMockup, 
    replaceCores, 
    presentation_data, 
    setPresentationData 
  } = useBrandStore()
  
  const mockupRef = useRef<HTMLInputElement>(null)
  const isPres = screen === 'brand-presentation'

  const handleLogoPrincipalChange = async (value: string | null) => {
    if (isPres) {
      // In presentation, "Logo Principal" is the new version logo if we had one global, 
      // but here we use it for the "Original" (Antiga) to be compared.
      setPresentationData({ ...presentation_data, original_logo: value })
    } else {
      setAsset('logo_principal', value)
    }

    if (!value) return

    const extracted = await extractColorsFromDataUrl(value, 4)
    if (extracted.length > 0) {
      if (isPres) {
        replaceCores('apresentacao', extracted)
      } else {
        replaceCores('logo', extracted)
        replaceCores('apresentacao', extracted)
      }
      toast.success('Cores extraídas da logo e aplicadas à paleta.')
    }
  }

  const handleMockup = async (file: File) => {
    try {
      const b64 = await fileToBase64(file, 1800, 0.82)
      addMockup(b64)
      toast.success(`Mockup "${file.name}" adicionado.`)
    } catch {
      toast.error('Erro ao processar mockup.')
    }
  }

  return (
    <CollapsibleSection icon={<ImageIcon size={14} />} label="Logos & Assets" defaultOpen sectionId="assets">
      <div
        style={{
          background: 'rgba(255,163,0,0.04)',
          border: '1px solid rgba(255,163,0,0.12)',
          borderRadius: 8,
          padding: '10px 12px',
          marginBottom: 4,
        }}
      >
        <p style={{ fontSize: 11, color: '#ffb833', fontWeight: 600, marginBottom: 2 }}>
          {isPres ? 'Logo Original para Comparativo' : 'Logo principal atualiza a paleta automaticamente'}
        </p>
        <p style={{ fontSize: 10, color: '#a1a1aa', lineHeight: 1.5 }}>
          {isPres 
            ? 'Envie a logo antiga do cliente para gerar os slides de "Versão Antiga vs Nova Versão".'
            : 'SVG ou PNG com fundo transparente funcionam melhor para preview e extração das cores da marca.'}
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">{isPres ? 'Logo Versão Antiga' : 'Logo Principal'}</label>
        <UploadZone
          inputId="input-logo-presentation-original"
          label={isPres ? 'Upload Logo Antiga' : 'Upload Logo Principal'}
          hint="SVG recomendado · PNG com transparência"
          accept={LOGO_ACCEPT}
          value={isPres ? presentation_data.original_logo : assets_base64.logo_principal}
          onChange={handleLogoPrincipalChange}
        />
      </div>

      {!isPres && (
        <>
          <div className="form-group">
            <label className="form-label">Logo Monocromática</label>
            <UploadZone
              inputId="input-logo-monocromatica"
              label="Upload Logo Mono"
              hint="SVG recomendado · versão preta ou branca"
              accept={LOGO_ACCEPT}
              value={assets_base64.logo_monocromatica}
              onChange={(value) => setAsset('logo_monocromatica', value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Símbolo / Ícone</label>
            <UploadZone
              inputId="input-logo-simbolo"
              label="Upload Símbolo"
              hint="SVG recomendado · só o ícone, sem texto"
              accept={LOGO_ACCEPT}
              value={assets_base64.logo_simbolo}
              onChange={(value) => setAsset('logo_simbolo', value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>
                Mockups <span style={{ color: 'var(--accent)', fontWeight: 700 }}>({assets_base64.mockups.length})</span>
              </label>
              <span style={{ fontSize: 10, color: '#71717a' }}>1 mockup = 1 página</span>
            </div>

            {assets_base64.mockups.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                {assets_base64.mockups.map((src, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img
                      src={src}
                      alt={`Mockup ${i + 1}`}
                      style={{ width: '100%', height: 60, objectFit: 'cover', display: 'block' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 8,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      Pág. {i + 1}
                    </div>
                    <button
                      className="upload-remove"
                      style={{ top: 6, right: 6 }}
                      onClick={() => removeMockup(i)}
                      title={`Remover mockup ${i + 1}`}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={mockupRef}
              type="file"
              accept={MOCKUP_ACCEPT}
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? [])
                for (const file of files) await handleMockup(file)
                e.target.value = ''
              }}
            />
            <button className="btn-add" onClick={() => mockupRef.current?.click()}>
              <ImageIcon size={13} /> Adicionar Mockup(s)
            </button>
          </div>
        </>
      )}
    </CollapsibleSection>
  )
}
