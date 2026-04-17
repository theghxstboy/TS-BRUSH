import { create } from 'zustand'

export type AppScreen = 'home' | 'brand-manual'

interface AppStore {
  screen: AppScreen
  hasUnsavedChanges: boolean
  setScreen: (screen: AppScreen) => void
  setHasUnsavedChanges: (value: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  screen: 'home',
  hasUnsavedChanges: false,
  setScreen: (screen) => set({ screen }),
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}))
