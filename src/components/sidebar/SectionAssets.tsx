import { ImageIcon, X } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'
import { UploadZone } from './UploadZone'
import { fileToBase64 } from '../../lib/imageUtils'
import { toast } from 'sonner'
import { useRef } from 'react'

// SVG + PNG + common raster formats accepted for logos
const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,.svg,.png,.webp,.jpg,.jpeg'
// Photos only for mockups (SVG rarely used as mockup)
const MOCKUP_ACCEPT = 'image/*'

export function SectionAssets() {
  const { assets_base64, setAsset, addMockup, removeMockup } = useBrandStore()
  const mockupRef = useRef<HTMLInputElement>(null)

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
    <CollapsibleSection icon={<ImageIcon size={14} />} label="Logos & Assets" defaultOpen>
      {/* ── Logos (SVG ou PNG transparente) ──────────────────── */}
      <div style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.12)', borderRadius: 8, padding: '10px 12px', marginBottom: 4 }}>
        <p style={{ fontSize: 11, color: '#fb923c', fontWeight: 600, marginBottom: 2 }}>💡 Recomendado: SVG ou PNG com fundo transparente</p>
        <p style={{ fontSize: 10, color: '#a1a1aa', lineHeight: 1.5 }}>Logos SVG são exibidas em tamanho perfeito sem distorção. PNGs com canal alpha também funcionam.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Logo Principal</label>
        <UploadZone
          label="Upload Logo Principal"
          hint="SVG recomendado · PNG com transparência"
          accept={LOGO_ACCEPT}
          value={assets_base64.logo_principal}
          onChange={(v) => setAsset('logo_principal', v)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Logo Monocromática</label>
        <UploadZone
          label="Upload Logo Mono"
          hint="SVG recomendado · versão preta ou branca"
          accept={LOGO_ACCEPT}
          value={assets_base64.logo_monocromatica}
          onChange={(v) => setAsset('logo_monocromatica', v)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Símbolo / Ícone</label>
        <UploadZone
          label="Upload Símbolo"
          hint="SVG recomendado · só o ícone, sem texto"
          accept={LOGO_ACCEPT}
          value={assets_base64.logo_simbolo}
          onChange={(v) => setAsset('logo_simbolo', v)}
        />
      </div>


      {/* ── Mockups (1 por página) ───────────────────────────── */}
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
                {/* Index badge */}
                <div style={{
                  position: 'absolute', top: 6, left: 8,
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  borderRadius: 4, fontFamily: "'Geist Mono', monospace"
                }}>
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
            for (const f of files) await handleMockup(f)
            e.target.value = ''
          }}
        />
        <button className="btn-add" onClick={() => mockupRef.current?.click()}>
          <ImageIcon size={13} /> Adicionar Mockup(s)
        </button>
      </div>
    </CollapsibleSection>
  )
}
