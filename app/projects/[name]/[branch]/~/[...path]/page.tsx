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
		path: string[]
	}
	searchParams: {
		branch?: string
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const fileName = params.path[params.path.length - 1]
	return generateMeta({
		title: `${fileName} - ${params.name}`,
	})
}

export default async function FilePage({ params, searchParams }: Props) {
	const currentBranch = searchParams.branch || 'main'
	const [project, branches] = await Promise.all([
		getProjectDetails(params.name),
		getBranches(params.name),
	])

	const filePath = params.path.join('/')

	// First get the content info to determine if it's a file or directory
	const contentInfo = await getDirContent(params.name, filePath, currentBranch)

	// If it's a directory, pass the directory contents
	if (Array.isArray(contentInfo)) {
		return (
			<FileViewerPage
				project={project}
				filePath={filePath}
				isDirectory={true}
				contents={contentInfo}
				branches={branches}
				currentBranch={currentBranch}
			/>
		)
	}

	// If it's a file, get its content
	const content = await getFileContent(params.name, filePath, currentBranch)
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
}
