import { useBrandStore } from '../../store/useBrandStore'
import { CanvasClassico } from './CanvasClassico'
import { CanvasModerno }  from './CanvasModerno'

/** Roteador de templates: escolhe o canvas baseado em `store.template` */
export function Canvas() {
  const { template } = useBrandStore()
  return template === 'classico'
    ? <CanvasClassico />
    : <CanvasModerno />
}
