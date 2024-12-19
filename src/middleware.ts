import { NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

const privatePages = ['/dashboard']
const authPages = ['/login']

const isInPage = (currentPathname: string, pages: string[]) => {
  return pages.some((page) => currentPathname.startsWith(page))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPage = isInPage(pathname, authPages)
  const isPrivatePage = isInPage(pathname, privatePages)
  const atBlankPage = pathname === '/'

  const token = await getToken({
    req,
    secret: '7e221b8caf590d540e2c43bb465511b129af897e5b338bbdb4bdd8582acf317b',
  })

  if (!token && atBlankPage) return NextResponse.redirect(new URL('/login', req.url))
  if (!token && isPrivatePage) return NextResponse.redirect(new URL('/login', req.url))
  if (!token && isAuthPage) return NextResponse.next()
  if (token) {
    if (isPrivatePage) {
      return NextResponse.next()
    }

    if (isAuthPage || atBlankPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
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
