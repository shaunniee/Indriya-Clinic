import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { clinicInfo, doctors } from '../clinicData'

function upsertMeta(name, content, attr = 'name') {
  let element = document.head.querySelector(`meta[${attr}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel, href, extra) {
  const selector = extra
    ? `link[rel="${rel}"][${extra}]`
    : `link[rel="${rel}"]`
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
  return element
}

function upsertJsonLd(id, data) {
  let element = document.getElementById(id)

  if (!element) {
    element = document.createElement('script')
    element.id = id
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

function Seo({ page = 'home' }) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const isBooking = page === 'booking'

    // Page-specific titles & descriptions
    const title = isBooking
      ? `${t('bookingTitle')} | ${clinicInfo.name}`
      : t('seoTitle')
    const description = isBooking
      ? `Book an ENT or Psychiatry appointment at ${clinicInfo.name}, Surathkal, Mangalore. Quick WhatsApp booking — no waiting on hold.`
      : t('seoDescription')
    const keywords = isBooking
      ? `book appointment Mangalore, ENT appointment Surathkal, psychiatry appointment Mangalore, WhatsApp doctor booking, ${t('seoKeywords')}`
      : t('seoKeywords')

    document.title = title
    document.documentElement.lang = i18n.language

    // Standard meta
    upsertMeta('description', description)
    upsertMeta('keywords', keywords)
    upsertMeta('robots', 'index, follow')
    upsertMeta('author', clinicInfo.name)

    // Geo meta for local SEO
    upsertMeta('geo.region', 'IN-KA')
    upsertMeta('geo.placename', 'Surathkal, Mangalore')
    upsertMeta('geo.position', '13.0067;74.7964')
    upsertMeta('ICBM', '13.0067, 74.7964')

    // Open Graph
    upsertMeta('og:title', title, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:type', 'website', 'property')
    upsertMeta('og:locale', i18n.language, 'property')
    upsertMeta('og:site_name', clinicInfo.name, 'property')
    upsertMeta('og:url', window.location.href, 'property')
    upsertMeta('og:image', `${window.location.origin}/logo.jpg`, 'property')
    upsertMeta('og:image:width', '512', 'property')
    upsertMeta('og:image:height', '512', 'property')

    // Twitter
    upsertMeta('twitter:card', 'summary_large_image', 'name')
    upsertMeta('twitter:title', title, 'name')
    upsertMeta('twitter:description', description, 'name')
    upsertMeta('twitter:image', `${window.location.origin}/logo.jpg`, 'name')

    // Canonical
    upsertLink('canonical', window.location.href)

    // MedicalClinic schema (rich structured data)
    const clinicSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      '@id': `${window.location.origin}/#clinic`,
      name: clinicInfo.name,
      alternateName: 'Indriya Clinics - Mind & ENT Health Care',
      description: t('seoDescription'),
      url: window.location.origin,
      image: `${window.location.origin}/logo.jpg`,
      logo: `${window.location.origin}/logo.jpg`,
      telephone: clinicInfo.whatsappNumber || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          '2nd floor, Kuduva Grandeur Commercial Complex, MRPL Road, Surathkal Junction',
        addressLocality: 'Mangalore',
        addressRegion: 'Karnataka',
        postalCode: clinicInfo.postalCode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.0067,
        longitude: 74.7964,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      medicalSpecialty: ['Otolaryngologic', 'Psychiatric'],
      availableLanguage: [
        { '@type': 'Language', name: 'English', alternateName: 'en' },
        { '@type': 'Language', name: 'Kannada', alternateName: 'kn' },
        { '@type': 'Language', name: 'Hindi', alternateName: 'hi' },
      ],
      hasMap: `https://www.google.com/maps?q=${encodeURIComponent(clinicInfo.mapQuery)}&ftid=${clinicInfo.mapFtid}`,
      priceRange: '$$',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI',
    }

    upsertJsonLd('clinic-json-ld', clinicSchema)

    // Physician schema for each doctor
    const doctorSchemas = doctors.map((doctor) => ({
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: doctor.name,
      medicalSpecialty: doctor.specialty === 'ENT' ? 'Otolaryngology' : 'Psychiatry',
      qualification: doctor.qualification,
      worksFor: {
        '@type': 'MedicalClinic',
        '@id': `${window.location.origin}/#clinic`,
        name: clinicInfo.name,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mangalore',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
    }))

    upsertJsonLd('doctors-json-ld', doctorSchemas)

    // FAQ schema (helps with Google featured snippets)
    if (!isBooking) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What services does Indriya Clinics offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Indriya Clinics offers specialist ENT (Ear, Nose, Throat) services and Psychiatry services including treatment for anxiety, depression, sleep disorders, and stress management.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Indriya Clinics located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Indriya Clinics is located at 2nd floor, Kuduva Grandeur Commercial Complex, MRPL Road, Surathkal Junction, Mangalore-575014, Karnataka, India.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I book an appointment at Indriya Clinics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can book an appointment via WhatsApp through our website. Simply fill in your details and we will send a pre-filled message to the clinic for confirmation.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the clinic timings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Indriya Clinics is open Monday to Saturday, 9:00 AM to 8:00 PM. The clinic is closed on Sundays.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which doctors are available at Indriya Clinics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Dr Jaswin Dsouza (MD, ENT Specialist) and Dr Vinitha Percilla Dsouza (MD, Psychiatrist) are available at Indriya Clinics.',
            },
          },
        ],
      }

      upsertJsonLd('faq-json-ld', faqSchema)
    }

    // Breadcrumb schema for booking page
    if (isBooking) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Book Appointment',
            item: `${window.location.origin}/book`,
          },
        ],
      }

      upsertJsonLd('breadcrumb-json-ld', breadcrumbSchema)
    }
  }, [i18n.language, t, page])

  return null
}

export default Seo
