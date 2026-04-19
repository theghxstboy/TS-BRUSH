import { useAppStore } from '../../store/useAppStore'
import { CanvasClassico } from './CanvasClassico'
import { CanvasPresentation } from './CanvasPresentation'

/** Roteador de templates: alterna entre Manual de Marca e Apresentação de Identidade. */
export function Canvas() {
  const { screen } = useAppStore()

  if (screen === 'brand-presentation') {
    return <CanvasPresentation />
  }

  return <CanvasClassico />
}

