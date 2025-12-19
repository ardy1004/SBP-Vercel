'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'hover:shadow-md',
        elevated: 'shadow-lg hover:shadow-xl border-0',
        outlined: 'border-2 border-gray-300 hover:border-blue-500',
        gradient: 'bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg',
        premium: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        scale: 'hover:scale-105',
        glow: 'hover:shadow-2xl hover:shadow-blue-500/20',
        border: 'hover:border-blue-500',
      },
      animation: {
        none: '',
        fadeIn: 'animate-in fade-in duration-300',
        slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
        zoomIn: 'animate-in zoom-in-95 duration-300',
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'lift',
      animation: 'fadeIn',
    },
  }
)

export interface EnhancedCardProps
  extends Omit<HTMLMotionProps<'div'>, 'padding'>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({
    className,
    variant,
    padding,
    hover,
    animation,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Component = asChild ? motion.div : motion.div

    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, animation }), className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

EnhancedCard.displayName = 'EnhancedCard'

// Card sub-components
const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))

CardFooter.displayName = 'CardFooter'

export {
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants
}