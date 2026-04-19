import { Type } from 'lucide-react'
import { FontUploadControl } from '../common/FontUploadControl'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { DEFAULT_BODY_FONT } from '../../lib/fontUtils'
import { CollapsibleSection } from './CollapsibleSection'

export function SectionTipografia() {
  const { screen } = useAppStore()
  const { tipografia, setTipografia, presentation_data, setPresentationData } = useBrandStore()

  const isPres = screen === 'brand-presentation'

  return (
    <CollapsibleSection icon={<Type size={14} />} label="Tipografia" defaultOpen={false} sectionId="tipografia">
      <div style={{ paddingBottom: 14 }}>
        <FontUploadControl
          title={isPres ? 'Fontes da Proposta · Títulos' : 'Fontes da Apresentacao · Titulos'}
          name={isPres ? presentation_data.typography.titulosNome : tipografia.apresentacao_titulos}
          customFont={isPres ? presentation_data.typography.titulosCustom : tipografia.apresentacao_titulos_custom}
          onNameChange={(value) => {
            if (isPres) {
              setPresentationData({
                ...presentation_data,
                typography: { ...presentation_data.typography, titulosNome: value }
              })
            } else {
              setTipografia({ apresentacao_titulos: value })
            }
          }}
          onCustomFontChange={(value) => {
            if (isPres) {
              setPresentationData({
                ...presentation_data,
                typography: { ...presentation_data.typography, titulosCustom: value }
              })
            } else {
              setTipografia({ apresentacao_titulos_custom: value })
            }
          }}
          placeholder="Ex: Sora, Montserrat, Poppins"
          previewFallback={DEFAULT_BODY_FONT}
          sourceHint={isPres 
            ? "Escolha a fonte dos títulos para esta proposta específica."
            : "Digite o nome para buscar no Google Fonts ou escolha um arquivo personalizado para usar nos titulos da apresentacao."}
        />

        <FontUploadControl
          title={isPres ? 'Fontes da Proposta · Textos' : 'Fontes da Apresentacao · Textos'}
          name={isPres ? presentation_data.typography.textosNome : tipografia.apresentacao_textos}
          customFont={isPres ? presentation_data.typography.textosCustom : tipografia.apresentacao_textos_custom}
          onNameChange={(value) => {
            if (isPres) {
              setPresentationData({
                ...presentation_data,
                typography: { ...presentation_data.typography, textosNome: value }
              })
            } else {
              setTipografia({ apresentacao_textos: value })
            }
          }}
          onCustomFontChange={(value) => {
            if (isPres) {
              setPresentationData({
                ...presentation_data,
                typography: { ...presentation_data.typography, textosCustom: value }
              })
            } else {
              setTipografia({ apresentacao_textos_custom: value })
            }
          }}
          placeholder="Ex: Inter, Manrope, DM Sans"
          previewFallback={DEFAULT_BODY_FONT}
          sourceHint={isPres
            ? "Escolha a fonte dos textos para esta proposta específica."
            : "Digite o nome para buscar no Google Fonts ou escolha um arquivo personalizado para usar nos textos da apresentacao."}
        />

        {!isPres && (
          <>
            {!tipografia.apresentacao_titulos && !tipografia.apresentacao_titulos_custom.data_url && !tipografia.apresentacao_textos && !tipografia.apresentacao_textos_custom.data_url && (
              <p style={{ fontSize: 11, color: '#52525b', marginTop: 8, lineHeight: 1.5 }}>
                Se deixar ambos em branco e sem arquivo, a apresentacao herda automaticamente a tipografia principal da marca.
              </p>
            )}

            <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 10px' }} />

            <div className="form-group">
              <label className="form-label">Alinhamento do Texto</label>
              <select
                id="input-apresentacao-alinhamento"
                className="form-input"
                value={tipografia.apresentacao_alinhamento}
                onChange={(e) => setTipografia({ apresentacao_alinhamento: e.target.value as 'left' | 'center' | 'right' | 'justify' })}
              >
                <option value="left">A esquerda</option>
                <option value="center">Centralizado</option>
                <option value="right">A direita</option>
                <option value="justify">Justificado</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: 10 }}>
              <label className="form-label">Escala dos Titulos</label>
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
              <label className="form-label">Tamanho dos Titulos das Paginas</label>
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
              <label className="form-label">Espacamento entre Letras</label>
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
          </>
        )}

        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.02)',
            fontSize: 11,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {isPres 
            ? "A tipografia configurada aqui é exclusiva para esta Apresentação de Identidade Visual."
            : "As fontes principal e secundaria da marca continuam no slide de tipografia, no painel da direita."}
        </div>
      </div>
    </CollapsibleSection>
  )
}
