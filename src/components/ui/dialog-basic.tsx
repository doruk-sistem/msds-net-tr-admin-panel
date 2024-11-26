import {
  type DialogProps as RadixDialogProps,
  type DialogContentProps as RadixDialogContentProps,
} from '@radix-ui/react-dialog'

import {
  Dialog as DialogCore,
  DialogContent as DialogContentCore,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

interface DialogProps extends RadixDialogProps {
  children: React.ReactNode
  DialogContent: React.ReactNode
  DialogContentProps?: RadixDialogContentProps
}

/**
 * How to use:
 *
 * ```tsx
 *
 * ```
 */
export function Dialog({ children, DialogContent, DialogContentProps, ...rest }: DialogProps) {
  return (
    <DialogCore {...rest}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContentCore {...DialogContentProps}>{DialogContent}</DialogContentCore>
    </DialogCore>
  )
}

export {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
}
