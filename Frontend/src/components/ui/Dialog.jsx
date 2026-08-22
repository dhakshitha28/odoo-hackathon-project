import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onClose, children }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg animate-fade-in">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <div className={cn('relative card p-0 shadow-dropdown', className)} {...props}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-1 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  )
}

export function DialogHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <h2 className={cn('text-lg font-semibold font-headline text-on-surface', className)} {...props}>
      {children}
    </h2>
  )
}

export function DialogDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-on-surface-variant font-body', className)} {...props}>
      {children}
    </p>
  )
}

export function DialogFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex justify-end gap-3 p-6 pt-4 border-t border-outline-variant', className)} {...props}>
      {children}
    </div>
  )
}
