import { cn } from '../../lib/utils.js'

/**
 * Card
 *
 * Chakra-style card with soft elevation, hairline border and rounded
 * corners. Sub-components mirror the Chakra API: <Card>, <CardHeader>,
 * <CardBody>, <CardFooter>.
 *
 * Variants:
 *  - 'elevated' (default): soft shadow, raises on hover
 *  - 'outline'           : 1px solid border, no shadow
 *  - 'filled'            : filled surface, no shadow
 *  - 'unstyled'          : no styling
 */
export function Card({
  variant = 'elevated',
  className,
  children,
  ...rest
}) {
  const variantClass = {
    elevated: 'card-elevated',
    outline:  'card-bordered',
    filled:   'card-flat',
    unstyled: '',
  }[variant]

  return (
    <div className={cn(variantClass, className)} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 px-5 pt-5 pb-3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...rest }) {
  return (
    <div className={cn('px-5 py-4', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--border-subtle)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
