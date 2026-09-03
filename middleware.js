import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = process.env.APP_USER;
  const password = process.env.APP_PASSWORD;
  if (!user || !password) return NextResponse.next();

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const i = decoded.indexOf(':');
      const gotUser = decoded.slice(0, i);
      const gotPass = decoded.slice(i + 1);
      if (gotUser === user && gotPass === password) return NextResponse.next();
    } catch {}
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Carousel Factory"' }
  });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
