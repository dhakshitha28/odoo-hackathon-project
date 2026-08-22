import { AlertTriangle, CheckCircle, Info, XCircle, Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  success: {
    icon: CheckCircle,
    container: 'bg-surface-container-low border border-status-present/20 rounded-xl p-4',
    iconColor: 'text-status-present',
    titleColor: 'text-on-surface',
    descColor: 'text-on-surface-variant',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-primary-50 border border-primary-100/30 rounded-xl p-4',
    iconColor: 'text-status-break',
    titleColor: 'text-on-surface',
    descColor: 'text-on-surface-variant',
  },
  destructive: {
    icon: XCircle,
    container: 'bg-error-container border border-error/20 rounded-xl p-4',
    iconColor: 'text-error',
    titleColor: 'text-on-error-container',
    descColor: 'text-on-error-container/80',
  },
  info: {
    icon: Info,
    container: 'bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4',
    iconColor: 'text-primary',
    titleColor: 'text-on-surface',
    descColor: 'text-on-surface-variant',
  },
}

export function Alert({ variant = 'info', title, description, className, ...props }) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={cn('flex gap-3', config.container, className)} {...props}>
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={cn('text-sm font-semibold font-label', config.titleColor)}>{title}</h4>}
        {description && <p className={cn('text-sm mt-1 font-body', config.descColor)}>{description}</p>}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="rounded-full bg-surface-container p-4 mb-4">
        <Icon className="h-8 w-8 text-on-surface-variant" />
      </div>
      <h3 className="text-lg font-semibold font-headline text-on-surface mb-1">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant font-body text-center max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
