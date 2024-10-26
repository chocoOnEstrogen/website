/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.choco.rip',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'spotify-recently-played-readme.vercel.app',
				port: '',
				pathname: '/api',
			},
		],
		dangerouslyAllowSVG: true,
	},
}

export default nextConfig
