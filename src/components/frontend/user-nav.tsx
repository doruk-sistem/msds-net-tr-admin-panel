'use client'

import { useTranslations } from 'next-intl'
import { Building2, LogOut, User } from 'lucide-react'
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
import { ThemeToggle } from './theme-toggle'
import authService from '@/services/auth.service'
import LocaleSwitcher from './locale-switcher'

export function UserNav() {
  const mounted = useMounted()
  const router = useRouter()
  const { user } = useAuth()
  const t = useTranslations('common')

  const handleSignOut = async () => {
    try {
      await authService.logout()
      router.push('/login')
    } catch { }
  }

  if (!mounted)
    return (
      <div className="border-b flex justify-center py-2">
        <Loader className="text-primary w-10 h-10" />
      </div>
    )

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-0">
        <DynamicLogo imageClassName="w-[230px]" />
        <div className="ml-auto flex items-center gap-6 pr-4 md:pr-6">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium hidden md:block">
              {t('userNav.welcome', { name: user?.fullname })}
            </p>
            <div className="h-4 w-[1px] bg-border hidden md:block" />
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full transition-opacity hover:opacity-80"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                  <AvatarImage src="/avatars/01.png" alt={user?.fullname || 'User avatar'} />
                  <AvatarFallback className="bg-primary/5">
                    <User className="w-4 h-4 text-primary/70" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1.5 p-1">
                  <p className="text-sm font-semibold leading-none">{user?.fullname}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  {t('userNav.settings')}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/settings/profile')}
                  className="gap-3 p-3 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{t('userNav.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/settings/company')}
                  className="gap-3 p-3 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{t('userNav.company')}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-3 p-3 cursor-pointer text-red-500 focus:text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">{t('userNav.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
