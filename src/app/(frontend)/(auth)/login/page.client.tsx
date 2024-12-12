'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/frontend/theme-toggle'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
})

export default function LoginClient() {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const auth = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (auth?.ok) {
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
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('title')}</CardTitle>
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
              <Button type="submit" className="w-full">
                {t('loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
