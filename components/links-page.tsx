'use client'

import { motion } from 'framer-motion'
import Layout from './Layout'
import { config } from '@/configs/main'
import { useEffect } from 'react'
import type { ISocials, ILink } from '@/interfaces/IConfig'
import { DynamicIcon, IconName } from './dynamic-icon'

export function LinksPage({
	selectedLink,
}: {
	selectedLink?: ISocials | ILink
}) {
	useEffect(() => {
		if (selectedLink) {
			window.location.href = selectedLink.url
		}
	}, [selectedLink])

	// Combine socials and links
	const allLinks = [...(config.socials || []), ...(config.links || [])]

	return (
		<Layout>
			<div className="container mx-auto px-4 py-12">
				<motion.div
					className="mx-auto max-w-2xl space-y-8"
					initial="initial"
					animate="animate"
					variants={{
						initial: { opacity: 0 },
						animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
					}}
				>
					<motion.h1 className="text-center text-2xl font-bold">
						Links
					</motion.h1>
					{/* Links Grid */}
					<motion.div className="grid gap-4">
						{allLinks.map((link) => (
							<a
								key={link.name}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-700/50"
							>
								<div className="flex items-center space-x-4">
									{link.iconName && (
										<DynamicIcon
											name={link.iconName as IconName}
											size={24}
											color={link.color}
											className="transition-transform duration-300 group-hover:scale-110"
										/>
									)}
									<span className="font-medium">{link.name}</span>
									<span className="ml-auto text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
										→
									</span>
								</div>
								{/* Hover effect */}
								<div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							</a>
						))}
					</motion.div>
				</motion.div>
			</div>
		</Layout>
	)
}
