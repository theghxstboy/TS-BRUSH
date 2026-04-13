import { useEffect } from 'react'
import { Type } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

function loadGoogleFont(fontName: string) {
  if (!fontName.trim()) return
  const id = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  const query = encodeURIComponent(fontName)
  link.href = `https://fonts.googleapis.com/css2?family=${query}:wght@300;400;500;600;700;800;900&display=swap`
  document.head.appendChild(link)
}

export function SectionTipografia() {
  const { tipografia, setTipografia } = useBrandStore()

  useEffect(() => {
    ;[
      tipografia.principal_nome,
      tipografia.secundaria_nome,
      tipografia.apresentacao_titulos,
      tipografia.apresentacao_textos,
    ].forEach(loadGoogleFont)
  }, [
    tipografia.principal_nome,
    tipografia.secundaria_nome,
    tipografia.apresentacao_titulos,
    tipografia.apresentacao_textos,
  ])

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Tipografia" defaultOpen={false} sectionId="tipografia">
      <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <p className="form-label" style={{ marginBottom: 10, color: 'var(--accent)' }}>Fontes da Apresentação</p>

        <div className="form-group">
          <label className="form-label">Fonte dos Títulos</label>
          <input
            id="input-apresentacao-titulos"
            className="form-input"
            placeholder="Ex: Sora, Montserrat, Poppins"
            value={tipografia.apresentacao_titulos}
            onChange={(e) => setTipografia({ apresentacao_titulos: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Fonte dos Textos</label>
          <input
            id="input-apresentacao-textos"
            className="form-input"
            placeholder="Ex: Inter, Manrope, DM Sans"
            value={tipografia.apresentacao_textos}
            onChange={(e) => setTipografia({ apresentacao_textos: e.target.value })}
          />
        </div>

        {(tipografia.apresentacao_titulos || tipografia.apresentacao_textos) && (
          <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
            <div
              style={{
                padding: '10px 12px',
                background: 'var(--bg-input)',
                borderRadius: 7,
                border: '1px solid var(--border)',
                fontFamily: tipografia.apresentacao_titulos ? `'${tipografia.apresentacao_titulos}', sans-serif` : 'inherit',
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              Título da apresentação
            </div>
            <div
              style={{
                padding: '10px 12px',
                background: 'var(--bg-input)',
                borderRadius: 7,
                border: '1px solid var(--border)',
                fontFamily: tipografia.apresentacao_textos ? `'${tipografia.apresentacao_textos}', sans-serif` : 'inherit',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
              }}
            >
              Texto corrido, descrições e observações do manual.
            </div>
          </div>
        )}

        {!tipografia.apresentacao_titulos && !tipografia.apresentacao_textos && (
          <p style={{ fontSize: 11, color: '#52525b', marginTop: 6, lineHeight: 1.5 }}>
            Se preferir, deixe em branco para herdar automaticamente a tipografia principal da marca.
          </p>
        )}

        <div style={{ height: 1, background: 'var(--border)', margin: '12px 0 10px' }} />

        <div className="form-group">
          <label className="form-label">Alinhamento do Texto</label>
          <select
            id="input-apresentacao-alinhamento"
            className="form-input"
            value={tipografia.apresentacao_alinhamento}
            onChange={(e) => setTipografia({ apresentacao_alinhamento: e.target.value as 'left' | 'center' | 'right' | 'justify' })}
          >
            <option value="left">À esquerda</option>
            <option value="center">Centralizado</option>
            <option value="right">À direita</option>
            <option value="justify">Justificado</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Escala dos Títulos</label>
          <input
            id="input-apresentacao-tamanho-titulo"
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={tipografia.apresentacao_tamanho_titulo}
            onChange={(e) => setTipografia({ apresentacao_tamanho_titulo: Number(e.target.value) })}
          />
          <span style={{ fontSize: 11, color: '#71717a' }}>{Math.round(tipografia.apresentacao_tamanho_titulo * 100)}%</span>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Tamanho dos Títulos das Páginas</label>
          <input
            id="input-apresentacao-titulo-pagina"
            type="range"
            min="0.8"
            max="1.6"
            step="0.05"
            value={tipografia.apresentacao_tamanho_titulo_pagina}
            onChange={(e) => setTipografia({ apresentacao_tamanho_titulo_pagina: Number(e.target.value) })}
          />
          <span style={{ fontSize: 11, color: '#71717a' }}>{Math.round(tipografia.apresentacao_tamanho_titulo_pagina * 100)}%</span>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Escala dos Textos</label>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={tipografia.apresentacao_tamanho_texto}
            onChange={(e) => setTipografia({ apresentacao_tamanho_texto: Number(e.target.value) })}
          />
          <span style={{ fontSize: 11, color: '#71717a' }}>{Math.round(tipografia.apresentacao_tamanho_texto * 100)}%</span>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Entrelinha</label>
          <input
            type="range"
            min="1.2"
            max="2.2"
            step="0.05"
            value={tipografia.apresentacao_entrelinha}
            onChange={(e) => setTipografia({ apresentacao_entrelinha: Number(e.target.value) })}
          />
          <span style={{ fontSize: 11, color: '#71717a' }}>{tipografia.apresentacao_entrelinha.toFixed(2)}</span>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Espaçamento entre Letras</label>
          <input
            type="range"
            min="-0.04"
            max="0.12"
            step="0.01"
            value={tipografia.apresentacao_espacamento_letras}
            onChange={(e) => setTipografia({ apresentacao_espacamento_letras: Number(e.target.value) })}
          />
          <span style={{ fontSize: 11, color: '#71717a' }}>{tipografia.apresentacao_espacamento_letras.toFixed(2)}em</span>
        </div>
      </div>

      <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <p className="form-label" style={{ marginBottom: 10, color: 'var(--accent)' }}>Fonte Principal da Marca</p>

        <div className="form-group">
          <label className="form-label">Nome da Fonte</label>
          <input
            id="input-fonte-principal"
            className="form-input"
            placeholder="Ex: Geist, Inter, Montserrat"
            value={tipografia.principal_nome}
            onChange={(e) => setTipografia({ principal_nome: e.target.value })}
          />
          {tipografia.principal_nome && (
            <div
              style={{
                marginTop: 6,
                padding: '8px 12px',
                background: 'var(--bg-input)',
                borderRadius: 7,
                fontFamily: `'${tipografia.principal_nome}', sans-serif`,
                fontSize: 15,
                color: 'var(--text-primary)',
                letterSpacing: '0.01em',
                border: '1px solid var(--border)',
              }}
            >
              Aa Bb Cc 0123456789
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Estilos / Pesos</label>
          <input
            id="input-fonte-principal-estilos"
            className="form-input"
            placeholder="Ex: Light 300, Regular 400, Bold 700, Black 900"
            value={tipografia.principal_estilos}
            onChange={(e) => setTipografia({ principal_estilos: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <p className="form-label" style={{ margin: 0, color: 'var(--text-secondary)' }}>Fonte Secundária da Marca</p>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '1px 6px',
              color: '#71717a',
            }}
          >
            opcional
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Nome da Fonte</label>
          <input
            id="input-fonte-secundaria"
            className="form-input"
            placeholder="Ex: Geist Mono, DM Mono, Space Mono"
            value={tipografia.secundaria_nome}
            onChange={(e) => setTipografia({ secundaria_nome: e.target.value })}
          />
          {tipografia.secundaria_nome && (
            <div
              style={{
                marginTop: 6,
                padding: '8px 12px',
                background: 'var(--bg-input)',
                borderRadius: 7,
                fontFamily: `'${tipografia.secundaria_nome}', monospace`,
                fontSize: 14,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              Aa Bb Cc 0123456789
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Estilos / Pesos</label>
          <input
            id="input-fonte-secundaria-estilos"
            className="form-input"
            placeholder="Ex: Regular 400, Medium 500"
            value={tipografia.secundaria_estilos}
            onChange={(e) => setTipografia({ secundaria_estilos: e.target.value })}
          />
        </div>

        {!tipografia.secundaria_nome && (
          <p style={{ fontSize: 11, color: '#52525b', marginTop: 6, lineHeight: 1.5 }}>
            Deixe em branco para usar apenas a fonte principal no manual.
          </p>
        )}
      </div>
    </CollapsibleSection>
  )
}
