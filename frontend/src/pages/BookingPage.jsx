import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { clinicInfo } from '../clinicData'
import { WhatsAppIcon, CheckCircleIcon as CheckIcon, MapPinIcon, ClockIcon, ShieldIcon } from '../components/Icons'

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
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol className="breadcrumb-list">
            <li><Link to="/">{t('breadcrumbHome')}</Link></li>
            <li aria-current="page">{t('breadcrumbBook')}</li>
          </ol>
        </nav>

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
