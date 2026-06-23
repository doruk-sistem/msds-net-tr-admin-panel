// node
import { fileURLToPath } from 'url'
import path from 'path'

import dotenv from 'dotenv'
import OpenAI from 'openai'
import * as pdf from 'pdf-parse/lib/pdf-parse.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, `../../.env.${process.env.NODE_ENV}`),
})
dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

let client: OpenAI | null = null

function getClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    client = new OpenAI({ apiKey })
  }

  return client
}

export async function processPDF(dataBuffer: Buffer, question: string) {
  try {
    const pdfData = await pdf(dataBuffer)

    const result = await getClient().chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Sen bir PDF analiz uzmanısın. Kullanıcı PDF içeriğinden bilgi almanı isterse uygun cevaplar ver.',
        },
        { role: 'user', content: `PDF İçeriği:\n${pdfData.text}\n\nSoru: ${question}` },
      ],
      model,
      temperature: 0.7,
      max_tokens: 500,
    })

    return result?.choices[0]?.message?.content
  } catch (error) {
    console.error('openai.ts ERROR: ', error)
  }
}
