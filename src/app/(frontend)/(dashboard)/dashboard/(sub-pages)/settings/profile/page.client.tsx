'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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

import useAuth from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

import getMe from '@/utilities/getMe'
import authService from '@/services/auth.service'

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

        const response = await authService.updateUser({
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-none shadow-md bg-gradient-to-r from-card/50 to-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            {t('profileInformationSection.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('profileInformationSection.email')}
              </label>
              <p className="font-semibold">{user?.email || 'No data'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`border-none shadow-md ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('editProfileSection.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('editProfileSection.fullname')}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11" />
                      </FormControl>
                      <FormDescription>
                        {t('editProfileSection.fullnameDescription')}
                      </FormDescription>
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
                        <FormLabel className="text-base">{t('editProfileSection.phone')}</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
                        <FormDescription>
                          {t('editProfileSection.phoneDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={notChanged}
                  loading={isLoading}
                  className="min-w-[150px]"
                >
                  {t('editProfileSection.saveChanges')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
