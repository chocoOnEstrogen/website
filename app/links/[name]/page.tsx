import { LinksPage } from '@/components/links-page'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'
import { config } from '@/configs/main'
import { notFound } from 'next/navigation'

interface Props {
	params: { name: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const link = [...(config.socials || []), ...(config.links || [])].find(
		(l) => l.name.toLowerCase() === params.name.toLowerCase(),
	)
	if (!link) return notFound()

	return generateMeta({
		title: `${link.name} Link`,
		description: `Direct link to ${config.name}'s ${link.name}`,
	})
}

export default function LinkRedirect({ params }: Props) {
	const link = [...(config.socials || []), ...(config.links || [])].find(
		(l) => l.name.toLowerCase() === params.name.toLowerCase(),
	)
	if (!link) return notFound()

	return <LinksPage selectedLink={link} />
}
