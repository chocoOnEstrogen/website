import type { Timezones, Pronouns } from '@/types/Config'
import type { IconName } from '@/components/dynamic-icon'

export interface IConfig {
	name: string
	pronouns: Pronouns
	email: string
	titles: string[]
	socials?: ISocials[]
	location: string
	avatar: string
	timezone: Timezones
	url: string
	frontLinks?: {
		name: string
		href: string
	}[]
	links?: ILink[]
	skills?: ISkill[]
}

export interface ISocials {
	name: string
	url: string
	iconName?: IconName
	color?: string
}

export interface ILink {
	name: string
	url: string
	iconName?: IconName
	color?: string
}

export interface ISkill {
	name: string
	iconName?: IconName
	level: number
	description: string
	color: string
}
