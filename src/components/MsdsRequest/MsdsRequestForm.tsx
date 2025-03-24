import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import useAuth from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { CardFooter } from '@/components/ui/card'
import { CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'

// Özel dosya yükleyici import'unu kaldırdık

// Form şema doğrulaması
const formSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  // We'll validate the file separately since it's not part of the form state
})

type MsdsRequestFormProps = {
  onSuccess?: () => void
}

export const MsdsRequestForm = ({ onSuccess }: MsdsRequestFormProps) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const t = useTranslations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      description: '',
    },
  })

  // Dosya seçim işleyicisi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    setSelectedFile(file)
  }

  // We no longer need a separate uploadFile function as we're handling the file upload
  // directly in the createMsdsRequest function

  // MSDS talebi oluşturma
  const createMsdsRequest = async (
    values: z.infer<typeof formSchema>,
    userData: any,
  ): Promise<boolean> => {
    try {
      if (!selectedFile) {
        toast.error('Please select a file')
        return false
      }

      toast.info('Creating request with file...')

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('productName', values.productName)
      formData.append('description', values.description)
      formData.append('status', 'pending')
      formData.append('company', userData.company)
      formData.append('requestedBy', userData.id)

      // Create MSDS request with file through API
      const msdsResponse = await fetch('/api/msds-requests', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!msdsResponse.ok) {
        const errorText = await msdsResponse.text()
        throw new Error(`Request could not be created: ${msdsResponse.status} ${errorText}`)
      }

      const msdsResult = await msdsResponse.json()
      console.log('MSDS request created with file:', msdsResult)
      return true
    } catch (error) {
      console.error('MSDS request creation error:', error)
      throw error
    }
  }

  // Form gönderimi ana fonksiyonu
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('Oturum bulunamadı')
      return
    }

    // Validate file is selected
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    try {
      setIsLoading(true)

      // Create MSDS request with file
      const success = await createMsdsRequest(values, user)

      // Show success message
      if (success) {
        toast.success('MSDS request has been created successfully')
        toast.success('File has been uploaded successfully')

        // Form sıfırlama
        onSuccess?.()
        form.reset()
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Request creation error:', error)
      toast.error(`Request creation failed: ${error.message || error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboardPage.msdsRequestForm.title')}</CardTitle>
        <CardDescription>{t('dashboardPage.msdsRequestForm.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboardPage.msdsRequestForm.productName.title')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('dashboardPage.msdsRequestForm.productName.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboardPage.msdsRequestForm.formDescription.title')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('dashboardPage.msdsRequestForm.formDescription.placeholder')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>{t('dashboardPage.msdsRequestForm.formFile.title')} *</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </FormControl>
              <FormDescription>
                {t('dashboardPage.msdsRequestForm.formFile.description')}
              </FormDescription>
              {selectedFile && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">
                    {t('dashboardPage.msdsRequestForm.formFile.selectedFile')}:{' '}
                  </span>
                  <span>{selectedFile.name} </span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </FormItem>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? t('dashboardPage.msdsRequestForm.requestButtonLoading')
                : t('dashboardPage.msdsRequestForm.requestButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {t('dashboardPage.msdsRequestForm.footer')}
      </CardFooter>
    </Card>
  )
}
