import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { services, doctors } from '../clinicData'
import Seo from '../components/Seo'
import { CheckIcon, WhatsAppIcon, getSpecialtyIcon } from '../components/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ── Service section component ── */
function ServiceSection({ service, icon, titleKey, bodyKey, index }) {
  const { t } = useTranslation()
  const doctorSpecialtyMap = {
    ent: 'ENT',
    psychiatry: 'Psychiatry',
    pediatrics: 'Pediatrics',
    neurosurgery: 'Neurosurgery',
  }
  const doc = doctors.find((d) => d.specialty === doctorSpecialtyMap[service.key])

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
            {doc ? (
              <Link to={`/doctors/${doc.slug}`} className="services-doctor-chip services-doctor-chip-link">
                <div className={`services-doctor-avatar ${doc.specialty.toLowerCase()}`}>
                  {doc.name.replace(/^Dr\.?\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="services-doctor-name">{doc.name}</span>
                  <span className="services-doctor-qual">{doc.qualification} · {doc.specialtyFull}</span>
                </div>
              </Link>
            ) : null}

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
                  <div className={`condition-check ${service.key}`}>
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

  const serviceMeta = {
    ent: {
      titleKey: 'entDetailTitle',
      bodyKey: 'entDetailBody',
      icon: getSpecialtyIcon('ENT', 28),
      ctaKey: 'serviceEntTitle',
      ctaIcon: getSpecialtyIcon('ENT', 16),
    },
    psychiatry: {
      titleKey: 'psychiatryDetailTitle',
      bodyKey: 'psychiatryDetailBody',
      icon: getSpecialtyIcon('Psychiatry', 28),
      ctaKey: 'servicePsychiatryTitle',
      ctaIcon: getSpecialtyIcon('Psychiatry', 16),
    },
    pediatrics: {
      titleKey: 'pediatricsDetailTitle',
      bodyKey: 'pediatricsDetailBody',
      icon: getSpecialtyIcon('Pediatrics', 28),
      ctaKey: 'servicePediatricsTitle',
      ctaIcon: getSpecialtyIcon('Pediatrics', 16),
    },
    neurosurgery: {
      titleKey: 'neurosurgeryDetailTitle',
      bodyKey: 'neurosurgeryDetailBody',
      icon: getSpecialtyIcon('Neurosurgery', 28),
      ctaKey: 'serviceNeurosurgeryTitle',
      ctaIcon: getSpecialtyIcon('Neurosurgery', 16),
    },
  }

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
              {services.map((service) => {
                const meta = serviceMeta[service.key]
                if (!meta) return null
                return (
                  <a key={service.key} href={`#${service.key}`} className="btn-secondary" style={{ fontSize: '0.92rem' }}>
                    {meta.ctaIcon}
                    {t(meta.ctaKey)}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {services.map((service, index) => {
        const meta = serviceMeta[service.key]
        if (!meta) return null
        return (
          <ServiceSection
            key={service.key}
            service={service}
            icon={meta.icon}
            titleKey={meta.titleKey}
            bodyKey={meta.bodyKey}
            index={index}
          />
        )
      })}

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
