'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from './Layout'
import { config } from '@/configs/main'
import markdownStyles from '@/app/styles/markdown.module.css'
import { DynamicIcon, IconName } from './dynamic-icon'

export function HomePage({ aboutContent }: { aboutContent: string }) {
	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	}

	const TypingAnimation = ({
		strings,
		typingSpeed = 150,
		deleteSpeed = 75,
		pauseTime = 2000,
	}: {
		strings: string[]
		typingSpeed?: number
		deleteSpeed?: number
		pauseTime?: number
	}) => {
		const [displayText, setDisplayText] = useState('')
		const [currentIndex, setCurrentIndex] = useState(0)
		const [isDeleting, setIsDeleting] = useState(false)

		useEffect(() => {
			const timer = setTimeout(
				() => {
					const currentString = strings[currentIndex]

					if (isDeleting) {
						setDisplayText(currentString.substring(0, displayText.length - 1))
						if (displayText.length === 0) {
							setIsDeleting(false)
							setCurrentIndex((prev) => (prev + 1) % strings.length)
						}
					} else {
						setDisplayText(currentString.substring(0, displayText.length + 1))
						if (displayText.length === currentString.length) {
							setTimeout(() => setIsDeleting(true), pauseTime)
						}
					}
				},
				isDeleting ? deleteSpeed : typingSpeed,
			)

			return () => clearTimeout(timer)
		}, [
			displayText,
			currentIndex,
			isDeleting,
			strings,
			typingSpeed,
			deleteSpeed,
			pauseTime,
		])

		return <span className="typing-text">{displayText}</span>
	}

	// Sort skills by level
	config.skills?.sort((a, b) => b.level - a.level)

	return (
		<Layout>
			<section
				id="home"
				className="flex min-h-screen items-center justify-center"
			>
				<motion.div
					className="text-center"
					initial="initial"
					animate="animate"
					variants={{
						initial: { opacity: 0 },
						animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
					}}
				>
					<motion.h1 className="mb-4 text-5xl font-bold" variants={fadeInUp}>
						{config.name}
					</motion.h1>
					<motion.p className="mb-8 text-xl text-gray-300" variants={fadeInUp}>
						<TypingAnimation strings={config.titles} />
					</motion.p>
					<motion.div
						className="flex justify-center space-x-4"
						variants={fadeInUp}
					>
						{config.socials?.length &&
							config.socials.map((social) => (
								<a
									key={social.name}
									href={social.url}
									className="text-gray-300 hover:text-white"
									style={{ color: social.color || 'inherit' }}
								>
									<DynamicIcon
										name={social.iconName as IconName}
										size={24}
										color={social.color}
									/>
								</a>
							))}
					</motion.div>
				</motion.div>
			</section>
			<section id="about" className="min-h-screen bg-gray-800 py-20">
				<motion.div
					className="container mx-auto"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={{
						initial: { opacity: 0 },
						animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
					}}
				>
					<motion.h2
						className="mb-8 text-center text-3xl font-bold"
						variants={fadeInUp}
					>
						About Me
					</motion.h2>
					<motion.div
						className={`${markdownStyles.markdown} text-gray-300`}
						variants={fadeInUp}
						dangerouslySetInnerHTML={{ __html: aboutContent }}
					/>
				</motion.div>
			</section>
			<section id="skills" className="min-h-screen py-20">
				<motion.div
					className="container mx-auto px-4"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={{
						initial: { opacity: 0 },
						animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
					}}
				>
					<motion.h2
						className="mb-12 text-center text-4xl font-bold"
						variants={fadeInUp}
					>
						Skills & Expertise
					</motion.h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{config.skills?.map((skill) => (
							<motion.div
								key={skill.name}
								className="perspective-1000 group rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:border-blue-500/50"
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
									<div className="mb-4 flex items-center gap-4">
										<DynamicIcon
											name={skill.iconName as IconName}
											size={32}
											color={skill.color}
											className="transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110"
										/>
										<h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-400">
											{skill.name}
										</h3>
									</div>
									<div className="space-y-3">
										<p className="text-sm text-gray-300">{skill.description}</p>
										<div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
											<div
												className="h-2 rounded-full bg-blue-500 transition-all duration-500 ease-out group-hover:bg-blue-400"
												style={{ width: `${skill.level}%` }}
											/>
										</div>
										<p className="text-right text-sm text-gray-400 transition-colors duration-300 group-hover:text-blue-400">
											{skill.level}%
										</p>
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>
		</Layout>
	)
}
