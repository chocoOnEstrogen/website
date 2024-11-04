'use client'

import { Content } from '@/lib/content'
import Link from 'next/link'
import Layout from './Layout'

export function formatDate(
	date: string,
	includeTime: boolean = false,
	locale: string = 'en-US',
) {
	const dateObj = new Date(date)
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}
	if (includeTime) options.hour = '2-digit'
	options.minute = '2-digit'
	return dateObj.toLocaleDateString(locale, options)
}

interface Props {
	posts: Content[]
	locale?: string
}

export function BlogList({ posts, locale = 'en-US' }: Props) {
	return (
		<Layout>
			<section className="py-20">
				<div className="container mx-auto px-4">
					<h1 className="mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-center text-4xl font-bold text-transparent">
						Blog Posts
					</h1>

					<div className="mx-auto max-w-2xl space-y-8">
						{posts.map((post) => {
							const date = new Date(post.metadata.date)
							const url = `/blog/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${post.slug}`

							return (
								<article
									key={post.slug}
									className="group relative rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-800/75"
								>
									<div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<Link href={url}>
										<h2 className="mb-2 text-2xl font-bold transition-colors group-hover:text-purple-400">
											{post.metadata.title}
										</h2>
									</Link>

									<time className="flex items-center gap-2 text-sm text-gray-400">
										<svg className="h-4 w-4" /* Add calendar icon SVG */ />
										{formatDate(post.metadata.date, true, locale)}
									</time>

									{post.metadata.description && (
										<p className="mt-4 line-clamp-3 text-gray-300">
											{post.metadata.description}
										</p>
									)}

									<div className="mt-4 flex flex-wrap gap-2">
										{post.metadata.tags.map((tag: string) => (
											<span
												key={tag}
												className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400"
											>
												#{tag}
											</span>
										))}
									</div>
								</article>
							)
						})}
					</div>
				</div>
			</section>
		</Layout>
	)
}
