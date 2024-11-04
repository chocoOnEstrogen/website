'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ImageLightbox } from './image-lightbox'

interface Post {
	uri: string
	cid: string
	author: {
		handle: string
		displayName: string
		avatar: string
	}
	record: {
		text: string
		createdAt: string
		embed?: {
			images?: {
				alt: string
				image: {
					ref: { $link: string }
					mimeType: string
				}
			}[]
		}
	}
	embed?: {
		images?: {
			fullsize: string
			thumb: string
			alt: string
		}[]
	}
}

export function BlueskyPosts() {
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedImage, setSelectedImage] = useState<{
		src: string
		alt: string
	} | null>(null)

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch('/api/posts', {
					next: {
						revalidate: 300, // 5 minutes
					},
				})

				if (!response.ok) {
					const error = await response.json()
					throw new Error(error.error || 'Failed to fetch posts')
				}

				const data = await response.json()
				setPosts(data)
			} catch (error) {
				console.error('Error fetching posts:', error)
				setError(
					error instanceof Error ? error.message : 'Failed to fetch posts',
				)
			} finally {
				setLoading(false)
			}
		}

		fetchPosts()
	}, [])

	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	}

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h2 className="mb-4 text-2xl font-bold text-red-500">Error</h2>
					<p className="text-gray-400">{error}</p>
				</div>
			</div>
		)
	}

	return (
		<section className="min-h-screen py-20">
			{selectedImage && (
				<ImageLightbox
					src={selectedImage.src}
					alt={selectedImage.alt}
					onClose={() => setSelectedImage(null)}
				/>
			)}
			<motion.div
				className="container mx-auto px-4"
				initial="initial"
				animate="animate"
				variants={{
					initial: { opacity: 0 },
					animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
				}}
			>
				<motion.h2
					className="mb-12 text-center text-4xl font-bold"
					variants={fadeInUp}
				>
					Latest Posts
				</motion.h2>
				<div className="mx-auto max-w-2xl space-y-6">
					{posts.map((post) => (
						<motion.div
							key={post.cid}
							className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm"
							variants={fadeInUp}
						>
							<div className="mb-4 flex items-center gap-3">
								<Image
									src={post.author.avatar}
									alt={post.author.displayName}
									width={40}
									height={40}
									className="rounded-full"
								/>
								<div>
									<h3 className="font-semibold">{post.author.displayName}</h3>
									<p className="text-sm text-gray-400">@{post.author.handle}</p>
								</div>
								<span className="ml-auto text-sm text-gray-400">
									{formatDistanceToNow(new Date(post.record.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
							<p className="mb-4 whitespace-pre-wrap text-gray-200">
								{post.record.text}
							</p>
							{post.embed?.images && (
								<div className="grid gap-2">
									{post.embed.images.map((image, index) => (
										<div
											key={index}
											className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
											onClick={() =>
												setSelectedImage({
													src: image.fullsize,
													alt: image.alt || 'Post image',
												})
											}
										>
											<Image
												src={image.fullsize}
												alt={image.alt || 'Post image'}
												fill
												className="object-cover transition-transform duration-200 hover:scale-105"
											/>
										</div>
									))}
								</div>
							)}
							<div className="mt-4 flex items-center gap-4 text-gray-400">
								<a
									href={`https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm hover:text-blue-400"
								>
									View on Bluesky →
								</a>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</section>
	)
}
