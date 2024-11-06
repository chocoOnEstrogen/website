'use client'

import * as React from 'react'
import { config } from '@/configs/main'
import { Link } from 'nextjs13-progress'
import Image from 'next/image'
import { DynamicIcon, IconName } from './dynamic-icon'

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isScrolled, setIsScrolled] = React.useState(false)

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	React.useEffect(() => {
		const canvas = document.getElementById(
			'particle-canvas',
		) as HTMLCanvasElement
		const ctx = canvas.getContext('2d')

		if (!ctx) return

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		const particles: Particle[] = []

		class Particle {
			x: number
			y: number
			size: number
			speedX: number
			speedY: number

			constructor() {
				this.x = Math.random() * canvas.width
				this.y = Math.random() * canvas.height
				this.size = Math.random() * 5 + 1
				this.speedX = Math.random() * 3 - 1.5
				this.speedY = Math.random() * 3 - 1.5
			}

			update() {
				this.x += this.speedX
				this.y += this.speedY

				if (this.size > 0.2) this.size -= 0.1
			}

			draw() {
				if (ctx) {
					ctx.fillStyle = 'rgba(255,255,255,0.6)'
					ctx.strokeStyle = 'rgba(255,255,255,0.6)'
					ctx.lineWidth = 2
					ctx.beginPath()
					ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
					ctx.closePath()
					ctx.fill()
				}
			}
		}

		function handleParticles() {
			for (let i = 0; i < particles.length; i++) {
				particles[i].update()
				particles[i].draw()

				if (particles[i].size <= 0.2) {
					particles.splice(i, 1)
					i--
				}
			}
		}

		function animate() {
			if (!ctx) return
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			if (particles.length < 100) {
				particles.push(new Particle())
			}
			handleParticles()
			requestAnimationFrame(animate)
		}

		animate()

		window.addEventListener('resize', () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		})

		// Cleanup
		return () => {
			window.removeEventListener('resize', () => {
				canvas.width = window.innerWidth
				canvas.height = window.innerHeight
			})
		}
	}, [])

	return (
		<>
			<div className="flex min-h-screen flex-col bg-gray-900 text-white">
				<canvas id="particle-canvas" className="fixed inset-0 z-0 blur-[2px]" />

				{/* Header */}
				<header
					className={`sticky top-0 z-50 border-b border-gray-800 backdrop-blur-sm transition-all duration-200 ${isScrolled ? 'bg-gray-900/75 shadow-lg' : 'bg-transparent'} `}
				>
					<nav className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							<Link
								href="/"
								className="flex items-center space-x-3 transition-opacity hover:opacity-80"
							>
								<Image
									src={config.avatar}
									alt={config.name}
									width={40}
									height={40}
									className="rounded-full"
								/>
								<span className="text-xl font-bold">{config.name}</span>
							</Link>

							<div className="flex items-center space-x-6">
								{config.header?.map((item) => (
									<div key={item.name} className="group relative">
										{item.dropdown ?
											<>
												<button className="group flex items-center space-x-1 transition-colors hover:text-purple-400">
													<span>{item.name}</span>
													<svg
														className="h-4 w-4 transition-transform group-hover:rotate-180"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>
												<div className="absolute right-0 mt-2 w-48 origin-top-right scale-0 transform rounded-md bg-gray-800 py-1 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
													{item.dropdown.map((dropdownItem) => (
														<Link
															key={dropdownItem.name}
															href={dropdownItem.href}
															className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
														>
															{dropdownItem.name}
														</Link>
													))}
												</div>
											</>
										:	<Link
												href={item.href}
												className="transition-colors hover:text-purple-400"
												target={
													item.href.startsWith('http') ? '_blank' : undefined
												}
												rel={
													item.href.startsWith('http') ?
														'noopener noreferrer'
													:	undefined
												}
											>
												{item.name}
											</Link>
										}
									</div>
								))}
							</div>
						</div>
					</nav>
				</header>

				{/* Main content */}
				<main className="relative z-10 flex-grow">{children}</main>

				{/* Footer */}
				<footer className="relative z-10 border-t border-gray-800 backdrop-blur-sm">
					<div className="container mx-auto px-4 py-8">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							{/* Contact Info */}
							<div>
								<h3 className="mb-4 text-lg font-bold">Contact</h3>
								<p className="text-gray-400">{config.email}</p>
								<p className="text-gray-400">{config.location}</p>
								<p className="text-gray-400">Timezone: {config.timezone}</p>
							</div>

							{/* Social Links */}
							<div>
								<h3 className="mb-4 text-lg font-bold">Connect</h3>
								<div className="flex space-x-4">
									{config.socials?.map((social) => (
										<a
											key={social.name}
											href={social.url}
											target="_blank"
											rel="noopener noreferrer"
											className="transition-opacity hover:opacity-75"
											style={{ color: social.color }}
										>
											<DynamicIcon
												name={social.iconName as IconName}
												size={24}
												color={social.color}
											/>
										</a>
									))}
								</div>
							</div>

							{/* Copyright */}
							<div className="text-right">
								<p className="text-gray-400">
									© {new Date().getFullYear()} {config.name}
								</p>
								<p className="mt-2 text-sm text-gray-400">
									Built with ❤️ using Next.js
								</p>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	)
}
