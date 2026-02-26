import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doctors } from '../clinicData'
import Seo from '../components/Seo'

const EarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0" />
  </svg>
)

const BrainIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a4 4 0 0 0-4 4c0 1.1.4 2 1 2.8A4 4 0 0 0 6 13c0 1.3.6 2.4 1.6 3.1A4 4 0 0 0 6 19a4 4 0 0 0 4 4h1V2h1v21h1a4 4 0 0 0 4-4c0-1.1-.5-2.2-1.4-2.9A4 4 0 0 0 18 13a4 4 0 0 0-3-3.9c.6-.7 1-1.7 1-2.8a4 4 0 0 0-4-4z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

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

function getInitials(name) {
  return name.replace(/^Dr\.?\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function DoctorsPage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  return (
    <div ref={pageRef}>
      <Seo page="doctors" />

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

                    {/* Top conditions */}
                    <ul className="doctor-profile-conditions">
                      {doctor.conditions.slice(0, 4).map((c) => (
                        <li key={c}>{c}</li>
                      ))}
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
