import { BskyAgent } from '@atproto/api'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const identifier = process.env.BLUESKY_IDENTIFIER
		const password = process.env.BLUESKY_PASSWORD

		if (!identifier || !password) {
			return NextResponse.json(
				{ error: 'Bluesky credentials are not configured' },
				{ status: 500 },
			)
		}

		const agent = new BskyAgent({ service: 'https://bsky.social' })
		await agent.login({
			identifier: identifier,
			password,
		})

		const response = await agent.getAuthorFeed({
			actor: 'choco.rip',
			limit: 20,
		})

		const posts = response.data.feed.map((item) => item.post)

		return NextResponse.json(posts, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error fetching Bluesky posts:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch posts' },
			{ status: 500 },
		)
	}
}

export const runtime = 'edge'
