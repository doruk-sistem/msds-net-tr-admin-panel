import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default function dotenvConfig(envPath: string) {
  dotenv.config({
    path: path.resolve(dirname, envPath),
  })
}
