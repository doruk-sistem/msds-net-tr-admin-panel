import { processPDF } from '@/utilities/openai'
import { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'

export const aiScanning: BeforeChangeHook = async ({ req, operation, data }) => {
  if ((operation === 'create' || operation === 'update') && req.file?.data && data?.aiScanning) {
    type PromptKeys = Record<
      string,
      { type: any; description: string; afterScanning?: (value: any) => Promise<any> }
    >

    const promptKeys = {
      msdsCreatedAt: {
        type: 'Date',
        description: `Hazırlama Tarihi`,
        afterScanning: async (value: string) =>
          typeof value === 'string' ? new Date(value) : undefined,
      },
      formNo: {
        type: 'string',
        description: `Form No. (Bulamazsan undefined olarak ver.)`,
      },
      msdsUpdatedAt: {
        type: 'Date',
        description: `Yeniden Düzenleme Tarihi ("Yeni Düzenleme Tarihi" olarak da belirtilmiş olabilir.)`,
        afterScanning: async (value: string) =>
          typeof value === 'string' ? new Date(value) : undefined,
      },
      updatedCount: {
        type: 'number',
        description: `Düzenleme Sayısı veya kaçıncı düzenleme olduğu (ondalık sayı olabilir, örn: 1.1, 1.2, 2.5)`,
        afterScanning: async (value: string | number) =>
          typeof value === 'string' ? parseFloat(value) : value,
      },
      author: {
        type: 'string',
        description: `Kimyasal Değerlendirme Uzmanı`,
      },
      certificateDate: {
        type: 'Date',
        description: `Sertifika Tarihi (Bu bilgi direkt olarak "Sertifika Tarihi" olarak belirtilmemiş olabilir. Eğer belirtilmemişse 16.2 numaralı bölümdeki KDU numarasından sonraki tarih bilgilerini kullan.)`,
        afterScanning: async (value: string) =>
          typeof value === 'string' ? new Date(value) : undefined,
      },
      contentLanguage: {
        type: {
          name: 'string',
          code: 'string',
        },
        description: `İçerik Dili. "code" değeri Türkçe ise "tr", İngilizce ise "en" gibi olmalı. "name" değeri kendi dilinde yazılmalıdır. (Örneğin Türkçe için "Türkçe", İngilizce için "English" gibi...)`,
        afterScanning: async (value?: { code: string; name: string }) => {
          if (!value || !value?.code) {
            return undefined
          }

          // If the content_language is not undefined, find the content language in the content-languages collection
          let contentLanguage: number | undefined = undefined

          try {
            const response = await req.payload.find({
              collection: 'contentLanguages',
              where: {
                code: {
                  equals: value?.code,
                },
              },
            })

            contentLanguage = response.docs[0].id
          } catch {
            try {
              if (value?.code && value?.name) {
                const response = await req.payload.create({
                  collection: 'contentLanguages',
                  data: {
                    name: value.name,
                    code: value.code,
                  },
                })

                contentLanguage = response.id
              }
            } catch (error) {
              console.error('aiScanning contentLanguage create error: ', error)
            }
          }

          return contentLanguage
        },
      },
    } satisfies PromptKeys

    const promptKeysToProcess = Object.keys(promptKeys).filter((key) => !data[key])

    if (promptKeysToProcess.length === 0) {
      console.log('No prompt keys to process')

      return data
    }

    const result = await processPDF(
      req.file?.data,
      `Sana bir pdf dosyası vereceğim. Aşağıda yorum satırı olarak belirttiğim bilgileri oku ve onları aşağıdaki gibi bir json nesnesi olarak ver:
        {
          ${promptKeysToProcess
            .map(
              (key) =>
                `${key}: ${JSON.stringify(promptKeys[key].type)} // ${promptKeys[key].description}`,
            )
            .join('\n')}
        }
        Bulamadığın bilgileri undefined olarak ver.
        Belirttiğim bilgiler farklı dillerde de yazılmış olabilir. Farklı dillerde yazılmışsa bilgileri çevirerek doğru bilgiyi bul.
      `,
    )

    if (typeof result === 'string') {
      // Remove the ```json and ``` from the result
      const jsonString = result.replace(/```json|```/g, '').trim()

      // Parse the jsonString to a json object
      const jsonObject = JSON.parse(jsonString) as Record<keyof typeof promptKeys, any>

      const processedData = await Promise.all(
        promptKeysToProcess.map(async (key) => {
          const value = promptKeys[key].afterScanning
            ? await promptKeys[key].afterScanning(jsonObject[key])
            : jsonObject[key]
          return { [key]: value }
        }),
      )

      const newData = {
        ...data,
        ...processedData.reduce((acc, item) => ({ ...acc, ...item }), {}),
      }

      return newData
    }
  }

  return data
}
