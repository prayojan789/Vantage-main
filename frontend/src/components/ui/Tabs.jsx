import { useState, createContext, useContext } from 'react'
import { cn } from '../../lib/utils.js'

/**
 * Tabs
 *
 * Minimal controlled / uncontrolled tabs in the Chakra style.
 */
const TabsContext = createContext(null)

export function Tabs({
  defaultIndex = 0,
  index: controlledIndex,
  onChange,
  variant = 'line', // 'line' | 'enclosed' | 'soft-rounded'
  size = 'md',
  align = 'start',
  className,
  children,
}) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex)
  const activeIndex = controlledIndex ?? internalIndex
  const setActive = (i) => {
    if (controlledIndex === undefined) setInternalIndex(i)
    onChange?.(i)
  }

  return (
    <TabsContext.Provider value={{ activeIndex, setActive, variant, size, align }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabList({ children, className }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabList must be used inside <Tabs>')
  const variantClass = {
    line: 'flex border-b border-[var(--border)] gap-0',
    enclosed: 'flex border-b border-[var(--border)] gap-1',
    'soft-rounded': 'tab-list',
  }[ctx.variant]
  const align = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }[ctx.align]
  return (
    <div
      role="tablist"
      className={cn('flex items-center gap-1', variantClass, align, className)}
    >
      {Array.isArray(children) ? children.map((child, i) => {
        if (!child) return null
        return <CtxTab key={i} index={i}>{child.props.children}</CtxTab>
      }) : children}
    </div>
  )
}

function CtxTab({ index, children }) {
  return <Tab index={index}>{children}</Tab>
}

export function Tab({ index, children, className }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab must be used inside <Tabs>')
  const isActive = ctx.activeIndex === index

  const baseByVariant = {
    line: cn(
      'inline-flex items-center gap-2 h-10 px-4 -mb-px border-b-2 text-sm font-semibold transition-colors cursor-pointer',
      isActive
        ? 'border-[var(--brand-500)] text-[var(--brand-600)]'
        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
    ),
    enclosed: cn(
      'inline-flex items-center gap-2 h-10 px-4 rounded-t-lg border border-b-0 text-sm font-semibold transition-colors cursor-pointer',
      isActive
        ? 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)]'
        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
    ),
    'soft-rounded': cn(
      'tab',
      isActive && 'is-active',
    ),
  }[ctx.variant]

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setActive(index)}
      className={cn(baseByVariant, className)}
    >
      {children}
    </button>
  )
}

export function TabPanels({ children, className }) {
  const ctx = useContext(TabsContext)
  return (
    <div className={cn('mt-4', className)}>
      {Array.isArray(children)
        ? children.map((child, i) => (i === ctx.activeIndex ? child : null))
        : children}
    </div>
  )
}

export function TabPanel({ children, className }) {
  return <div className={cn('anim-fade-up', className)}>{children}</div>
}
