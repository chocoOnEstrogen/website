import { getProjectDetails } from '@/lib/github'
import { ProjectDetailsPage } from '@/components/project-details-page'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'

interface Props {
	params: { name: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const project = await getProjectDetails(params.name)
	return generateMeta({
		title: project.name,
		description: project.description,
	})
}

export default async function ProjectPage({ params }: Props) {
	const project = await getProjectDetails(params.name)
	return <ProjectDetailsPage project={project} />
}
