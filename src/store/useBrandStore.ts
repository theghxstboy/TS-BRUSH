import { create } from 'zustand'
import { toast } from 'sonner'
import { hexToHsl, hexToRgb, normalizeHex } from '../lib/colorUtils'
import { EMPTY_UPLOADED_FONT } from '../lib/fontUtils'
import type { UploadedFontAsset } from '../lib/fontUtils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandColor {
  id: number
  hex: string
  rgb: string
  hsl: string
  cmyk: string
}

type ColorTarget = 'logo' | 'apresentacao'

export const DEFAULT_BACKGROUND_IMAGE_OPACITY = 0.16

export interface Aparencia {
  capa: {
    cor_fundo_pagina: string
    cor_detalhes: string
    imagem_fundo?: string | null
    imagem_fundo_opacidade?: number
  }
  secao: {
    cor_fundo_pagina: string
    cor_titulo: string
    cor_detalhes: string
    imagem_fundo?: string | null
    imagem_fundo_opacidade?: number
  }
  final: {
    cor_fundo_pagina: string
    cor_titulo: string
    cor_texto: string
    cor_detalhes: string
    cor_sombra: string
    imagem_fundo?: string | null
    imagem_fundo_opacidade?: number
  }
  conteudo: {
    cor_fundo_pagina: string
    cor_titulo: string
    cor_texto: string
    cor_detalhes: string
    cor_sombra: string
    imagem_fundo?: string | null
    imagem_fundo_opacidade?: number
  }
  /** Imagem de textura/padrão aplicada sobre os painéis de fundo (opcional) */
  imagem_fundo: string | null
  imagem_fundo_opacidade: number
}

export type SlideAppearanceKey =
  | 'capa'
  | 'bem-vindo'
  | 'sumario'
  | 'conceito'
  | 'tipografia-principal'
  | 'tipografia-secundaria'
  | 'padrao-cromatico'
  | 'versao-mono'
  | 'elementos'
  | 'aplicacao-fundos'
  | 'usos-incorretos'
  | 'mockup'
  | 'final'
  | 'logo-principal'
  | 'simbolo'
  | 'secao-logo'
  | 'secao-tipografia'
  | 'secao-cores'
  | 'secao-construcao'
  | 'secao-usos-incorretos'
  | 'secao-aplicacoes'

export interface SlideAppearance {
  cor_fundo_pagina: string
  cor_titulo: string
  cor_texto: string
  cor_detalhes: string
  cor_sombra: string
  imagem_fundo: string | null
  imagem_fundo_opacidade: number
  exibir_logo_fundo: boolean
}

export type SlideAppearanceState = Record<string, SlideAppearance>

