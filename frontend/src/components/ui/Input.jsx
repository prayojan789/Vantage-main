import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

const sizeMap = { sm: 'h-8 text-xs px-2.5', md: 'h-10 text-sm px-3.5', lg: 'h-12 text-base px-4' }
const variantMap = {
  outline: 'border border-[var(--color-border)] bg-[var(--color-surface)]',
  filled: 'border border-transparent bg-[var(--color-surface-muted)]',
  flushed: 'border-0 border-b border-[var(--color-border)] rounded-none bg-transparent px-0',
}

export const Input = forwardRef(function Input({ as: Comp = 'input', size = 'md', variant = 'outline', isInvalid = false, className, ...rest }, ref) {
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full rounded-[var(--radius-lg)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition-all duration-150',
        'focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeMap[size], variantMap[variant],
        isInvalid && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20',
        className,
      )}
      {...rest}
    />
  )
})

export function InputGroup({ size = 'md', className, children }) {
  return <div className={cn('group relative flex w-full items-center', size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10', className)}>{children}</div>
}

export function InputLeftElement({ children, className }) {
  return <span className={cn('pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-brand-500)]', className)}>{children}</span>
}

export function InputRightElement({ children, className }) {
  return <span className={cn('absolute right-2 top-1/2 -translate-y-1/2 flex items-center', className)}>{children}</span>
}