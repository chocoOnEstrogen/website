import { notFound } from 'next/navigation'
import { getContent, sortContentByDate } from '@/lib/content'
import { generateMeta } from '@/lib/generateMeta'
import { GuideLayout } from '@/components/guide-layout'
import markdownStyles from '@/app/styles/markdown.module.css'

interface Props {
	params: {
		slug: string
	}
}

export function generateMetadata({ params }: Props) {
	const guides = getContent('guides')
	const guide = guides.find((g) => g.slug === params.slug)

	if (!guide) return generateMeta({ title: 'Guide Not Found', path: '/guides' })

	return generateMeta({
		title: guide.metadata.title,
		description: guide.metadata.description,
		path: `/guides/${params.slug}`,
	})
}

export default function GuidePage({ params }: Props) {
	const guides = sortContentByDate(getContent('guides'))
	const currentGuide = guides.find((guide) => guide.slug === params.slug)

	if (!currentGuide) return notFound()

	return (
		<GuideLayout guides={guides} currentGuide={currentGuide}>
			<div
				className={markdownStyles.markdown}
				dangerouslySetInnerHTML={{ __html: currentGuide.content }}
			/>
		</GuideLayout>
	)
}
