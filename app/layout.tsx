import type { Metadata } from 'next'
import './globals.css'
import { config } from '@/configs/main'
import { Next13NProgress } from 'nextjs13-progress'
import { Oneko } from '@/components/oneko'
import '@/app/styles/markdown-globals.css'

export const metadata: Metadata = {
	title: config.name,
	description: `Personal information and projects of ${config.name}`,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					type={
						config.avatar.split('.').pop() === 'svg' ?
							'image/svg+xml'
						:	`image/${config.avatar.split('.').pop()}`
					}
					href={config.avatar}
				/>
			</head>
			<body className={`font-sans antialiased`}>
				<Oneko />
				<Next13NProgress color="blue" height={5} />
				{children}
			</body>
		</html>
	)
}
