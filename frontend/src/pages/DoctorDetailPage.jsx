import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doctors, clinicInfo } from '../clinicData'
import Seo from '../components/Seo'
import { CheckIcon, WhatsAppIcon, GlobeIcon, BuildingIcon, ClockIcon, getSpecialtyIcon } from '../components/Icons'
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
  const isPsych = doctor.specialty === 'Psychiatry'
  const seoTitleKey = isEnt ? 'seoJaswinTitle' : (isPsych ? 'seoPsychTitle' : undefined)
  const seoDescKey = isEnt ? 'seoJaswinDescription' : (isPsych ? 'seoPsychDescription' : undefined)
  const doctorTagline = doctor.tagline || t(doctor.taglineBioKey)
  const doctorLongBio = doctor.bioLong || t(doctor.bioLongKey)
  const firstName = doctor.name.replace(/^Dr\.?\s*/i, '').split(' ')[0]

  return (
    <div ref={pageRef}>
      <Seo
        page={`doctor-${doctor.slug}`}
        doctorSeoTitleKey={seoTitleKey}
        doctorSeoDescKey={seoDescKey}
        doctorSeoTitle={doctor.seoTitle}
        doctorSeoDesc={doctor.seoDescription}
      />

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
                {getSpecialtyIcon(doctor.specialty, 14)}
                {doctor.specialty}
              </div>
              <h1>{doctor.name}</h1>
              <p className="doctor-detail-tagline">{doctorTagline}</p>

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
                {(doctor.department || doctor.timings) && (
                  <span className="doctor-detail-meta-item">
                    <ClockIcon />
                    {[doctor.department, doctor.timings].filter(Boolean).join(' | ')}
                  </span>
                )}
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
                {doctorLongBio.split('\n\n').map((paragraph, i) => (
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
                  {getSpecialtyIcon(doctor.specialty, 15)}
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
