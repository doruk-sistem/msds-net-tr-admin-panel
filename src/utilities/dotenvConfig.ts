import dotenv from 'dotenv'
import path from 'path'

export default function dotenvConfig(dirname, envPath: string) {
  dotenv.config({
    path: path.resolve(dirname, envPath),
  })
}
