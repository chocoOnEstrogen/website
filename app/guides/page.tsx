import { getContent, sortContentByDate } from '@/lib/content'
import { generateMeta } from '@/lib/generateMeta'
import { GuideLayout } from '@/components/guide-layout'
import { Link } from 'nextjs13-progress'


export function generateMetadata() {
  return generateMeta({
    title: 'Guides',
    path: '/guides',
  })
}

export default function GuidesPage() {
  const guides = sortContentByDate(getContent('guides'))

  return (
    <GuideLayout guides={guides}>
      <div className="prose prose-invert">
        <h1>Guides</h1>
        <p>Welcome to the guides section. Choose a guide from the sidebar to get started.</p>
        
        {/* Optional: Featured guides or categories */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.filter(guide => guide.metadata.featured).map(guide => (
            <div
              key={guide.slug}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-purple-500/50"
            >
              <h3 className="mb-2 text-xl font-semibold">
                <Link href={`/guides/${guide.slug}`} className="text-purple-400 hover:text-purple-300">
                  {guide.metadata.title}
                </Link>
              </h3>
              {guide.metadata.description && (
                <p className="text-sm text-gray-400">{guide.metadata.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </GuideLayout>
  )
} 