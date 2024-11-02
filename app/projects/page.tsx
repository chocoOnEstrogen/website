import { ProjectsPage } from '@/components/projects'
import { getProjects } from '@/lib/github'
import { generateMeta } from '@/lib/generateMeta'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	return generateMeta({
		title: 'Projects',
	})
}

export const dynamic = 'force-dynamic'

export default async function ProjectsRoute() {
	const projects = await getProjects()
	return <ProjectsPage projects={projects} />
}
