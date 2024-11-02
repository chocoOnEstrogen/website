'use client'

import { Link } from 'nextjs13-progress'
import { Badge } from '@/components/ui/badge'
import { GitFork, Star } from 'lucide-react'
import Layout from './Layout'
import { motion } from 'framer-motion'

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6 },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectsPage({ projects }: { projects: any[] }) {
	return (
		<Layout>
			<section id="projects" className="min-h-screen py-20">
				<div className="container mx-auto">
					<h1 className="mb-8 text-center text-3xl font-bold">
						My GitHub Projects
					</h1>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project) => (
							<motion.div
								key={project.id}
								className="perspective-1000 group rounded-xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:border-blue-500/50"
								variants={fadeInUp}
								whileHover={{
									rotateX: -2,
									rotateY: 5,
									scale: 1.02,
									transition: {
										duration: 0.2,
										ease: 'easeOut',
									},
								}}
								whileTap={{ scale: 0.98 }}
								style={{
									transformStyle: 'preserve-3d',
									boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
								}}
							>
								<motion.div
									className="relative z-10"
									style={{ transform: 'translateZ(50px)' }}
								>
									<div className="mb-4">
										<h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-400">
											{project.name}
										</h3>
									</div>
									<div className="space-y-4">
										<p className="text-sm text-gray-300">
											{project.description || 'No description'}
										</p>
										<div className="flex items-center justify-between">
											<div className="flex space-x-2">
												<Badge
													variant="secondary"
													className="flex items-center space-x-1 bg-gray-700/50"
												>
													<Star className="h-4 w-4 text-yellow-500" />
													<span className="text-xs text-gray-300">
														{project.stargazers_count || 0}
													</span>
												</Badge>
												<Badge
													variant="secondary"
													className="flex items-center space-x-1 bg-gray-700/50"
												>
													<GitFork className="h-4 w-4 text-gray-300" />
													<span className="text-xs text-gray-300">
														{project.forks_count || 0}
													</span>
												</Badge>
											</div>
											<Link
												href={`/projects/${project.name}`}
												className="text-blue-400 transition-colors duration-300 hover:text-blue-300 hover:underline"
											>
												View Details
											</Link>
										</div>
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</Layout>
	)
}
