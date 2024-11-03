import type { IConfig } from '@/interfaces/IConfig'
import { skills } from '@/configs/skills'
import { socials } from '@/configs/socials'
import { links } from '@/configs/links'

export const config: IConfig = {
	location: 'Tokyo, Japan',
	email: 'choco@choco.rip',
	pronouns: 'she/her/hers/herself',
	name: 'Stella',
	titles: ['Full-Stack Developer', 'Anime Lover', 'Wannabe VTuber'],
	avatar: '/me.jpg',
	timezone: 'Asia/Tokyo',
	url: 'https://choco.rip',
	frontLinks: [
		{
			name: 'Projects',
			href: '/projects',
		},
		{
			name: 'Links',
			href: '/links',
		},
		{
			name: 'Posts',
			href: '/posts',
		},
		{
			name: 'Github',
			href: 'https://github.com/choco-rip',
		},
	],
	socials,
	links,
	skills,
}
