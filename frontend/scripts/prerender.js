/**
 * Post-build pre-rendering script.
 * Visits each route with Puppeteer and saves the fully-rendered HTML.
 * This gives search engines real content even for an SPA.
 *
 * Usage: node scripts/prerender.js
 */
import puppeteer from 'puppeteer'
import { createServer } from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '../dist')
const PROD_ORIGIN = 'https://www.indriyaclinic.com'

// Static routes to pre-render
const STATIC_ROUTES = [
  '/',
  '/services',
  '/doctors',
  '/doctors/dr-jaswin-dsouza',
  '/doctors/dr-vinitha-dsouza',
  '/book',
  '/blog',
  '/privacy',
]

// Read blog slugs from posts.json built earlier
function getBlogRoutes() {
  const postsPath = path.join(__dirname, '../src/blog/posts.json')
  try {
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'))
    return posts.filter((p) => p.status === 'published').map((p) => `/blog/${p.slug}`)
  } catch {
    return []
  }
}

// Simple static file server for the dist folder
function startServer(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url)

      // SPA fallback — serve index.html for HTML routes
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html')
      }

      const ext = path.extname(filePath)
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.woff2': 'font/woff2',
      }

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
      fs.createReadStream(filePath).pipe(res)
    })

    server.listen(port, () => resolve(server))
  })
}

async function prerender() {
  const port = 4173
  const server = await startServer(port)
  console.log(`Pre-render server running on http://localhost:${port}`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const blogRoutes = getBlogRoutes()
  const allRoutes = [...STATIC_ROUTES, ...blogRoutes]
  console.log(`Pre-rendering ${allRoutes.length} routes...`)

  for (const route of allRoutes) {
    const page = await browser.newPage()
    const url = `http://localhost:${port}${route}`

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

      // Wait a bit for React to finish rendering
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)))

      let html = await page.content()

      // Remove any Vite HMR / dev scripts if present
      html = html.replace(/<script[^>]*type="module"[^>]*src="\/@vite[^"]*"[^>]*><\/script>/g, '')

      // Replace local dev URLs with production origin (both raw and URL-encoded)
      html = html.replaceAll(`http://localhost:${port}`, PROD_ORIGIN)
      html = html.replaceAll(encodeURIComponent(`http://localhost:${port}`), encodeURIComponent(PROD_ORIGIN))

      // Strip js-ready class so pre-rendered content stays visible
      // (the inline script will re-add it when JS loads in the browser)
      html = html.replace(/<html([^>]*) class="js-ready"/, '<html$1')

      // Strip 'visible' from fade-up elements so scroll-reveal works fresh after hydration
      html = html.replaceAll('fade-up visible', 'fade-up')

      // Write the HTML to the correct path
      const outDir = route === '/' ? distDir : path.join(distDir, route)
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }

      const outFile = path.join(outDir, 'index.html')
      fs.writeFileSync(outFile, html)
      console.log(`  ✓ ${route} → ${path.relative(distDir, outFile)}`)
    } catch (err) {
      console.error(`  ✗ ${route} — ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()
  console.log(`\n✓ Pre-rendered ${allRoutes.length} pages`)
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err)
  process.exit(1)
})
