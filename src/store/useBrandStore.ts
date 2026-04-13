import { create } from 'zustand'
import { toast } from 'sonner'
import { hexToHsl, hexToRgb } from '../lib/colorUtils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandColor {
  id: number
  hex: string
  rgb: string
  hsl: string
  cmyk: string
}

type ColorTarget = 'logo' | 'apresentacao'

export interface Aparencia {
  /** Cor de fundo dos painéis escuros de cada página */
  cor_fundo: string
  /** Imagem de textura/padrão aplicada sobre os painéis de fundo (opcional) */
  imagem_fundo: string | null
}

export type TemplateId = 'moderno' | 'classico'

export interface BrandStore {
  projeto: {
    nome_marca: string
    conceito: string
    caracteristicas_marca: string
    valores_marca: string
    sensacoes_cores: string
    elementos_logo: string
    responsavel_manual: string
  }
  tipografia: {
    principal_nome: string
    principal_estilos: string
    secundaria_nome: string
    secundaria_estilos: string
    apresentacao_titulos: string
    apresentacao_textos: string
    apresentacao_alinhamento: 'left' | 'center' | 'right' | 'justify'
    apresentacao_tamanho_titulo: number
    apresentacao_tamanho_titulo_pagina: number
    apresentacao_tamanho_texto: number
    apresentacao_entrelinha: number
    apresentacao_espacamento_letras: number
  }
  cores_logo: BrandColor[]
  cores_apresentacao: BrandColor[]
  aparencia: Aparencia
  template: TemplateId
  assets_base64: {
    logo_principal: string | null
    logo_monocromatica: string | null
    logo_simbolo: string | null
    mockups: string[]
  }

