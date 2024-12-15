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
  const { session } = useAuth()
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
    console.log('data: ', data)

    try {
      if (session?.auth.accessToken && company?.id) {
        setIsLoading(true)

        const response = await companyRequest.updateCompany({
          id: company.id,
          accessToken: session?.auth?.accessToken,
          body: {
            companyName: data.name.trim(),
            phoneNumber: data.phoneNumber.trim(),
            address: data.address.trim(),
          },
        })

        console.log('response: ', response)

        toast({
          title: 'Company information updated',
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
    company?.companyName === form.watch('name') &&
    company.phoneNumber === form.watch('phoneNumber') &&
    company.address === form.watch('address')

  return (
    <>
      <Card className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('companyName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{t('phoneDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{t('addressDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button type="submit" disabled={notChanged} loading={isLoading}>
                {t('saveChanges')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
