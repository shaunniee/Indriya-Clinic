import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { services, doctors } from '../clinicData'
import Seo from '../components/Seo'
import { EarIcon, BrainIcon, CheckIcon, WhatsAppIcon } from '../components/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getInitials } from '../utils/helpers'

/* ── Service section component ── */
function ServiceSection({ service, icon, titleKey, bodyKey, index }) {
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
                <Link to={`/doctors/${doc.slug}`} className="services-doctor-chip services-doctor-chip-link">
                  <div className={`services-doctor-avatar ${doc.specialty.toLowerCase()}`}>
              {doc.name.replace(/^Dr\.?\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="services-doctor-name">{doc.name}</span>
                    <span className="services-doctor-qual">{doc.qualification} · {doc.specialtyFull}</span>
                  </div>
                </Link>
              )
            })() : null}

            <Link to="/book" className="btn-primary btn-whatsapp" style={{ display: 'inline-flex', marginTop: '1.5rem', gap: '0.5rem' }}>
              <WhatsAppIcon />
              {t('ctaBook')}
            </Link>
          </div>

          {/* Conditions grid */}
          <div className="services-conditions-grid">
            <h3 className="conditions-title">{t('conditionsWeTreat')}</h3>
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

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">{t('breadcrumbHome')}</Link></li>
            <li aria-current="page">{t('breadcrumbServices')}</li>
          </ol>
        </div>
      </nav>

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
        index={0}
      />

      {/* Psychiatry Services */}
      <ServiceSection
        service={services.find((s) => s.key === 'psychiatry')}
        icon={<BrainIcon size={28} />}
        titleKey="psychiatryDetailTitle"
        bodyKey="psychiatryDetailBody"
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
