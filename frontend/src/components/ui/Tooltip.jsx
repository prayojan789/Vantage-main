import { useState } from 'react'
import { cn } from '../../lib/utils.js'

export function Tooltip({ label, children, placement = 'top', className }) {
  const [open, setOpen] = useState(false)
  const positionClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[placement]
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && label ? (
        <span role="tooltip" className={cn('pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-[var(--color-text)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-inverse)] shadow-lg anim-scale-in', positionClass, className)}>
          {label}
          <span className={cn('absolute h-2 w-2 rotate-45 bg-[var(--color-text)]', placement === 'top' && 'bottom-[-3px] left-1/2 -translate-x-1/2', placement === 'bottom' && 'top-[-3px] left-1/2 -translate-x-1/2', placement === 'left' && 'right-[-3px] top-1/2 -translate-y-1/2', placement === 'right' && 'left-[-3px] top-1/2 -translate-y-1/2')} />
        </span>
      ) : null}
    </span>
  )
}