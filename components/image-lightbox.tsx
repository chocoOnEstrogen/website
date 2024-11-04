'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ImageLightboxProps {
	src: string
	alt: string
	onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					className="relative max-h-[90vh] max-w-[90vw]"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						onClick={onClose}
						className="absolute -right-4 -top-4 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<Image
						src={src}
						alt={alt}
						width={1200}
						height={800}
						className="h-auto max-h-[90vh] w-auto rounded-lg object-contain"
					/>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
