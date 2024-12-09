import 'server-only'

import jwt from 'jsonwebtoken'

import dotenvConfig from './dotenvConfig'

dotenvConfig(`../../.env.${process.env.NODE_ENV}`)

const JWT_SECRET = process.env.JWT_SECRET || ''

export function signJWT(payload: string | Buffer | object, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyJWT(
  token: string,
  options?: jwt.VerifyOptions & {
    complete: true
  },
) {
  return jwt.verify(token, JWT_SECRET, options)
}
