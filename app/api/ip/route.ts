import { NextResponse } from 'next/server'

function toBase16(text: string) {
	return Buffer.from(text).toString('hex')
}

export async function GET(request: Request) {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
    return NextResponse.json({ ip: toBase16(ip) })
} 