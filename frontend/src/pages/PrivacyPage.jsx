import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { clinicInfo } from '../clinicData'

function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <section className="section privacy-page">
      <Seo page="privacy" />
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol className="breadcrumb-list">
            <li><Link to="/">{t('breadcrumbHome')}</Link></li>
            <li aria-current="page">{t('privacyTitle')}</li>
          </ol>
        </nav>

        <div className="privacy-content">
          <h1>{t('privacyTitle')}</h1>
          <p className="privacy-updated">{t('privacyLastUpdated')}</p>

          <h2>{t('privacyIntroTitle')}</h2>
          <p>{t('privacyIntroText', { clinicName: clinicInfo.name })}</p>

          <h2>{t('privacyDataCollectedTitle')}</h2>
          <p>{t('privacyDataCollectedIntro')}</p>
          <ul>
            <li>{t('privacyDataName')}</li>
            <li>{t('privacyDataPhone')}</li>
            <li>{t('privacyDataService')}</li>
            <li>{t('privacyDataDate')}</li>
            <li>{t('privacyDataNotes')}</li>
          </ul>

          <h2>{t('privacyHowUsedTitle')}</h2>
          <p>{t('privacyHowUsedText')}</p>

          <h2>{t('privacyThirdPartyTitle')}</h2>
          <p>{t('privacyThirdPartyText')}</p>

          <h2>{t('privacyDataStorageTitle')}</h2>
          <p>{t('privacyDataStorageText')}</p>

          <h2>{t('privacyCookiesTitle')}</h2>
          <p>{t('privacyCookiesText')}</p>

          <h2>{t('privacyRightsTitle')}</h2>
          <p>{t('privacyRightsText')}</p>

          <h2>{t('privacyChildrenTitle')}</h2>
          <p>{t('privacyChildrenText')}</p>

          <h2>{t('privacyChangesTitle')}</h2>
          <p>{t('privacyChangesText')}</p>

          <h2>{t('privacyContactTitle')}</h2>
          <p>{t('privacyContactText', { whatsappNumber: clinicInfo.whatsappNumber })}</p>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPage
