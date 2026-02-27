import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doctors } from '../clinicData'
import Seo from '../components/Seo'
import { EarIcon, BrainIcon, ArrowRightIcon, CheckIcon, GlobeIcon, WhatsAppIcon } from '../components/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getInitials } from '../utils/helpers'

function DoctorsPage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  return (
    <div ref={pageRef}>
      <Seo page="doctors" />

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">{t('breadcrumbHome')}</Link></li>
            <li aria-current="page">{t('breadcrumbDoctors')}</li>
          </ol>
        </div>
      </nav>

      {/* Page hero */}
      <section className="doctors-page-hero">
        <div className="container">
          <div className="doctors-page-hero-inner fade-up">
            <h1>{t('doctorsPageTitle')}</h1>
            <p>{t('doctorsPageSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Doctor cards */}
      <section className="section">
        <div className="container">
          <div className="doctors-listing-grid">
            {doctors.map((doctor, index) => {
              const isEnt = doctor.specialty === 'ENT'
              return (
                <article
                  key={doctor.slug}
                  className={`doctor-profile-card fade-up delay-${index + 1}`}
                >
                  {/* Top accent band */}
                  <div className={`doctor-profile-band ${doctor.specialty.toLowerCase()}`} />

                  {/* Avatar */}
                  <div className="doctor-profile-avatar-wrap">
                    <div className={`doctor-profile-avatar ${doctor.specialty.toLowerCase()}`}>
                      {getInitials(doctor.name)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="doctor-profile-body">
                    <div className={`doctor-profile-badge ${doctor.specialty.toLowerCase()}`}>
                      {isEnt ? <EarIcon size={13} /> : <BrainIcon size={13} />}
                      {doctor.specialty}
                    </div>
                    <h2 className="doctor-profile-name">{doctor.name}</h2>
                    <p className="doctor-profile-tagline">{t(doctor.taglineBioKey)}</p>
                    <p className="doctor-profile-bio">{t(doctor.bioKey)}</p>

                    {/* Languages */}
                    <div className="doctor-profile-languages">
                      <GlobeIcon />
                      <span>{doctor.languages.join(', ')}</span>
                    </div>

                    {/* Top conditions */}
                    <ul className="doctor-profile-conditions">
                      {doctor.conditions.slice(0, 6).map((c) => (
                        <li key={c}>
                          <span className={`doctor-profile-check ${doctor.specialty.toLowerCase()}`}>
                            <CheckIcon size={11} />
                          </span>
                          {c}
                        </li>
                      ))}
                      {doctor.conditions.length > 6 && (
                        <li className="doctor-profile-more">
                          +{doctor.conditions.length - 6} more
                        </li>
                      )}
                    </ul>

                    {/* Actions */}
                    <div className="doctor-profile-actions">
                      <Link
                        to={`/doctors/${doctor.slug}`}
                        className="btn-primary-outline"
                      >
                        {t('viewProfile')} <ArrowRightIcon />
                      </Link>
                      <Link to="/book" className="btn-primary btn-whatsapp">
                        <WhatsAppIcon />
                        {t('bookWithDoctor')}
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DoctorsPage
