import type { IConfig } from '@/interfaces/IConfig'
import { skills } from '@/configs/skills'
import { socials } from '@/configs/socials'
import { links } from '@/configs/links'
import { header } from '@/configs/header'

export const config: IConfig = {
	location: 'Tokyo, Japan',
	email: 'choco@choco.rip',
	pronouns: 'she/her/hers/herself',
	name: 'Stella',
	titles: ['Full-Stack Developer', 'Anime Lover', 'Wannabe VTuber'],
	avatar: '/me.png',
	timezone: 'Asia/Tokyo',
	url: 'https://choco.rip',
	socials,
	links,
	skills,
	header,
}
