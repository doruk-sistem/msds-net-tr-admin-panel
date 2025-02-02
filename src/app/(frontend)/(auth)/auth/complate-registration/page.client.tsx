'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

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
import { Card, CardContent } from '@/components/ui/card'

import { ThemeToggle } from '@/components/frontend/theme-toggle'
import DynamicLogo from '@/components/frontend/dynamic-logo'

import authService from '@/services/auth.service'

import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  password: z.string().min(3),
})

export default function ComplateRegistrationPageClient() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await authService.complateRegistration({
        email: email!,
        password: values.password,
      })

      if (res?.success) {
        toast({
          title: t('complateRegistrationPage.successToast.title'),
          description: t('complateRegistrationPage.successToast.description'),
        })
        router.push('/')
      } else {
        toast({
          title: t('complateRegistrationPage.invalidUserToast.title'),
          description: t('complateRegistrationPage.invalidUserToast.description'),
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-8">
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.4)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-100" />
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90" />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="container max-w-6xl relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        <div className="w-full max-w-[400px] order-1 lg:order-2">
          <div className="w-full flex flex-col items-center mb-6 lg:mb-8 space-y-7">
            <DynamicLogo imageClassName="w-[160px] lg:w-[180px] mx-auto lg:mx-0 hover:opacity-90 transition-all" />
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-2xl font-bold">{t('complateRegistrationPage.title')}</h3>
              <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0">
                {t('complateRegistrationPage.description')}
              </p>

              <p className="mt-4 text-muted-foreground !text-sm font-bold lg:text-lg mx-auto">
                {email}
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-card/50 dark:bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t('loginPage.password')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            {...field}
                            className="h-12 bg-background/50 dark:bg-background/50 border-border/30 dark:border-border/20 focus:border-primary/50 focus:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 font-medium shadow-sm hover:shadow-lg transition-shadow"
                    loading={isPending}
                  >
                    {t('common.complate')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
