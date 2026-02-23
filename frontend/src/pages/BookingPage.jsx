import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { clinicInfo } from '../clinicData'

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const initialFormState = {
  name: '',
  phone: '',
  service: 'ENT',
  preferredDate: '',
  notes: '',
}

function BookingPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(initialFormState)
  const [submitted, setSubmitted] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const bookingMessage = [
      'New Appointment Request',
      `Patient Name: ${formData.name}`,
      `Phone Number: ${formData.phone}`,
      `Service: ${formData.service}`,
      `Preferred Date: ${formData.preferredDate || 'Not specified'}`,
      `Notes: ${formData.notes || 'None'}`,
      `Clinic: ${clinicInfo.name}`,
    ].join('\n')

    const normalizedNumber = clinicInfo.whatsappNumber.replace(/\D/g, '')
    const baseUrl = normalizedNumber ? `https://wa.me/${normalizedNumber}` : 'https://wa.me/'
    const whatsappUrl = `${baseUrl}?text=${encodeURIComponent(bookingMessage)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <section className="section booking-page">
      <Seo page="booking" />
      <div className="container">
        <h1>{t('bookingTitle')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('bookingText')}</p>

        <div className="booking-layout">
          <form className="booking-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('bookingName')}</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                autoComplete="name"
                placeholder={t('placeholderName')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('bookingPhone')}</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onChange}
                required
                autoComplete="tel"
                pattern="[+]?[0-9\s\-]{7,15}"
                title="Enter a valid phone number (e.g. +91 98765 43210)"
                placeholder={t('placeholderPhone')}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service">{t('bookingService')}</label>
                <select id="service" name="service" value={formData.service} onChange={onChange}>
                  <option value="ENT">{t('serviceEntTitle')}</option>
                  <option value="Psychiatry">{t('servicePsychiatryTitle')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="preferredDate">{t('bookingPreferredDate')}</label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={onChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">{t('bookingNotes')}</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={onChange}
                placeholder={t('placeholderNotes')}
              />
            </div>

            <button className="btn-primary btn-whatsapp" type="submit">
              <WhatsAppIcon />
              {t('bookingSubmit')}
            </button>
          </form>

          <div className="booking-sidebar">
            <img
              src="/logo.jpg"
              alt=""
              className="booking-sidebar-logo"
              onError={(event) => { event.currentTarget.style.display = 'none' }}
            />
            <h3>{clinicInfo.name}</h3>
            <div className="booking-sidebar-item">
              <MapPinIcon />
              <p>
                <strong>{t('labelLocation')}</strong>
                {t('locationShort')}
              </p>
            </div>
            <div className="booking-sidebar-item">
              <ClockIcon />
              <p>
                <strong>{t('labelHours')}</strong>
                {t('hoursText')}
              </p>
            </div>
            <div className="booking-sidebar-item">
              <ShieldIcon />
              <p>
                <strong>{t('labelSpecialities')}</strong>
                {t('specialitiesText')}
              </p>
            </div>
          </div>
        </div>

        {submitted ? (
          <p className="success-text">
            <CheckIcon />
            {t('bookingSuccess')}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default BookingPage
