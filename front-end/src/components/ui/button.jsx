import React from 'react'
import { cn } from '@/lib/utils'

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', size = 'default', ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    outline: 'border bg-transparent hover:bg-secondary',
    ghost: 'bg-transparent hover:bg-secondary',
    secondary: 'bg-secondary text-foreground hover:opacity-90',
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  }

  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
})

export default Button


