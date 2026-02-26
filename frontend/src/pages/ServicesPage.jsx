import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { services, doctors } from '../clinicData'
import Seo from '../components/Seo'

/* ── Icons ── */
const EarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0" />
  </svg>
)

const BrainIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 0-4 4c0 1.1.4 2 1 2.8A4 4 0 0 0 6 13c0 1.3.6 2.4 1.6 3.1A4 4 0 0 0 6 19a4 4 0 0 0 4 4h1V2h1v21h1a4 4 0 0 0 4-4c0-1.1-.5-2.2-1.4-2.9A4 4 0 0 0 18 13a4 4 0 0 0-3-3.9c.6-.7 1-1.7 1-2.8a4 4 0 0 0-4-4z" />
  </svg>
)

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

/* ── Scroll animation ── */
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const elements = ref.current?.querySelectorAll('.fade-up')
    if (!('IntersectionObserver' in window) || !elements?.length) {
      elements?.forEach((el) => el.classList.add('visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ── Service section component ── */
function ServiceSection({ service, icon, titleKey, bodyKey, colorClass, index }) {
  const { t } = useTranslation()
  const isEnt = service.key === 'ent'

  return (
    <section className={`section ${index % 2 === 0 ? 'section-alt' : ''}`} id={service.key}>
      <div className="container">
        <div className="services-detail-layout fade-up">
          {/* Header */}
          <div className="services-detail-header">
            <div className={`service-icon ${service.key}`} style={{ width: 64, height: 64, marginBottom: '1.25rem' }}>
              {icon}
            </div>
            <h2>{t(titleKey)}</h2>
            <p className="services-detail-intro">{t(bodyKey)}</p>

            {/* Associated doctor */}
            {service.key === 'ent' || service.key === 'psychiatry' ? (() => {
              const doc = doctors.find((d) =>
                service.key === 'ent' ? d.specialty === 'ENT' : d.specialty === 'Psychiatry'
              )
              if (!doc) return null
              return (
                <div className="services-doctor-chip">
                  <div className={`services-doctor-avatar ${doc.specialty.toLowerCase()}`}>
                    {doc.name.replace(/^Dr\.?\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="services-doctor-name">{doc.name}</span>
                    <span className="services-doctor-qual">{doc.qualification} · {doc.specialtyFull}</span>
                  </div>
                </div>
              )
            })() : null}

            <Link to="/book" className="btn-primary btn-whatsapp" style={{ display: 'inline-flex', marginTop: '1.5rem', gap: '0.5rem' }}>
              <WhatsAppIcon />
              {t('ctaBook')}
            </Link>
          </div>

          {/* Conditions grid */}
          <div className="services-conditions-grid">
            <h3 className="conditions-title">{t('conditionsWeTraeat')}</h3>
            <ul className="conditions-list">
              {service.conditions.map((condition) => (
                <li key={condition.name} className="condition-item">
                  <div className={`condition-check ${isEnt ? 'ent' : 'psychiatry'}`}>
                    <CheckIcon size={14} />
                  </div>
                  <div>
                    <strong className="condition-name">{condition.name}</strong>
                    <p className="condition-desc">{condition.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Page ── */
function ServicesPage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  return (
    <div ref={pageRef}>
      <Seo page="services" />

      {/* Page hero */}
      <section className="services-page-hero">
        <div className="container">
          <div className="services-page-hero-inner fade-up">
            <div className="hero-badge" style={{ justifyContent: 'center' }}>
              <CheckIcon size={15} />
              {t('heroBadge')}
            </div>
            <h1>{t('servicesPageTitle')}</h1>
            <p>{t('servicesPageSubtitle')}</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
              <a href="#ent" className="btn-secondary" style={{ fontSize: '0.92rem' }}>
                <EarIcon size={16} />
                {t('serviceEntTitle')}
              </a>
              <a href="#psychiatry" className="btn-secondary" style={{ fontSize: '0.92rem' }}>
                <BrainIcon size={16} />
                {t('servicePsychiatryTitle')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ENT Services */}
      <ServiceSection
        service={services.find((s) => s.key === 'ent')}
        icon={<EarIcon size={28} />}
        titleKey="entDetailTitle"
        bodyKey="entDetailBody"
        colorClass="ent"
        index={0}
      />

      {/* Psychiatry Services */}
      <ServiceSection
        service={services.find((s) => s.key === 'psychiatry')}
        icon={<BrainIcon size={28} />}
        titleKey="psychiatryDetailTitle"
        bodyKey="psychiatryDetailBody"
        colorClass="psychiatry"
        index={1}
      />

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner-content fade-up">
          <h2>{t('ctaBannerTitle')}</h2>
          <p>{t('ctaBannerText')}</p>
          <Link className="btn-primary btn-whatsapp" to="/book">
            <WhatsAppIcon />
            {t('ctaBook')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
