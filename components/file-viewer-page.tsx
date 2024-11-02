'use client'

import { motion } from 'framer-motion'
import Layout from './Layout'
import { Link } from 'nextjs13-progress'
import {
	ChevronRight,
	FileText,
	Folder,
	Download,
	Copy,
	Check,
	Eye,
	EyeOff,
	GitBranch,
	WrapText,
	ZoomIn,
	ZoomOut,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
	getFileExtension,
	getLanguageFromExtension,
	processMarkdownLinks,
} from '@/lib/fileUtils'
import markdownStyles from '@/app/styles/markdown.module.css'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6 },
}

interface FileContent {
	type: string
	name: string
	path: string
	size: number
	commit?: {
		message: string
		date: string
	}
}

interface FileViewerPageProps {
	project: {
		name: string
		default_branch: string
	}
	filePath: string
	isDirectory: boolean
	content?: string
	contents?: FileContent[]
	branches: string[]
	currentBranch: string
}

export function FileViewerPage({
	project,
	filePath,
	isDirectory,
	content,
	contents,
	branches,
	currentBranch,
}: FileViewerPageProps) {
	const [copied, setCopied] = useState(false)
	const [showLineNumbers, setShowLineNumbers] = useState(true)
	const router = useRouter()
	const [highlightedLines, setHighlightedLines] = useState<number[]>([])
	const pathParts = filePath.split('/')
	const currentName = pathParts[pathParts.length - 1]
	const fileExtension = getFileExtension(currentName)
	const language = getLanguageFromExtension(fileExtension || 'sh')
	const isMarkdown = fileExtension.toLowerCase() === 'md'
	const [wordWrap, setWordWrap] = useState(false)
	const [fontSize, setFontSize] = useState(14)

	useEffect(() => {
		const hash = window.location.hash
		if (hash) {
			const lineRanges = hash.replace('#L', '').split('-')
			const lines: number[] = []

			if (lineRanges.length === 2) {
				// Handle range like #L5-L10
				const start = parseInt(lineRanges[0])
				const end = parseInt(lineRanges[1])
				for (let i = start; i <= end; i++) {
					lines.push(i)
				}
			} else {
				// Handle single line like #L5
				lines.push(parseInt(lineRanges[0]))
			}

			setHighlightedLines(lines)

			// Scroll to the first highlighted line
			if (lines.length > 0) {
				const element = document.getElementById(`L${lines[0]}`)
				element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}
	}, [])

	const handleLineNumberClick = (
		lineNumber: number,
		event: React.MouseEvent,
	) => {
		const isShiftPressed = event.shiftKey
		let newHash = ''

		if (isShiftPressed && highlightedLines.length > 0) {
			// Create a range selection
			const lastLine = highlightedLines[highlightedLines.length - 1]
			newHash = `#L${Math.min(lastLine, lineNumber)}-L${Math.max(lastLine, lineNumber)}`
		} else {
			// Single line selection
			newHash = `#L${lineNumber}`
		}

		window.history.pushState(null, '', newHash)
		const lines =
			newHash.includes('-') ?
				range(
					parseInt(newHash.split('-')[0].replace('#L', '')),
					parseInt(newHash.split('-')[1].replace('L', '')),
				)
			:	[lineNumber]
		setHighlightedLines(lines)
	}

	const range = (start: number, end: number) => {
		return Array.from({ length: end - start + 1 }, (_, i) => start + i)
	}

	const syntaxHighlighterProps = {
		language: language,
		style: vscDarkPlus,
		showLineNumbers: showLineNumbers,
		customStyle: {
			margin: 0,
			borderRadius: '0.5rem',
			background: 'transparent',
			fontSize: `${fontSize}px`,
			whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
		},
		wrapLines: true,
		lineProps: (lineNumber: number) => ({
			style: {
				display: 'block',
				cursor: 'pointer',
				backgroundColor:
					highlightedLines.includes(lineNumber) ?
						'rgba(255, 255, 255, 0.1)'
					:	'transparent',
			},
			id: `L${lineNumber}`,
			onClick: (e: React.MouseEvent) => handleLineNumberClick(lineNumber, e),
			onContextMenu: (e: React.MouseEvent) => {
				e.preventDefault()
				handleShareLine(lineNumber)
			},
		}),
		lineNumberStyle: (lineNumber: number) => ({
			cursor: 'pointer',
			':hover': {
				color: '#fff',
			},
			color: highlightedLines.includes(lineNumber) ? '#fff' : undefined,
		}),
	}

	const handleCopyContent = async () => {
		try {
			await navigator.clipboard.writeText(content || '')
			setCopied(true)
			toast.success('Copied to clipboard!')
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			toast.error('Failed to copy content')
		}
	}

	const sizeToHumanReadable = (size: number) => {
		// bytes, KB, MB, GB
		if (size < 1024) return `${size} bytes`
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
		if (size < 1024 * 1024 * 1024)
			return `${(size / (1024 * 1024)).toFixed(2)} MB`
		return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
	}

	const handleDownload = () => {
		const blob = new Blob([content || ''], { type: 'text/plain' })
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = currentName
		document.body.appendChild(a)
		a.click()
		window.URL.revokeObjectURL(url)
		document.body.removeChild(a)
		toast.success('File downloaded!')
	}

	const handleShareLine = (lineNumber: number) => {
		const url = `${window.location.origin}${window.location.pathname}#L${lineNumber}`
		navigator.clipboard.writeText(url)
		toast.success('Link copied to clipboard!')
	}

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
					{/* Breadcrumb */}
					<motion.div
						variants={fadeInUp}
						className="flex items-center space-x-2"
					>
						<Link
							href={`/projects/${project.name}`}
							className="hover:text-blue-400"
						>
							{project.name}
						</Link>
						{pathParts.map((part, index) => (
							<div key={index} className="flex items-center space-x-2">
								<ChevronRight className="h-4 w-4" />
								<Link
									href={`/projects/${project.name}/${currentBranch}/~/${pathParts
										.slice(0, index + 1)
										.join('/')}`}
									className="hover:text-blue-400"
								>
									{part}
								</Link>
							</div>
						))}
					</motion.div>

					{/* Content */}
					<motion.div variants={fadeInUp} className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								{isDirectory ?
									<Folder className="h-6 w-6" />
								:	<FileText className="h-6 w-6" />}
								<h1 className="text-2xl font-bold">{currentName}</h1>
							</div>

							{!isDirectory && (
								<div className="flex items-center space-x-2">
									{/* Branch selector */}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm" title="Switch branch">
												<GitBranch className="mr-2 h-4 w-4" />
												{currentBranch}
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{
												// eslint-disable-next-line @typescript-eslint/no-explicit-any
												branches.map((branch: any) => (
													<DropdownMenuItem
														key={branch.name}
														onClick={() => {
															router.push(
																`/projects/${project.name}/${branch.name}/~/${filePath}`,
															)
														}}
													>
														{branch.name}
													</DropdownMenuItem>
												))
											}
										</DropdownMenuContent>
									</DropdownMenu>

									{/* Font size controls */}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setFontSize(Math.max(10, fontSize - 1))}
										title="Decrease font size"
									>
										<ZoomOut className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setFontSize(Math.min(24, fontSize + 1))}
										title="Increase font size"
									>
										<ZoomIn className="h-4 w-4" />
									</Button>

									{/* Word wrap toggle */}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setWordWrap(!wordWrap)}
										title={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
									>
										<WrapText className="h-4 w-4" />
									</Button>

									{/* Line numbers toggle */}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowLineNumbers(!showLineNumbers)}
										title={
											showLineNumbers ? 'Hide line numbers' : (
												'Show line numbers'
											)
										}
									>
										{showLineNumbers ?
											<EyeOff className="h-4 w-4" />
										:	<Eye className="h-4 w-4" />}
									</Button>

									{/* Copy button */}
									<Button
										variant="ghost"
										size="sm"
										onClick={handleCopyContent}
										title="Copy content"
									>
										{copied ?
											<Check className="h-4 w-4 text-green-500" />
										:	<Copy className="h-4 w-4" />}
									</Button>

									{/* Download button */}
									<Button
										variant="ghost"
										size="sm"
										onClick={handleDownload}
										title="Download file"
									>
										<Download className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>

						{isDirectory ?
							// Directory listing
							<div className="rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
								<table className="w-full">
									<thead>
										<tr className="text-left">
											<th className="pb-4">Name</th>
											<th className="pb-4">Size</th>
											<th className="pb-4">Last Commit</th>
										</tr>
									</thead>
									<tbody>
										{contents
											?.sort((a, b) => {
												// Sort directories first, then files
												if (a.type === 'dir' && b.type !== 'dir') return -1
												if (a.type !== 'dir' && b.type === 'dir') return 1
												// Then sort alphabetically by name
												return a.name.localeCompare(b.name)
											})
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											.map((item: any) => (
												<tr
													key={item.name}
													className="border-t border-gray-700"
												>
													<td className="py-3">
														<Link
															href={`/projects/${project.name}/${currentBranch}/~/${item.path}`}
															className="flex items-center space-x-2 hover:text-blue-400"
														>
															{item.type === 'dir' ?
																<Folder className="h-4 w-4" />
															:	<FileText className="h-4 w-4" />}
															<span>{item.name}</span>
														</Link>
													</td>
													<td className="py-3">
														{sizeToHumanReadable(item.size)}
													</td>
													<td className="py-3 text-sm text-gray-400">
														{item.commit?.message || 'No commits yet'}
														{item.commit && (
															<span className="ml-2 text-xs text-gray-500">
																{new Date(
																	item.commit.date,
																).toLocaleDateString()}
															</span>
														)}
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						: isMarkdown ?
							// Markdown content
							<div
								className={`${markdownStyles.markdown} prose prose-invert max-w-none rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm`}
								dangerouslySetInnerHTML={{
									__html: processMarkdownLinks(
										content || '',
										project.name,
										currentBranch,
									),
								}}
							/>
							// Code content
						:	<div className="rounded-lg bg-gray-800/50 backdrop-blur-sm">
								<SyntaxHighlighter {...syntaxHighlighterProps}>
									{content || ''}
								</SyntaxHighlighter>
							</div>
						}
					</motion.div>
				</motion.div>
			</div>
		</Layout>
	)
}
