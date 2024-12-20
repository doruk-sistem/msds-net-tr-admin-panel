'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/ui/loader'

import LocaleSwitcher from '@/components/frontend/locale-switcher'

import useAuth from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

import auth from '@/requests/auth'

import getMe from '@/utilities/getMe'

const ThemeToggleSection = dynamic(() => import('@/components/frontend/theme-toggle-section'), {
  ssr: false,
  loading: () => <Loader className="text-primary w-10 h-10" />,
})

const formSchema = z.object({
  fullname: z.string().min(2).max(30),
  phoneNumber: z.string().min(2).max(20),
})

interface Props {
  serverData: {
    user: Awaited<ReturnType<typeof getMe>>
  }
}

export default function ProfileSettingsPageClient({ serverData: { user } }: Props) {
  const { toast } = useToast()
  const { setUser } = useAuth()
  const t = useTranslations('settingsPage.userSettingsPage')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: user?.fullname || '',
      phoneNumber: user?.personalPhoneNumber || '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (user?.id) {
        setIsLoading(true)

        const response = await auth.updateUser({
          id: user?.id,
          body: {
            fullname: data.fullname,
            personalPhoneNumber: data.phoneNumber,
          },
        })

        setUser((prev: any) => {
          if (typeof prev === 'object') {
            return {
              ...prev,
              fullname: response?.fullname,
              personalPhoneNumber: response?.personalPhoneNumber,
            }
          }

          return prev
        })

        toast({
          title: 'Settings updated',
          description: 'Your user settings have been saved successfully.',
        })
      } else {
        toast({
          title: 'Credentials could not be verified',
          description: 'Please you try to log in again',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'If you want to see the error, open developer console or contact developer team',
        variant: 'destructive',
      })

      console.error('ERROR: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const notChanged =
    user?.fullname === form.watch('fullname') &&
    user?.personalPhoneNumber === form.watch('phoneNumber')

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>{t('profileInformationSection.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <Mail />
            <div>
              <label className="text-sm font-medium">{t('profileInformationSection.email')}</label>
              <p className="font-semibold text-sm">{user?.email || 'No data'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('preferencesSection.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">{t('preferencesSection.theme')}</label>
              <p className="text-sm text-muted-foreground">
                {t('preferencesSection.themeDescription')}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggleSection />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">{t('preferencesSection.language')}</label>
              <p className="text-sm text-muted-foreground">
                {t('preferencesSection.languageDescription')}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <LocaleSwitcher />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        <CardHeader>
          <CardTitle>{t('editProfileSection.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProfileSection.fullname')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t('editProfileSection.fullnameDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('editProfileSection.phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{t('editProfileSection.phoneDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button type="submit" disabled={notChanged} loading={isLoading}>
                {t('editProfileSection.saveChanges')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
