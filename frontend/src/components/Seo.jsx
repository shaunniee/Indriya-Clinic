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

function upsertHreflang(lang, href) {
  const selector = `link[rel="alternate"][hreflang="${lang}"]`
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'alternate')
    element.setAttribute('hreflang', lang)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function Seo({ page = 'home', doctorSeoTitleKey, doctorSeoDescKey, blogPost }) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const isBooking = page === 'booking'
    const isServices = page === 'services'
    const isDoctors = page === 'doctors'
    const isDoctorDetail = page.startsWith('doctor-')
    const isPrivacy = page === 'privacy'
    const isNotFound = page === 'notfound'
    const isBlog = page === 'blog'
    const isBlogPost = page === 'blog-post'

    // Clean up article meta tags from previous blog post pages
    document.head.querySelectorAll('meta[property^=\"article:\"]').forEach((el) => el.remove())
    // Clean up page-specific JSON-LD from previous pages
    ;['faq-json-ld', 'breadcrumb-json-ld', 'services-page-json-ld', 'blog-article-json-ld'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) el.remove()
    })
    // Page-specific titles & descriptions
    let title, description, keywords
    if (isNotFound) {
      title = '404 — Page Not Found | ' + clinicInfo.name
      description = 'The page you are looking for does not exist.'
      keywords = clinicInfo.name
    } else if (isBooking) {
      title = `${t('bookingTitle')} | ${clinicInfo.name}, Mangalore`
      description = `Book an ENT or Psychiatry appointment at ${clinicInfo.name}, Surathkal, Mangalore. In-person & online consultations available. Quick WhatsApp booking — no waiting on hold.`
      keywords = `book appointment Mangalore, ENT appointment Surathkal, psychiatry appointment Mangalore, WhatsApp doctor booking, ${t('seoKeywords')}`
    } else if (isServices) {
      title = t('seoServicesTitle')
      description = t('seoServicesDescription')
      keywords = `${t('seoServicesKeywords')}, ${t('seoKeywords')}`
    } else if (isDoctors) {
      title = t('seoDoctorsTitle')
      description = t('seoDoctorsDescription')
      keywords = `${t('seoDoctorsKeywords')}, ${t('seoKeywords')}`
    } else if (isDoctorDetail && doctorSeoTitleKey) {
      title = t(doctorSeoTitleKey)
      description = t(doctorSeoDescKey)
      keywords = `${t('seoDoctorsKeywords')}, ${t('seoKeywords')}`
    } else if (isPrivacy) {
      title = `${t('privacyTitle')} | ${clinicInfo.name}`
      description = `Privacy Policy for ${clinicInfo.name} — how we handle your personal information when using our WhatsApp booking service.`
      keywords = `privacy policy, ${clinicInfo.name}, data protection`
    } else if (isBlog) {
      title = t('seoBlogTitle')
      description = t('seoBlogDescription')
      keywords = `${t('seoBlogKeywords')}, ${t('seoKeywords')}`
    } else if (isBlogPost && blogPost) {
      title = `${blogPost.title} | ${clinicInfo.name}`
      description = blogPost.excerpt || blogPost.title
      keywords = `${(blogPost.tags || []).join(', ')}, ${t('seoKeywords')}`
    } else {
      title = t('seoTitle')
      description = t('seoDescription')
      keywords = t('seoKeywords')
    }

    document.title = title
    document.documentElement.lang = i18n.language

    // Canonical URL — strip query strings and hash fragments
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`

    // Standard meta
    upsertMeta('description', description)
    upsertMeta('keywords', keywords)
    upsertMeta('robots', isNotFound ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('author', clinicInfo.name)

    // OG locale — must be language_TERRITORY format
    const ogLocaleMap = { en: 'en_IN', kn: 'kn_IN', hi: 'hi_IN' }
    const ogLocale = ogLocaleMap[i18n.language] || 'en_IN'

    // Geo meta for local SEO
    upsertMeta('geo.region', 'IN-KA')
    upsertMeta('geo.placename', 'Surathkal, Mangalore')
    upsertMeta('geo.position', '13.0067;74.7935')
    upsertMeta('ICBM', '13.0067, 74.7935')

    // Open Graph
    const ogType = isBlogPost ? 'article' : 'website'
    const ogImage = (isBlogPost && blogPost?.coverImage) ? blogPost.coverImage : `${window.location.origin}/logo.jpg`
    const ogImageW = (isBlogPost && blogPost?.coverImage) ? '1200' : '512'
    const ogImageH = (isBlogPost && blogPost?.coverImage) ? '630' : '512'
    const ogImageAlt = (isBlogPost && blogPost) ? blogPost.title : `${clinicInfo.name} logo — Mind & ENT Health Care, Mangalore`

    upsertMeta('og:title', title, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:type', ogType, 'property')
    upsertMeta('og:locale', ogLocale, 'property')
    upsertMeta('og:site_name', clinicInfo.name, 'property')
    upsertMeta('og:url', canonicalUrl, 'property')
    upsertMeta('og:image', ogImage, 'property')
    upsertMeta('og:image:width', ogImageW, 'property')
    upsertMeta('og:image:height', ogImageH, 'property')
    upsertMeta('og:image:alt', ogImageAlt, 'property')

    // OG article tags for blog posts
    if (isBlogPost && blogPost) {
      upsertMeta('article:published_time', blogPost.publishedAt, 'property')
      if (blogPost.updatedAt) upsertMeta('article:modified_time', blogPost.updatedAt, 'property')
      upsertMeta('article:section', blogPost.category || 'Health', 'property')
      upsertMeta('article:author', blogPost.author || clinicInfo.name, 'property')
      ;(blogPost.tags || []).forEach((tag) => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'article:tag')
        el.setAttribute('content', tag)
        document.head.appendChild(el)
      })
    }

    // og:locale:alternate — declare non-active locales
    document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => el.remove())
    Object.entries(ogLocaleMap)
      .filter(([lang]) => lang !== i18n.language)
      .forEach(([, locale]) => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:locale:alternate')
        el.setAttribute('content', locale)
        document.head.appendChild(el)
      })

    // Twitter
    upsertMeta('twitter:card', (isBlogPost && blogPost?.coverImage) ? 'summary_large_image' : 'summary', 'name')
    upsertMeta('twitter:title', title, 'name')
    upsertMeta('twitter:description', description, 'name')
    upsertMeta('twitter:image', ogImage, 'name')
    upsertMeta('twitter:image:alt', ogImageAlt, 'name')

    // Canonical
    upsertLink('canonical', canonicalUrl)

    // Hreflang — since language is client-side state (not URL-path based),
    // only set x-default to indicate this URL serves all languages.
    // Remove any stale per-language hreflang tags from previous renders.
    ;['en', 'kn', 'hi'].forEach((lang) => {
      const stale = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)
      if (stale) stale.remove()
    })
    upsertHreflang('x-default', canonicalUrl)

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
        addressLocality: 'Surathkal, Mangalore',
        addressRegion: 'Karnataka',
        postalCode: clinicInfo.postalCode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.0067,
        longitude: 74.7935,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '17:00',
          closes: '20:00',
        },
      ],
      virtualLocation: {
        '@type': 'VirtualLocation',
        name: 'Online Consultation via WhatsApp',
        url: `${window.location.origin}/book`,
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceType: 'Online Consultation',
        serviceUrl: `${window.location.origin}/book`,
        availableLanguage: ['English', 'Kannada', 'Hindi'],
      },
      medicalSpecialty: ['Otolaryngologic', 'Psychiatric'],
      availableLanguage: [
        { '@type': 'Language', name: 'English', alternateName: 'en' },
        { '@type': 'Language', name: 'Kannada', alternateName: 'kn' },
        { '@type': 'Language', name: 'Hindi', alternateName: 'hi' },
      ],
      hasMap: clinicInfo.mapUrl,
      priceRange: '$$',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI',
      contactPoint: clinicInfo.whatsappNumber ? [
        {
          '@type': 'ContactPoint',
          telephone: clinicInfo.whatsappNumber,
          contactType: 'appointment',
          availableLanguage: ['English', 'Kannada', 'Hindi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: clinicInfo.whatsappNumber,
          contactType: 'customer service',
          availableLanguage: ['English', 'Kannada', 'Hindi'],
          description: 'Online consultation and appointment booking via WhatsApp',
        },
      ] : undefined,
      areaServed: [
        { '@type': 'City', name: 'Mangalore' },
        { '@type': 'City', name: 'Surathkal' },
        { '@type': 'City', name: 'Mukka' },
        { '@type': 'City', name: 'Panambur' },
        { '@type': 'City', name: 'Katipalla' },
        { '@type': 'City', name: 'Bajpe' },
        { '@type': 'City', name: 'Mulki' },
        { '@type': 'City', name: 'Haleangady' },
        { '@type': 'City', name: 'Udupi' },
        { '@type': 'AdministrativeArea', name: 'Dakshina Kannada' },
        { '@type': 'AdministrativeArea', name: 'Karnataka' },
      ],
      availableService: [
        { '@type': 'MedicalTherapy', name: 'ENT (Ear, Nose, Throat) Specialist Care' },
        { '@type': 'MedicalTherapy', name: 'Psychiatry & Mental Health Care' },
        { '@type': 'MedicalTherapy', name: 'Anxiety & Depression Treatment' },
        { '@type': 'MedicalTherapy', name: 'Sleep Disorder Management' },
        { '@type': 'MedicalTherapy', name: 'Hearing Loss & Tinnitus Treatment' },
        { '@type': 'MedicalTherapy', name: 'Stress Management' },
        { '@type': 'MedicalTherapy', name: 'Online Consultation via WhatsApp' },
      ],
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${window.location.origin}/book`,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Reservation',
          name: 'Book Appointment',
        },
      },
      sameAs: [
        clinicInfo.mapUrl,
        'https://share.google/xxuO7R9rjpYwxlmQ',
        'https://www.instagram.com/drjaswin_dsouza',
        'https://www.instagram.com/clinincstocontinents',
      ],
    }

    upsertJsonLd('clinic-json-ld', clinicSchema)

    // WebSite schema — helps Google show sitelinks search box
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${window.location.origin}/#website`,
      name: clinicInfo.name,
      alternateName: 'Indriya Clinics - Mind & ENT Health Care',
      url: window.location.origin,
      publisher: {
        '@type': 'Organization',
        '@id': `${window.location.origin}/#organization`,
      },
      inLanguage: ['en', 'kn', 'hi'],
    }
    upsertJsonLd('website-json-ld', websiteSchema)

    // Organization schema — for brand knowledge panel
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${window.location.origin}/#organization`,
      name: clinicInfo.name,
      url: window.location.origin,
      logo: `${window.location.origin}/logo.jpg`,
      image: `${window.location.origin}/logo.jpg`,
      telephone: clinicInfo.whatsappNumber || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2nd floor, Kuduva Grandeur Commercial Complex, MRPL Road, Surathkal Junction',
        addressLocality: 'Mangalore',
        addressRegion: 'Karnataka',
        postalCode: clinicInfo.postalCode,
        addressCountry: 'IN',
      },
      sameAs: [
        clinicInfo.mapUrl,
        'https://share.google/xxuO7R9rjpYwxlmQ',
        'https://www.instagram.com/drjaswin_dsouza',
        'https://www.instagram.com/clinincstocontinents',
      ],
    }
    upsertJsonLd('organization-json-ld', organizationSchema)

    // Physician schema for each doctor
    const doctorSchemas = doctors.map((doctor) => ({
      '@context': 'https://schema.org',
      '@type': 'Physician',
      '@id': `${window.location.origin}/doctors/${doctor.slug}#physician`,
      url: `${window.location.origin}/doctors/${doctor.slug}`,
      name: doctor.name,
      description: doctor.specialtyFull,
      image: `${window.location.origin}/logo.jpg`,
      medicalSpecialty: doctor.specialty === 'ENT' ? 'Otolaryngologic' : 'Psychiatric',
      qualification: doctor.qualification,
      isAcceptingNewPatients: true,
      knowsLanguage: doctor.languages.map((lang) => ({ '@type': 'Language', name: lang })),
      worksFor: {
        '@type': 'MedicalClinic',
        '@id': `${window.location.origin}/#clinic`,
        name: clinicInfo.name,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2nd floor, Kuduva Grandeur Commercial Complex, MRPL Road, Surathkal Junction',
        addressLocality: 'Surathkal, Mangalore',
        addressRegion: 'Karnataka',
        postalCode: clinicInfo.postalCode,
        addressCountry: 'IN',
      },
      availableService: [
        { '@type': 'MedicalTherapy', name: 'In-Person Consultation' },
        { '@type': 'MedicalTherapy', name: 'Online Consultation via WhatsApp' },
      ],
    }))

    upsertJsonLd('doctors-json-ld', doctorSchemas)

    // FAQ schema (helps with Google featured snippets) — only on home page
    if (page === 'home') {
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
              text: 'Indriya Clinics is open Monday to Saturday, 5:00 PM to 8:00 PM. The clinic is closed on Sundays. Online consultation is also available via WhatsApp.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which doctors are available at Indriya Clinics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Dr Jaswin D'Souza (MBBS, MS ENT, ENT Specialist & Head and Neck Surgeon) and Dr Vinitha D'Souza (MBBS, MD Psychiatry, Consultant Psychiatrist & Sexologist) are available at Indriya Clinics.",
            },
          },
          {
            '@type': 'Question',
            name: 'What is the cost of ENT consultation in Mangalore at Indriya Clinics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Indriya Clinics offers affordable ENT consultations in Mangalore. Payments are accepted in Cash and UPI. Contact us via WhatsApp for current consultation fees.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Indriya Clinics treat anxiety and depression?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes. Dr Vinitha D'Souza (MBBS, MD Psychiatry, Consultant Psychiatrist & Sexologist) at Indriya Clinics provides treatment for anxiety, depression, OCD, addiction, sexual health concerns, women's mental health, and other psychiatric conditions.",
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need a referral to see the psychiatrist at Indriya Clinics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No referral is needed. You can directly book a psychiatry appointment at Indriya Clinics via WhatsApp through our website.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Indriya Clinics open on weekends?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Indriya Clinics is open Monday to Saturday, 5:00 PM to 8:00 PM. The clinic is closed on Sundays. Online consultation is also available via WhatsApp.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer online consultations?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Indriya Clinics offers online consultations via WhatsApp for follow-ups and initial assessments. Contact us through the booking form to arrange a virtual appointment.',
            },
          },
          {
            '@type': 'Question',
            name: 'What ENT conditions do you treat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We treat a wide range of ENT conditions including sinusitis, hearing loss, vertigo, tonsillitis, adenoid problems, nasal allergies, ear infections, voice disorders, snoring, sleep apnea, and head & neck conditions.',
            },
          },
          {
            '@type': 'Question',
            name: 'What mental health conditions do you treat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We provide treatment for depression, anxiety, panic attacks, OCD, bipolar disorder, sleep disorders, addiction, sexual health concerns, ADHD, autism spectrum disorders, and other psychiatric conditions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is the consultation confidential?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. All consultations at Indriya Clinics — whether in-person or online — are completely confidential. We maintain strict patient privacy in accordance with medical ethics and Indian data protection laws.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need a referral to visit the clinic?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No referral is needed. You can directly book an appointment with any of our specialists via WhatsApp or by visiting the clinic during working hours.',
            },
          },
        ],
      }

      upsertJsonLd('faq-json-ld', faqSchema)
    }

    // Breadcrumb schema — booking, services, doctors, blog pages
    if (isBooking || isServices || isDoctors || isDoctorDetail || isBlog || isBlogPost) {
      let crumbLabel, crumbUrl
      if (isBooking) { crumbLabel = 'Book Appointment'; crumbUrl = `${window.location.origin}/book` }
      else if (isServices) { crumbLabel = 'Services'; crumbUrl = `${window.location.origin}/services` }
      else if (isDoctors) { crumbLabel = 'Doctors'; crumbUrl = `${window.location.origin}/doctors` }
      else if (isBlog) { crumbLabel = 'Blog'; crumbUrl = `${window.location.origin}/blog` }
      else if (isBlogPost) { crumbLabel = 'Blog'; crumbUrl = `${window.location.origin}/blog` }
      else { crumbLabel = title; crumbUrl = `${window.location.origin}${window.location.pathname}` }

      const items = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: (isDoctorDetail || isBlogPost) ? crumbLabel : crumbLabel, item: (isDoctorDetail) ? `${window.location.origin}/doctors` : crumbUrl },
      ]
      if (isDoctorDetail) {
        items.push({ '@type': 'ListItem', position: 3, name: title, item: `${window.location.origin}${window.location.pathname}` })
      }
      if (isBlogPost && blogPost) {
        items.push({ '@type': 'ListItem', position: 3, name: blogPost.title, item: `${window.location.origin}/blog/${blogPost.slug}` })
      }
      upsertJsonLd('breadcrumb-json-ld', { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
    }

    // MedicalWebPage schema for services page
    if (isServices) {
      const servicePageSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        name: t('seoServicesTitle'),
        description: t('seoServicesDescription'),
        url: `${window.location.origin}/services`,
        about: [
          { '@type': 'MedicalSpecialty', name: 'Otolaryngologic' },
          { '@type': 'MedicalSpecialty', name: 'Psychiatric' },
        ],
        mainContentOfPage: {
          '@type': 'WebPageElement',
          cssSelector: 'main',
        },
      }
      upsertJsonLd('services-page-json-ld', servicePageSchema)
    }

    // Article schema for blog posts — BlogPosting with local SEO signals
    if (isBlogPost && blogPost) {
      // Resolve author: use Person schema for doctors, Organization for clinic
      const doctorMap = {
        "Dr. Jaswin D'Souza": doctors.find((d) => d.slug === 'dr-jaswin-dsouza'),
        "Dr. Vinitha D'Souza": doctors.find((d) => d.slug === 'dr-vinitha-dsouza'),
      }
      const matchedDoctor = blogPost.author ? doctorMap[blogPost.author] : null
      const authorSchema = matchedDoctor
        ? {
            '@type': 'Person',
            '@id': `${window.location.origin}/doctors/${matchedDoctor.slug}#physician`,
            name: matchedDoctor.name,
            url: `${window.location.origin}/doctors/${matchedDoctor.slug}`,
            jobTitle: matchedDoctor.specialtyFull,
            worksFor: { '@type': 'MedicalClinic', '@id': `${window.location.origin}/#clinic` },
          }
        : {
            '@type': 'Organization',
            '@id': `${window.location.origin}/#organization`,
            name: clinicInfo.name,
            url: window.location.origin,
          }

      // Map category to medical specialty
      const specialtyMap = {
        ENT: 'Otolaryngology',
        'Mental Health': 'Psychiatry',
      }

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${window.location.origin}/blog/${blogPost.slug}#article`,
        headline: blogPost.title,
        description: blogPost.excerpt || blogPost.title,
        url: `${window.location.origin}/blog/${blogPost.slug}`,
        datePublished: blogPost.publishedAt,
        dateModified: blogPost.updatedAt || blogPost.publishedAt,
        image: blogPost.coverImage || `${window.location.origin}/logo.jpg`,
        wordCount: blogPost.wordCount || undefined,
        author: authorSchema,
        publisher: {
          '@type': 'Organization',
          '@id': `${window.location.origin}/#organization`,
          name: clinicInfo.name,
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.jpg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${window.location.origin}/blog/${blogPost.slug}`,
        },
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${window.location.origin}/#website`,
        },
        keywords: (blogPost.tags || []).join(', '),
        articleSection: blogPost.category || 'Health',
        inLanguage: 'en',
        // Speakable — eligible for Google Assistant voice results
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.blog-post-header h1', '.blog-post-body'],
        },
        // Local SEO: connect article to the clinic location
        about: [
          { '@type': 'MedicalClinic', '@id': `${window.location.origin}/#clinic` },
          ...(blogPost.category && specialtyMap[blogPost.category]
            ? [{ '@type': 'MedicalSpecialty', name: specialtyMap[blogPost.category] }]
            : []),
        ],
        // Content location — signals local relevance
        contentLocation: {
          '@type': 'Place',
          name: 'Indriya Clinics, Surathkal, Mangalore',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
          },
        },
      }
      upsertJsonLd('blog-article-json-ld', articleSchema)
    }
  }, [i18n.language, t, page, doctorSeoTitleKey, doctorSeoDescKey, blogPost])

  return null
}

export default Seo
