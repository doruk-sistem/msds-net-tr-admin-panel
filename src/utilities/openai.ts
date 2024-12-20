// node
import { fileURLToPath } from 'url'
import path from 'path'

import dotenv from 'dotenv'
import { AzureOpenAI } from 'openai'
import * as pdf from 'pdf-parse/lib/pdf-parse.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, `../../.env.${process.env.NODE_ENV}`),
})

const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT
const azureApiKey = process.env.AZURE_OPENAI_KEY
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT
const apiVersion = process.env.AZURE_OPENAI_API_VERSION

const client = new AzureOpenAI({
  apiKey: azureApiKey,
  deployment: deploymentName,
  endpoint: azureEndpoint,
  apiVersion,
})

export async function processPDF(dataBuffer: Buffer, question: string) {
  try {
    const pdfData = await pdf(dataBuffer)

    const result = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Sen bir PDF analiz uzmanısın. Kullanıcı PDF içeriğinden bilgi almanı isterse uygun cevaplar ver.',
        },
        { role: 'user', content: `PDF İçeriği:\n${pdfData.text}\n\nSoru: ${question}` },
      ],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 500,
    })

    return result?.choices[0]?.message?.content
  } catch (error) {
    console.error('openai.ts ERROR: ', error)
  }
}
