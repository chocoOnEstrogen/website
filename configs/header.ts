import type { IHeader } from '@/interfaces/IConfig'

export const header: IHeader[] = [
	{
		name: 'Projects',
		href: '/projects',
	},
	{
		name: 'Links',
		href: '/links',
	},
	{
		name: 'Misc',
		href: '#',
		dropdown: [
			{
				name: 'Posts',
				href: '/posts',
			},
			{
				name: 'Blog',
				href: '/blog',
			},
			{
				name: 'Guides',
				href: '/guides',
			},
		],
	},
	{
		name: 'Github',
		href: 'https://github.com/chocoOnEstrogen',
	},
]
