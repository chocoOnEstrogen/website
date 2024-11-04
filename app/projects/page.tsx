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
export const revalidate = 3600 // Revalidate every hour

export default async function ProjectsRoute() {
	try {
		const projects = await getProjects()

		if (!projects || projects.length === 0) {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<p>No projects available at the moment.</p>
				</div>
			)
		}

		return <ProjectsPage projects={projects} />
	} catch (error) {
		console.error('Error in ProjectsRoute:', error)
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p>Unable to load projects. Please try again later.</p>
			</div>
		)
	}
}
