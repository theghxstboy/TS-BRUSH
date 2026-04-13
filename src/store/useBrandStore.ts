import { create } from 'zustand'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandColor {
  id: number
  hex: string
  rgb: string
  cmyk: string
}

export interface Aparencia {
  /** Cor de fundo dos painéis escuros de cada página */
  cor_fundo: string
  /** Imagem de textura/padrão aplicada sobre os painéis de fundo (opcional) */
  imagem_fundo: string | null
}

export interface BrandStore {
  projeto: {
    nome_marca: string
    conceito: string
  }
  tipografia: {
    principal_nome: string
    principal_estilos: string
    secundaria_nome: string
    secundaria_estilos: string
  }
  cores: BrandColor[]
  aparencia: Aparencia
  assets_base64: {
    logo_principal: string | null
    logo_monocromatica: string | null
    logo_simbolo: string | null
    mockups: string[]
  }

  // Actions
  setProjeto: (fields: Partial<BrandStore['projeto']>) => void
  setTipografia: (fields: Partial<BrandStore['tipografia']>) => void
  setCor: (id: number, fields: Partial<BrandColor>) => void
  addCor: () => void
  removeCor: (id: number) => void
  setAsset: (key: keyof Omit<BrandStore['assets_base64'], 'mockups'>, value: string | null) => void
  addMockup: (base64: string) => void
  removeMockup: (index: number) => void
  setAparencia: (fields: Partial<Aparencia>) => void
  exportJson: () => void
  importJson: (file: File) => void
  reset: () => void
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_APARENCIA: Aparencia = {
  cor_fundo: '#0C0C0C',
  imagem_fundo: null,
}

const DEFAULT_CORES: BrandColor[] = [
  { id: 1, hex: '#F97316', rgb: '249, 115, 22', cmyk: '0, 54, 91, 2' },
  { id: 2, hex: '#0C0C0C', rgb: '12, 12, 12',   cmyk: '0, 0, 0, 95'  },
  { id: 3, hex: '#FFFFFF', rgb: '255, 255, 255', cmyk: '0, 0, 0, 0'   },
]

/** Always freshly cloned → reset never shares references with live state */
function freshDefault(): Omit<BrandStore,
  | 'setProjeto' | 'setTipografia' | 'setCor' | 'addCor' | 'removeCor'
  | 'setAsset' | 'addMockup' | 'removeMockup' | 'setAparencia'
  | 'exportJson' | 'importJson' | 'reset'
> {
  return {
    projeto: { nome_marca: '', conceito: '' },
    tipografia: {
      principal_nome: '',
      principal_estilos: '',
      secundaria_nome: '',
      secundaria_estilos: '',
    },
    cores: DEFAULT_CORES.map((c) => ({ ...c })),
    aparencia: { ...DEFAULT_APARENCIA },
    assets_base64: {
      logo_principal: null,
      logo_monocromatica: null,
      logo_simbolo: null,
      mockups: [],
    },
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

let nextColorId = 4

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBrandStore = create<BrandStore>((set, get) => ({
  ...freshDefault(),

  setProjeto: (fields) =>
    set((s) => ({ projeto: { ...s.projeto, ...fields } })),

  setTipografia: (fields) =>
    set((s) => ({ tipografia: { ...s.tipografia, ...fields } })),

  setCor: (id, fields) =>
    set((s) => ({
      cores: s.cores.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    })),

  addCor: () =>
    set((s) => ({
      cores: [...s.cores, { id: nextColorId++, hex: '#888888', rgb: '', cmyk: '' }],
    })),

  removeCor: (id) =>
    set((s) => ({ cores: s.cores.filter((c) => c.id !== id) })),

  setAsset: (key, value) =>
    set((s) => ({
      assets_base64: { ...s.assets_base64, [key]: value },
    })),

  addMockup: (base64) =>
    set((s) => ({
      assets_base64: {
        ...s.assets_base64,
        mockups: [...s.assets_base64.mockups, base64],
      },
    })),

  removeMockup: (index) =>
    set((s) => ({
      assets_base64: {
        ...s.assets_base64,
        mockups: s.assets_base64.mockups.filter((_, i) => i !== index),
      },
    })),

  setAparencia: (fields) =>
    set((s) => ({ aparencia: { ...s.aparencia, ...fields } })),

  exportJson: () => {
    const s = get()
    const stateData = {
      projeto: s.projeto,
      tipografia: s.tipografia,
      cores: s.cores,
      aparencia: s.aparencia,
      assets_base64: s.assets_base64,
    }
    const blob = new Blob([JSON.stringify(stateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const name = s.projeto.nome_marca
      ? s.projeto.nome_marca.replace(/\s+/g, '-').toLowerCase()
      : 'manual-de-marca'
    a.download = `${name}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Projeto exportado com sucesso!')
  },

  importJson: (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const p = JSON.parse(e.target?.result as string)
        set(() => ({
          projeto:    p.projeto    ?? freshDefault().projeto,
          tipografia: p.tipografia ?? freshDefault().tipografia,
          cores:      p.cores      ?? freshDefault().cores,
          aparencia:  p.aparencia  ? { ...DEFAULT_APARENCIA, ...p.aparencia } : { ...DEFAULT_APARENCIA },
          assets_base64: {
            logo_principal:   p.assets_base64?.logo_principal   ?? null,
            logo_monocromatica: p.assets_base64?.logo_monocromatica ?? null,
            logo_simbolo:     p.assets_base64?.logo_simbolo     ?? null,
            mockups:          p.assets_base64?.mockups           ?? [],
          },
        }))
        toast.success('Projeto importado com sucesso!')
      } catch {
        toast.error('Arquivo inválido. Verifique o JSON.')
      }
    }
    reader.readAsText(file)
  },

  // ── freshDefault() garante deep clone completo → Zustand detecta todos os changes
  reset: () => {
    set(freshDefault())
    nextColorId = 4
    toast('Projeto resetado.')
  },
}))
