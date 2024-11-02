import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'ghost'
	size?: 'default' | 'sm' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'default', ...props }, ref) => {
		return (
			<button
				className={cn(
					'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50',
					{
						'bg-gray-800 text-white hover:bg-gray-700': variant === 'default',
						'hover:bg-gray-800/50': variant === 'ghost',
						'h-10 px-4 py-2': size === 'default',
						'h-8 px-3': size === 'sm',
						'h-12 px-8': size === 'lg',
					},
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)

Button.displayName = 'Button'
