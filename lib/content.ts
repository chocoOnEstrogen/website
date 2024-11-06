import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import matter from 'gray-matter'
import { cache } from 'react'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'highlight.js/styles/github-dark.css'
import hljs from 'highlight.js'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { unescapeHtml } from './utils'


/**
 * Represents the metadata of a content file.
 */
export type Metadata = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

/**
 * Represents a content file with its metadata, slug, and content.
 */
export type Content = {
	metadata: Metadata
	slug: string
	content: string
	path: string
}

/**
 * Parses the frontmatter of a content file.
 */
function parseFrontmatter(
	fileContent: string,
	fileType: string,
): { metadata: Metadata; content: string; rawContent: string } {
	switch (fileType) {
		case 'json':
			try {
				const parsed = JSON.parse(fileContent)
				return {
					metadata: parsed.metadata || {},
					content: parsed.content || '',
					rawContent: fileContent,
				}
			} catch (error) {
				console.error('Error parsing JSON:', error)
				return { metadata: {}, content: fileContent, rawContent: fileContent }
			}
		case 'yaml':
		case 'yml':
			try {
				const parsed = yaml.load(fileContent) as {
					metadata?: Metadata
					content?: string
				}
				return {
					metadata: parsed.metadata || {},
					content: parsed.content || '',
					rawContent: fileContent,
				}
			} catch (error) {
				console.error('Error parsing YAML:', error)
				return { metadata: {}, content: fileContent, rawContent: fileContent }
			}
		case 'markdown':
		case 'md':
		case 'mdx':
			const { data, content } = matter(fileContent)
			const htmlProcessor = unified()
				.use(remarkParse)
				.use(remarkRehype, { allowDangerousHtml: true })
				.use(rehypeRaw)
				.use(rehypeStringify)
				.use(remarkMath)
				.use(rehypeKatex)

			let htmlContent = htmlProcessor.processSync(content).toString()

			// Add IDs to headings
			htmlContent = htmlContent.replace(
				/<(h[1-6])>(.*?)<\/h[1-6]>/g,
				(match, tag, content) => {
					const id = slugify(content)
					return `<${tag} id="${id}">${content}</${tag}>`
				}
			)

			// Replace video tags with custom player
			htmlContent = htmlContent.replace(
				/<video([^>]*)src="([^"]*)"([^>]*)>/g,
				(_, before, src, after) => `
					<div class="custom-video-player">
						<div data-video-src="${src}"></div>
					</div>
				`
			)

			// Replace img tags with custom viewer
			htmlContent = htmlContent.replace(
				/<img([^>]*)src="([^"]*)"([^>]*)alt="([^"]*)"([^>]*)>/g,
				(_, before, src, middle, alt, after) => `
					<div class="custom-image-viewer">
						<div data-image-src="${src}" data-image-alt="${alt}"></div>
					</div>
				`
			)

			// Process code blocks with syntax highlighting
			htmlContent = htmlContent.replace(
				/<pre><code( class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g,
				(_, classAttr, language, code) => {
					// First decode standard HTML entities, then decode any remaining special entities
					const decodedCode = unescapeHtml(code)

					const highlightedCode = language ?
						hljs.highlight(decodedCode, { language }).value :
						hljs.highlightAuto(decodedCode).value

					return `
						<div class="code-wrapper relative group">
							<pre><code class="hljs code${language ? ` language-${language}` : ''}">${highlightedCode}</code></pre>
							<button class="copy-button absolute top-2 right-2 p-2 bg-gray-700 text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-600">
								<span class="copy-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span>
								<span class="check-icon hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
							</button>
						</div>
					`
				}
			)

			return {
				metadata: data,
				content: htmlContent,
				rawContent: content,
			}
		case 'html':
			const htmlMetadataRegex = /<!--\s*METADATA\s*([\s\S]*?)\s*-->/
			const htmlMatch = htmlMetadataRegex.exec(fileContent)
			if (htmlMatch) {
				try {
					const metadata = yaml.load(htmlMatch[1]) as Metadata
					const content = fileContent.replace(htmlMetadataRegex, '').trim()
					return { metadata, content, rawContent: fileContent }
				} catch (error) {
					console.error('Error parsing HTML metadata:', error)
				}
			}
			return {
				metadata: {},
				content: fileContent.trim(),
				rawContent: fileContent,
			}
		case 'text':
		case 'txt':
		default:
			return {
				metadata: {},
				content: fileContent.trim(),
				rawContent: fileContent,
			}
	}
}

/**
 * Valid file extensions for content files
 */
const VALID_EXTENSIONS = [
	'.json',
	'.yaml',
	'.yml',
	'.md',
	'.mdx',
	'.html',
	'.txt',
]

/**
 * Gets all content files in a directory.
 */
