import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { useScrollReveal } from '../hooks/useScrollReveal'
import posts from '../blog/posts.json'

function BlogListPage() {
  const { t } = useTranslation()
  const pageRef = useScrollReveal()
  const [activeCategory, setActiveCategory] = React.useState('all')

  const published = posts
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const categories = ['all', ...new Set(published.map((p) => p.category).filter(Boolean))]
  const filtered = activeCategory === 'all' ? published : published.filter((p) => p.category === activeCategory)

  return (
    <div ref={pageRef}>
      <Seo page="blog" />

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <h2>{t('blogTitle')}</h2>
            <p>{t('blogSubtitle')}</p>
            <div className="section-divider" />
          </div>

          {published.length > 0 && categories.length > 2 && (
            <div className="blog-categories fade-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`blog-category-btn${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? t('blogCategoryAll') : cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="blog-empty fade-up">{t('blogEmpty')}</p>
          ) : (
            <div className="blog-grid fade-up">
              {filtered.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                  {post.coverImage && (
                    <div className="blog-card-image">
                      <img src={post.coverImage} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.tags?.length > 0 && (
                        <span className="blog-card-tag">{post.tags[0]}</span>
                      )}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-cta">{t('blogReadMore')} &rarr;</span>
                      {post.readingTime && <span className="blog-card-time">{post.readingTime} min</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogListPage
