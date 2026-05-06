import { useBrandStore, DEFAULT_SLIDE_APPEARANCE } from '../store/useBrandStore'
import type { SlideAppearance } from '../store/useBrandStore'
import { useAppStore } from '../store/useAppStore'

export type PresentationGlobalType = 'capa' | 'secao' | 'final' | 'conteudo'

export function usePresentationAppearance(pageId: string, globalType: PresentationGlobalType): SlideAppearance {
  const { page_appearance, presentation_data, custom_presentation_data } = useBrandStore()
  const { screen } = useAppStore()
  const isCustom = screen === 'custom-presentation'
  
  // 1. Get the local override for this specific page
  // First check in page_appearance (manual mode), then in custom_presentation_data (custom mode)
  const local = isCustom 
    ? custom_presentation_data.slides.find(s => s.id === pageId)?.appearance
    : page_appearance[pageId]
  
  // 2. Resolve global style: if we are on custom-presentation, use its global config
  const globalCustom = custom_presentation_data.appearance
  const globalBrand = presentation_data.appearance
  
  let globalRef: any = globalBrand.secao
  
  if (globalType === 'capa') {
    globalRef = globalBrand.capa
  } else if (globalType === 'secao') {
    globalRef = globalBrand.secao
  } else if (globalType === 'conteudo') {
    globalRef = globalBrand.conteudo
  } else if (globalType === 'final') {
    globalRef = globalBrand.final
  }
  
  // Use custom global config if available
  const finalGlobal = {
    fundo: isCustom ? globalCustom?.fundo : (globalRef.fundo || '#FFFFFF'),
    titulo: isCustom ? globalCustom?.titulo : (globalRef.titulo || '#000000'),
    texto: isCustom ? globalCustom?.texto : (globalRef.texto || '#1A1A1A'),
    detalhe: isCustom ? globalCustom?.detalhe : (globalRef.detalhe || '#FFA300'),
  }
  
  // 3. Resolve each field with priority: Local -> Global -> Project Default
  return {
    cor_fundo_pagina: local?.cor_fundo_pagina || finalGlobal.fundo || '#FFFFFF',
    cor_titulo: local?.cor_titulo || finalGlobal.titulo || '#000000',
    cor_texto: local?.cor_texto || finalGlobal.texto || finalGlobal.titulo || '#1A1A1A',
    cor_detalhes: local?.cor_detalhes || finalGlobal.detalhe || '#FFA300',
    cor_sombra: local?.cor_sombra || '#00000040',
    imagem_fundo: local?.imagem_fundo || (globalType === 'capa' || globalType === 'secao' ? globalBrand.fundos.capaSecao : globalBrand.fundos.conteudo),
    imagem_fundo_opacidade: local?.imagem_fundo_opacidade ?? DEFAULT_SLIDE_APPEARANCE.imagem_fundo_opacidade,
    exibir_logo_fundo: local?.exibir_logo_fundo ?? true,
  }
}
