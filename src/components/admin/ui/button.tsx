import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot, Slottable } from '@radix-ui/react-slot'

import { cn } from '@/utilities/cn'

import Loader from './loader'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-base font-medium outline-none border-solid cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
      rounded: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-1',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded-md px-8',
        sm: 'h-9 rounded-md px-3',
        full: 'w-full py-2',
      },
      variant: {
        default: 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
        white:
          'bg-accent text-accent-foreground border-transparent hover:opacity-90 hover:text-slate-700',
      },
      rounded: {
        default: 'rounded',
        full: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, loading = false, children, disabled, variant, size, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader className="mr-2" />}
        <Slottable>{children}</Slottable>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
