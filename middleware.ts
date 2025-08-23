import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // user can't access auth url after login
  if (session && ['/sign-in', '/sign-up'].includes(pathname)) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (session.role === 'applicant') {
      return NextResponse.redirect(new URL('/applicant', req.url))
    }
  }

  // checking if user can access /dashboard only admin
  if (pathname.startsWith('/dashboard') && session?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // checking if user can access /applicant only applicant
  if (pathname.startsWith('/applicant') && session?.role !== 'applicant') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
