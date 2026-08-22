import { motion } from 'motion/react'
import Logo from '../brand/Logo'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-[24rem] w-[24rem] rounded-full bg-present/10 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex">
            <Logo className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
        </div>
        <div className="rounded-3xl border border-outline-variant/80 bg-white p-6 shadow-elevated sm:p-8">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
