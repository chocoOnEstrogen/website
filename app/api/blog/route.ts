import { NextResponse } from 'next/server'
import { getContent, sortContentByDate } from '@/lib/content'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const year = searchParams.get('year')
	const month = searchParams.get('month')
	const day = searchParams.get('day')
	const slug = searchParams.get('slug')

	try {
		const posts = sortContentByDate(getContent('blog'))

		if (slug) {
			const post = posts.find((post) => post.slug === slug)
			if (!post)
				return NextResponse.json({ error: 'Post not found' }, { status: 404 })
			return NextResponse.json(post)
		}

		const filteredPosts = posts.filter((post) => {
			const date = new Date(post.metadata.date)

			if (year && date.getFullYear() !== parseInt(year)) return false
			if (month && date.getMonth() + 1 !== parseInt(month)) return false
			if (day && date.getDate() !== parseInt(day)) return false

			return true
		})

		return NextResponse.json(filteredPosts)
	} catch (error) {
		console.error('Error fetching blog posts:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch blog posts' },
			{ status: 500 },
		)
	}
}
