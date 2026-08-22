import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, type, icon: Icon, rounder, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
      )}
      <input
        type={type}
        className={cn(
          rounder ? 'input input-rounder' : 'input',
          Icon && 'pl-10',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export default Input
