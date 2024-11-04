'use client'

import { Content } from '@/lib/content'
import Link from 'next/link'
import Layout from './Layout'
import { useState, useMemo } from 'react'
import { Select } from '@/components/ui/select'

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
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedYear, setSelectedYear] = useState<string | null>(null)
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	// Get unique years, months, and tags from posts
	const filters = useMemo(() => {
		const years = new Set<string>()
		const months = new Set<string>()
		const tags = new Set<string>()

		posts.forEach((post) => {
			const date = new Date(post.metadata.date)
			years.add(date.getFullYear().toString())
			months.add(date.toLocaleString(locale, { month: 'long' }))
			post.metadata.tags.forEach((tag: string) => tags.add(tag))
		})

		return {
			years: Array.from(years).sort().reverse(),
			months: Array.from(months),
			tags: Array.from(tags).sort(),
		}
	}, [posts, locale])

	// Filter posts based on search and filters
	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const date = new Date(post.metadata.date)
			const matchesSearch =
				searchQuery === '' ||
				post.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.metadata.description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())

			const matchesYear =
				selectedYear === null || date.getFullYear().toString() === selectedYear

			const matchesMonth =
				selectedMonth === null ||
				date.toLocaleString(locale, { month: 'long' }) === selectedMonth

			const matchesTags =
				selectedTags.length === 0 ||
				selectedTags.every((tag) => post.metadata.tags.includes(tag))

			return matchesSearch && matchesYear && matchesMonth && matchesTags
		})
	}, [posts, searchQuery, selectedYear, selectedMonth, selectedTags, locale])

	return (
		<Layout>
			<section className="py-20">
				<div className="container mx-auto px-4">
					<h1 className="mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-center text-4xl font-bold text-transparent">
						Blog Posts
					</h1>

					{/* Search and Filters */}
					<div className="mx-auto mb-8 max-w-2xl">
						<div className="flex gap-4">
							<input
								type="text"
								placeholder="Search posts..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2 text-gray-100 focus:border-purple-500 focus:outline-none"
							/>

							<Select
								value={selectedYear}
								onValueChange={(value) => setSelectedYear(value)}
								options={[
									{ value: null, label: 'All Years' },
									...filters.years.map((year) => ({
										value: year,
										label: year,
									})),
								]}
							/>

							<Select
								value={selectedMonth}
								onValueChange={(value) => setSelectedMonth(value)}
								options={[
									{ value: null, label: 'All Months' },
									...filters.months.map((month) => ({
										value: month,
										label: month,
									})),
								]}
							/>
						</div>

						<div className="mt-4 flex flex-wrap gap-2">
							{filters.tags.map((tag) => (
								<button
									key={tag}
									onClick={() =>
										setSelectedTags((prev) =>
											prev.includes(tag) ?
												prev.filter((t) => t !== tag)
											:	[...prev, tag],
										)
									}
									className={`rounded-full px-3 py-1 text-sm transition-colors ${
										selectedTags.includes(tag) ?
											'bg-purple-500 text-white'
										:	'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
									}`}
								>
									#{tag}
								</button>
							))}
						</div>
					</div>

					{/* Posts List */}
					<div className="mx-auto max-w-2xl space-y-8">
						{filteredPosts.length === 0 ?
							<p className="text-center text-gray-400">No posts found</p>
						:	filteredPosts.map((post) => {
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
							})
						}
					</div>
				</div>
			</section>
		</Layout>
	)
}
