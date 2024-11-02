import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CalloutType = 'important' | 'note' | 'warning' | 'tip'

interface CalloutProps {
	type: CalloutType
	children: ReactNode
	className?: string
}

const calloutStyles = {
	important: {
		container: 'border-[#1f6feb]/20 bg-[#161b22]',
		text: 'text-[#1f6feb]',
		icon: '🚨',
	},
	note: {
		container: 'border-[#2f81f7]/20 bg-[#161b22]',
		text: 'text-[#2f81f7]',
		icon: '📝',
	},
	warning: {
		container: 'border-[#d29922]/20 bg-[#161b22]',
		text: 'text-[#d29922]',
		icon: '⚠️',
	},
	tip: {
		container: 'border-[#3fb950]/20 bg-[#161b22]',
		text: 'text-[#3fb950]',
		icon: '💡',
	},
}

export function Callout({ type, children, className }: CalloutProps) {
	const styles = calloutStyles[type]

	return (
		<div
			className={cn('my-4 rounded-md border p-4', styles.container, className)}
		>
			<div className="mb-2 flex items-center gap-2">
				<span
					className={cn('flex items-center gap-2 font-semibold', styles.text)}
				>
					<span>{styles.icon}</span>
					{type.toUpperCase()}
				</span>
			</div>
			<div className="text-[#e6edf3]">{children}</div>
		</div>
	)
}
