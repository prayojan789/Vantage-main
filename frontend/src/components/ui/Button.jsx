import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

const variantMap = { solid: 'btn-primary', subtle: 'btn-secondary', outline: 'btn-outline', ghost: 'btn-ghost', soft: 'btn-soft', danger: 'btn-danger', link: 'btn-link', unstyled: '' }
const sizeMap = { xs: 'btn-sm', sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-lg' }

export const Button = forwardRef(function Button({ as: Comp = 'button', variant = 'solid', size = 'md', colorScheme = 'brand', leftIcon, rightIcon, isLoading = false, loadingText, isDisabled, className, children, ...rest }, ref) {
  const isUnstyled = variant === 'unstyled'
  return (
    <Comp ref={ref} disabled={isDisabled || isLoading} className={cn(isUnstyled ? '' : 'btn', !isUnstyled && sizeMap[size], !isUnstyled && variantMap[variant], className)} {...rest}>
      {isLoading ? <span className="anim-spin h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white" /> : leftIcon}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && rightIcon}
    </Comp>
  )
})