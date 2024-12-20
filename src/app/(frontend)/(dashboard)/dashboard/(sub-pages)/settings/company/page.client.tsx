'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { DataFromCollectionSlug } from 'payload'

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

import companyRequest from '@/requests/company'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
  name: z.string().min(2).max(30),
  phoneNumber: z.string().min(2).max(20),
  address: z.string().min(2).max(40),
})

interface Props {
  serverData: {
    company: DataFromCollectionSlug<'companies'> | undefined
  }
}

export default function CompanySettingsPageClient({ serverData: { company } }: Props) {
  const { toast } = useToast()
  const t = useTranslations('settingsPage.companySettingsPage')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.companyName || '',
      phoneNumber: company?.phoneNumber || '',
      address: company?.address,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if (company?.id) {
        await companyRequest.updateCompany({
          id: company.id,
          body: {
            companyName: data.name.trim(),
            phoneNumber: data.phoneNumber.trim(),
            address: data.address.trim(),
          },
        })

        toast({
          title: 'Company information updated',
          description: 'Your user settings have been saved successfully.',
        })
      } else {
        toast({
          title: 'Company not found',
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
    company?.companyName === form.watch('name') &&
    company.phoneNumber === form.watch('phoneNumber') &&
    company.address === form.watch('address')

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        className={`border-none shadow-md ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('companyName')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11" />
                      </FormControl>
                      <FormDescription>{t('companyNameDescription')}</FormDescription>
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
                        <FormLabel className="text-base">{t('phone')}</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
                        <FormDescription>{t('phoneDescription')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-base">{t('address')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11" />
                      </FormControl>
                      <FormDescription>{t('addressDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={notChanged}
                  loading={isLoading}
                  className="min-w-[150px]"
                >
                  {t('saveChanges')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
