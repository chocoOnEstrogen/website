import { LinksPage } from '@/components/links-page'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
	title: 'Links',
})

export default function Links() {
	return <LinksPage />
}
