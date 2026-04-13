type SidebarTarget = {
  sectionId: string
  fieldId?: string
}

const SLIDE_TARGETS: Record<string, SidebarTarget> = {
  capa: { sectionId: 'assets', fieldId: 'input-logo-principal' },
  'bem-vindo': { sectionId: 'projeto', fieldId: 'input-conceito' },
  sumario: { sectionId: 'tipografia', fieldId: 'input-apresentacao-titulo-pagina' },
  conceito: { sectionId: 'projeto', fieldId: 'input-caracteristicas-marca' },
  'tipografia-principal': { sectionId: 'tipografia', fieldId: 'input-fonte-principal' },
  'tipografia-secundaria': { sectionId: 'tipografia', fieldId: 'input-fonte-secundaria' },
  'padrao-cromatico': { sectionId: 'cores' },
  'versao-mono': { sectionId: 'assets', fieldId: 'input-logo-monocromatica' },
  elementos: { sectionId: 'projeto', fieldId: 'input-elementos-logo' },
  'aplicacao-fundos': { sectionId: 'aparencia', fieldId: 'input-imagem-fundo' },
  'usos-incorretos': { sectionId: 'tipografia', fieldId: 'input-apresentacao-titulo-pagina' },
  mockup: { sectionId: 'assets' },
  final: { sectionId: 'projeto', fieldId: 'input-responsavel-manual' },
}

export function focusSidebarTarget(slideType: string) {
  const target = SLIDE_TARGETS[slideType]
  if (!target) return

  window.dispatchEvent(new CustomEvent('open-sidebar-section', { detail: { sectionId: target.sectionId } }))

  const section = document.getElementById(`sidebar-section-${target.sectionId}`)
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const fieldId = target.fieldId
  if (!fieldId) return

  window.setTimeout(() => {
    const field = document.getElementById(fieldId) as HTMLElement | null
    field?.focus()
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 180)
}
