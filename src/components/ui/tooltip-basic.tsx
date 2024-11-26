import React from 'react'

import { type TooltipProviderProps, type TooltipProps } from '@radix-ui/react-tooltip'

import {
  Tooltip as TooltipCore,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TooltipBaseProps extends TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  TooltipProviderProps?: TooltipProviderProps
}

export default function Tooltip({
  children,
  content,
  TooltipProviderProps,
  ...rest
}: TooltipBaseProps) {
  return (
    <TooltipProvider {...TooltipProviderProps}>
      <TooltipCore {...rest}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipCore>
    </TooltipProvider>
  )
}
