'use client'

import { Content } from '@/lib/content'
import { formatDate } from './blog-list'
import Layout from './Layout'
import markdownStyles from '@/app/styles/markdown.module.css'
// Import highlight.js
import 'highlight.js/styles/github-dark.css'
import hljs from 'highlight.js'
import { useEffect } from 'react'
import Link from 'next/link'
import { languages } from '@/configs/hljs'

interface Props {
	post: Content
	locale?: string
	allPosts?: Content[]
}

// Tag component
function Tag({ tag }: { tag: string }) {
	return (
		<span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400">
			{tag}
		</span>
	)
}

function getSimilarPosts(
	currentPost: Content,
	allPosts: Content[],
	limit = 3,
): Content[] {
	const currentTags = new Set(currentPost.metadata.tags)

	return allPosts
		.filter((post) => post.slug !== currentPost.slug)
		.map((post) => ({
			post,
			commonTags: post.metadata.tags.filter((tag: string) =>
				currentTags.has(tag),
			).length,
		}))
		.filter(({ commonTags }) => commonTags > 0)
		.sort((a, b) => b.commonTags - a.commonTags)
		.slice(0, limit)
		.map(({ post }) => post)
}

export function BlogPost({ post, locale = 'en-US', allPosts = [] }: Props) {
	useEffect(() => {
		try {
			// Initialize syntax highlighting with specific languages
			hljs.configure({
				ignoreUnescapedHTML: true,
				languages: languages,
			})

			// Use a more specific selector and add error handling
			document.querySelectorAll('pre code').forEach((block) => {
				try {
					hljs.highlightElement(block as HTMLElement)
				} catch (e) {
					console.warn('Failed to highlight code block:', e)
				}
			})

			// Add click handlers for copy buttons
			document.querySelectorAll('.copy-button').forEach((button) => {
				button.addEventListener('click', () => {
					const codeBlock = button.closest('.code-wrapper')?.querySelector('code')
					if (codeBlock) {
						navigator.clipboard.writeText(codeBlock.textContent || '')
						const copyIcon = button.querySelector('.copy-icon')
						const checkIcon = button.querySelector('.check-icon')
						if (copyIcon && checkIcon) {
							copyIcon.classList.add('hidden')
							checkIcon.classList.remove('hidden')
							setTimeout(() => {
								copyIcon.classList.remove('hidden')
								checkIcon.classList.add('hidden')
							}, 2000)
						}
					}
				})
			})
		} catch (e) {
			console.error('Error initializing syntax highlighting:', e)
		}
	}, [post])

	const similarPosts = getSimilarPosts(post, allPosts)

	return (
		<Layout>
			<article className="prose prose-invert mx-auto max-w-3xl px-4 py-20">
				<header className="mb-12">
					<h1 className="mb-4 text-4xl font-bold">{post.metadata.title}</h1>
					<div className="flex items-center gap-4 text-gray-400">
						<time>{formatDate(post.metadata.date, true, locale)}</time>
						<div className="flex gap-2">
							{post.metadata.tags?.map((tag: string) => (
								<Tag key={tag} tag={tag} />
							))}
						</div>
					</div>
				</header>

				<div
					className={markdownStyles.markdown}
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				{similarPosts.length > 0 && (
					<section className="mt-16 border-t border-gray-800 pt-8">
						<h2 className="mb-6 text-2xl font-bold">Similar Posts</h2>
						<div className="space-y-6">
							{similarPosts.map((similarPost) => {
								const date = new Date(similarPost.metadata.date)
								const url = `/blog/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${similarPost.slug}`

								return (
									<div
										key={similarPost.slug}
										className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-purple-500/50"
									>
										<Link href={url}>
											<h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-purple-400">
												{similarPost.metadata.title}
											</h3>
										</Link>
										<time className="text-sm text-gray-400">
											{formatDate(similarPost.metadata.date, false, locale)}
										</time>
										<div className="mt-2 flex flex-wrap gap-2">
											{similarPost.metadata.tags.map((tag: string) => (
												<Tag key={tag} tag={tag} />
											))}
										</div>
									</div>
								)
							})}
						</div>
					</section>
				)}
			</article>
		</Layout>
	)
}
