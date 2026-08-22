import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Select = forwardRef(({ className, icon: Icon, children, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
      )}
      <select
        className={cn(
          'input appearance-none bg-[url("data:image/svg+xml,%3Csvg%20width=\'12\'%20height=\'12\'%20viewBox=\'0%200%2012%2012\'%20fill=\'none\'%20xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath%20d=\'M3%204.5L6%207.5L9%204.5\'%20stroke=\'%239a9088\'%20stroke-width=\'1.5\'%20stroke-linecap=\'round\'%20stroke-linejoin=\'round\'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_12px_center] bg-no-repeat',
          Icon && 'pl-10',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    </div>
  )
})
Select.displayName = 'Select'

export default Select
