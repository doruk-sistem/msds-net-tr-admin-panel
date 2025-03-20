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
import payload from 'payload'

// Özel dosya yükleyici import'unu kaldırdık

// Form şema doğrulaması
const formSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
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

  // Dosya yükleme işlemi
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      toast.info('File is being uploaded...')

      const formData = new FormData()
      formData.append('file', file)

      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // API isteği - dosya yükleme
      const uploadResponse = await fetch('/api/fileMedia', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      console.log('Upload response status:', uploadResponse.status)

      const responseText = await uploadResponse.text()
      console.log('Upload raw response:', responseText)

      if (!uploadResponse.ok) {
        throw new Error(`File is not uploaded: ${uploadResponse.status} ${responseText}`)
      }

      // Response is not empty and valid JSON
      if (responseText && responseText.trim()) {
        try {
          const uploadResult = JSON.parse(responseText)
          console.log('Upload result:', uploadResult)

          // ID'yi bulmaya çalış
          if (uploadResult && uploadResult.id) {
            console.log('File ID is found:', uploadResult.id)
            return uploadResult.id
          } else if (uploadResult.doc && uploadResult.doc.id) {
            console.log('File ID is found from doc.id:', uploadResult.doc.id)
            return uploadResult.doc.id
          } else {
            console.error('Valid file ID not found:', uploadResult)
            return null
          }
        } catch (jsonError) {
          console.error('API response is not valid JSON:', jsonError)
          return null
        }
      }
      return null
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('File upload failed. Your request will be created without a file.')
      return null
    }
  }

  // MSDS talebi oluşturma
  const createMsdsRequest = async (
    values: z.infer<typeof formSchema>,
    fileId: string | null,
    userData: any,
  ): Promise<boolean> => {
    try {
      // MSDS request creation
      const msdsRequest = await payload.create({
        collection: 'msdsRequests',
        data: {
          productName: values.productName,
          description: values.description,
          status: 'pending',
          company: userData.company,
          requestedBy: userData.id,
        },
        file: {
          data: selectedFile,
          mimetype: selectedFile?.type || '',
          name: selectedFile?.name || '',
          size: selectedFile?.size || 0,
        },
      })

      // Dosya ID'si varsa ekle
      // if (fileId) {
      //   requestData.sdsFile = fileId
      // }

      console.log('MSDS request is sending:', requestData)

      // Talep oluştur
      // const msdsResponse = await fetch('/api/msdsRequests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(requestData),
      // })

      // const msdsResponseText = await msdsResponse.text()
      // console.log('MSDS request response:', msdsResponseText)

      // if (!msdsResponse.ok) {
      //   throw new Error(`Request could not be created: ${msdsResponse.status} ${msdsResponseText}`)
      // }

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

    try {
      setIsLoading(true)

      // 1. Dosya yükleme (varsa)
      let fileId: string | null = null
      // if (selectedFile) {
      //   fileId = await uploadFile(selectedFile)
      // }

      // 2. MSDS talebi oluşturma
      const success = await createMsdsRequest(values, fileId, user)

      // 3. Sonuç bildirimi
      if (success) {
        toast.success('MSDS request has been created successfully')

        if (fileId) {
          toast.success('File has been uploaded successfully')
        } else if (selectedFile) {
          toast.warning('File could not be uploaded, request created without a file')
        }

        // 4. Form sıfırlama
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
              <FormLabel>{t('dashboardPage.msdsRequestForm.formFile.title')}</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
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
