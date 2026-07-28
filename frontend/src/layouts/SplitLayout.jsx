import { Children, forwardRef } from 'react'
import { cn } from '../lib/utils.js'

/**
 * SplitLayout
 *
 * Renders two children side-by-side (default) or stacked. The consumer
 * controls the relative size of each side via the `ratio` prop.
 *
 * @example
 *   <SplitLayout ratio="1/2" gap="md" responsive="stack-on-mobile">
 *     <aside>...</aside>
 *     <main>...</main>
 *   </SplitLayout>
 */
const HORIZONTAL_RATIOS = {
  '1/4':      'md:grid-cols-[1fr_4fr]',
  '1/3':      'md:grid-cols-[1fr_3fr]',
  '1/2':      'md:grid-cols-[1fr_2fr]',
  '2/3':      'md:grid-cols-[2fr_3fr]',
  '3/2':      'md:grid-cols-[3fr_2fr]',
  '1/1':      'md:grid-cols-2',
  'auto-1fr': 'md:grid-cols-[auto_1fr]',
  '1fr-auto': 'md:grid-cols-[1fr_auto]',
}

const GAPS = {
  none: 'gap-0',
  sm:   'gap-3',
  md:   'gap-4',
  lg:   'gap-6',
  xl:   'gap-8',
}

export const SplitLayout = forwardRef(function SplitLayout(
  {
    direction = 'horizontal',
    ratio = '1/1',
    gap = 'md',
    responsive = 'stack-on-mobile',
    as: Tag = 'div',
    className,
    leftClassName,
    rightClassName,
    children,
    ...rest
  },
  ref,
) {
  const isHorizontal = direction === 'horizontal'
  const items = Children.toArray(children)
  const [first, second] = items

  if (isHorizontal) {
    const ratioClass = HORIZONTAL_RATIOS[ratio] ?? HORIZONTAL_RATIOS['1/1']
    const stackClass = responsive === 'stack-on-mobile' ? 'flex flex-col md:grid' : 'grid'

    return (
      <Tag
        ref={ref}
        className={cn(stackClass, ratioClass, GAPS[gap] ?? GAPS.md, className)}
        {...rest}
      >
        <div className={cn('min-w-0', leftClassName)}>{first}</div>
        <div className={cn('min-w-0', rightClassName)}>{second}</div>
      </Tag>
    )
  }

  // vertical (stacked)
  const verticalRatio = ratio === '1fr-auto'
    ? 'md:grid-rows-[1fr_auto]'
    : ratio === 'auto-1fr'
      ? 'md:grid-rows-[auto_1fr]'
      : 'md:grid-rows-2'

  return (
    <Tag
      ref={ref}
      className={cn('grid grid-rows-2', verticalRatio, GAPS[gap] ?? GAPS.md, className)}
      {...rest}
    >
      <div className={cn('min-h-0', leftClassName)}>{first}</div>
      <div className={cn('min-h-0', rightClassName)}>{second}</div>
    </Tag>
  )
})
