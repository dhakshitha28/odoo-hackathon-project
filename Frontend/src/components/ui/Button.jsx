import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
  success: 'btn-success',
}

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const Button = forwardRef(({ className, variant = 'primary', size = 'md', icon: Icon, rounded, fullWidth, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        Icon && !children && 'btn-icon',
        rounded && 'btn-rounded',
        fullWidth && 'btn-full',
        className
      )}
      ref={ref}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

export default Button
