import { ArrowDown, ArrowUp, ListOrdered } from 'lucide-react'
import { useBrandStore } from '../../store/useBrandStore'
import { CollapsibleSection } from './CollapsibleSection'

const LABELS: Record<string, string> = {
  capa: 'Capa',
  'bem-vindo': 'Boas-vindas',
  sumario: 'Sumário',
  cores: 'Cores',
  tipografia: 'Tipografia',
  'logo-principal': 'Logo Principal',
  'logo-mono': 'Logo Monocromática',
  simbolo: 'Símbolo e Ícone',
  mockups: 'Mockups',
  logo: 'Seção Logo',
  construcao: 'Construção da Marca',
  'usos-incorretos': 'Usos Incorretos',
  aplicacoes: 'Aplicações',
  final: 'Encerramento',
}

function getAvailability(blockId: string, hasLogo: boolean, hasMono: boolean, hasSimbolo: boolean, mockupCount: number, hasPrimary: boolean, hasSecondary: boolean) {
  switch (blockId) {
    case 'capa':
    case 'logo-principal':
    case 'logo':
    case 'construcao':
    case 'usos-incorretos':
      return hasLogo
    case 'logo-mono':
      return hasMono || hasLogo
    case 'simbolo':
      return hasSimbolo
    case 'mockups':
    case 'aplicacoes':
      return mockupCount > 0
    case 'tipografia':
      return hasPrimary || hasSecondary
    default:
      return true
  }
}

export function SectionOrdemPaginas() {
  const { template, page_order, movePageBlock, assets_base64, tipografia } = useBrandStore()

  const hasLogo = !!assets_base64.logo_principal
  const hasMono = !!assets_base64.logo_monocromatica
  const hasSimbolo = !!assets_base64.logo_simbolo
  const mockupCount = assets_base64.mockups.length
  const hasPrimary = !!tipografia.principal_nome
  const hasSecondary = !!tipografia.secundaria_nome
  const items = page_order[template]

  return (
    <CollapsibleSection icon={<ListOrdered size={14} />} label="Ordem das Páginas" defaultOpen={false} sectionId="ordem-paginas">
      <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
        Organize a ordem dos blocos do manual. A visualização e o PDF seguem essa ordem.
      </p>

      <div className="page-order-list">
        {items.map((blockId, index) => {
          const available = getAvailability(blockId, hasLogo, hasMono, hasSimbolo, mockupCount, hasPrimary, hasSecondary)

          return (
            <div key={`${template}-${blockId}`} className={`page-order-item ${available ? '' : 'is-unavailable'}`}>
              <div className="page-order-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="page-order-content">
                <div className="page-order-label">{LABELS[blockId] || blockId}</div>
                <div className="page-order-meta">{available ? 'Visível no template atual' : 'Oculto até haver conteúdo suficiente'}</div>
              </div>
              <div className="page-order-actions">
                <button
                  type="button"
                  className="page-order-btn"
                  onClick={() => movePageBlock(template, blockId, 'up')}
                  disabled={index === 0}
                  title="Mover para cima"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  className="page-order-btn"
                  onClick={() => movePageBlock(template, blockId, 'down')}
                  disabled={index === items.length - 1}
                  title="Mover para baixo"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}
