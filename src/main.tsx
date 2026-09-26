import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './core/i18n/i18n'; // Inicializa o sistema de idiomas

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

