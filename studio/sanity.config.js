import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import BlogPostPreview from './components/BlogPostPreview'

// Production site URL for "Open preview" button
const PREVIEW_URL = 'https://www.indriyaclinic.com'

export default defineConfig({
  name: 'indriya-clinics',
  title: 'Indriya Clinics Blog',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '6za6g18l',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .schemaType('post')
              .child(
                S.documentTypeList('post')
                  .title('Blog Posts')
                  .child((documentId) =>
                    S.document()
                      .documentId(documentId)
                      .schemaType('post')
                      .views([
                        S.view.form(),
                        S.view.component(BlogPostPreview).title('Preview'),
                      ]),
                  ),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Add "Open preview" action to blog posts
    productionUrl: async (prev, context) => {
      const { document } = context
      if (document._type === 'post' && document.slug?.current) {
        return `${PREVIEW_URL}/blog/${document.slug.current}`
      }
      return prev
    },
  },
})
