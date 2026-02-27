import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clinicInfo, doctors } from '../clinicData'
import Seo from '../components/Seo'
import { EarIcon, BrainIcon, WhatsAppIcon, MapPinIcon, PhoneIcon, ClockIcon, CheckCircleIcon, ShieldIcon, HeartIcon, CalendarIcon } from '../components/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getInitials } from '../utils/helpers'

function HomePage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  const encodedMapQuery = encodeURIComponent(clinicInfo.mapQuery)
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedMapQuery}&ftid=${clinicInfo.mapFtid}&output=embed`
  const mapOpenUrl = `https://www.google.com/maps?q=${encodedMapQuery}&ftid=${clinicInfo.mapFtid}`

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
                  width="240"
                  height="240"
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
              <Link to="/services#ent" className="service-detail-link">{t('viewAllServices')} &rarr;</Link>
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
              <Link to="/services#psychiatry" className="service-detail-link">{t('viewAllServices')} &rarr;</Link>
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
              <Link
                key={doctor.slug}
                to={`/doctors/${doctor.slug}`}
                className={`doctor-card doctor-card-link ${doctor.specialty.toLowerCase()}-bg fade-up delay-${index + 1}`}
              >
                <div className={`doctor-avatar ${doctor.specialty.toLowerCase()}`}>
                  {getInitials(doctor.name)}
                </div>
                <h3>{doctor.name}</h3>
                <p className="doctor-qualification">{doctor.qualification}</p>
                <span className={`doctor-specialty ${doctor.specialty.toLowerCase()}`}>
                  {doctor.specialty === 'ENT' ? <EarIcon size={14} /> : <BrainIcon size={14} />}
                  {doctor.specialtyFull}
                </span>
                <p className="doctor-bio">{t(doctor.bioKey)}</p>
                <span className="doctor-card-cta">{t('viewProfile')} &rarr;</span>
              </Link>
            ))}
          </div>
          <div className="section-cta fade-up">
            <Link to="/doctors" className="btn-secondary">
              {t('doctorsPageTitle')}
            </Link>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
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
