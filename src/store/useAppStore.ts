import { create } from 'zustand'

export type AppScreen = 'home' | 'brand-manual' | 'brand-presentation'

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
  setScreen: (screen: AppScreen) => void
  setHasUnsavedChanges: (value: boolean) => void
  showAlert: (options: Omit<AlertState, 'isOpen'>) => void
  hideAlert: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  screen: 'home',
  hasUnsavedChanges: false,
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
}))
