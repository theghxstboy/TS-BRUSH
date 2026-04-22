import { useBrandStore, DEFAULT_SLIDE_APPEARANCE } from '../store/useBrandStore'
import type { SlideAppearance } from '../store/useBrandStore'

export type PresentationGlobalType = 'capa' | 'secao' | 'final' | 'conteudo'

export function usePresentationAppearance(pageId: string, globalType: PresentationGlobalType): SlideAppearance {
  const { page_appearance, presentation_data } = useBrandStore()
  
  // 1. Get the local override for this specific page
  const local = page_appearance[pageId]
  
  // 2. Get the global style for this presentation slide type
  const global = presentation_data.appearance
  let globalRef: any = global.secao
  
  if (globalType === 'capa') {
    globalRef = global.capa
  } else if (globalType === 'secao') {
    globalRef = global.secao
  } else if (globalType === 'conteudo') {
    globalRef = global.conteudo
  } else if (globalType === 'final') {
    globalRef = global.final
  } else {
    globalRef = { fundo: '#FFFFFF', titulo: '#000000', detalhe: '#FFA300' }
  }
  
  // 3. Resolve each field with priority: Local -> Global -> Project Default
  return {
    cor_fundo_pagina: local?.cor_fundo_pagina || globalRef.fundo || '#FFFFFF',
    cor_titulo: local?.cor_titulo || globalRef.titulo || '#000000',
    cor_texto: local?.cor_texto || globalRef.texto || '#1A1A1A',
    cor_detalhes: local?.cor_detalhes || globalRef.detalhe || '#FFA300',
    cor_sombra: local?.cor_sombra || DEFAULT_SLIDE_APPEARANCE.cor_sombra,
    imagem_fundo: local?.imagem_fundo || (globalType === 'capa' || globalType === 'secao' ? global.fundos.capaSecao : global.fundos.conteudo),
    imagem_fundo_opacidade: local?.imagem_fundo_opacidade ?? DEFAULT_SLIDE_APPEARANCE.imagem_fundo_opacidade,
    exibir_logo_fundo: local?.exibir_logo_fundo ?? true,
  }
}
