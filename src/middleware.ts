import { NextRequest, NextResponse } from 'next/server'

import authHelper from './utilities/authHelper'

export const PRIVATE_BASE_PATH = '/dashboard'
export const AUTH_PATH = '/login'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isRootPath = pathname === '/'

  const token = request.cookies.get(authHelper.tokenCookieKey)?.value
  const refreshToken = request.cookies.get(authHelper.refreshTokenCookieKey)?.value

  if (pathname.startsWith(AUTH_PATH) || isRootPath) {
    if (token && refreshToken) {
      return NextResponse.redirect(new URL(PRIVATE_BASE_PATH, request.url))
    }
    if (isRootPath) {
      return NextResponse.redirect(new URL(AUTH_PATH, request.url))
    }
    return NextResponse.next()
  }

  // protected routes
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url))
  }

  try {
    const hasValidToken = token && (await authHelper.decrypt(token))

    if (hasValidToken) {
      return NextResponse.next()
    }

    // try to refresh the token
    const session = await authHelper.updateSessionWithRequest(request)

    if (session) {
      return NextResponse.next({
        headers: {
          'Set-Cookie': [
            `token=${session.accessToken}; Path=/; HttpOnly; SameSite=Strict`,
            `refreshToken=${session.refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
          ].join(', '),
        },
      })
    }

    const response = NextResponse.redirect(new URL(AUTH_PATH, request.url))
    authHelper.clearSessionFromResponse(response)

    return response
  } catch (error) {
    console.log('token refresh error: ', error)
    return NextResponse.redirect(new URL(AUTH_PATH, request.url))
  }
}

/**
 * Next JS Middleware Config
 *
 * About matcher:
 * "Middleware will be invoked for every route in your project.
 * Given this, it's crucial to use matchers to precisely target or exclude specific routes."
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths
 */
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
