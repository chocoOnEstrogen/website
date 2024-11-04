import { BlogList } from '@/components/blog-list'
import { generateMeta } from '@/lib/generateMeta'
import { getContent, sortContentByDate } from '@/lib/content'
import { headers } from 'next/headers'

export function generateMetadata() {
	return generateMeta({
		title: 'Blog',
		path: '/blog',
	})
}

export default function BlogPage() {
	const allPosts = sortContentByDate(getContent('blog'))
	const locale = headers().get('accept-language')?.split(',')[0] || 'en-US'

	return <BlogList posts={allPosts} locale={locale} />
}
