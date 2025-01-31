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

import DynamicLogo from '@/components/frontend/dynamic-logo'

import authService from '@/services/auth.service'

import { useToast } from '@/hooks/use-toast'
import AuthLayout from '@/components/frontend/auth-layout'
import { MoveLeft } from 'lucide-react'

const formSchema = z.object({
  password: z.string().min(3),
})

interface ResetPasswordPageClientProps {
  hasExpired: boolean
}

export default function ResetPasswordPageClient({ hasExpired }: ResetPasswordPageClientProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

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
      try {
        await authService.resetPassword({
          token: token!,
          password: values.password,
        })

        toast({
          title: t('resetPasswordPage.successToast.title'),
          description: t('resetPasswordPage.successToast.description'),
        })
        router.push('/')
      } catch {
        toast({
          title: t('resetPasswordPage.invalidUserToast.title'),
          description: t('resetPasswordPage.invalidUserToast.description'),
        })
      }
    })
  }

  if (hasExpired) {
    return (
      <AuthLayout>
        <div className="w-full max-w-[400px] order-1 lg:order-2">
          <div className="w-full flex flex-col items-center mb-6 lg:mb-8 space-y-7">
            <h3 className="text-2xl font-bold">{t('resetPasswordPage.hasExpiredTitle')}</h3>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              {t('resetPasswordPage.hasExpiredDescription')}
            </p>
            <Button
              type="submit"
              className="w-full h-12 mt-4 font-medium shadow-sm hover:shadow-lg transition-shadow"
              onClick={() => router.push('/')}
            >
              <MoveLeft className="w-4 h-4 mr-2" />
              {t('common.backToLogin')}
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] order-1 lg:order-2">
        <div className="w-full flex flex-col items-center mb-6 lg:mb-8 space-y-7">
          <DynamicLogo imageClassName="w-[160px] lg:w-[180px] mx-auto lg:mx-0 hover:opacity-90 transition-all" />
          <div className="flex flex-col gap-2 text-center">
            <h3 className="text-2xl font-bold">{t('resetPasswordPage.title')}</h3>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              {t('resetPasswordPage.description')}
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
                        {t('common.newPassword')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('common.newPassword')}
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
                  {t('common.resetPassword')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
