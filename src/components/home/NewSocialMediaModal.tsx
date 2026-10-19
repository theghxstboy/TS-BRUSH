import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Trash2, Share2, ArrowRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useBrandStore } from '../../store/useBrandStore'
import { fileToBase64, extractBrandTheme } from '../../lib/imageUtils'

export function NewSocialMediaModal({ onClose }: { onClose: () => void }) {
  const { setScreen } = useAppStore()
  const { social_media_data, setSocialMediaData, importJson } = useBrandStore()
  const logoRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const c = social_media_data.company
  const t = social_media_data.theme
  const [name, setName] = useState(c.name)
  const [logo, setLogo] = useState<string | null>(c.logo)
  const [phone, setPhone] = useState(c.phone)
  const [email, setEmail] = useState(c.email)
  const [website, setWebsite] = useState(c.website)
  const [instagram, setInstagram] = useState(c.instagram)
  const [facebook, setFacebook] = useState(c.facebook)
  const [services, setServices] = useState(c.services)
  const [primary, setPrimary] = useState(t.primary)
  const [accent, setAccent] = useState(t.accent)
  const b = social_media_data.background
  const [bgMode, setBgMode] = useState<'color' | 'image'>(b.mode)
  const [bgColor, setBgColor] = useState(b.color)
  const [bgImage, setBgImage] = useState<string | null>(b.image)
  const bgRef = useRef<HTMLInputElement>(null)

  const start = () => {
    setSocialMediaData({
      company: { ...c, name, logo, phone, email, website, instagram, facebook, services },
      theme: { primary, accent },
      background: { mode: bgMode, color: bgColor, image: bgImage },
      destaque: { ...social_media_data.destaque, ringOuterColor: primary, ringInnerColor: accent, iconColor: accent },
    })
    setScreen('social-media')
    onClose()
  }

  return (
    <div className="home-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="np-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="np-modal-header">
          <div className="home-modal-icon"><Share2 size={22} /></div>
          <div style={{ flex: 1 }}>
            <h3 className="home-modal-title">Personalização de Página</h3>
            <p className="np-modal-subtitle">Preencha os dados da empresa — eles alimentam a capa, a assinatura e as peças.</p>
          </div>
          <button type="button" className="np-close-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 28px', overflowY: 'auto' }}>
          <div className="form-group">
            <label className="form-label">Logo da empresa</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => logoRef.current?.click()}>
                <Upload size={14} /> {logo ? 'Trocar logo' : 'Enviar logo'}
              </button>
              {logo && (
                <>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', backgroundImage: `url(${logo})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', border: '1px solid var(--border)' }} />
                  <button type="button" className="btn btn-danger" style={{ width: 'auto', padding: '9px 11px' }} onClick={() => setLogo(null)}><Trash2 size={14} /></button>
                </>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const b64 = await fileToBase64(f); setLogo(b64); const th = await extractBrandTheme(b64); if (th) { setPrimary(th.primary); setAccent(th.accent) } } e.target.value = '' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Nome da empresa</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Hartemann Carpentry" />
          </div>

          <div className="form-group">
            <label className="form-label">Serviços (headline da capa)</label>
            <textarea className="form-textarea" rows={2} value={services} onChange={(e) => setServices(e.target.value)} placeholder={'FINISH AND CUSTOM CARPENTRY\nWINDOWS | DOORS | DECKS'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group"><label className="form-label">Telefone</label><input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(774) 470-7797" /></div>
            <div className="form-group"><label className="form-label">E-mail</label><input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Site</label><input className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Instagram</label><input className="form-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Facebook</label><input className="form-input" value={facebook} onChange={(e) => setFacebook(e.target.value)} /></div>
          </div>

          <div className="form-group">
            <label className="form-label">Cores da marca</label>
            <div style={{ display: 'flex', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} /> Primária
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} /> Destaque
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fundo global (padrão de todas as peças)</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <select className="form-input" style={{ width: 'auto' }} value={bgMode} onChange={(e) => setBgMode(e.target.value as 'color' | 'image')}>
                <option value="color">Cor sólida</option>
                <option value="image">Imagem / textura</option>
              </select>
              {bgMode === 'color'
                ? <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                : (
                  <>
                    <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => bgRef.current?.click()}><Upload size={14} /> {bgImage ? 'Trocar' : 'Enviar'}</button>
                    {bgImage && (
                      <>
                        <div style={{ width: 34, height: 34, borderRadius: 6, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)' }} />
                        <button type="button" className="btn btn-danger" style={{ width: 'auto', padding: '8px 10px' }} onClick={() => setBgImage(null)}><Trash2 size={14} /></button>
                      </>
                    )}
                    <input ref={bgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setBgImage(await fileToBase64(f)); e.target.value = '' }} />
                  </>
                )}
            </div>
          </div>
        </div>

        <div className="np-modal-footer" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => importRef.current?.click()}>
            <Upload size={14} /> Importar JSON
          </button>
          <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { importJson(f); onClose() } e.target.value = '' }} />
          <button type="button" className="home-modal-btn home-modal-btn-primary" onClick={start}>
            Começar <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
