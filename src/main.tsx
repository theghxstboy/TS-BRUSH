import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
// Fontes auto-hospedadas (não dependem da CDN do Google / passam sob CSP 'self')
import '@fontsource/geist/300.css'
import '@fontsource/geist/400.css'
import '@fontsource/geist/500.css'
import '@fontsource/geist/600.css'
import '@fontsource/geist/700.css'
import '@fontsource/geist/800.css'
import '@fontsource/geist/900.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
// Teste de self-host: Manrope como fonte da UI (Manrope não tem peso 900)
import '@fontsource/manrope/300.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import App from './App'
import './index.css'
import { GlobalAlert } from './components/common/GlobalAlert'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <GlobalAlert />
    <Toaster
      theme="dark"
      position="bottom-right"
      toastOptions={{}}
    />
  </React.StrictMode>
)
