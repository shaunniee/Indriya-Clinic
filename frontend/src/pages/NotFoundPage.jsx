import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = '404 — Page Not Found | Indriya Clinics'
    let meta = document.head.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow')
    return () => { meta.setAttribute('content', 'index, follow') }
  }, [])

  return (
    <section className="section" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', color: 'var(--blue)' }}>404</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {t('notFoundText')}
        </p>
        <Link className="btn-primary" to="/">
          {t('navHome')}
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
