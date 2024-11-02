'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
	value: string
	label: string
}

interface SelectProps {
	value: string
	onValueChange: (value: string) => void
	options: SelectOption[]
}

export function Select({ value, onValueChange, options }: SelectProps) {
	return (
		<SelectPrimitive.Root value={value} onValueChange={onValueChange}>
			<SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
				<SelectPrimitive.Value />
				<SelectPrimitive.Icon>
					<ChevronDown className="h-4 w-4 opacity-50" />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-md animate-in fade-in-80">
					<SelectPrimitive.Viewport className="p-1">
						{options.map((option) => (
							<SelectPrimitive.Item
								key={option.value}
								value={option.value}
								className={cn(
									'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none focus:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
								)}
							>
								<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
									<SelectPrimitive.ItemIndicator>
										<Check className="h-4 w-4" />
									</SelectPrimitive.ItemIndicator>
								</span>
								<SelectPrimitive.ItemText>
									{option.label}
								</SelectPrimitive.ItemText>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Viewport>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	)
}
