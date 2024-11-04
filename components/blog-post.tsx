'use client'

import { Content } from '@/lib/content'
import { formatDate } from './blog-list'
import Layout from './Layout'
import markdownStyles from '@/app/styles/markdown.module.css'
// Import highlight.js
import 'highlight.js/styles/github-dark.css'
import hljs from 'highlight.js'
import { useEffect } from 'react'

interface Props {
	post: Content
	locale?: string
}

// Tag component
function Tag({ tag }: { tag: string }) {
	return (
		<span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400">
			{tag}
		</span>
	)
}

export function BlogPost({ post, locale = 'en-US' }: Props) {
	useEffect(() => {
		// Initialize syntax highlighting
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightElement(block as HTMLElement)
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
	}, [post])

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
			</article>
		</Layout>
	)
}
