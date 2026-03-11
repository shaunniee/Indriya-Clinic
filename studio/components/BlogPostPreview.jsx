import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { PortableText } from '@portabletext/react'

/*
 * Matches the actual website styles from index.css + styles.css
 * Uses the same CSS variables, fonts, and layout as BlogPostPage.jsx
 */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .preview-root {
    --blue: #0F6F9A;
    --blue-dark: #0A526F;
    --blue-light: #E6F3F9;
    --text-primary: #182C3E;
    --text-secondary: #3D5A72;
    --text-muted: #6E8FA8;
    --bg-secondary: #F5F9FC;
    --border-light: #D6E3ED;

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    color: var(--text-secondary);
    line-height: 1.7;
    background: #fff;
  }

  .preview-root .blog-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }
  .preview-root .blog-breadcrumb a {
    color: var(--blue);
    text-decoration: none;
  }

  .preview-root .blog-post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }
  .preview-root .blog-post-author {
    font-weight: 600;
    color: var(--text-secondary);
  }

  .preview-root .blog-post-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.25;
    margin: 0 0 0.75rem;
  }

  .preview-root .blog-post-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  .preview-root .service-tag {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--blue);
    background: var(--blue-light);
  }

  .preview-root .blog-post-cover {
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  .preview-root .blog-post-cover img {
    width: 100%;
    height: auto;
    display: block;
  }

  .preview-root .blog-post-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--text-secondary);
  }
  .preview-root .blog-post-body h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 2rem 0 0.75rem;
  }
  .preview-root .blog-post-body h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 1.5rem 0 0.5rem;
  }
  .preview-root .blog-post-body p {
    margin-bottom: 1.25rem;
  }
  .preview-root .blog-post-body ul,
  .preview-root .blog-post-body ol {
    margin: 0.75rem 0 1.25rem 1.5rem;
  }
  .preview-root .blog-post-body li {
    margin-bottom: 0.4rem;
  }
  .preview-root .blog-post-body a {
    color: var(--blue);
    text-decoration: underline;
  }
  .preview-root .blog-post-body img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
  }
  .preview-root .blog-post-body blockquote {
    border-left: 4px solid var(--blue);
    padding: 0.75rem 1.25rem;
    margin: 1.5rem 0;
    background: var(--bg-secondary);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: var(--text-secondary);
  }
  .preview-root .blog-post-body figure {
    margin: 1.5rem 0;
  }
  .preview-root .blog-post-body figcaption {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-align: center;
    margin-top: 0.5rem;
  }

  .preview-root .status-badge {
    display: inline-block;
    padding: 0.15rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  .preview-root .status-badge.published {
    background: #E8F5ED;
    color: #2D8A4E;
  }
  .preview-root .status-badge.draft {
    background: #FDF3E3;
    color: #D4820E;
  }

  .preview-root .empty-state {
    text-align: center;
    padding: 5rem 1.5rem;
    color: var(--text-muted);
    font-size: 1rem;
  }
`

// Portable Text components matching the website's HTML output
const ptComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const ref = value.asset._ref
      const [, id, dimensions, format] = ref.split('-')
      const url = `https://cdn.sanity.io/images/6za6g18l/production/${id}-${dimensions}.${format}`
      return (
        <figure>
          <img src={url} alt={value.alt || ''} />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
  },
}

export default function BlogPostPreview(props) {
  const { document } = props
  const doc = document?.displayed

  const [coverUrl, setCoverUrl] = useState(null)

  useEffect(() => {
    if (doc?.coverImage?.asset?._ref) {
      const ref = doc.coverImage.asset._ref
      const [, id, dimensions, format] = ref.split('-')
      setCoverUrl(`https://cdn.sanity.io/images/6za6g18l/production/${id}-${dimensions}.${format}`)
    } else {
      setCoverUrl(null)
    }
  }, [doc?.coverImage?.asset?._ref])

  if (!doc) {
    return (
      <>
        <style>{CSS}</style>
        <div className="preview-root">
          <div className="empty-state">Select a blog post to preview</div>
        </div>
      </>
    )
  }

  const isDraft = !doc.publishedAt
  const date = doc.publishedAt
    ? new Date(doc.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      <style>{CSS}</style>
      <div className="preview-root">
        {/* Breadcrumb */}
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="#">Home</a>
          <span aria-hidden="true">/</span>
          <a href="#">Blog</a>
          <span aria-hidden="true">/</span>
          <span>{doc.title || 'Untitled'}</span>
        </nav>

        {/* Status badge (studio-only, not on real site) */}
        <span className={`status-badge ${isDraft ? 'draft' : 'published'}`}>
          {isDraft ? 'Draft' : 'Published'}
        </span>

        {/* Header — matches .blog-post-header */}
        <header className="blog-post-header">
          <div className="blog-post-meta">
            {date && <time dateTime={doc.publishedAt}>{date}</time>}
            {!date && <span>Not published yet</span>}
            {doc.author && <span className="blog-post-author">{doc.author}</span>}
          </div>
          <h1>{doc.title || 'Untitled Post'}</h1>
          {doc.tags?.length > 0 && (
            <div className="blog-post-tags">
              {doc.tags.map((tag) => (
                <span key={tag} className="service-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Cover image — matches .blog-post-cover */}
        {coverUrl && (
          <div className="blog-post-cover">
            <img src={coverUrl} alt={doc.title} />
          </div>
        )}

        {/* Body — matches .blog-post-body */}
        {doc.body?.length > 0 ? (
          <div className="blog-post-body">
            <PortableText value={doc.body} components={ptComponents} />
          </div>
        ) : (
          <p style={{ color: '#6E8FA8', fontStyle: 'italic' }}>
            Start writing to see the preview...
          </p>
        )}
      </div>
    </>
  )
}
