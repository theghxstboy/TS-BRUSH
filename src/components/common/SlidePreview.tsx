import React from 'react'

export interface SlidePreviewProps {
  bg: string
  accent: string
  titleColor?: string
  textColor?: string
  logoSrc?: string | null
  type: 'cover' | 'section' | 'content' | 'final'
  label?: string
  number?: string
  backgroundImg?: string | null
}

export function SlidePreview({
  bg,
  accent,
  titleColor = '#000000',
  textColor = '#666666',
  logoSrc,
  type,
  label,
  number = '01',
  backgroundImg
}: SlidePreviewProps) {
  const isDark = bg === '#000000' || bg === '#1a1a1a' || bg === '#0C0C0C'
  const defTitle = titleColor || (isDark ? '#FFFFFF' : '#1a1a1a')
  const defText = textColor || (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)')

  return (
    <div
      className="np-slide-preview"
      style={{ 
        backgroundColor: bg,
        backgroundImage: backgroundImg ? `url(${backgroundImg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="np-slide-preview-overlay" />
      
      {type === 'cover' && (
        <div className="np-slide-preview-center" style={{ gap: '10px' }}>
          {logoSrc ? (
            <img src={logoSrc} alt="logo" className="np-slide-preview-logo-main" style={{ maxHeight: '30%' }} />
          ) : (
            <div className="np-slide-preview-logo-main skeleton-logo" style={{ border: `1px dashed ${accent}80` }} />
          )}
          <div className="np-slide-preview-brand-info" style={{ gap: '6px' }}>
             <div className="np-slide-preview-rect-title" style={{ backgroundColor: accent, width: '40%', height: '8px' }} />
             <div className="np-slide-preview-rect-subtitle" style={{ backgroundColor: defText, width: '25%', height: '4px' }} />
          </div>
        </div>
      )}

      {type === 'section' && (
        <div className="np-slide-preview-section-layout" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 10%' }}>
          <div className="np-slide-preview-section-num" style={{ color: accent, fontSize: '32px', marginBottom: '4px' }}>{number}</div>
          <div className="np-slide-preview-section-title-skeleton" style={{ backgroundColor: defTitle, width: '70%', height: '10px' }} />
          <div className="np-slide-preview-section-bar" style={{ backgroundColor: accent, width: '30%', height: '3px', marginTop: '12px' }} />
        </div>
      )}

      {type === 'content' && (
        <div className="np-slide-preview-content-layout" style={{ gridTemplateColumns: '45% 1fr', padding: '12% 10%', gap: '12px' }}>
          <div className="np-slide-preview-content-left" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
             <div className="skeleton-image-placeholder" style={{ backgroundColor: accent, opacity: 0.3 }} />
          </div>
          <div className="np-slide-preview-content-right" style={{ gap: '8px' }}>
            <div className="np-slide-preview-content-rect" style={{ width: '40%', backgroundColor: accent, height: '6px', borderRadius: '3px' }} />
            <div className="np-slide-preview-content-rect" style={{ width: '100%', backgroundColor: defTitle, height: '4px', borderRadius: '2px' }} />
            <div className="np-slide-preview-content-rect" style={{ width: '100%', backgroundColor: defText, height: '4px', borderRadius: '2px' }} />
            <div className="np-slide-preview-content-rect" style={{ width: '70%', backgroundColor: defText, height: '4px', borderRadius: '2px' }} />
          </div>
        </div>
      )}

      {type === 'final' && (
        <div className="np-slide-preview-center">
          <div className="np-slide-preview-glass-box" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', gap: '6px', padding: '12px' }}>
             {logoSrc && <img src={logoSrc} alt="logo" className="np-slide-preview-logo-main" style={{ maxHeight: '12px', marginBottom: '4px' }} />}
             <div className="np-slide-preview-final-rect" style={{ backgroundColor: defTitle, width: '50%', height: '6px', borderRadius: '3px' }} />
             <div className="np-slide-preview-final-rect" style={{ backgroundColor: defText, width: '25%', height: '3px', borderRadius: '1.5px' }} />
          </div>
        </div>
      )}
    </div>
  )
}
