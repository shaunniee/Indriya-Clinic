import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense, useEffect, useState } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'))
const DoctorDetailPage = lazy(() => import('./pages/DoctorDetailPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/* Lightweight loading fallback — no extra bundle weight */
const PageLoading = () => (
  <div className="page-loading" role="status" aria-label="Loading page">
    <div className="page-loading-spinner" />
  </div>
)

const WhatsAppFloatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation()

  return (
    <div className={className} role="group" aria-label="Language selector">
      <button
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => i18n.changeLanguage('en')}
        aria-label="English"
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <button
        className={i18n.language === 'kn' ? 'active' : ''}
        onClick={() => i18n.changeLanguage('kn')}
        aria-label="ಕನ್ನಡ (Kannada)"
        aria-pressed={i18n.language === 'kn'}
      >
        ಕನ್ನಡ
      </button>
      <button
        className={i18n.language === 'hi' ? 'active' : ''}
        onClick={() => i18n.changeLanguage('hi')}
        aria-label="हिन्दी (Hindi)"
        aria-pressed={i18n.language === 'hi'}
      >
        हिन्दी
      </button>
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Helper: scroll to a Y position with smooth fallback for older Safari
    const smoothScrollTo = (top) => {
      try {
        window.scrollTo({ top, behavior: 'smooth' })
      } catch {
        window.scrollTo(0, top)
      }
    }

    if (hash) {
      // Use rAF to ensure the DOM has painted before measuring
      requestAnimationFrame(() => {
        const element = document.querySelector(hash)
        if (element) {
          // Account for sticky header height so content isn't hidden underneath
          const headerEl = document.querySelector('.site-header')
          const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 72
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16
          smoothScrollTo(offsetTop)
          return
        }
        smoothScrollTo(0)
      })
      return
    }
    smoothScrollTo(0)
  }, [pathname, hash])

  return null
}

function MobileMenu({ isOpen, onClose }) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="mobile-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="mobile-panel">
        <button className="mobile-close" onClick={onClose} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/" onClick={onClose}>{t('navHome')}</Link>
          <Link to="/services" onClick={onClose}>{t('navServices')}</Link>
          <Link to="/doctors" onClick={onClose}>{t('navDoctors')}</Link>
          <Link to="/book" onClick={onClose}>{t('navBook')}</Link>
        </nav>
        <div className="mobile-lang" role="group" aria-label="Language selector">
          <button
            className={i18n.language === 'en' ? 'active' : ''}
            onClick={() => { i18n.changeLanguage('en'); onClose() }}
            aria-label="English"
            aria-pressed={i18n.language === 'en'}
          >
            EN
          </button>
          <button
            className={i18n.language === 'kn' ? 'active' : ''}
            onClick={() => { i18n.changeLanguage('kn'); onClose() }}
            aria-label="ಕನ್ನಡ (Kannada)"
            aria-pressed={i18n.language === 'kn'}
          >
            ಕನ್ನಡ
          </button>
          <button
            className={i18n.language === 'hi' ? 'active' : ''}
            onClick={() => { i18n.changeLanguage('hi'); onClose() }}
            aria-label="हिन्दी (Hindi)"
            aria-pressed={i18n.language === 'hi'}
          >
            हिन्दी
          </button>
        </div>
      </div>
    </div>
  )
}

function AppShell() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Indriya Clinics home">
            <img
              src="/logo.jpg"
              alt="Indriya Clinics logo"
              width="44"
              height="44"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
            <div>
              <p className="brand-title">
                Indriya <span className="brand-highlight">Clinics</span>
              </p>
              <p className="brand-subtitle">{t('siteTagline')}</p>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">{t('navHome')}</Link>
            <Link to="/services">{t('navServices')}</Link>
            <Link to="/doctors">{t('navDoctors')}</Link>
            <Link to="/book" className="nav-cta">{t('navBook')}</Link>
          </nav>

          <LanguageSwitcher className="language-switcher" />

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main-content">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:slug" element={<DoctorDetailPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Floating WhatsApp button */}
      <Link to="/book" className="floating-whatsapp" aria-label="Book appointment via WhatsApp">
        <WhatsAppFloatIcon />
      </Link>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">
                <img
                  src="/logo.jpg"
                  alt="Indriya Clinics logo"
                  width="40"
                  height="40"
                  loading="lazy"
                  onError={(event) => { event.currentTarget.style.display = 'none' }}
                />
                <span className="footer-brand-name">Indriya Clinics</span>
              </div>
              <p className="footer-desc">{t('heroText')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('servicesTitle')}</h4>
              <ul>
                <li><Link to="/services#ent">{t('serviceEntTitle')}</Link></li>
                <li><Link to="/services#psychiatry">{t('servicePsychiatryTitle')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('locationTitle')}</h4>
              <ul>
                <li><Link to="/#location">{t('locationShort')}</Link></li>
                <li><Link to="/#location">{t('hoursText')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('footerLine')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  )
}

export default App
