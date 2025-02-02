'use client'

import { useTransition, useState } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'

import { ThemeToggle } from '@/components/frontend/theme-toggle'
import DynamicLogo from '@/components/frontend/dynamic-logo'

import authService from '@/services/auth.service'

import { useToast } from '@/hooks/use-toast'
import { CircleCheckBig, MoveLeft } from 'lucide-react'
import AuthLayout from '@/components/frontend/auth-layout'

const formSchema = z.object({
  email: z.string().email(),
})

export default function ResetPasswordEmailPageClient() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await authService.resetPasswordEmail({
        email: values.email,
      })

      if (res?.success) {
        setIsSuccess(true)
      } else {
        toast({
          title: t('resetPasswordEmailPage.invalidUserToast.title'),
          description: t('resetPasswordEmailPage.invalidUserToast.description'),
        })
      }
    })
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-[400px] border-0 shadow-xl bg-card/50 dark:bg-card/50 backdrop-blur-sm relative z-10">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
            <DynamicLogo imageClassName="w-[160px] lg:w-[180px] mx-auto hover:opacity-90 transition-all" />
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                <CircleCheckBig className="w-6 h-6 text-green-500" />
                {t('resetPasswordEmailPage.successToast.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('resetPasswordEmailPage.successToast.description')}
              </p>
            </div>
            <Button
              onClick={() => router.push('/')}
              className="w-full h-12 font-medium shadow-sm hover:shadow-lg transition-shadow"
            >
              <MoveLeft className="w-4 h-4 mr-2" />
              {t('common.backToLogin')}
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] order-1 lg:order-2">
        <div className="w-full flex flex-col items-center mb-6 lg:mb-8 space-y-7">
          <DynamicLogo imageClassName="w-[160px] lg:w-[180px] mx-auto lg:mx-0 hover:opacity-90 transition-all" />
          <div className="flex flex-col gap-2 text-center">
            <h3 className="text-2xl font-bold">{t('resetPasswordEmailPage.title')}</h3>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              {t('resetPasswordEmailPage.description')}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 dark:bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">{t('common.email')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
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
                  {t('resetPasswordEmailPage.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
