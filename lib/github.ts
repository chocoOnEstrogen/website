import { cache } from 'react'

const USERNAME = 'chocoOnEstrogen'
const BASE_URL = 'https://api.github.com'
const TOKEN = process.env.GITHUB_TOKEN

export const getProjects = cache(async () => {
	const res = await fetch(`https://api.github.com/users/${USERNAME}/repos`, {
		headers: {
			Authorization: `token ${TOKEN}`,
		},
		next: { revalidate: 3600 }, // Cache for 1 hour
	})

	if (!res.ok) {
		throw new Error('Failed to fetch projects')
	}

	const repos = await res.json()
	return (
		repos
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.filter((repo: any) => repo.private === false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.filter((repo: any) => repo.fork === false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.filter((repo: any) => repo.name !== USERNAME)
	)
})

export const getProjectDetails = cache(async (name: string) => {
	const [repo, readme, contents] = await Promise.all([
		// Get repository details
		fetch(`${BASE_URL}/repos/${USERNAME}/${name}`, {
			headers: { Authorization: `token ${TOKEN}` },
			next: { revalidate: 3600 },
		}).then((res) => res.json()),

		// Get README content
		fetch(`${BASE_URL}/repos/${USERNAME}/${name}/readme`, {
			headers: {
				Authorization: `token ${process.env.GITHUB_TOKEN}`,
				Accept: 'application/vnd.github.raw',
			},
			next: { revalidate: 3600 },
		}).then((res) => (res.ok ? res.text() : '')),

		// Get repository contents
		fetch(`${BASE_URL}/repos/${USERNAME}/${name}/contents`, {
			headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
			next: { revalidate: 3600 },
		}).then((res) => res.json()),
	])

	return {
		...repo,
		readme,
		contents,
	}
})

export const getBranches = cache(async (name: string) => {
	const res = await fetch(`${BASE_URL}/repos/${USERNAME}/${name}/branches`, {
		headers: { Authorization: `token ${TOKEN}` },
		next: { revalidate: 3600 },
	})

	if (!res.ok) {
		throw new Error('Failed to fetch branches')
	}

	return res.json()
})

export const getFileContent = cache(
	async (name: string, path: string, branch = 'main') => {
		const cleanPath = path.replace(/^\/+/, '')

		const res = await fetch(
			`${BASE_URL}/repos/${USERNAME}/${name}/contents/${cleanPath}?ref=${branch}`,
			{
				headers: {
					Authorization: `token ${TOKEN}`,
					Accept: 'application/vnd.github.raw',
				},
				next: { revalidate: 3600 },
			},
		)

		if (!res.ok) {
			throw new Error('Failed to fetch file content')
		}

		const content = await res.text()
		return content
	},
)

export const getDirContent = cache(
	async (name: string, path: string, branch = 'main') => {
		const cleanPath = path.replace(/^\/+/, '')

		const res = await fetch(
			`${BASE_URL}/repos/${USERNAME}/${name}/contents/${cleanPath}?ref=${branch}`,
			{
				headers: { Authorization: `token ${TOKEN}` },
				next: { revalidate: 3600 },
			},
		)

		if (!res.ok) {
			throw new Error('Failed to fetch directory content')
		}

		const content = await res.json()
		return content
	},
)

export const getFileCommits = cache(
	async (name: string, path: string, branch = 'main') => {
		const cleanPath = path.replace(/^\/+/, '')

		const res = await fetch(
			`${BASE_URL}/repos/${USERNAME}/${name}/commits?path=${cleanPath}&sha=${branch}`,
			{
				headers: { Authorization: `token ${TOKEN}` },
				next: { revalidate: 3600 },
			},
		)

		if (!res.ok) {
			throw new Error('Failed to fetch file commits')
		}

		return res.json()
	},
)
