import { cn } from '../../lib/utils.js'

/**
 * Skeleton / SkeletonText / SkeletonCircle
 *
 * Chakra-style placeholder.
 */
export function Skeleton({ className, ...rest }) {
  return <div className={cn('skeleton', className)} {...rest} />
}

export function SkeletonText({ lines = 3, className, gap = '0.5rem' }) {
  return (
    <div className={cn('flex flex-col', className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonCircle({ size = '2.5rem', className }) {
  return (
    <div
      className={cn('skeleton rounded-full', className)}
      style={{ width: size, height: size }}
    />
  )
}
