import { createClient } from '@sanity/client'
import { toHTML } from '@portabletext/to-html'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectId = process.env.SANITY_PROJECT_ID || '6za6g18l'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_AUTH_TOKEN || undefined

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-11',
  useCdn: !token,
  ...(token ? { token } : {}),
})

console.log(`Fetching blog posts from Sanity (project: ${projectId}, dataset: ${dataset})...`)

const posts = await client.fetch(`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    body,
    author,
    category,
    tags,
    publishedAt,
    "updatedAt": _updatedAt,
    "coverImage": coverImage.asset->url,
    "status": select(defined(publishedAt) => "published", "draft")
  }
`)

// Calculate reading time from Portable Text blocks
function calcReadingTime(body) {
  if (!body) return 1
  const text = body
    .filter((b) => b._type === 'block')
    .map((b) => b.children?.map((c) => c.text).join(' ') || '')
    .join(' ')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// Convert Portable Text body to HTML for each post
const postsWithHtml = posts.map((post) => ({
  ...post,
  bodyHtml: post.body ? toHTML(post.body) : '',
  wordCount: post.body ? post.body.filter((b) => b._type === 'block').map((b) => b.children?.map((c) => c.text).join(' ') || '').join(' ').trim().split(/\s+/).length : 0,
  readingTime: calcReadingTime(post.body),
  body: undefined, // Remove raw Portable Text from JSON to save bundle size
}))

const outPath = path.join(__dirname, '../src/blog/posts.json')
fs.writeFileSync(outPath, JSON.stringify(postsWithHtml, null, 2))
console.log(`✓ Fetched ${postsWithHtml.length} posts → src/blog/posts.json`)

// Auto-update sitemap with blog URLs
const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf-8')

  // Remove old blog entries
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/www\.indriyaclinic\.com\/blog[^]*?<\/url>/g, '')

  // Build new blog entries
  const today = new Date().toISOString().split('T')[0]
  let blogEntries = ''

  // Blog listing page
  blogEntries += `
  <url>
    <loc>https://www.indriyaclinic.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.indriyaclinic.com/blog" />
  </url>`

  // Individual posts
  for (const post of postsWithHtml) {
    const postDate = post.publishedAt ? post.publishedAt.split('T')[0] : today
    blogEntries += `
  <url>
    <loc>https://www.indriyaclinic.com/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.indriyaclinic.com/blog/${post.slug}" />
  </url>`
  }

  // Insert before closing </urlset>
  sitemap = sitemap.replace('</urlset>', `${blogEntries}\n</urlset>`)
  fs.writeFileSync(sitemapPath, sitemap)
  console.log(`✓ Sitemap updated with ${postsWithHtml.length + 1} blog URLs`)
}
