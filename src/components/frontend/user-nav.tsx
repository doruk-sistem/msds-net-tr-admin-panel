'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Building2, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useAuth from '@/hooks/use-auth'
import useMounted from '@/hooks/use-mounted'

import Loader from '../ui/loader'
import DynamicLogo from './dynamic-logo'

export function UserNav() {
  const mounted = useMounted()
  const router = useRouter()
  const { user } = useAuth()
  const t = useTranslations('common')

  if (!mounted)
    return (
      <div className="border-b flex justify-center py-2">
        <Loader className="text-primary w-10 h-10" />{' '}
      </div>
    )

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <DynamicLogo />
        <div className="ml-auto flex items-center space-x-4">
          <p className="text-sm font-semibold">{t('userNav.welcome', { name: user?.fullname })}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullname}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('userNav.settings')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>
                  <User />
                  {t('userNav.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings/company')}>
                  <Building2 />
                  {t('userNav.company')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut />
                {t('userNav.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
