import {
	getProjectDetails,
	getFileContent,
	getDirContent,
	getBranches,
} from '@/lib/github'
import { FileViewerPage } from '@/components/file-viewer-page'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'

interface Props {
	params: {
		name: string
		branch: string
		path?: string[]
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const fileName =
		params.path?.length ? params.path[params.path.length - 1] : 'Root'
	return generateMeta({
		title: `${fileName} - ${params.name}`,
	})
}

export default async function FilePage({ params }: Props) {
	// Get project details first to know the default branch
	const project = await getProjectDetails(params.name)
	const branches = await getBranches(params.name)

	// Use the default branch from the project if branch is undefined
	const currentBranch = params.branch || project.default_branch || 'main'

	// Handle the path correctly - remove any empty segments
	const filePath =
		params.path
			?.filter((segment) => segment !== '~' && segment !== '')
			.join('/') || ''

	try {
		// First get the content info to determine if it's a file or directory
		const contentInfo = await getDirContent(
			params.name,
			filePath,
			currentBranch,
		)

		// Root or directory case
		if (!filePath || Array.isArray(contentInfo)) {
			return (
				<FileViewerPage
					project={project}
					filePath={filePath}
					isDirectory={true}
					contents={Array.isArray(contentInfo) ? contentInfo : project.contents}
					branches={branches}
					currentBranch={currentBranch}
				/>
			)
		}

		// If it's a file, get its content and commits
		const [content] = await Promise.all([
			getFileContent(params.name, filePath, currentBranch),
		])

		return (
			<FileViewerPage
				project={project}
				filePath={filePath}
				isDirectory={false}
				content={content}
				branches={branches}
				currentBranch={currentBranch}
			/>
		)
	} catch (error) {
		console.error('Error fetching content:', error)
		// Handle 404 or other errors appropriately
		return (
			<FileViewerPage
				project={project}
				filePath={filePath}
				isDirectory={true}
				contents={project.contents}
				branches={branches}
				currentBranch={currentBranch}
			/>
		)
	}
}
