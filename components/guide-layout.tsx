'use client'

import { Content } from '@/lib/content'
import { Link } from 'nextjs13-progress'
import { usePathname } from 'next/navigation'
import Layout from './Layout'
import { useEffect, useState, useCallback } from 'react'
import { VideoPlayer } from '@/components/media/VideoPlayer'
import { ImageViewer } from '@/components/media/ImageViewer'
import { createRoot } from 'react-dom/client'

interface Props {
	children: React.ReactNode
	guides: Content[]
	currentGuide?: Content
}

interface TocItem {
	id: string
	level: number
	text: string
	children: TocItem[]
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function generateToc(content: string): TocItem[] {
	const container = document.createElement('div')
	container.innerHTML = content
	const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
	const toc: TocItem[] = []
	const stack: TocItem[] = []

	headings.forEach((heading) => {
		const level = parseInt(heading.tagName[1])
		const id = heading.id || slugify(heading.textContent || '')
		const text = heading.textContent || ''
		const item: TocItem = { id, level, text, children: [] }

		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop()
		}

		if (stack.length === 0) {
			toc.push(item)
		} else {
			stack[stack.length - 1].children.push(item)
		}
		stack.push(item)
	})

	return toc
}

function TocItems({
	items,
	level = 0,
	activeId,
}: {
	items: TocItem[]
	level?: number
	activeId?: string
}) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({})

	const toggleExpand = (id: string) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	return (
		<ul className={`space-y-2 ${level > 0 ? 'ml-4 mt-2' : ''}`}>
			{items.map((item) => (
				<li key={item.id}>
					<div className="flex items-center gap-2">
						{item.children.length > 0 && (
							<button
								onClick={() => toggleExpand(item.id)}
								className="p-1 hover:text-purple-400"
							>
								<svg
									className={`h-3 w-3 transform transition-transform ${
										expanded[item.id] ? 'rotate-90' : ''
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						)}
						<a
							href={`#${item.id}`}
							className={`transition-colors ${
								activeId === item.id ?
									'text-purple-400'
								:	'text-gray-400 hover:text-purple-400'
							}`}
						>
							{item.text}
						</a>
					</div>
					{expanded[item.id] && item.children.length > 0 && (
						<TocItems
							items={item.children}
							level={level + 1}
							activeId={activeId}
						/>
					)}
				</li>
			))}
		</ul>
	)
}

function HeaderLink({
	id,
	children,
}: {
	id: string
	children: React.ReactNode
}) {
	const [showCheck, setShowCheck] = useState(false)

	const handleCopy = useCallback(() => {
		const url = `${window.location.origin}${window.location.pathname}#${id}`
		navigator.clipboard.writeText(url)
		setShowCheck(true)
		setTimeout(() => setShowCheck(false), 1000) // Reset after 1 second
	}, [id])

	return (
		<span className="group relative">
			{children}
			<button
				onClick={handleCopy}
				className="absolute -left-5 top-1/2 hidden -translate-y-1/2 text-gray-400 opacity-0 transition-opacity hover:text-purple-400 group-hover:opacity-100 md:block"
				title="Copy link to section"
			>
				{showCheck ? '✓' : '#'}
			</button>
		</span>
	)
}

export function GuideLayout({ children, guides, currentGuide }: Props) {
	const pathname = usePathname()
	const [tocItems, setTocItems] = useState<TocItem[]>([])
	const [activeId, setActiveId] = useState<string>()

	useEffect(() => {
		if (currentGuide?.content) {
			setTocItems(generateToc(currentGuide.content))
		}
	}, [currentGuide?.content])

	// Group guides by category
	const groupedGuides = guides.reduce(
		(acc, guide) => {
			const category = guide.metadata.category || 'Uncategorized'
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(guide)
			return acc
		},
		{} as Record<string, Content[]>,
	)

	useEffect(() => {
		// Process custom video players
		const videoPlayers = document.querySelectorAll('.custom-video-player')
		videoPlayers.forEach((player) => {
			const videoData = player.querySelector('div')
			if (videoData) {
				const src = videoData.getAttribute('data-video-src')
				if (src) {
					const videoElement = document.createElement('div')
					const root = createRoot(videoElement)
					root.render(<VideoPlayer src={src} />)
					player.replaceWith(videoElement)
				}
			}
		})

		// Process custom image viewers
		const imageViewers = document.querySelectorAll('.custom-image-viewer')
		imageViewers.forEach((viewer) => {
			const imageData = viewer.querySelector('div')
			if (imageData) {
				const src = imageData.getAttribute('data-image-src')
				const alt = imageData.getAttribute('data-image-alt')
				if (src) {
					const imageElement = document.createElement('div')
					const root = createRoot(imageElement)
					root.render(<ImageViewer src={src} alt={alt || ''} />)
					viewer.replaceWith(imageElement)
				}
			}
		})
	}, [currentGuide?.content])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				})
			},
			{
				rootMargin: '-80px 0px -80% 0px',
			},
		)

		// Observe all section headings
		document
			.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
			.forEach((element) => {
				observer.observe(element)
			})

		return () => {
			observer.disconnect()
		}
	}, [currentGuide?.content])

	useEffect(() => {
		// Only target headers within the prose content div
		const contentDiv = document.querySelector('.prose')
		if (!contentDiv) return

		const headers = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
		headers.forEach((header) => {
			if (!header.id) {
				header.id = slugify(header.textContent || '')
			}

			// Wrap header content in our HeaderLink component
			const headerContent = header.innerHTML
			const root = createRoot(header)
			root.render(<HeaderLink id={header.id}>{headerContent}</HeaderLink>)
		})

		// Add smooth scrolling for hash links
		const hashLinks = contentDiv.querySelectorAll('a[href^="#"]')
		hashLinks.forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault()
				const targetId = link.getAttribute('href')?.slice(1)
				const targetElement = document.getElementById(targetId || '')
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth' })
					// Update URL without scroll
					window.history.pushState(null, '', `#${targetId}`)
				}
			})
		})
	}, [currentGuide?.content])

	useEffect(() => {
		if (window.location.hash) {
			const targetId = window.location.hash.slice(1)
			const targetElement = document.getElementById(targetId)
			if (targetElement) {
				setTimeout(() => {
					targetElement.scrollIntoView({ behavior: 'smooth' })
				}, 100)
			}
		}
	}, [])

	return (
		<Layout>
			<div className="container mx-auto px-4 py-20">
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar with Guides and ToC for smaller screens */}
					<aside className="lg:w-64 lg:flex-shrink-0">
						<nav className="sticky top-24 space-y-6">
							{Object.entries(groupedGuides).map(
								([category, categoryGuides]) => (
									<div key={category}>
										<h3 className="mb-3 font-semibold text-purple-400">
											{category}
										</h3>
										<ul className="space-y-2">
											{categoryGuides.map((guide) => (
												<li key={guide.slug}>
													<Link
														href={`/guides/${guide.slug}`}
														className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
															pathname === `/guides/${guide.slug}` ?
																'bg-purple-500/20 text-purple-400'
															:	'text-gray-400 hover:bg-gray-800/50 hover:text-purple-400'
														}`}
													>
														{guide.metadata.title}
													</Link>
												</li>
											))}
										</ul>
									</div>
								),
							)}

							{/* ToC for smaller screens */}
							{currentGuide && currentGuide.metadata.toc && (
								<div className="xl:hidden">
									<h3 className="mb-3 font-semibold text-purple-400">
										On this page
									</h3>
									<nav className="text-sm text-gray-400">
										<TocItems items={tocItems} activeId={activeId} />
									</nav>
								</div>
							)}
						</nav>
					</aside>

					{/* Main content */}
					<main className="min-w-0 flex-1">
						{currentGuide && (
							<>
								<header className="mb-8">
									<h1 className="mb-4 text-4xl font-bold">
										{currentGuide.metadata.title}
									</h1>
									<div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
										{currentGuide.metadata.date && (
											<time dateTime={currentGuide.metadata.date}>
												{new Date(
													currentGuide.metadata.date,
												).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</time>
										)}
										{currentGuide.metadata.category && (
											<span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-400">
												{currentGuide.metadata.category}
											</span>
										)}
										{currentGuide.metadata.readingTime && (
											<span className="flex items-center gap-1">
												<svg
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
												>
													<circle cx="12" cy="12" r="10" strokeWidth="2" />
													<path d="M12 6v6l4 2" strokeWidth="2" />
												</svg>
												{currentGuide.metadata.readingTime} min read
											</span>
										)}
									</div>
									{currentGuide.metadata.description && (
										<p className="mt-4 text-lg text-gray-400">
											{currentGuide.metadata.description}
										</p>
									)}
								</header>
								<div className="prose prose-invert max-w-none">{children}</div>
								{/* Add navigation between guides */}
								<nav className="mt-16 flex justify-between border-t border-gray-800 pt-8">
									{currentGuide.metadata.prev && (
										<Link
											href={`/guides/${currentGuide.metadata.prev}`}
											className="group flex items-center gap-2 text-gray-400 transition-colors hover:text-purple-400"
										>
											<svg
												className="h-5 w-5 transition-transform group-hover:-translate-x-1"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
											</svg>
											Previous Guide
										</Link>
									)}
									{currentGuide.metadata.next && (
										<Link
											href={`/guides/${currentGuide.metadata.next}`}
											className="group flex items-center gap-2 text-gray-400 transition-colors hover:text-purple-400"
										>
											<svg
												className="h-5 w-5 transition-transform group-hover:translate-x-1"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
											</svg>
											Next Guide
										</Link>
									)}
								</nav>
							</>
						)}
					</main>

					{/* ToC for larger screens */}
					{currentGuide && currentGuide.metadata.toc && (
						<aside className="hidden xl:block xl:w-64">
							<div className="sticky top-24 space-y-3">
								<h3 className="font-semibold text-purple-400">On this page</h3>
								<nav className="text-sm text-gray-400">
									<TocItems items={tocItems} activeId={activeId} />
								</nav>
							</div>
						</aside>
					)}
				</div>
			</div>
		</Layout>
	)
}
