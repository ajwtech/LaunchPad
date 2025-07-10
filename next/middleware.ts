import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from '@/i18n.config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string {
  try {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    // Filter out invalid locales and ensure we have valid locale strings
    const validLanguages = languages.filter(lang => 
      typeof lang === 'string' && 
      lang.length > 0 && 
      /^[a-z]{2}(-[A-Z]{2})?$/.test(lang)
    )

    if (validLanguages.length === 0) {
      return i18n.defaultLocale
    }

    return matchLocale(validLanguages, locales, i18n.defaultLocale)
  } catch (error) {
    console.warn('Locale detection failed, falling back to default:', error)
    return i18n.defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and `/demo/` paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|demo).*)']
}