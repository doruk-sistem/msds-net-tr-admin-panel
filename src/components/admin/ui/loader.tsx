import { cn } from '@/utilities/cn'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface Props extends React.ComponentProps<typeof Loader2> {
  className?: string
}

export default function Loader({ className, ...rest }: Props) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-muted', className)} {...rest} />
}
