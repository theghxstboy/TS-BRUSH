export interface ContextDrawerTarget {
  slideType: string
  pageLabel?: string
  mockupIndex?: number
  versionIndex?: number
  slideId?: string
}

export function focusSidebarTarget(slideType: string, pageLabel?: string, meta?: Omit<ContextDrawerTarget, 'slideType' | 'pageLabel'>) {
  window.dispatchEvent(new CustomEvent<ContextDrawerTarget>('open-context-drawer', { detail: { slideType, pageLabel, ...meta } }))
}
