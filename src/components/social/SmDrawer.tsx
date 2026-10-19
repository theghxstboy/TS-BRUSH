import { RotateCcw, PanelLeft, PanelRight, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, PaintBucket, Ban, Circle, CircleDot, Palette, Sparkles, Layers, EyeOff, Bookmark } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { useAppStore } from '../../store/useAppStore'
import { Field, ImageField, IconSegmented, ColorField, Toggle } from './controls'

type Tab = 'avatar' | 'capas' | 'destaques' | 'assinatura'

const EL_LABELS: Record<string, string> = {
  logo: 'Logo', button: 'Botão', services: 'Serviços', contact: 'Contatos',
  tagline: 'Slogan', info: 'Informações', title: 'Título', body: 'Texto',
}

export function SmDrawer({ tab }: { tab: Tab }) {
  const { social_media_data: sm, setSocialMediaData, setElementPosition, page_appearance } = useBrandStore()
  const selectedElement = useAppStore((s) => s.selectedElement)
  const selectedElements = useAppStore((s) => s.selectedElements)
  const d = sm.destaque
  const setDesign = (patch: Partial<typeof sm.destaque>) => setSocialMediaData({ destaque: { ...d, ...patch } })

  const sel = selectedElement && selectedElement.pageId.startsWith('sm-') ? selectedElement : null
  const targets = selectedElements.filter((e) => e.pageId.startsWith('sm-'))
  // Aplica a todos os elementos selecionados (multi-seleção = mexer em vários ao mesmo tempo).
  const applySel = (patch: { scale?: number; ls?: number; color?: string; logoVariant?: 'original' | 'white' | 'black' }) => (targets.length ? targets : sel ? [sel] : []).forEach((t) => setElementPosition(t.pageId, t.key, patch))
  const selPos = sel ? page_appearance[sel.pageId]?.element_positions?.[sel.key] : undefined
  const selScale = selPos?.scale ?? 1
  const selLs = selPos?.ls ?? 0
  const selColor = selPos?.color ?? '#333333'

  return (
    <aside className="sm-drawer">
      <h4 className="sm-sec-title" style={{ marginTop: 0 }}>Elemento selecionado{targets.length > 1 ? ` (${targets.length})` : ''}</h4>
      {sel ? (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>{targets.length > 1 ? `${targets.length} elementos` : (EL_LABELS[sel.key] ?? sel.key)}</p>
          {sel.key === 'logo' ? (
            <IconSegmented
              label={targets.length > 1 ? `Versão da logo (${targets.length} selecionadas)` : 'Versão da logo (só esta peça)'}
              value={selPos?.logoVariant ?? sm.company.logoVariant}
              onChange={(logoVariant) => applySel({ logoVariant })}
              options={[
                { value: 'original', icon: <ImageIcon size={16} />, title: 'Original (cores da logo)' },
                { value: 'white', icon: <Circle size={16} color="#8a8a8a" fill="#ffffff" />, title: 'Branca — logo clara p/ fundo escuro' },
                { value: 'black', icon: <Circle size={16} color="#8a8a8a" fill="#111111" />, title: 'Preta — logo escura p/ fundo claro' },
              ]}
            />
          ) : (
            <ColorField label="Cor do texto" icon={<Palette size={13} />} value={selColor} onChange={(v) => applySel({ color: v })} />
          )}
          <Field label={`Tamanho (${Math.round(selScale * 100)}%)`}><input type="range" min={0.3} max={2.5} step={0.05} value={selScale} onChange={(e) => applySel({ scale: Number(e.target.value) })} /></Field>
          <Field label={`Espaçamento das letras (${selLs}em)`}><input type="range" min={-0.05} max={0.5} step={0.01} value={selLs} onChange={(e) => applySel({ ls: Number(e.target.value) })} /></Field>
          <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => (targets.length ? targets : [sel]).forEach((t) => setElementPosition(t.pageId, t.key, { x: 0, y: 0, scale: 1, ls: 0 }))}>
            <RotateCcw size={13} /> Resetar posição/tamanho
          </button>
          <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>Dica: Shift+clique seleciona vários elementos pra mudar todos de uma vez.</p>
        </>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Clique num elemento da peça (logo, texto, botão) pra editar aqui. A cor afeta textos.</p>
      )}

      {tab === 'avatar' && (
        <>
          <h4 className="sm-sec-title">Avatar</h4>
          <Field label={`Tamanho da logo (${Math.round(sm.avatar.logoScale * 100)}%)`}>
            <input type="range" min={0.3} max={0.95} step={0.05} value={sm.avatar.logoScale} onChange={(e) => setSocialMediaData({ avatar: { logoScale: Number(e.target.value) } })} />
          </Field>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>3 versões + sem fundo (PNG transparente) são geradas automaticamente.</p>
        </>
      )}

      {tab === 'capas' && (
        <>
          <h4 className="sm-sec-title">Capas</h4>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>Layout, foto e alinhamento valem pra todas as capas. Arraste os elementos em cada uma pra ajustar posições.</p>
          <IconSegmented
            label="Layout da capa"
            value={sm.facebook_cover.layout}
            onChange={(layout) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, layout } })}
            options={[
              { value: 'split', icon: <ImageIcon size={16} />, title: 'Com foto (foto + painel)' },
              { value: 'full', icon: <PaintBucket size={16} />, title: 'Fundo total (sem foto)' },
            ]}
          />
          {sm.facebook_cover.layout === 'split' && (
            <>
              <ImageField label="Foto da capa" value={sm.facebook_cover.photo} onChange={(v) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, photo: v } })} maxPx={3200} quality={0.92} />
              <IconSegmented
                label="Lado da foto"
                value={sm.facebook_cover.side}
                onChange={(side) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, side } })}
                options={[
                  { value: 'right', icon: <PanelLeft size={16} />, title: 'Foto à esquerda' },
                  { value: 'left', icon: <PanelRight size={16} />, title: 'Foto à direita' },
                ]}
              />
            </>
          )}
          {sm.facebook_cover.layout === 'full' && (
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>No "fundo total", a foto da capa não é usada — o fundo global (sidebar) preenche tudo e o conteúdo fica por cima.</p>
          )}
          <IconSegmented
            label="Alinhamento do texto"
            value={sm.facebook_cover.textAlign}
            onChange={(textAlign) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, textAlign } })}
            options={[
              { value: 'left', icon: <AlignLeft size={16} />, title: 'Esquerda' },
              { value: 'center', icon: <AlignCenter size={16} />, title: 'Centro' },
              { value: 'right', icon: <AlignRight size={16} />, title: 'Direita' },
            ]}
          />
          <Toggle label="Mostrar logo" icon={<ImageIcon size={14} />} checked={sm.facebook_cover.showLogo} onChange={(showLogo) => setSocialMediaData({ facebook_cover: { ...sm.facebook_cover, showLogo } })} />
        </>
      )}

      {tab === 'assinatura' && (
        <>
          <h4 className="sm-sec-title">Assinatura</h4>
          <label className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={sm.signature.showAvatar} onChange={(e) => setSocialMediaData({ signature: { ...sm.signature, showAvatar: e.target.checked } })} /> Mostrar foto (avatar)
          </label>
          {sm.signature.showAvatar && (
            <>
              <Field label="Formato da foto">
                <select className="form-input" value={sm.signature.avatarShape} onChange={(e) => setSocialMediaData({ signature: { ...sm.signature, avatarShape: e.target.value as 'round' | 'square' } })}>
                  <option value="round">Redondo</option>
                  <option value="square">Quadrado</option>
                </select>
              </Field>
              <ImageField label="Foto do avatar" value={sm.signature.avatarPhoto} onChange={(v) => setSocialMediaData({ signature: { ...sm.signature, avatarPhoto: v } })} />
            </>
          )}
          <h4 className="sm-sec-title">Fundo da assinatura</h4>
          <IconSegmented
            label="Tipo de fundo"
            value={sm.signature.bg.mode}
            onChange={(mode) => setSocialMediaData({ signature: { ...sm.signature, bg: { ...sm.signature.bg, mode } } })}
            options={[
              { value: 'color', icon: <PaintBucket size={16} />, title: 'Cor sólida' },
              { value: 'image', icon: <ImageIcon size={16} />, title: 'Imagem' },
            ]}
          />
          {sm.signature.bg.mode === 'color'
            ? <ColorField label="Cor do fundo" icon={<PaintBucket size={13} />} value={sm.signature.bg.color} onChange={(v) => setSocialMediaData({ signature: { ...sm.signature, bg: { ...sm.signature.bg, color: v } } })} />
            : <ImageField label="Imagem de fundo" value={sm.signature.bg.image} onChange={(v) => setSocialMediaData({ signature: { ...sm.signature, bg: { ...sm.signature.bg, image: v } } })} />}
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Fundo próprio (não usa o fundo global). Nome e contatos vêm dos dados da empresa; clique num texto pra mudar a cor.</p>
        </>
      )}

      {tab === 'destaques' && (
        <>
          <h4 className="sm-sec-title" style={{ marginTop: 0 }}>Fundo da peça</h4>
          <IconSegmented
            label="Tipo de fundo"
            value={d.bgMode}
            onChange={(bgMode) => setDesign({ bgMode })}
            options={[
              { value: 'global', icon: <Layers size={16} />, title: 'Fundo global (padrão)' },
              { value: 'photo', icon: <ImageIcon size={16} />, title: 'Foto' },
              { value: 'color', icon: <PaintBucket size={16} />, title: 'Cor sólida' },
              { value: 'none', icon: <Ban size={16} />, title: 'Sem fundo (transparente)' },
            ]}
          />
          {d.bgMode === 'photo' && <ImageField label="Foto de fundo" value={d.bgImage} onChange={(v) => setDesign({ bgImage: v })} />}
          {d.bgMode === 'color' && <ColorField label="Cor do fundo" icon={<PaintBucket size={13} />} value={d.bgColor} onChange={(v) => setDesign({ bgColor: v })} />}

          <h4 className="sm-sec-title">Anéis</h4>
          <ColorField label="Cor do anel externo" icon={<Circle size={13} />} value={d.ringOuterColor} onChange={(v) => setDesign({ ringOuterColor: v })} />
          <Field label={`Espessura do anel externo (${d.ringOuterWidth})`}><input type="range" min={0} max={90} step={2} value={d.ringOuterWidth} onChange={(e) => setDesign({ ringOuterWidth: Number(e.target.value) })} /></Field>
          <ColorField label="Cor do anel interno" icon={<CircleDot size={13} />} value={d.ringInnerColor} onChange={(v) => setDesign({ ringInnerColor: v })} />
          <Field label={`Espessura do anel interno (${d.ringInnerWidth})`}><input type="range" min={0} max={60} step={2} value={d.ringInnerWidth} onChange={(e) => setDesign({ ringInnerWidth: Number(e.target.value) })} /></Field>
          <Field label={`Espaço entre anéis (${d.gap})`}><input type="range" min={0} max={60} step={2} value={d.gap} onChange={(e) => setDesign({ gap: Number(e.target.value) })} /></Field>
          <IconSegmented
            label="Estilo da borda"
            value={d.ringStyle}
            onChange={(ringStyle) => setDesign({ ringStyle })}
            options={[
              { value: 'solid', icon: <svg width="22" height="10"><line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="2.5" /></svg>, title: 'Sólida' },
              { value: 'dashed', icon: <svg width="22" height="10"><line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 4" /></svg>, title: 'Tracejada' },
              { value: 'dotted', icon: <svg width="22" height="10"><line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="2.5" strokeDasharray="0.5 5" strokeLinecap="round" /></svg>, title: 'Pontilhada' },
            ]}
          />

          <h4 className="sm-sec-title">Botão</h4>
          <Toggle label="Mostrar botão" icon={<EyeOff size={14} />} checked={d.showButton ?? true} onChange={(v) => setDesign({ showButton: v })} />
          <ColorField label="Cor das pílulas / acento" icon={<Circle size={13} />} value={d.accentColor ?? sm.theme.accent} onChange={(v) => setDesign({ accentColor: v })} />
          {d.accentColor && (
            <button type="button" className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setDesign({ accentColor: null })}>
              Resetar para cor do tema
            </button>
          )}

          <h4 className="sm-sec-title">Centro & ícone</h4>
          <IconSegmented
            label="Preenchimento central"
            value={d.discFill}
            onChange={(discFill) => setDesign({ discFill })}
            options={[
              { value: 'none', icon: <Ban size={16} />, title: 'Nenhum' },
              { value: 'color', icon: <Circle size={16} fill="currentColor" />, title: 'Cor sólida' },
            ]}
          />
          {d.discFill === 'color' && <ColorField label="Cor do preenchimento" icon={<Circle size={13} />} value={d.discColor} onChange={(v) => setDesign({ discColor: v })} />}
          <ColorField label="Cor do ícone" icon={<Palette size={13} />} value={d.iconColor} onChange={(v) => setDesign({ iconColor: v })} />
          <Field label={`Traço do ícone (${d.iconStrokeWidth})`}><input type="range" min={1} max={4} step={0.1} value={d.iconStrokeWidth} onChange={(e) => setDesign({ iconStrokeWidth: Number(e.target.value) })} /></Field>
          <Field label={`Tamanho do botão (${d.buttonSize}px)`}><input type="range" min={300} max={860} step={10} value={d.buttonSize} onChange={(e) => setDesign({ buttonSize: Number(e.target.value) })} /></Field>

          <h4 className="sm-sec-title">Efeito 3D</h4>
          <Toggle label="Gradiente + sombra" icon={<Sparkles size={14} />} checked={d.emboss} onChange={(emboss) => setDesign({ emboss })} />
          {d.emboss && (
            <Field label={`Profundidade (${Math.round(d.embossDepth * 100)}%)`}>
              <input type="range" min={0.1} max={0.7} step={0.02} value={d.embossDepth} onChange={(e) => setDesign({ embossDepth: Number(e.target.value) })} />
            </Field>
          )}

          <h4 className="sm-sec-title">Ícones padrão</h4>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', gap: 6 }}
            onClick={() => {
              const defaults: Record<string, string> = {}
              sm.destaques.forEach((dq) => { defaults[dq.id] = dq.icon })
              setSocialMediaData({ iconDefaults: defaults })
            }}
          >
            <Bookmark size={14} /> Salvar ícones atuais como padrão
          </button>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0 0' }}>
            Novos destaques usarão os ícones que você salvou.
          </p>
        </>
      )}
    </aside>
  )
}
