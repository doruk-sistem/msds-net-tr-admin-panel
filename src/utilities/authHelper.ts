import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

class AuthHelper {
  private secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
  public tokenCookieKey = 'token'
  public refreshTokenCookieKey = 'refreshToken'

  public async encrypt(payload: { userId: number }) {
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(this.secret)

    const refreshToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(this.secret)

    return { accessToken, refreshToken }
  }

  public async decrypt(token: string): Promise<{ userId: number } | null> {
    try {
      const verified = await jwtVerify(token, this.secret)
      return verified.payload as any
    } catch {
      return null
    }
  }

  public async getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get(this.tokenCookieKey)?.value

    if (!token) return null
    return await this.decrypt(token)
  }

  public async getTokens() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(this.tokenCookieKey)?.value
    const refreshToken = cookieStore.get(this.refreshTokenCookieKey)?.value

    return { accessToken, refreshToken }
  }

  public clearSessionFromResponse(response: NextResponse): void {
    response.cookies.delete(this.tokenCookieKey)
    response.cookies.delete(this.refreshTokenCookieKey)
  }

  public async updateSessionWithRequest(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value
    if (!refreshToken) return null

    const decoded = await this.decrypt(refreshToken)
    if (!decoded) return null

    const { accessToken, refreshToken: newRefreshToken } = await this.encrypt(decoded)

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}

const authHelper = new AuthHelper()

export default authHelper
