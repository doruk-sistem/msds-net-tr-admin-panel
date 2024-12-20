'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { ThemeToggle } from '@/components/frontend/theme-toggle'
import DynamicLogo from '@/components/frontend/dynamic-logo'

import authService from '@/services/auth.service'

import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
})

export default function LoginClient() {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('loginPage')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await authService.login({
        email: values.email,
        password: values.password,
      })

      if (res?.accessToken) {
        toast({
          title: t('successToast.title'),
          description: t('successToast.description'),
        })
        router.push('/dashboard')
      } else {
        toast({
          title: t('invalidCredentialsToast.title'),
          description: t('invalidCredentialsToast.description'),
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[400px]">
        <CardHeader className="space-y-8">
          <div className="w-full flex justify-center">
            <DynamicLogo imageClassName="w-[240px]" />
          </div>
          <CardTitle className="text-2xl text-center opacity-75">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input placeholder="123" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" loading={isPending}>
                {t('loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
