import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  )
})

export default Input


