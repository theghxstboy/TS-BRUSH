import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { BookOpen, Image, Sparkles, ArrowRight, Lock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { NewProjectModal } from './NewProjectModal'
import brushLogo from '../../logos/TS-BRUSH-PEN-WHITE.svg'
import tssLogo from '../../logos/TSS.svg'

const itemVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
}


const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
}


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
    <motion.button
      variants={itemVariants}
      whileHover={!disabled ? { scale: 1.02, transition: { duration: 0.1 } } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
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
        {!disabled && (
          <span className="home-card-arrow">
            <ArrowRight size={20} />
          </span>
        )}
        {disabled && (
          <span className="home-card-soon">Em breve</span>
        )}
      </div>
    </motion.button>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export function HomeScreen() {
  const { setScreen } = useAppStore()
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  return (
    <motion.div 
      className="home-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Backgrounds */}
      <div className="home-bg-gradient" />
      <div className="home-bg-grid" />

      {/* Header */}
      <motion.header 
        className="home-header"
        variants={logoVariants}
      >
        <div className="home-logo">
          <img src={brushLogo} alt="TS BRUSH" style={{ height: 54 }} />
        </div>
        <div className="home-header-badge">BETA</div>
      </motion.header>

      {/* Hero */}
      <main className="home-main">
        <div className="home-hero">
          <motion.div className="home-hero-eyebrow" variants={textVariants}>
            <Sparkles size={12} />
            Ferramenta de Apresentações
          </motion.div>
          <motion.h1 className="home-hero-title" variants={textVariants}>
            Crie apresentações<br />
            <span className="home-hero-accent">profissionais.</span>
          </motion.h1>
          <motion.p className="home-hero-subtitle" variants={textVariants}>
            Escolha o tipo de apresentação que deseja criar e comece a construir sua identidade visual.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="home-cards">
          <PresentationCard
            icon={<BookOpen size={28} />}
            eyebrow="01 — DISPONÍVEL"
            title="Manual de Marca"
            description="Crie um brand manual completo com capa, cores, tipografia, aplicações, mockups e muito mais."
            onClick={() => setShowNewProjectModal(true)}
          />

          <PresentationCard
            icon={<Image size={28} />}
            eyebrow="02 — EM BREVE"
            title="Apresentação de Logo"
            description="Apresente a identidade visual da marca com foco no logotipo, variações e aplicações principais."
            disabled
          />

          <PresentationCard
            icon={<Sparkles size={28} />}
            eyebrow="03 — EM BREVE"
            title="Apresentação Personalizada"
            description="Monte uma apresentação do zero com total liberdade de estrutura, layout e conteúdo."
            disabled
          />
        </div>

        {/* Footer */}
        <motion.footer className="home-footer" variants={textVariants}>
          <p className="home-footer-text">
            TS BRUSH v1.0 &nbsp;·&nbsp; Desenvolvido por
          </p>
          <img src={tssLogo} alt="TSS" className="home-footer-logo" />
        </motion.footer>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}
    </motion.div>
  )
}
