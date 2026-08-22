import { cn } from '../../lib/utils'

const variants = {
  present: {
    wrapper: 'badge-present',
    dot: 'status-dot status-present',
    showDot: true,
  },
  absent: {
    wrapper: 'badge-absent',
    dot: 'status-dot status-absent',
    showDot: true,
  },
  break: {
    wrapper: 'badge-pending',
    dot: 'status-dot status-break',
    showDot: true,
  },
  pending: {
    wrapper: 'badge-pending',
    dot: null,
    showDot: false,
  },
  approved: {
    wrapper: 'badge-approved',
    dot: null,
    showDot: false,
  },
  rejected: {
    wrapper: 'badge bg-error-container text-on-error-container border border-error/20',
    dot: null,
    showDot: false,
  },
  department: {
    wrapper: 'badge-department',
    dot: null,
    showDot: false,
  },
  muted: {
    wrapper: 'badge bg-surface-container-high text-on-surface-variant border border-outline-variant/40',
    dot: null,
    showDot: false,
  },
}

export function Badge({ variant = 'muted', className, children, ...props }) {
  const config = variants[variant]

  return (
    <span className={cn(config.wrapper, className)} {...props}>
      {config.showDot && <span className={cn(config.dot, 'rounded-full')} />}
      {children}
    </span>
  )
}
