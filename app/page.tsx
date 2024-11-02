import { HomePage } from '@/components/home'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'
import { getCachedContent } from '@/lib/content'

export const metadata: Metadata = generateMeta({
	title: 'Home',
})

export default function Home() {
	// Get the about page content
	const aboutContent = getCachedContent('pages').find(
		(page) => page.slug === 'about',
	)

	if (!aboutContent) {
		return <div>About content not found</div>
	}

	return <HomePage aboutContent={aboutContent?.content} />
}
