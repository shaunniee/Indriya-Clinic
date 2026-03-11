import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { WhatsAppIcon, FacebookIcon, XIcon } from '../components/Icons'
import { doctors, clinicInfo } from '../clinicData'
import posts from '../blog/posts.json'

const authorMap = {
  "Dr. Jaswin D'Souza": doctors.find((d) => d.slug === 'dr-jaswin-dsouza'),
  "Dr. Vinitha D'Souza": doctors.find((d) => d.slug === 'dr-vinitha-dsouza'),
}

function BlogPostPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const pageRef = useScrollReveal()

  const post = posts.find((p) => p.slug === slug && p.status === 'published')

  if (!post) {
    return (
      <div ref={pageRef}>
        <Seo page="notfound" />
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h1>Post Not Found</h1>
            <p>{t('notFoundText')}</p>
            <Link to="/blog" className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              &larr; {t('blogBackToList')}
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div ref={pageRef}>
      <Seo
        page="blog-post"
        blogPost={post}
      />

      <article className="section blog-article">
        <div className="container narrow">
          {/* Breadcrumb */}
          <nav className="blog-breadcrumb fade-up" aria-label="Breadcrumb">
            <Link to="/">{t('breadcrumbHome')}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog">{t('blogTitle')}</Link>
            <span aria-hidden="true">/</span>
            <span>{post.title}</span>
          </nav>

          {/* Header */}
          <header className="blog-post-header fade-up">
            <div className="blog-post-meta">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <span className="blog-post-updated">
                  Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {post.author && (
                <span className="blog-post-author">
                  {post.author}
                  {authorMap[post.author] && <>, {authorMap[post.author].qualification}</>}
                </span>
              )}
              {post.readingTime && <span className="blog-post-reading-time">{post.readingTime} min read</span>}
            </div>
            <h1>{post.title}</h1>
            <div className="blog-post-tags">
              {post.category && <span className="service-tag blog-category-tag">{post.category}</span>}
              {post.tags?.map((tag) => (
                <span key={tag} className="service-tag">{tag}</span>
              ))}
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="blog-post-cover fade-up">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          {/* Body */}
          <div
            className="blog-post-body fade-up"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          {/* Author bio card */}
          {(() => {
            const doctor = post.author ? authorMap[post.author] : null
            if (doctor) {
              return (
                <div className="blog-author-card fade-up">
                  <div className="blog-author-avatar">
                    <span>{doctor.name.split(' ').filter((_, i) => i === 0 || i === doctor.name.split(' ').length - 1).map(n => n[0]).join('')}</span>
                  </div>
                  <div className="blog-author-info">
                    <span className="blog-author-label">Written by</span>
                    <h4>
                      <Link to={`/doctors/${doctor.slug}`}>{doctor.name}</Link>
                    </h4>
                    <span className="blog-author-qualification">{doctor.qualification}</span>
                    <span className="blog-author-specialty">{doctor.specialtyFull}</span>
                    <span className="blog-author-location">{clinicInfo.name} — Surathkal, Mangalore</span>
                    <Link to={`/doctors/${doctor.slug}`} className="blog-author-profile-link">
                      View Profile &rarr;
                    </Link>
                  </div>
                </div>
              )
            }
            return (
              <div className="blog-author-card fade-up">
                <div className="blog-author-avatar blog-author-avatar-clinic">
                  <span>IC</span>
                </div>
                <div className="blog-author-info">
                  <span className="blog-author-label">Published by</span>
                  <h4>
                    <Link to="/">{clinicInfo.name}</Link>
                  </h4>
                  <span className="blog-author-specialty">Mind & ENT Health Care</span>
                  <span className="blog-author-location">Kudva Grandeur, NH 66, Surathkal, Mangalore-575014</span>
                </div>
              </div>
            )
          })()}

          {/* Share */}
          <div className="blog-share fade-up">
            <span className="blog-share-label">{t('blogShare')}:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn blog-share-whatsapp"
              aria-label="Share on WhatsApp"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn blog-share-facebook"
              aria-label="Share on Facebook"
            >
              <FacebookIcon size={16} /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn blog-share-x"
              aria-label="Share on X"
            >
              <XIcon size={14} /> X
            </a>
          </div>

          {/* CTA */}
          <div className="blog-post-cta fade-up">
            <h3>{t('ctaBannerTitle')}</h3>
            <p>{t('ctaBannerText')}</p>
            <Link to="/book" className="btn-primary btn-whatsapp">
              <WhatsAppIcon />
              {t('ctaBook')}
            </Link>
          </div>

          {/* Related Posts */}
          {(() => {
            const related = posts
              .filter((p) => p.slug !== post.slug && p.status === 'published')
              .filter((p) =>
                p.category === post.category ||
                (p.tags || []).some((tag) => (post.tags || []).includes(tag))
              )
              .slice(0, 3)
            if (related.length === 0) return null
            return (
              <div className="blog-related fade-up">
                <h3>{t('blogRelatedPosts')}</h3>
                <div className="blog-related-grid">
                  {related.map((r) => (
                    <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-related-card">
                      {r.coverImage && <img src={r.coverImage} alt={r.title} loading="lazy" />}
                      <div className="blog-related-body">
                        <span className="blog-related-meta">
                          {new Date(r.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {r.readingTime && ` · ${r.readingTime} min`}
                        </span>
                        <h4>{r.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Back link */}
          <div className="blog-post-back fade-up">
            <Link to="/blog">&larr; {t('blogBackToList')}</Link>
          </div>
        </div>
      </article>
    </div>
  )
}

export default BlogPostPage
