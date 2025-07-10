import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const locales = ['en'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api')
  ) return;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`)
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }
}
