import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { AlertType } from '../../store/useAppStore'

const ICONS: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle2 className="alert-icon-success" size={24} />,
  error: <AlertCircle className="alert-icon-error" size={24} />,
  warning: <AlertTriangle className="alert-icon-warning" size={24} />,
  info: <Info className="alert-icon-info" size={24} />,
  confirm: <AlertTriangle className="alert-icon-warning" size={24} />,
}

export function GlobalAlert() {
  const { alert, hideAlert } = useAppStore()

  const handleConfirm = () => {
    alert.onConfirm?.()
    hideAlert()
  }

  const handleCancel = () => {
    alert.onCancel?.()
    hideAlert()
  }

  return (
    <AnimatePresence>
      {alert.isOpen && (
        <div className="global-alert-overlay">
          <motion.div
            className="global-alert-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={alert.type !== 'confirm' ? hideAlert : undefined}
          />
          
          <motion.div
            className={`global-alert-card glass-style alert-border-${alert.type}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="global-alert-header">
              <div className="global-alert-icon-container">
                {ICONS[alert.type]}
              </div>
              {alert.type !== 'confirm' && (
                <button className="global-alert-close" onClick={hideAlert}>
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="global-alert-content">
              <h2 className="global-alert-title">{alert.title}</h2>
              <p className="global-alert-message">{alert.message}</p>
            </div>

            <div className="global-alert-actions">
              {alert.type === 'confirm' ? (
                <>
                  <button className="alert-btn alert-btn-secondary" onClick={handleCancel}>
                    {alert.cancelLabel || 'Cancelar'}
                  </button>
                  <button className="alert-btn alert-btn-primary" onClick={handleConfirm}>
                    {alert.confirmLabel || 'Confirmar'}
                  </button>
                </>
              ) : (
                <button className="alert-btn alert-btn-primary" onClick={hideAlert}>
                  Entendido
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
