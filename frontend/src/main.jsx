import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './styles.css'
import App from './App.jsx'
import './i18n.js'

const rootElement = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Use hydrateRoot for pre-rendered pages (content already in DOM),
// createRoot for SPA-navigated empty shells
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
