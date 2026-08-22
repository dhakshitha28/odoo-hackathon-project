import { useState, createContext, useContext } from 'react'
import { cn } from '../../lib/utils'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, children, className, ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center gap-1 p-1 rounded-xl bg-surface-container-low',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      className={cn(
        isActive ? 'chip-active' : 'chip-inactive',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children, ...props }) {
  const { activeTab } = useContext(TabsContext)
  if (activeTab !== value) return null

  return (
    <div
      className={cn('mt-4 animate-fade-in', className)}
      {...props}
    >
      {children}
    </div>
  )
}
