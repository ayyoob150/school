// /middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = url.hostname;

  const subdomain = hostname.split('.')[0];
    url.searchParams.set('school', subdomain);
    return NextResponse.rewrite(url);

}

export const config = {
  matcher: '/', 
};
