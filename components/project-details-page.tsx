'use client'

import { Link } from 'nextjs13-progress'
import { motion } from 'framer-motion'
import Layout from './Layout'
import { Badge } from '@/components/ui/badge'
import {
	GitFork,
	Star,
	Eye,
	Calendar,
	Code,
	FileText,
	GitBranch,
	Download,
	ExternalLink,
	Folder,
} from 'lucide-react'
import { format } from 'date-fns'
import markdownStyles from '@/app/styles/markdown.module.css'
import { processMarkdownLinks } from '@/lib/fileUtils'
import { useState } from 'react'
import { useEffect } from 'react'

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6 },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectDetailsPage({ project }: { project: any }) {
	const [readme, setReadme] = useState('')

	useEffect(() => {
		setReadme(
			processMarkdownLinks(
				project.readme,
				project.name,
				project.default_branch,
			),
		)
	}, [project])

	return (
		<Layout>
			<div className="container mx-auto py-12">
				<motion.div
					className="space-y-8"
					initial="initial"
					animate="animate"
					variants={{
						initial: { opacity: 0 },
						animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
					}}
				>
					{/* Header */}
					<motion.div variants={fadeInUp} className="space-y-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-4xl font-bold">{project.name}</h1>
							<Badge variant="secondary" className="text-sm">
								{project.private ? 'Private' : 'Public'}
							</Badge>
						</div>
						<p className="text-lg text-gray-400">{project.description}</p>
					</motion.div>

					{/* Stats */}
					<motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
						<div className="flex items-center space-x-2">
							<Star className="h-5 w-5 text-yellow-500" />
							<span>{project.stargazers_count} stars</span>
						</div>
						<div className="flex items-center space-x-2">
							<GitFork className="h-5 w-5" />
							<span>{project.forks_count} forks</span>
						</div>
						<div className="flex items-center space-x-2">
							<Eye className="h-5 w-5" />
							<span>{project.watchers_count} watchers</span>
						</div>
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5" />
							<span>Created {format(new Date(project.created_at), 'PP')}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Code className="h-5 w-5" />
							<span>{project.language}</span>
						</div>
					</motion.div>

					{/* Actions */}
					<motion.div variants={fadeInUp} className="flex space-x-4">
						<a
							href={project.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
						>
							<GitBranch className="h-5 w-5" />
							<span>View on GitHub</span>
						</a>
						{project.homepage && (
							<a
								href={project.homepage}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 hover:bg-gray-600"
							>
								<ExternalLink className="h-5 w-5" />
								<span>Visit Website</span>
							</a>
						)}
						<a
							href={`${project.html_url}/archive/refs/heads/main.zip`}
							className="flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 hover:bg-gray-600"
						>
							<Download className="h-5 w-5" />
							<span>Download ZIP</span>
						</a>
					</motion.div>

					{/* README */}
					<motion.div variants={fadeInUp} className="space-y-4">
						<div className="flex items-center space-x-2 border-b border-gray-700 pb-3">
							<FileText className="h-5 w-5" />
							<h2 className="text-lg font-semibold">README.md</h2>
						</div>
						<div
							className={`${markdownStyles.markdown} prose prose-invert max-w-none rounded-lg bg-gray-800/50 p-6`}
							dangerouslySetInnerHTML={{ __html: readme }}
						/>
					</motion.div>

					{/* Files */}
					<motion.div variants={fadeInUp} className="space-y-4">
						<h2 className="text-2xl font-bold">Files</h2>
						<div className="rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
							<table className="w-full">
								<thead>
									<tr className="text-left">
										<th className="pb-4">Name</th>
										<th className="pb-4">Size</th>
										<th className="pb-4">Type</th>
									</tr>
								</thead>
								<tbody>
									{project.contents
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										.sort((a: any, b: any) => {
											// Sort directories first, then files
											if (a.type === 'dir' && b.type !== 'dir') return -1
											if (a.type !== 'dir' && b.type === 'dir') return 1
											// Then sort alphabetically by name
											return a.name.localeCompare(b.name)
										})
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										.map((file: any) => (
											<tr key={file.name} className="border-t border-gray-700">
												<td className="py-3">
													<Link
														href={`/projects/${project.name}/${project.default_branch || 'main'}/~/${file.path}`}
														className="flex items-center space-x-2 hover:text-blue-400"
													>
														{file.type === 'dir' ?
															<Folder className="h-4 w-4" />
														:	<FileText className="h-4 w-4" />}
														<span>{file.name}</span>
													</Link>
												</td>
												<td className="py-3">{file.size}</td>
												<td className="py-3">{file.type}</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</Layout>
	)
}
