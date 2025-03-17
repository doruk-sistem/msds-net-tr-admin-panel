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
// Özel dosya yükleyici import'unu kaldırdık

// Form şema doğrulaması
const formSchema = z.object({
  productName: z.string().min(3, 'Ürün adı en az 3 karakter olmalıdır'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
})

type MsdsRequestFormProps = {
  onSuccess?: () => void
}

export const MsdsRequestForm = ({ onSuccess }: MsdsRequestFormProps) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('Oturum bulunamadı')
      return
    }

    try {
      setIsLoading(true)
      let fileId = null

      // Dosya yükleme kısmı
      if (selectedFile) {
        try {
          toast.info('Dosya yükleniyor...')

          const formData = new FormData()
          formData.append('file', selectedFile)

          console.log('Dosya bilgileri:', {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
          })

          // API isteği - dosya yükleme
          const uploadResponse = await fetch('/api/fileMedia', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          })

          console.log('Yükleme yanıt durumu:', uploadResponse.status)

          const responseText = await uploadResponse.text()
          console.log('Yükleme ham yanıtı:', responseText)

          if (!uploadResponse.ok) {
            throw new Error(`Dosya yüklenemedi: ${uploadResponse.status} ${responseText}`)
          }

          // Yanıt boş değilse ve geçerli JSON ise işle
          if (responseText && responseText.trim()) {
            try {
              const uploadResult = JSON.parse(responseText)
              console.log('Yükleme sonucu:', uploadResult)

              // ID'yi bulmaya çalış
              if (uploadResult && uploadResult.id) {
                fileId = uploadResult.id
                console.log("Dosya ID'si alındı:", fileId)
              } else if (uploadResult.doc && uploadResult.doc.id) {
                fileId = uploadResult.doc.id
                console.log("Dosya ID'si doc.id'den alındı:", fileId)
              } else {
                console.error("Geçerli dosya ID'si bulunamadı:", uploadResult)
              }
            } catch (jsonError) {
              console.error('API yanıtı geçerli JSON değil:', jsonError)
            }
          }
        } catch (uploadError) {
          console.error('Dosya yükleme hatası:', uploadError)
          toast.error('Dosya yüklenirken bir hata oluştu. Talebiniz dosyasız oluşturulacak.')
          // Hata olsa bile işlemi devam ettir, dosyasız gönderr
        }
      }

      // MSDS talebi oluşturma
      const requestData: Record<string, any> = {
        productName: values.productName,
        description: values.description,
        status: 'pending',
        company: user.company,
        requestedBy: user.id,
      }

      // Dosya ID'si varsa ekle
      if (fileId) {
        requestData.sdsFile = fileId
      }

      console.log('MSDS talebi gönderiliyor:', requestData)

      // Talep oluştur
      const msdsResponse = await fetch('/api/msdsRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData),
      })

      const msdsResponseText = await msdsResponse.text()
      console.log('MSDS talebi yanıtı:', msdsResponseText)

      if (!msdsResponse.ok) {
        throw new Error(`Talep oluşturulamadı: ${msdsResponse.status} ${msdsResponseText}`)
      }

      // Başarılı
      toast.success('MSDS talebi başarıyla oluşturuldu')

      if (fileId) {
        toast.success('Dosya başarıyla yüklendi')
      } else if (selectedFile) {
        toast.warning('Dosya yüklenemedi, talep dosyasız oluşturuldu')
      }

      onSuccess?.()
      form.reset()
      setSelectedFile(null)
    } catch (error) {
      console.error('Talep oluşturma hatası:', error)
      toast.error(`Talep oluşturulurken bir hata oluştu: ${error.message || error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni MSDS Talebi</CardTitle>
        <CardDescription>Ürün güvenlik bilgi formu talebinizi oluşturun.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Kozmetik Ürünü" {...field} />
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
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="MSDS talebi hakkında detaylı bilgi verin"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>SDS Dosyası (İsteğe Bağlı)</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
              </FormControl>
              <FormDescription>
                Ürün güvenlik bilgi formunu PDF veya Word formatında yükleyebilirsiniz.
              </FormDescription>
              {/* Dosya bilgisini FormDescription dışında gösterelim */}
              {selectedFile && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Seçilen dosya: </span>
                  <span>{selectedFile.name} </span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </FormItem>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Talep Oluşturuluyor...' : 'Talep Oluştur'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Talebiniz oluşturulduktan sonra durumunu izleyebilirsiniz.
      </CardFooter>
    </Card>
  )
}