export type TemplateId = 'moderno' | 'classico'
export interface PageOrderState {
  moderno: string[]
  classico: string[]
}

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
  conteudo_pdf: {
    boas_vindas_titulo: string
    boas_vindas_texto_1: string
    boas_vindas_texto_2: string
    boas_vindas_texto_3: string
    sumario_descricao: string
    conceito_titulo: string
    conceito_texto_1: string
    conceito_texto_2: string
    conceito_texto_3: string
    elementos_titulo: string
    elementos_descricao: string
    tipografia_principal_titulo: string
    tipografia_principal_descricao: string
    tipografia_secundaria_titulo: string
    tipografia_secundaria_descricao: string
    logo_principal_titulo: string
    logo_principal_compatibilidade: string
    logo_principal_usos: string
    logo_principal_protecao: string
    logo_mono_titulo: string
    logo_mono_descricao: string
    simbolo_titulo: string
    simbolo_descricao: string
    simbolo_tamanho_minimo: string
    simbolo_aplicacao: string
    simbolo_fundo_preferencial: string
  }
  tipografia: {
    principal_nome: string
    principal_estilos: string
    principal_custom: UploadedFontAsset
    secundaria_nome: string
    secundaria_estilos: string
    secundaria_custom: UploadedFontAsset
    apresentacao_titulos: string
    apresentacao_titulos_custom: UploadedFontAsset
    apresentacao_textos: string
    apresentacao_textos_custom: UploadedFontAsset
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
  page_appearance: SlideAppearanceState
  template: TemplateId
  page_order: PageOrderState
  assets_base64: {
    logo_principal: string | null
    logo_monocromatica: string | null
    logo_simbolo: string | null
    mockups: string[]
  }
  presentation_data: {
    brand_name: string
    responsible_name: string
    project_type: 'new' | 'rebranding'
    show_comparison: boolean
    original_logo: string | null
    versions: Array<{
      explanation: string
      logoNew: string | null
      mockups: string[]
    }>
    appearance: {
      capa: { fundo: string; detalhe: string }
      secao: { fundo: string; titulo: string; detalhe: string }
      final: { fundo: string; titulo: string; texto: string; detalhe: string }
      fundos: { capaSecao: string | null; conteudo: string | null }
    }
    typography: {
      titulosNome: string
      titulosCustom: UploadedFontAsset
      textosNome: string
      textosCustom: UploadedFontAsset
    }
  }

  // Actions
  setProjeto: (fields: Partial<BrandStore['projeto']>) => void
  setConteudoPdf: (fields: Partial<BrandStore['conteudo_pdf']>) => void
  setTipografia: (fields: Partial<BrandStore['tipografia']>) => void
  setCor: (target: ColorTarget, id: number, fields: Partial<BrandColor>) => void
  addCor: (target: ColorTarget) => void
  removeCor: (target: ColorTarget, id: number) => void
  replaceCores: (target: ColorTarget, colors: Omit<BrandColor, 'id'>[]) => void
  setAsset: (key: keyof Omit<BrandStore['assets_base64'], 'mockups'>, value: string | null) => void
  addMockup: (base64: string) => void
  replaceMockup: (index: number, base64: string) => void
  removeMockup: (index: number) => void
  setAparencia: (fields: Partial<Aparencia>) => void
  setPageAppearance: (slide: string, fields: Partial<SlideAppearance>) => void
  setTemplate: (t: TemplateId) => void
  setPresentationData: (data: BrandStore['presentation_data']) => void
  movePageBlock: (template: TemplateId, blockId: string, direction: 'up' | 'down') => void
  exportJson: () => void
  importJson: (file: File) => void
  reset: () => void
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_APARENCIA: Aparencia = {
  capa: {
    cor_fundo_pagina: '#FFFFFF',
    cor_detalhes: '#FFA300',
    imagem_fundo: null,
    imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
  },
  secao: {
    cor_fundo_pagina: '#FFFFFF',
    cor_titulo: '#0C0C0C',
    cor_detalhes: '#FFA300',
    imagem_fundo: null,
    imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
  },
  final: {
    cor_fundo_pagina: '#FFFFFF',
    cor_titulo: '#0C0C0C',
    cor_texto: '#1A1A1A',
    cor_detalhes: '#FFA300',
    cor_sombra: 'rgba(0,0,0,0.5)',
    imagem_fundo: null,
    imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
  },
  conteudo: {
    cor_fundo_pagina: '#FFFFFF',
    cor_titulo: '#0C0C0C',
    cor_texto: '#1A1A1A',
    cor_detalhes: '#FFA300',
    cor_sombra: 'rgba(0,0,0,0.5)',
    imagem_fundo: null,
    imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
  },
  imagem_fundo: null,
  imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
}

export const DEFAULT_SLIDE_APPEARANCE: SlideAppearance = {
  cor_fundo_pagina: '',
  cor_titulo: '',
  cor_texto: '',
  cor_detalhes: '',
  cor_sombra: '',
  imagem_fundo: null,
  imagem_fundo_opacidade: DEFAULT_BACKGROUND_IMAGE_OPACITY,
  exibir_logo_fundo: true,
}

function buildDefaultPageAppearance(): SlideAppearanceState {
  const keys: SlideAppearanceKey[] = [
    'capa',
    'bem-vindo',
    'sumario',
    'conceito',
    'tipografia-principal',
    'tipografia-secundaria',
    'padrao-cromatico',
    'versao-mono',
    'elementos',
    'aplicacao-fundos',
    'usos-incorretos',
    'mockup',
    'final',
    'logo-principal',
    'simbolo',
    'secao-logo',
    'secao-tipografia',
    'secao-cores',
    'secao-construcao',
    'secao-usos-incorretos',
    'secao-aplicacoes',
  ]

  return Object.fromEntries(keys.map((key) => [key, { ...DEFAULT_SLIDE_APPEARANCE }])) as SlideAppearanceState
}

const DEFAULT_CORES: BrandColor[] = [
  { id: 1, hex: '#FFA300', rgb: '255, 163, 0', hsl: '38°, 100%, 50%', cmyk: '0, 54, 91, 2' },
  { id: 2, hex: '#0C0C0C', rgb: '12, 12, 12', hsl: '0°, 0%, 5%', cmyk: '0, 0, 0, 95' },
  { id: 3, hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0°, 0%, 100%', cmyk: '0, 0, 0, 0' },
]

/** Always freshly cloned → reset never shares references with live state */
function freshDefault(): Omit<BrandStore,
  | 'setProjeto' | 'setConteudoPdf' | 'setTipografia' | 'setCor' | 'addCor' | 'removeCor' | 'replaceCores'
  | 'setAsset' | 'addMockup' | 'replaceMockup' | 'removeMockup' | 'setAparencia' | 'setTemplate' | 'movePageBlock'
  | 'setPageAppearance'
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
    conteudo_pdf: {
      boas_vindas_titulo: 'Bem Vindo!',
      boas_vindas_texto_1: 'Este manual foi criado para garantir a consistência e a autenticidade da identidade visual de sua marca. Aqui, você encontrará diretrizes essenciais para o uso correto do logo, cores, tipografia e outros elementos gráficos que representam a essência do seu negócio.',
      boas_vindas_texto_2: 'Na marca, acreditamos que uma identidade visual forte é a base para uma comunicação impactante e memorável. Com este material, sua marca estará preparada para se destacar e construir conexões sólidas com seu público.',
      boas_vindas_texto_3: 'Siga as orientações deste guia e mantenha a coerência em todas as aplicações. Juntos, estamos construindo uma marca de sucesso!',
      sumario_descricao: '',
      conceito_titulo: 'Conceito',
      conceito_texto_1: 'O logo da marca foi desenvolvido para representar os principais atributos e diferenciais da marca.',
      conceito_texto_2: 'Cada elemento foi pensado estrategicamente para comunicar os valores centrais que orientam sua comunicação.',
      conceito_texto_3: 'A tipografia, cores e ícones foram combinados para criar uma identidade visual forte e memorável.',
      elementos_titulo: 'Elementos',
      elementos_descricao: 'O logotipo é composto por elementos visuais que trabalham em conjunto para garantir equilíbrio estético, reconhecimento e flexibilidade de aplicação em diferentes formatos.',
      tipografia_principal_titulo: 'Principal',
      tipografia_principal_descricao: '',
      tipografia_secundaria_titulo: 'Secundária',
      tipografia_secundaria_descricao: '',
      logo_principal_titulo: 'Logotipo Principal',
      logo_principal_compatibilidade: 'Claro, Escuro, Colorido',
      logo_principal_usos: 'Alta Resolução, Digital & Print, Fundo Transparente',
      logo_principal_protecao: 'Área livre mínima equivalente à altura da letra "X" do logotipo em todos os lados.',
      logo_mono_titulo: 'Versão Monocromática',
      logo_mono_descricao: 'Use a versão branca em fundos escuros e a versão preta em fundos claros. Nunca utilize a versão colorida em contextos de baixo contraste.',
      simbolo_titulo: 'Símbolo & Ícone',
      simbolo_descricao: 'O símbolo pode ser utilizado de forma independente do logotipo em aplicações onde o reconhecimento da marca já esteja estabelecido.',
      simbolo_tamanho_minimo: '24px / 8mm',
      simbolo_aplicacao: 'Ícones, Favicons, Social Media',
      simbolo_fundo_preferencial: 'Claro ou Transparente',
    },
    tipografia: {
      principal_nome: '',
      principal_estilos: '',
      principal_custom: { ...EMPTY_UPLOADED_FONT },
      secundaria_nome: '',
      secundaria_estilos: '',
      secundaria_custom: { ...EMPTY_UPLOADED_FONT },
      apresentacao_titulos: '',
      apresentacao_titulos_custom: { ...EMPTY_UPLOADED_FONT },
      apresentacao_textos: '',
      apresentacao_textos_custom: { ...EMPTY_UPLOADED_FONT },
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
    page_appearance: buildDefaultPageAppearance(),
    template: 'classico' as TemplateId,
    page_order: {
      moderno: ['capa', 'sumario', 'cores', 'tipografia', 'logo-principal', 'logo-mono', 'simbolo', 'mockups'],
      classico: ['capa', 'bem-vindo', 'sumario', 'logo', 'tipografia', 'cores', 'construcao', 'usos-incorretos', 'aplicacoes', 'final'],
    },
    assets_base64: {
      logo_principal: null,
      logo_monocromatica: null,
      logo_simbolo: null,
      mockups: [],
    },
    presentation_data: {
      brand_name: '',
      responsible_name: '',
      project_type: 'new',
      show_comparison: false,
      original_logo: null,
      versions: [],
      appearance: {
        capa: { fundo: '#0C0C0C', detalhe: '#FFA300' },
        secao: { fundo: '#0C0C0C', titulo: '#FFFFFF', detalhe: '#FFA300' },
        final: { fundo: '#0C0C0C', titulo: '#FFFFFF', texto: '#D4D4D4', detalhe: '#FFA300' },
        fundos: { capaSecao: null, conteudo: null },
      },
      typography: {
        titulosNome: '',
        titulosCustom: { ...EMPTY_UPLOADED_FONT },
        textosNome: '',
        textosCustom: { ...EMPTY_UPLOADED_FONT },
      },
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

type GlobalAppearanceColorKey =
  | 'cor_fundo_pagina'
  | 'cor_titulo'
  | 'cor_texto'
  | 'cor_detalhes'
  | 'cor_sombra'

type SlideAppearanceColorKey = GlobalAppearanceColorKey

function sanitizeOpacity(value: unknown, fallback: number) {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(1, Math.max(0, numeric))
}

function sanitizeAparenciaFields(fields: Partial<Aparencia>, current: Aparencia): Partial<Aparencia> {
  const next: Partial<Aparencia> = { ...fields }

  if ('capa' in next && next.capa) {
    next.capa = { ...current.capa, ...next.capa }
  }

  if ('secao' in next && next.secao) {
    next.secao = { ...current.secao, ...next.secao }
  }

  if ('final' in next && next.final) {
    next.final = { ...current.final, ...next.final }
    if ('imagem_fundo_opacidade' in next.final) {
      next.final.imagem_fundo_opacidade = sanitizeOpacity(next.final.imagem_fundo_opacidade, current.final.imagem_fundo_opacidade ?? 1)
    }
  }

  if ('conteudo' in next && next.conteudo) {
    next.conteudo = { ...current.conteudo, ...next.conteudo }
    if ('imagem_fundo_opacidade' in next.conteudo) {
      next.conteudo.imagem_fundo_opacidade = sanitizeOpacity(next.conteudo.imagem_fundo_opacidade, current.conteudo.imagem_fundo_opacidade ?? 1)
    }
  }

  if ('capa' in next && next.capa) {
    next.capa = { ...current.capa, ...next.capa }
    if ('imagem_fundo_opacidade' in next.capa) {
      next.capa.imagem_fundo_opacidade = sanitizeOpacity(next.capa.imagem_fundo_opacidade, current.capa.imagem_fundo_opacidade ?? 1)
    }
  }

  if ('secao' in next && next.secao) {
    next.secao = { ...current.secao, ...next.secao }
    if ('imagem_fundo_opacidade' in next.secao) {
      next.secao.imagem_fundo_opacidade = sanitizeOpacity(next.secao.imagem_fundo_opacidade, current.secao.imagem_fundo_opacidade ?? 1)
    }
  }

  if ('imagem_fundo_opacidade' in next) {
    next.imagem_fundo_opacidade = sanitizeOpacity(next.imagem_fundo_opacidade, current?.imagem_fundo_opacidade ?? 1)
  }

  return next
}

function sanitizeSlideAppearanceFields(fields: Partial<SlideAppearance>, current: SlideAppearance): Partial<SlideAppearance> {
  const next: Partial<SlideAppearance> = { ...fields }
  const colorKeys: SlideAppearanceColorKey[] = [
    'cor_fundo_pagina',
    'cor_titulo',
    'cor_texto',
    'cor_detalhes',
    'cor_sombra',
  ]

  for (const key of colorKeys) {
    if ((key in next) && typeof next[key] === 'string') {
      // Allow any string, normalization happens in components
    }
  }

  if ('imagem_fundo_opacidade' in next) {
    next.imagem_fundo_opacidade = sanitizeOpacity(next.imagem_fundo_opacidade, current?.imagem_fundo_opacidade ?? 1)
  }

  return next
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBrandStore = create<BrandStore>((set, get) => ({
  ...freshDefault(),

  setProjeto: (fields) =>
    set((s) => ({ projeto: { ...s.projeto, ...fields } })),

  setConteudoPdf: (fields) =>
    set((s) => ({ conteudo_pdf: { ...s.conteudo_pdf, ...fields } })),

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

  replaceMockup: (index, base64) =>
    set((s) => ({
      assets_base64: {
        ...s.assets_base64,
        mockups: s.assets_base64.mockups.map((mockup, currentIndex) => (currentIndex === index ? base64 : mockup)),
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
    set((s) => ({ aparencia: { ...s.aparencia, ...sanitizeAparenciaFields(fields, s.aparencia) } })),

  setPageAppearance: (slide, fields) =>
    set((s) => {
      const currentItem = s.page_appearance[slide] || { ...DEFAULT_SLIDE_APPEARANCE }
      return {
        page_appearance: {
          ...s.page_appearance,
          [slide]: {
            ...currentItem,
            ...sanitizeSlideAppearanceFields(fields, currentItem),
          },
        },
      }
    }),

  setTemplate: (t) => set(() => ({ template: t })),

  setPresentationData: (data) => set(() => ({ presentation_data: data })),

  movePageBlock: (template, blockId, direction) =>
    set((s) => {
      const current = [...s.page_order[template]]
      const index = current.indexOf(blockId)
      if (index === -1) return s
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= current.length) return s

      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)

      return {
        page_order: {
          ...s.page_order,
          [template]: next,
        },
      }
    }),

  exportJson: () => {
    const s = get()
    const stateData = {
      projeto: s.projeto,
      conteudo_pdf: s.conteudo_pdf,
      tipografia: s.tipografia,
      cores_logo: s.cores_logo,
      cores_apresentacao: s.cores_apresentacao,
      aparencia: s.aparencia,
      page_appearance: s.page_appearance,
      template: s.template,
      page_order: s.page_order,
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
          conteudo_pdf: { ...fallback.conteudo_pdf, ...p.conteudo_pdf },
          tipografia: {
            ...fallback.tipografia,
            ...p.tipografia,
            principal_custom: {
              ...fallback.tipografia.principal_custom,
              ...(p.tipografia?.principal_custom ?? {}),
            },
            secundaria_custom: {
              ...fallback.tipografia.secundaria_custom,
              ...(p.tipografia?.secundaria_custom ?? {}),
            },
            apresentacao_titulos_custom: {
              ...fallback.tipografia.apresentacao_titulos_custom,
              ...(p.tipografia?.apresentacao_titulos_custom ?? {}),
            },
            apresentacao_textos_custom: {
              ...fallback.tipografia.apresentacao_textos_custom,
              ...(p.tipografia?.apresentacao_textos_custom ?? {}),
            },
          },
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
          page_order: {
            moderno: Array.isArray(p.page_order?.moderno) ? p.page_order.moderno : fallback.page_order.moderno,
            classico: Array.isArray(p.page_order?.classico) ? p.page_order.classico : fallback.page_order.classico,
          },
          aparencia: {
            ...DEFAULT_APARENCIA,
            capa: {
              ...DEFAULT_APARENCIA.capa,
              ...(p.aparencia?.capa ?? {}),
              cor_fundo_pagina: p.aparencia?.capa?.cor_fundo_pagina
                ?? p.aparencia?.divisores?.cor_fundo_pagina
                ?? p.aparencia?.cor_fundo_pagina 
                ?? DEFAULT_APARENCIA.capa.cor_fundo_pagina,
              cor_detalhes: p.aparencia?.capa?.cor_detalhes
                ?? p.aparencia?.divisores?.cor_detalhes
                ?? p.aparencia?.cor_destaque 
                ?? importedPresentationColors[0]?.hex 
                ?? DEFAULT_APARENCIA.capa.cor_detalhes,
            },
            secao: {
              ...DEFAULT_APARENCIA.secao,
              ...(p.aparencia?.secao ?? {}),
              cor_fundo_pagina: p.aparencia?.secao?.cor_fundo_pagina
                ?? p.aparencia?.divisores?.cor_fundo_pagina
                ?? p.aparencia?.cor_fundo_pagina 
                ?? DEFAULT_APARENCIA.secao.cor_fundo_pagina,
              cor_titulo: p.aparencia?.secao?.cor_titulo
                ?? p.aparencia?.divisores?.cor_titulo
                ?? p.aparencia?.cor_titulos_divisoria 
                ?? p.aparencia?.cor_titulos 
                ?? DEFAULT_APARENCIA.secao.cor_titulo,
              cor_detalhes: p.aparencia?.secao?.cor_detalhes
                ?? p.aparencia?.divisores?.cor_detalhes
                ?? p.aparencia?.cor_destaque 
                ?? importedPresentationColors[0]?.hex 
                ?? DEFAULT_APARENCIA.secao.cor_detalhes,
            },
            final: {
              ...DEFAULT_APARENCIA.final,
              ...(p.aparencia?.final ?? {}),
              cor_fundo_pagina: p.aparencia?.final?.cor_fundo_pagina
                ?? p.aparencia?.divisores?.cor_fundo_pagina
                ?? p.aparencia?.cor_fundo_pagina 
                ?? DEFAULT_APARENCIA.final.cor_fundo_pagina,
              cor_titulo: p.aparencia?.final?.cor_titulo
                ?? p.aparencia?.divisores?.cor_titulo
                ?? p.aparencia?.cor_titulos_divisoria 
                ?? p.aparencia?.cor_titulos 
                ?? DEFAULT_APARENCIA.final.cor_titulo,
              cor_texto: p.aparencia?.final?.cor_texto
                ?? p.aparencia?.divisores?.cor_texto
                ?? p.aparencia?.cor_texto
                ?? DEFAULT_APARENCIA.final.cor_texto,
              cor_detalhes: p.aparencia?.final?.cor_detalhes
                ?? p.aparencia?.divisores?.cor_detalhes
                ?? p.aparencia?.cor_destaque 
                ?? importedPresentationColors[0]?.hex 
                ?? DEFAULT_APARENCIA.final.cor_detalhes,
            },
            conteudo: {
              ...DEFAULT_APARENCIA.conteudo,
              ...(p.aparencia?.conteudo ?? {}),
              cor_fundo_pagina: p.aparencia?.conteudo?.cor_fundo_pagina 
                ?? p.aparencia?.cor_fundo_pagina 
                ?? DEFAULT_APARENCIA.conteudo.cor_fundo_pagina,
              cor_titulo: p.aparencia?.conteudo?.cor_titulo 
                ?? p.aparencia?.cor_titulos_conteudo 
                ?? p.aparencia?.cor_titulos 
                ?? DEFAULT_APARENCIA.conteudo.cor_titulo,
              cor_texto: p.aparencia?.conteudo?.cor_texto 
                ?? p.aparencia?.cor_texto
                ?? DEFAULT_APARENCIA.conteudo.cor_texto,
              cor_detalhes: p.aparencia?.conteudo?.cor_detalhes 
                ?? p.aparencia?.cor_destaque 
                ?? importedPresentationColors[0]?.hex 
                ?? DEFAULT_APARENCIA.conteudo.cor_detalhes,
            },
            imagem_fundo_opacidade: sanitizeOpacity(
              p.aparencia?.imagem_fundo_opacidade,
              DEFAULT_APARENCIA.imagem_fundo_opacidade,
            ),
          },
          page_appearance: {
            ...buildDefaultPageAppearance(),
            ...Object.fromEntries(
              Object.entries((p.page_appearance ?? {}) as Partial<Record<SlideAppearanceKey, Partial<SlideAppearance>>>).map(([key, value]) => [
                key,
                {
                  ...DEFAULT_SLIDE_APPEARANCE,
                  ...sanitizeSlideAppearanceFields(value ?? {}, DEFAULT_SLIDE_APPEARANCE),
                },
              ]),
            ),
          },
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
