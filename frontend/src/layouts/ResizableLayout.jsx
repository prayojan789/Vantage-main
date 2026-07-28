import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../lib/utils.js'

/**
 * ResizableLayout
 *
 * A two-pane resizable container. The first child becomes the primary
 * panel, the second child becomes the secondary panel, and a draggable
 * divider sits between them.
 *
 * - `direction="horizontal"` (default) splits the width.
 * - `direction="vertical"` splits the height.
 * - `defaultSize` and `minSize` are pixel values for the primary panel.
 * - `onResize` fires on every drag with the new primary size in pixels.
 *
 * The implementation is intentionally framework-free (no react-resizable-panels
 * dependency) so it can ship inside this layout system without adding
 * bundle weight.
 *
 * @example
 *   <ResizableLayout defaultSize={320} minSize={240} maxSize={520}>
 *     <Sidebar />
 *     <Main />
 *   </ResizableLayout>
 */
function clamp(value, min, max) {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

export const ResizableLayout = forwardRef(function ResizableLayout(
  {
    direction = 'horizontal',
    defaultSize = 280,
    minSize = 200,
    maxSize = 600,
    storageKey,
    onResize,
    className,
    handleClassName,
    firstClassName,
    secondClassName,
    children,
    ...rest
  },
  ref,
) {
  const isHorizontal = direction === 'horizontal'
  const items = Children.toArray(children)
  const [first, second] = items

  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  const [size, setSize] = useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        const n = Number(stored)
        if (!Number.isNaN(n)) return clamp(n, minSize, maxSize)
      }
    }
    return clamp(defaultSize, minSize, maxSize)
  })

  // keep the size within the new bounds if they change at runtime
  useEffect(() => {
    setSize(prev => clamp(prev, minSize, maxSize))
  }, [minSize, maxSize])

  const persist = useCallback((value) => {
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, String(value))
    }
  }, [storageKey])

  const handlePointerDown = useCallback((event) => {
    event.preventDefault()
    draggingRef.current = true
    document.body.style.userSelect = 'none'
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize'
  }, [isHorizontal])

  useEffect(() => {
    const handleMove = (event) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const next = isHorizontal
        ? event.clientX - rect.left
        : event.clientY - rect.top
      const clamped = clamp(next, minSize, maxSize)
      setSize(clamped)
      onResize?.(clamped)
    }
    const handleUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [isHorizontal, minSize, maxSize, onResize])

  // persist the final size when the user finishes dragging
  useEffect(() => {
    if (!draggingRef.current) persist(size)
  }, [size, persist])

  const sizeStyle = isHorizontal
    ? { width: `${size}px`, minWidth: 0 }
    : { height: `${size}px`, minHeight: 0 }

  return (
    <div
      ref={(node) => {
        containerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        'flex min-h-0 min-w-0',
        isHorizontal ? 'flex-row' : 'flex-col',
        className,
      )}
      {...rest}
    >
      <div className={cn('flex-shrink-0 min-h-0 min-w-0 overflow-auto', firstClassName)} style={sizeStyle}>
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 32 : 8
          if (isHorizontal) {
            if (event.key === 'ArrowLeft')  { setSize(s => clamp(s - step, minSize, maxSize)); onResize?.(clamp(size - step, minSize, maxSize)) }
            if (event.key === 'ArrowRight') { setSize(s => clamp(s + step, minSize, maxSize)); onResize?.(clamp(size + step, minSize, maxSize)) }
          } else {
            if (event.key === 'ArrowUp')   { setSize(s => clamp(s - step, minSize, maxSize)); onResize?.(clamp(size - step, minSize, maxSize)) }
            if (event.key === 'ArrowDown') { setSize(s => clamp(s + step, minSize, maxSize)); onResize?.(clamp(size + step, minSize, maxSize)) }
          }
        }}
        className={cn(
          'group relative flex-shrink-0 bg-border hover:bg-primary/40 transition-colors',
          isHorizontal ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
          handleClassName,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute bg-border group-hover:bg-primary/60 transition-colors',
            isHorizontal
              ? 'top-0 left-1/2 -translate-x-1/2 h-full w-[3px] group-hover:w-[5px]'
              : 'left-0 top-1/2 -translate-y-1/2 w-full h-[3px] group-hover:h-[5px]',
          )}
        />
      </div>

      <div className={cn('flex-1 min-h-0 min-w-0 overflow-auto', secondClassName)}>
        {second}
      </div>
    </div>
  )
})

