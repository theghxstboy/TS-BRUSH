import React from 'react'
import { Layout, Plus } from 'lucide-react'
import { CollapsibleSection } from './CollapsibleSection'
import { useBrandStore } from '../../store/useBrandStore'
import { SlidePreview } from '../common/SlidePreview'

type TemplateType = 'cover' | 'section' | 'content' | 'final'

interface TemplateItem {
  id: string
  name: string
  type: TemplateType
  label?: string
  bg?: string
  accent?: string
}

const TEMPLATES: { group: string; items: TemplateItem[] }[] = [
  { group: 'Manual de Marca', items: [
    { id: 'capa', name: 'Capa', type: 'cover' },
    { id: 'bem-vindo', name: 'Boas-vindas', type: 'content' },
    { id: 'sumario', name: 'Sumário', type: 'content' },
    { id: 'logo-principal', name: 'Logo Principal', type: 'cover', label: 'LOGO PRINCIPAL' },
    { id: 'cores', name: 'Cores', type: 'section', label: 'PALETA DE CORES' },
    { id: 'tipografia', name: 'Tipografia', type: 'section', label: 'TIPOGRAFIA' },
    { id: 'mockup', name: 'Mockups', type: 'content' },
    { id: 'final', name: 'Encerramento', type: 'final' },
  ]},
  { group: 'Apresentação de Logo', items: [
    { id: 'pres-capa', name: 'Capa Pres', type: 'cover', bg: '#000', accent: '#FFA300' },
    { id: 'pres-intro', name: 'Introdução', type: 'section', bg: '#000', accent: '#FFA300' },
    { id: 'pres-comparison', name: 'Comparativo', type: 'content' },
    { id: 'pres-mockup', name: 'Mockup Pres', type: 'content' },
  ]}
]

export function SectionTemplates() {
  const { addCustomSlide, assets_base64, aparencia, presentation_data, custom_presentation_data } = useBrandStore()

  const handleDragStart = (e: React.DragEvent, templateId: string) => {
    e.dataTransfer.setData('templateId', templateId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <CollapsibleSection
      label="Templates de Slides"
      icon={<Layout size={18} />}
      defaultOpen={true}
    >
      <div className="section-templates">
        <p className="section-help-text" style={{ marginBottom: 12 }}>
          Arraste os templates para o canvas ou clique para adicionar.
        </p>

        {TEMPLATES.map(group => (
          <div key={group.group} className="template-group" style={{ marginBottom: 20 }}>
            <div className="template-group-title" style={{ marginBottom: 12 }}>{group.group}</div>
            <div className="template-grid">
              {group.items.map(item => {
                // Use global custom presentation appearance for all previews in this mode
                const bg = custom_presentation_data.appearance.fundo
                const accent = custom_presentation_data.appearance.detalhe
                const titleColor = custom_presentation_data.appearance.titulo
                const textColor = custom_presentation_data.appearance.texto
                
                const isDark = bg === '#000000' || bg === '#1a1a1a' || bg === '#0C0C0C'
                const defTitle = titleColor || (isDark ? '#FFFFFF' : '#1a1a1a')
                const defText = textColor || (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)')
                
                return (
                  <div
                    key={item.id}
                    className="template-item-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onClick={() => addCustomSlide(item.id)}
                  >
                    <div className="template-preview-wrapper">
                      <SlidePreview 
                        type={item.type}
                        bg={bg}
                        accent={accent}
                        titleColor={titleColor}
                        textColor={textColor}
                        label={item.label || item.name}
                        logoSrc={assets_base64.logo_principal}
                      />
                    </div>
                    <div className="template-item-info">
                      <span className="template-item-label">{item.name}</span>
                      <div className="template-item-actions">
                        <div className="template-item-btn">
                          <Plus size={10} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}

