import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppScreen = 'home' | 'brand-manual' | 'brand-presentation' | 'custom-presentation'

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface AlertState {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface AppStore {
  screen: AppScreen
  hasUnsavedChanges: boolean
  alert: AlertState
  selectedElement: { pageId: string; key: string } | null
  setScreen: (screen: AppScreen) => void
  setHasUnsavedChanges: (value: boolean) => void
  showAlert: (options: Omit<AlertState, 'isOpen'>) => void
  hideAlert: () => void
  setSelectedElement: (sel: { pageId: string; key: string } | null) => void
}

export const useAppStore = create<AppStore>()(persist((set) => ({
  screen: 'home',
  hasUnsavedChanges: false,
  selectedElement: null,
  alert: {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  },
  setScreen: (screen) => set({ screen }),
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
  showAlert: (options) => set({ alert: { ...options, isOpen: true } }),
  hideAlert: () => set((state) => ({ alert: { ...state.alert, isOpen: false } })),
  setSelectedElement: (sel) => set({ selectedElement: sel }),
}), {
  name: 'ts-brush-screen',
  storage: createJSONStorage(() => localStorage),
  partialize: (s) => ({ screen: s.screen }),
}))
