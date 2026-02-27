import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doctors, clinicInfo } from '../clinicData'
import Seo from '../components/Seo'
import { EarIcon, BrainIcon, CheckIcon, WhatsAppIcon, GlobeIcon, BuildingIcon } from '../components/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getInitials } from '../utils/helpers'

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
  const firstName = doctor.name.replace(/^Dr\.?\s*/i, '').split(' ')[0]

  return (
    <div ref={pageRef}>
      <Seo page={`doctor-${doctor.slug}`} doctorSeoTitleKey={seoTitleKey} doctorSeoDescKey={seoDescKey} />

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">{t('breadcrumbHome')}</Link></li>
            <li><Link to="/doctors">{t('breadcrumbDoctors')}</Link></li>
            <li aria-current="page">{doctor.name}</li>
          </ol>
        </div>
      </nav>

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
              <h2>About {firstName}</h2>
              <div className="doctor-detail-long-bio">
                {t(doctor.bioLongKey).split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Book CTA card */}
              <div className={`doctor-detail-booking-card ${doctor.specialty.toLowerCase()}`}>
                <p>{t('bookConsultationWith', { doctorName: doctor.name })}</p>
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
