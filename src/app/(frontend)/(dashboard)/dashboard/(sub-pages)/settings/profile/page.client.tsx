'use client'

import { Suspense, useState } from 'react'
import { Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import dynamic from 'next/dynamic'

import { ClientUser } from 'types/auth.types'

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

import useAuth from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

import auth from '@/requests/auth'

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
    user: ClientUser['user'] | undefined
  }
}

export default function ProfileSettingsPageClient({ serverData: { user } }: Props) {
  const { toast } = useToast()
  const { session, updateAuth } = useAuth()

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
      if (session?.auth.accessToken && user?.id) {
        setIsLoading(true)

        const response = await auth.updateUser({
          id: user?.id,
          accessToken: session?.auth?.accessToken,
          body: {
            fullname: data.fullname,
            personalPhoneNumber: data.phoneNumber,
          },
        })

        // update the user data from next-auth session data
        await updateAuth({
          user: {
            fullname: response?.fullname,
            personalPhoneNumber: response?.personalPhoneNumber,
          },
        } as { user: Partial<ClientUser['user']> })

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
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <Mail />
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="font-semibold text-sm">{user?.email || 'No data'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <p className="text-sm text-muted-foreground">Choose a theme</p>
            </div>
            <div className="flex gap-2 items-center">
              <Suspense fallback={<>Loading...</>}>
                <ThemeToggleSection />
              </Suspense>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Your personal phone number.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button type="submit" disabled={notChanged} loading={isLoading}>
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
