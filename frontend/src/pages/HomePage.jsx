import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clinicInfo, doctors } from '../clinicData'
import Seo from '../components/Seo'

/* Inline SVG icons */
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

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

/* Scroll animation hook */
function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = ref.current?.querySelectorAll('.fade-up')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}

function HomePage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  const encodedMapQuery = encodeURIComponent(clinicInfo.mapQuery)
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedMapQuery}&ftid=${clinicInfo.mapFtid}&output=embed`
  const mapOpenUrl = `https://www.google.com/maps?q=${encodedMapQuery}&ftid=${clinicInfo.mapFtid}`

  const getInitials = (name) => {
    return name
      .replace(/^Dr\.?\s*/i, '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const entTagKeys = ['tagEar', 'tagNose', 'tagThroat', 'tagAllergy', 'tagSinus']
  const psychiatryTagKeys = ['tagAnxiety', 'tagDepression', 'tagSleep', 'tagStress', 'tagMood']

  return (
    <div ref={pageRef}>
      <Seo />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="hero-badge">
                <CheckCircleIcon />
                {t('heroBadge')}
              </div>
              <h1>
                {t('heroTitlePre')}
                <span className="highlight">{t('heroHighlight1')}</span>
                {t('heroTitleMid')}
                <span className="highlight">{t('heroHighlight2')}</span>
                {t('heroTitlePost')}
              </h1>
              <p>{t('heroText')}</p>
              <div className="cta-row">
                <Link className="btn-primary btn-whatsapp" to="/book">
                  <WhatsAppIcon />
                  {t('ctaBook')}
                </Link>
                <a className="btn-secondary" href={mapOpenUrl} target="_blank" rel="noreferrer">
                  <MapPinIcon />
                  {t('ctaDirections')}
                </a>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-number">2</div>
                  <div className="hero-stat-label">{t('heroStatSpecialities')}</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-number">MD</div>
                  <div className="hero-stat-label">{t('heroStatDoctors')}</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-number">6</div>
                  <div className="hero-stat-label">{t('heroStatDays')}</div>
                </div>
              </div>
            </div>
            <div className="hero-logo-area">
              <div className="hero-logo-circle">
                <img
                  src="/logo.jpg"
                  alt="Indriya Clinics"
                  onError={(event) => { event.currentTarget.parentElement.style.display = 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('servicesTitle')}</h2>
            <p>{t('servicesSubtitle')}</p>
            <div className="section-divider" />
          </div>
          <div className="card-grid">
            <article className="service-card fade-up delay-1">
              <div className="service-icon ent">
                <EarIcon />
              </div>
              <h3>{t('serviceEntTitle')}</h3>
              <p>{t('serviceEntBody')}</p>
              <div className="service-tags">
                {entTagKeys.map((key) => (
                  <span key={key} className="service-tag">{t(key)}</span>
                ))}
              </div>
            </article>
            <article className="service-card fade-up delay-2">
              <div className="service-icon psychiatry">
                <BrainIcon />
              </div>
              <h3>{t('servicePsychiatryTitle')}</h3>
              <p>{t('servicePsychiatryBody')}</p>
              <div className="service-tags">
                {psychiatryTagKeys.map((key) => (
                  <span key={key} className="service-tag">{t(key)}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" id="why-us">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('whyTitle')}</h2>
            <p>{t('whySubtitle')}</p>
            <div className="section-divider" />
          </div>
          <div className="features-grid">
            <div className="feature-card fade-up delay-1">
              <div className="feature-icon blue">
                <ShieldIcon />
              </div>
              <div>
                <h3>{t('whySpecialistsTitle')}</h3>
                <p>{t('whySpecialistsBody')}</p>
              </div>
            </div>
            <div className="feature-card fade-up delay-2">
              <div className="feature-icon orange">
                <HeartIcon />
              </div>
              <div>
                <h3>{t('whyCareTitle')}</h3>
                <p>{t('whyCareBody')}</p>
              </div>
            </div>
            <div className="feature-card fade-up delay-3">
              <div className="feature-icon green">
                <CalendarIcon />
              </div>
              <div>
                <h3>{t('whyBookingTitle')}</h3>
                <p>{t('whyBookingBody')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="section section-alt" id="doctors">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('doctorsTitle')}</h2>
            <p>{t('doctorsSubtitle')}</p>
            <div className="section-divider" />
          </div>
          <div className="card-grid">
            {doctors.map((doctor, index) => (
              <article
                key={doctor.name}
                className={`doctor-card ${doctor.specialty.toLowerCase()}-bg fade-up delay-${index + 1}`}
              >
                <div className={`doctor-avatar ${doctor.specialty.toLowerCase()}`}>
                  {getInitials(doctor.name)}
                </div>
                <h3>{doctor.name}</h3>
                <p className="doctor-qualification">{doctor.qualification}</p>
                <span className={`doctor-specialty ${doctor.specialty.toLowerCase()}`}>
                  {doctor.specialty === 'ENT' ? <EarIcon size={14} /> : <BrainIcon size={14} />}
                  {doctor.specialty}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      {/* FAQ — visible for SEO crawlers + users */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('faqTitle')}</h2>
            <p>{t('faqSubtitle')}</p>
            <div className="section-divider" />
          </div>
          <div className="faq-list fade-up">
            {[1, 2, 3, 4, 5].map((n) => (
              <details key={n} className="faq-item">
                <summary>{t(`faq${n}Q`)}</summary>
                <p>{t(`faq${n}A`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section" id="location">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('locationTitle')}</h2>
            <p>{t('locationSubtitle')}</p>
            <div className="section-divider" />
          </div>
          <div className="location-grid fade-up">
            <div className="location-info">
              <div className="location-info-item">
                <div className="location-info-icon">
                  <MapPinIcon />
                </div>
                <div className="location-info-text">
                  <h4>{t('labelAddress')}</h4>
                  <p>{t('locationText')}</p>
                </div>
              </div>
              <div className="location-info-item">
                <div className="location-info-icon">
                  <ClockIcon />
                </div>
                <div className="location-info-text">
                  <h4>{t('labelHours')}</h4>
                  <p>{t('hoursText')}</p>
                </div>
              </div>
              <div className="location-info-item">
                <div className="location-info-icon">
                  <PhoneIcon />
                </div>
                <div className="location-info-text">
                  <h4>{t('labelContact')}</h4>
                  <p>{t('contactText')}</p>
                </div>
              </div>
              <div className="location-cta">
                <a className="btn-secondary" href={mapOpenUrl} target="_blank" rel="noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                  <MapPinIcon />
                  {t('ctaDirections')}
                </a>
              </div>
            </div>
            <div className="map-wrap">
              <iframe
                title="Indriya Clinics Google Map"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
