import React from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import useMounted from '@/hooks/use-mounted'

interface Props {
  imageClassName?: string
  className?: string
}

export default function Logo({ imageClassName, className }: Props) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  const logoLight = () => (
    <Image
      className={cn('w-[170px]', imageClassName)}
      src="/msds-logo-light.png"
      alt="msds.com.tr logo light"
      width={400}
      height={100}
    />
  )

  const logoDark = () => (
    <Image
      className={cn('w-[170px]', imageClassName)}
      src="/msds-logo-dark.png"
      alt="msds.com.tr logo dark"
      width={400}
      height={100}
    />
  )

  return (
    <Link href="/" className={className}>
      {resolvedTheme === 'dark' ? logoLight() : logoDark()}
    </Link>
  )
}
