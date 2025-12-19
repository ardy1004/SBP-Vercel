'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { designTokens } from '@/lib/design-tokens'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
        premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl',
      },
      size: {
        xs: 'px-2.5 py-1.5 text-xs rounded gap-1',
        sm: 'px-3 py-2 text-sm rounded-md gap-1.5',
        md: 'px-4 py-2 text-sm rounded-md gap-2',
        lg: 'px-4 py-2 text-base rounded-md gap-2',
        xl: 'px-6 py-3 text-base rounded-lg gap-2.5',
        '2xl': 'px-8 py-4 text-lg rounded-xl gap-3',
      },
      shape: {
        default: '',
        square: 'aspect-square p-0',
        pill: 'rounded-full',
        circle: 'rounded-full aspect-square p-0',
      },
      animation: {
        none: '',
        scale: 'transform hover:scale-105 active:scale-95',
        lift: 'transform hover:-translate-y-0.5 active:translate-y-0',
        glow: 'hover:shadow-2xl',
        pulse: 'hover:animate-pulse',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'default',
      animation: 'scale',
    },
  }
)

export interface EnhancedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right' | 'only'
  fullWidth?: boolean
  ripple?: boolean
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    className,
    variant,
    size,
    shape,
    animation,
    loading,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth,
    ripple = true,
    children,
    disabled,
    ...props
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !loading && !disabled) {
        const button = event.currentTarget
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const newRipple = { id: Date.now(), x, y }
        setRipples(prev => [...prev, newRipple])

        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }

      props.onClick?.(event)
    }

    const isDisabled = disabled || loading
    const showIconOnly = iconPosition === 'only'
    const hasIcon = icon && !loading

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, shape, animation }),
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        whileHover={!isDisabled ? { scale: animation === 'scale' ? 1.05 : 1 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
        )}

        {/* Icon (left position) */}
        {hasIcon && !loading && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Content */}
        {!showIconOnly && (
          <span className={cn(
            'relative z-10',
            loading && 'ml-2',
            hasIcon && iconPosition === 'left' && 'ml-2',
            hasIcon && iconPosition === 'right' && 'mr-2'
          )}>
            {loading ? (loadingText || 'Loading...') : (children as React.ReactNode)}
          </span>
        )}

        {/* Icon (right position or only) */}
        {hasIcon && !loading && (iconPosition === 'right' || showIconOnly) && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Hover overlay for gradient buttons */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.button>
    )
  }
)

EnhancedButton.displayName = 'EnhancedButton'

export { EnhancedButton, buttonVariants }