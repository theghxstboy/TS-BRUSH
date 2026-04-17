import React, { useState } from 'react'
import { BookOpen, Image, Sparkles, ArrowRight, Lock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { NewProjectModal } from './NewProjectModal'
import brushLogo from '../../logos/TS-BRUSH-PEN-WHITE.svg'
import tssLogo from '../../logos/TSS.svg'

function PresentationCard({
  icon,
  eyebrow,
  title,
  description,
  tag,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
  tag?: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={`home-card ${disabled ? 'home-card-disabled' : 'home-card-active'}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <div className="home-card-icon-wrap">
        {icon}
        {disabled && (
          <div className="home-card-lock">
            <Lock size={12} />
          </div>
        )}
      </div>

      <div className="home-card-body">
        <div className="home-card-eyebrow">{eyebrow}</div>
        <h2 className="home-card-title">{title}</h2>
        <p className="home-card-description">{description}</p>
      </div>

      <div className="home-card-footer">
        {tag && <span className="home-card-tag">{tag}</span>}
        {!disabled && (
          <span className="home-card-arrow">
            <ArrowRight size={16} />
          </span>
        )}
        {disabled && (
          <span className="home-card-soon">Em breve</span>
        )}
      </div>
    </button>
  )
}

export function HomeScreen() {
  const { setScreen } = useAppStore()
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  return (
    <div className="home-screen">
      {/* Backgrounds */}
      <div className="home-bg-gradient" />
      <div className="home-bg-grid" />

      {/* Header */}
      <header className="home-header">
        <div className="home-logo">
          <img src={brushLogo} alt="TS BRUSH" style={{ height: 54 }} />
        </div>
        <div className="home-header-badge">BETA</div>
      </header>

      {/* Hero */}
      <main className="home-main">
        <div className="home-hero">
          <div className="home-hero-eyebrow">
            <Sparkles size={12} />
            Ferramenta de Apresentações
          </div>
          <h1 className="home-hero-title">
            Crie apresentações<br />
            <span className="home-hero-accent">profissionais.</span>
          </h1>
          <p className="home-hero-subtitle">
            Escolha o tipo de apresentação que deseja criar e comece a construir sua identidade visual.
          </p>
        </div>

        {/* Cards */}
        <div className="home-cards">
          <PresentationCard
            icon={<BookOpen size={28} />}
            eyebrow="01 — DISPONÍVEL"
            title="Manual de Marca"
            description="Crie um brand manual completo com capa, cores, tipografia, aplicações, mockups e muito mais."
            tag="Brand Manual"
            onClick={() => setShowNewProjectModal(true)}
          />

          <PresentationCard
            icon={<Image size={28} />}
            eyebrow="02 — EM BREVE"
            title="Apresentação de Logo"
            description="Apresente a identidade visual da marca com foco no logotipo, variações e aplicações principais."
            tag="Logo Deck"
            disabled
          />

          <PresentationCard
            icon={<Sparkles size={28} />}
            eyebrow="03 — EM BREVE"
            title="Apresentação Personalizada"
            description="Monte uma apresentação do zero com total liberdade de estrutura, layout e conteúdo."
            tag="Custom"
            disabled
          />
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <p className="home-footer-text">
            TS BRUSH v1.0 &nbsp;·&nbsp; Desenvolvido por
          </p>
          <img src={tssLogo} alt="TSS" className="home-footer-logo" />
        </footer>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}
    </div>
  )
}
