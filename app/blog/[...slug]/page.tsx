import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/blog-post'
import { BlogList } from '@/components/blog-list'
import { generateMeta } from '@/lib/generateMeta'
import { getContent, sortContentByDate } from '@/lib/content'
import { headers } from 'next/headers'

interface Props {
	params: {
		slug: string[]
	}
}

export function generateMetadata({ params }: Props) {
	const { slug } = params

	if (slug.length === 3) {
		const [year, month, day] = slug
		return generateMeta({
			title: `Blog Posts from ${month}/${day}/${year}`,
			path: `/blog/${year}/${month}/${day}`,
		})
	} else if (slug.length === 2) {
		const [year, month] = slug
		return generateMeta({
			title: `Blog Posts from ${month}/${year}`,
			path: `/blog/${year}/${month}`,
		})
	} else if (slug.length === 1) {
		const [year] = slug
		return generateMeta({
			title: `Blog Posts from ${year}`,
			path: `/blog/${year}`,
		})
	}

	return generateMeta({
		title: 'Blog',
		path: '/blog',
	})
}

export default function BlogPage({ params }: Props) {
	const { slug } = params
	const allPosts = sortContentByDate(getContent('blog'))
	const locale = headers().get('accept-language')?.split(',')[0] || 'en-US'

	//   Check if there is no first slug
	if (slug.length === 0) {
		return <BlogList posts={allPosts} locale={locale} />
	}

	try {
		if (slug.length === 4) {
			// Single post page
			const [year, month, day, postSlug] = slug
			const post = allPosts.find((post) => {
				const date = new Date(post.metadata.date)
				return (
					date.getFullYear() === parseInt(year) &&
					date.getMonth() + 1 === parseInt(month) &&
					date.getDate() === parseInt(day) &&
					post.slug === postSlug
				)
			})

			if (!post) return notFound()
			return <BlogPost post={post} locale={locale} allPosts={allPosts} />
		}

		// Filter posts by date components
		const filteredPosts = allPosts.filter((post) => {
			const date = new Date(post.metadata.date)
			const [year, month, day] = slug

			if (slug.length === 3) {
				return (
					date.getFullYear() === parseInt(year) &&
					date.getMonth() + 1 === parseInt(month) &&
					date.getDate() === parseInt(day)
				)
			} else if (slug.length === 2) {
				return (
					date.getFullYear() === parseInt(year) &&
					date.getMonth() + 1 === parseInt(month)
				)
			} else if (slug.length === 1) {
				return date.getFullYear() === parseInt(year)
			}

			return true
		})

		return <BlogList posts={filteredPosts} locale={locale} />
	} catch (error) {
		console.error('Error:', error)
		return notFound()
	}
}
