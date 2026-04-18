import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
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
