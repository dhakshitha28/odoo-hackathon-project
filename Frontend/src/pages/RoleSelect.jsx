import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Shield, User, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Logo from '../components/brand/Logo'
import { itemUp, stagger } from '../lib/motion'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const roles = [
    { id: 'admin', label: 'Admin / HR', description: 'Create people, approve leave, manage salary.', icon: Shield },
    { id: 'employee', label: 'Employee', description: 'Check in, view attendance, request time off.', icon: User },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-present/10 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex"><Logo className="h-14 w-14" /></div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dayflow</h1>
          <p className="mt-2 text-ink-muted">Every workday, perfectly aligned.</p>
        </div>
        <h2 className="mb-4 text-center text-lg font-semibold">Who is signing in?</h2>
        <motion.div variants={stagger} initial="initial" animate="animate" className="mb-6 grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              variants={itemUp}
              type="button"
              onClick={() => setSelected(role.id)}
              className={`rounded-2xl border-2 p-5 text-left transition ${selected === role.id ? 'border-primary bg-primary-50 shadow-soft' : 'border-outline-variant bg-white hover:border-primary/40'}`}
            >
              <role.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="font-semibold">{role.label}</p>
              <p className="mt-1 text-xs text-ink-muted">{role.description}</p>
            </motion.button>
          ))}
        </motion.div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => navigate('/signin', { state: { role: selected } })}
          className="btn-primary w-full py-3 disabled:opacity-40"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-center text-sm text-ink-muted">
          {selected === 'employee' ? 'Accounts are created by HR — you cannot self-register.' : 'Admin and HR sign in with issued credentials.'}
        </p>
      </motion.div>
    </div>
  )
}
