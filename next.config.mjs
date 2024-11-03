/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'spotify-recently-played-readme.vercel.app',
				port: '',
				pathname: '/api',
			},
			{
				protocol: 'https',
				hostname: 'cdn.bsky.app',
			},
		],
		dangerouslyAllowSVG: true,
	},
	experimental: {
		turbo: {
			rules: {
				'*.txt': ['raw-loader'],
			},
		},
	},
}

export default nextConfig