/**
 * ResizablePanelGroup
 *
 * Stack multiple resizable panels vertically (top to bottom). Splits are
 * evenly distributed by default and can be dragged individually.
 *
 * @example
 *   <ResizablePanelGroup direction="vertical" minSize={120}>
 *     <div>Header</div>
 *     <div>Body</div>
 *     <div>Footer</div>
 *   </ResizablePanelGroup>
 */
export function ResizablePanelGroup({
  direction = 'vertical',
  minSize = 120,
  className,
  children,
  ...rest
}) {
  const isVertical = direction === 'vertical'
  const items = Children.toArray(children).filter(isValidElement)
  const count = items.length

  // Default sizes are distributed evenly (in pixels is unknown, so use fr-like flex grow).
  const [sizes, setSizes] = useState(() => items.map(() => 1))

  const containerRef = useRef(null)

  const updateSize = (index, deltaPx) => {
    if (!containerRef.current) return
    const total = isVertical
      ? containerRef.current.getBoundingClientRect().height
      : containerRef.current.getBoundingClientRect().width
    if (!total) return
    const frSize = total / sizes.reduce((a, b) => a + b, 0)
    const deltaFr = deltaPx / frSize
    setSizes(prev => {
      const next = [...prev]
      const a = clamp(next[index] + deltaFr, 0.25, next[index] + next[index + 1] - 0.25)
      const b = next[index + 1] - (a - next[index])
      next[index] = a
      next[index + 1] = b
      return next
    })
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex min-h-0 min-w-0',
        isVertical ? 'flex-col' : 'flex-row',
        className,
      )}
      {...rest}
    >
      {items.map((child, index) => {
        const isLast = index === count - 1
        return (
          <div key={index} className="flex min-h-0 min-w-0" style={{ flex: `${sizes[index]} 1 0%` }}>
            <div className="flex-1 min-h-0 min-w-0 overflow-auto">{child}</div>
            {!isLast ? (
              <div
                role="separator"
                aria-orientation={isVertical ? 'horizontal' : 'vertical'}
                onPointerDown={(e) => {
                  e.preventDefault()
                  const startPos = isVertical ? e.clientY : e.clientX
                  const startSizes = [...sizes]
                  document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize'
                  const move = (ev) => {
                    const cur = isVertical ? ev.clientY : ev.clientX
                    const delta = cur - startPos
                    const frSize = (containerRef.current?.getBoundingClientRect()?.[isVertical ? 'height' : 'width'] ?? 0) / startSizes.reduce((a, b) => a + b, 0)
                    const deltaFr = delta / frSize
                    setSizes(prev => {
                      const next = [...startSizes]
                      const a = Math.max(0.25, next[index] + deltaFr)
                      const b = Math.max(0.25, next[index + 1] - (a - next[index]))
                      next[index] = a
                      next[index + 1] = b
                      return next
                    })
                  }
                  const up = () => {
                    document.body.style.cursor = ''
                    window.removeEventListener('pointermove', move)
                    window.removeEventListener('pointerup', up)
                  }
                  window.addEventListener('pointermove', move)
                  window.addEventListener('pointerup', up)
                }}
                className={cn(
                  'flex-shrink-0 bg-border hover:bg-primary/40 transition-colors',
                  isVertical ? 'h-px cursor-row-resize' : 'w-px cursor-col-resize',
                )}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
