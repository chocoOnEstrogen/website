import { NextResponse } from 'next/server'
import axios from 'axios'

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function POST(request: Request) {
	const { text } = await request.json()

	if (!text) {
		return NextResponse.json({ error: 'No text provided' }, { status: 400 })
	}

	try {
		const response = await axios.post(`${API_ENDPOINT}/ask`, {
			text,
		}, {
			headers: {
				'x-api-key': API_KEY,
			},
		})

		return NextResponse.json(response.data)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}



}