function getContentFilesInDir(dir: string): string[] {
	try {
		return fs
			.readdirSync(dir)
			.filter((file) =>
				VALID_EXTENSIONS.includes(path.extname(file).toLowerCase()),
			)
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error)
		return []
	}
}

/**
 * Reads and parses a content file.
 */
export function readContentFile(filePath: string): {
	metadata: Metadata
	content: string
} {
	try {
		const fileExists = fs.existsSync(filePath)
		if (!fileExists) {
			return { metadata: {}, content: '' }
		}
		const rawContent = fs.readFileSync(filePath, 'utf-8')
		const fileType = path.extname(filePath).slice(1).toLowerCase()
		return parseFrontmatter(rawContent, fileType)
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error)
		return { metadata: {}, content: '' }
	}
}

/**
 * Gets data from all content files in a directory.
 */
function getContentData(dir: string): Content[] {
	try {
		const contentFiles = getContentFilesInDir(dir)
		return contentFiles
			.map((file) => {
				const fullPath = path.join(dir, file)
				const { metadata, content } = readContentFile(fullPath)
				const slug = path.basename(file, path.extname(file))

				// Only include published content unless in development
				if (
					process.env.NODE_ENV !== 'development' &&
					metadata.published === false
				) {
					return null
				}

				return {
					metadata,
					slug,
					content,
					path: fullPath,
				}
			})
			.filter((item): item is Content => item !== null)
	} catch (error) {
		console.error(`Error getting content data from ${dir}:`, error)
		return []
	}
}

/**
 * Cached version of getContent for better performance in Next.js
 */
export const getCachedContent = cache((dirName: string): Content[] => {
	const contentPath = path.join(process.cwd(), 'content', dirName)
	return getContentData(contentPath)
})

/**
 * Gets all content files from a specific directory.
 */
export function getContent(dirName: string): Content[] {
	const contentPath = path.join(process.cwd(), 'content', dirName)
	return getContentData(contentPath)
}

/**
 * Gets all content file paths in the 'content' directory and its subdirectories.
 */
export function getContentFiles(dir: string = ''): string[] {
	const contentDir = path.join(process.cwd(), 'content', dir)

	const walk = (currentDir: string): string[] => {
		try {
			let files: string[] = []
			const items = fs.readdirSync(currentDir)

			for (const item of items) {
				const fullPath = path.join(currentDir, item)
				const stat = fs.statSync(fullPath)

				if (stat.isDirectory()) {
					files = files.concat(walk(fullPath))
				} else if (
					stat.isFile() &&
					VALID_EXTENSIONS.includes(path.extname(item).toLowerCase())
				) {
					const relativePath = path.relative(contentDir, fullPath)
					files.push(relativePath.replace(/\\/g, '/'))
				}
			}

			return files
		} catch (error) {
			console.error(`Error walking directory ${currentDir}:`, error)
			return []
		}
	}

	return walk(contentDir)
}

/**
 * Gets the content of a specific file.
 */
export const getCachedContentItem = cache(
	(dirName: string, slug: string): Content | undefined => {
		const files = getContent(dirName)
		return files.find((file) => file.slug === slug)
	},
)

/**
 * Gets all possible content paths for Next.js static generation
 */
export function generateContentPaths(dirName: string) {
	const files = getContentFiles(dirName)
	return files.map((file) => ({
		slug: path.basename(file, path.extname(file)),
	}))
}

/**
 * Sorts content by date (newest first)
 */
export function sortContentByDate(content: Content[]): Content[] {
	return [...content].sort((a, b) => {
		const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0
		const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0
		return dateB - dateA
	})
}

/**
 * Formats a date string.
 */
export function formatDate(date: string, includeRelative = false): string {
	const currentDate = new Date()
	const targetDate = new Date(date.includes('T') ? date : `${date}T00:00:00`)

	const diffTime = currentDate.getTime() - targetDate.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	let formattedDate = ''

	if (diffDays > 365) {
		formattedDate = `${Math.floor(diffDays / 365)}y ago`
	} else if (diffDays > 30) {
		formattedDate = `${Math.floor(diffDays / 30)}mo ago`
	} else if (diffDays > 0) {
		formattedDate = `${diffDays}d ago`
	} else {
		formattedDate = 'Today'
	}

	const fullDate = targetDate.toLocaleString('en-us', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return includeRelative ? `${fullDate} (${formattedDate})` : fullDate
}

/**
 * Converts a file extension to a MIME type.
 */
export function extToType(ext: string): string {
	const mimeTypes: { [key: string]: string } = {
		json: 'application/json',
		yaml: 'application/x-yaml',
		yml: 'application/x-yaml',
		md: 'text/markdown',
		mdx: 'text/markdown',
		html: 'text/html',
		txt: 'text/plain',
	}

	return mimeTypes[ext.toLowerCase()] || 'text/plain'
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
}
