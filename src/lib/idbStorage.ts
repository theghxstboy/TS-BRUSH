import { get, set as idbSet, del } from 'idb-keyval'
import type { StateStorage } from 'zustand/middleware'

// Storage do zustand/persist em IndexedDB (localStorage estoura com os base64 de logos/mockups/fundos).
// ponytail: debounce de 400ms nas escritas — evita serializar o estado inteiro a cada tecla.
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: (name, value) => {
    const prev = timers.get(name)
    if (prev) clearTimeout(prev)
    timers.set(
      name,
      setTimeout(() => {
        timers.delete(name)
        void idbSet(name, value)
      }, 400),
    )
  },
  removeItem: async (name) => {
    await del(name)
  },
}
