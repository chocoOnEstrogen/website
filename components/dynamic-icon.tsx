'use client'

import {
	SiBluesky,
	SiDiscord,
	SiGithub,
	SiJavascript,
	SiTypescript,
	SiPython,
	SiRust,
	SiHtml5,
	SiTailwindcss,
	SiAstro,
	SiNuxtdotjs,
	SiVim,
	SiGooglecloud,
	SiGitlab,
} from '@icons-pack/react-simple-icons'
import { GitBranch, Heart } from 'lucide-react'

export const iconMap = {
	// Simple Icons
	SiBluesky,
	SiDiscord,
	SiGithub,
	SiJavascript,
	SiTypescript,
	SiPython,
	SiRust,
	SiHtml5,
	SiTailwindcss,
	SiAstro,
	SiNuxtdotjs,
	SiVim,
	SiGooglecloud,
	SiGitlab,
	// Lucide Icons
	GitBranch,
	Heart,
}

export type IconName = keyof typeof iconMap

interface Props {
	name: IconName
	size?: number
	color?: string
	className?: string
}

export function DynamicIcon({ name, size = 24, color, className }: Props) {
	const Icon = iconMap[name]
	if (!Icon) return null

	return (
		<Icon
			size={size}
			style={{ color: color || 'inherit' }}
			className={className}
		/>
	)
}