  // Actions
  setProjeto: (fields: Partial<BrandStore['projeto']>) => void
  setTipografia: (fields: Partial<BrandStore['tipografia']>) => void
  setCor: (target: ColorTarget, id: number, fields: Partial<BrandColor>) => void
  addCor: (target: ColorTarget) => void
  removeCor: (target: ColorTarget, id: number) => void
  replaceCores: (target: ColorTarget, colors: Omit<BrandColor, 'id'>[]) => void
  setAsset: (key: keyof Omit<BrandStore['assets_base64'], 'mockups'>, value: string | null) => void
  addMockup: (base64: string) => void
  removeMockup: (index: number) => void
  setAparencia: (fields: Partial<Aparencia>) => void
  setTemplate: (t: TemplateId) => void
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
  { id: 1, hex: '#F97316', rgb: '249, 115, 22', hsl: '25°, 95%, 53%', cmyk: '0, 54, 91, 2' },
  { id: 2, hex: '#0C0C0C', rgb: '12, 12, 12', hsl: '0°, 0%, 5%', cmyk: '0, 0, 0, 95' },
  { id: 3, hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0°, 0%, 100%', cmyk: '0, 0, 0, 0' },
]

/** Always freshly cloned → reset never shares references with live state */
function freshDefault(): Omit<BrandStore,
  | 'setProjeto' | 'setTipografia' | 'setCor' | 'addCor' | 'removeCor' | 'replaceCores'
  | 'setAsset' | 'addMockup' | 'removeMockup' | 'setAparencia' | 'setTemplate'
  | 'exportJson' | 'importJson' | 'reset'
> {
  return {
    projeto: {
      nome_marca: '',
      conceito: '',
      caracteristicas_marca: '',
      valores_marca: '',
      sensacoes_cores: '',
      elementos_logo: '',
      responsavel_manual: '',
    },
    tipografia: {
      principal_nome: '',
      principal_estilos: '',
      secundaria_nome: '',
      secundaria_estilos: '',
      apresentacao_titulos: '',
      apresentacao_textos: '',
      apresentacao_alinhamento: 'left',
      apresentacao_tamanho_titulo: 1,
      apresentacao_tamanho_titulo_pagina: 1,
      apresentacao_tamanho_texto: 1,
      apresentacao_entrelinha: 1.7,
      apresentacao_espacamento_letras: 0,
    },
    cores_logo: DEFAULT_CORES.map((c) => ({ ...c })),
    cores_apresentacao: DEFAULT_CORES.map((c) => ({ ...c })),
    aparencia: { ...DEFAULT_APARENCIA },
    template: 'classico' as TemplateId,
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

function assignIds(colors: Omit<BrandColor, 'id'>[]): BrandColor[] {
  return colors.map((color) => ({ ...color, id: nextColorId++ }))
}

function getColorKey(target: ColorTarget) {
  return target === 'logo' ? 'cores_logo' : 'cores_apresentacao'
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBrandStore = create<BrandStore>((set, get) => ({
  ...freshDefault(),

  setProjeto: (fields) =>
    set((s) => ({ projeto: { ...s.projeto, ...fields } })),

  setTipografia: (fields) =>
    set((s) => ({ tipografia: { ...s.tipografia, ...fields } })),

  setCor: (target, id, fields) =>
    set((s) => ({
      [getColorKey(target)]: s[getColorKey(target)].map((c) => (c.id === id ? { ...c, ...fields } : c)),
    })),

  addCor: (target) =>
    set((s) => ({
      [getColorKey(target)]: [...s[getColorKey(target)], { id: nextColorId++, hex: '#888888', rgb: hexToRgb('#888888'), hsl: hexToHsl('#888888'), cmyk: '' }],
    })),

  removeCor: (target, id) =>
    set((s) => ({ [getColorKey(target)]: s[getColorKey(target)].filter((c) => c.id !== id) })),

  replaceCores: (target, colors) =>
    set(() => ({
      [getColorKey(target)]: assignIds(colors),
    })),

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

  setTemplate: (t) => set(() => ({ template: t })),

  exportJson: () => {
    const s = get()
    const stateData = {
      projeto: s.projeto,
      tipografia: s.tipografia,
      cores_logo: s.cores_logo,
      cores_apresentacao: s.cores_apresentacao,
      aparencia: s.aparencia,
      template: s.template,
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
        const fallback = freshDefault()
        const importedLogoColors = Array.isArray(p.cores_logo)
          ? p.cores_logo
          : Array.isArray(p.cores)
            ? p.cores
            : fallback.cores_logo
        const importedPresentationColors = Array.isArray(p.cores_apresentacao)
          ? p.cores_apresentacao
          : fallback.cores_apresentacao

        set(() => ({
          projeto:    { ...fallback.projeto, ...p.projeto },
          tipografia: { ...fallback.tipografia, ...p.tipografia },
          cores_logo: assignIds(importedLogoColors.map((c: Omit<BrandColor, 'id'> & Partial<BrandColor>) => ({
            hex: c.hex ?? '#888888',
            rgb: c.rgb ?? hexToRgb(c.hex ?? '#888888'),
            hsl: c.hsl ?? hexToHsl(c.hex ?? '#888888'),
            cmyk: c.cmyk ?? '',
          }))),
          cores_apresentacao: assignIds(importedPresentationColors.map((c: Omit<BrandColor, 'id'> & Partial<BrandColor>) => ({
            hex: c.hex ?? '#888888',
            rgb: c.rgb ?? hexToRgb(c.hex ?? '#888888'),
            hsl: c.hsl ?? hexToHsl(c.hex ?? '#888888'),
            cmyk: c.cmyk ?? '',
          }))),
          aparencia:  p.aparencia  ? { ...DEFAULT_APARENCIA, ...p.aparencia } : { ...DEFAULT_APARENCIA },
          template:   (p.template === 'moderno' || p.template === 'classico') ? p.template : 'classico',
          assets_base64: {
            logo_principal:   p.assets_base64?.logo_principal   ?? null,
            logo_monocromatica: p.assets_base64?.logo_monocromatica ?? null,
            logo_simbolo:     p.assets_base64?.logo_simbolo     ?? null,
            mockups:          p.assets_base64?.mockups           ?? [],
          },
        }))
        nextColorId = Math.max(
          4,
          ...importedLogoColors.map((c: BrandColor) => Number(c.id) || 0),
          ...importedPresentationColors.map((c: BrandColor) => Number(c.id) || 0),
        ) + 1
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
