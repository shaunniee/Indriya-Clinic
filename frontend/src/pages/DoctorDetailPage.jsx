import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doctors, clinicInfo } from '../clinicData'
import Seo from '../components/Seo'

/* ── Icons ── */
const EarIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0" />
  </svg>
)

const BrainIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a4 4 0 0 0-4 4c0 1.1.4 2 1 2.8A4 4 0 0 0 6 13c0 1.3.6 2.4 1.6 3.1A4 4 0 0 0 6 19a4 4 0 0 0 4 4h1V2h1v21h1a4 4 0 0 0 4-4c0-1.1-.5-2.2-1.4-2.9A4 4 0 0 0 18 13a4 4 0 0 0-3-3.9c.6-.7 1-1.7 1-2.8a4 4 0 0 0-4-4z" />
  </svg>
)

const CheckIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M3 9h18M9 21V9" />
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

function getInitials(name) {
  return name.replace(/^Dr\.?\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function DoctorDetailPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  const doctor = doctors.find((d) => d.slug === slug)

  // Gracefully handle unknown slugs
  if (!doctor) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Doctor not found</h2>
        <Link to="/doctors" style={{ color: 'var(--blue)' }}>{t('backToDoctors')}</Link>
      </div>
    )
  }

  const isEnt = doctor.specialty === 'ENT'
  const seoTitleKey = isEnt ? 'seoJaswinTitle' : 'seoPsychTitle'
  const seoDescKey = isEnt ? 'seoJaswinDescription' : 'seoPsychDescription'

  return (
    <div ref={pageRef}>
      <Seo page={`doctor-${doctor.slug}`} doctorSeoTitleKey={seoTitleKey} doctorSeoDescKey={seoDescKey} />

      {/* Breadcrumb */}
      <div className="doctor-detail-breadcrumb">
        <div className="container">
          <Link to="/doctors">{t('backToDoctors')}</Link>
        </div>
      </div>

      {/* Profile hero */}
      <section className={`doctor-detail-hero ${doctor.specialty.toLowerCase()}-hero`}>
        <div className="container">
          <div className="doctor-detail-hero-inner fade-up">
            {/* Avatar */}
            <div className={`doctor-detail-avatar ${doctor.specialty.toLowerCase()}`}>
              {getInitials(doctor.name)}
            </div>

            {/* Text block */}
            <div className="doctor-detail-hero-text">
              <div className={`doctor-profile-badge ${doctor.specialty.toLowerCase()}`} style={{ marginBottom: '0.6rem' }}>
                {isEnt ? <EarIcon size={14} /> : <BrainIcon size={14} />}
                {doctor.specialty}
              </div>
              <h1>{doctor.name}</h1>
              <p className="doctor-detail-tagline">{t(doctor.taglineBioKey)}</p>

              {/* Meta chips */}
              <div className="doctor-detail-meta">
                <span className="doctor-detail-meta-item">
                  <BuildingIcon />
                  {t('doctorClinicLabel')}: {clinicInfo.name}
                </span>
                <span className="doctor-detail-meta-item">
                  <GlobeIcon />
                  {t('doctorLanguagesLabel')}: {doctor.languages.join(', ')}
                </span>
              </div>

              <Link to="/book" className="btn-primary btn-whatsapp" style={{ marginTop: '1.25rem', display: 'inline-flex' }}>
                <WhatsAppIcon />
                {t('bookWithDoctor')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio + Conditions two-column */}
      <section className="section">
        <div className="container">
          <div className="doctor-detail-body fade-up">

            {/* Long bio */}
            <div className="doctor-detail-bio-section">
              <h2>{t('doctorsTitle')}</h2>
              <p className="doctor-detail-long-bio">{t(doctor.bioLongKey)}</p>

              {/* Book CTA card */}
              <div className={`doctor-detail-booking-card ${doctor.specialty.toLowerCase()}`}>
                <p>Book a consultation with <strong>{doctor.name}</strong> at Indriya Clinics, Surathkal, Mangalore.</p>
                <Link to="/book" className="btn-primary btn-whatsapp">
                  <WhatsAppIcon />
                  {t('bookWithDoctor')}
                </Link>
              </div>
            </div>

            {/* Conditions list */}
            <div className="doctor-detail-conditions-section">
              <h2>{t('doctorConditionsTitle')}</h2>
              <ul className="doctor-detail-conditions-list">
                {doctor.conditions.map((condition) => (
                  <li key={condition} className="doctor-detail-condition-item">
                    <span className={`condition-check ${doctor.specialty.toLowerCase()}`}>
                      <CheckIcon size={13} />
                    </span>
                    {condition}
                  </li>
                ))}
              </ul>

              {/* Link to services */}
              <div style={{ marginTop: '1.5rem' }}>
                <Link
                  to={`/services#${doctor.specialty.toLowerCase()}`}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', fontSize: '0.88rem' }}
                >
                  {isEnt ? <EarIcon size={15} /> : <BrainIcon size={15} />}
                  {t('viewAllServices')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default DoctorDetailPage
