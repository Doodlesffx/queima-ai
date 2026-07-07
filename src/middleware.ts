import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() valida o JWT no servidor — mais seguro que getSession() em middleware
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('quiz_completed')
      .eq('id', user.id)
      .single();

    if (!userData?.quiz_completed && pathname !== '/quiz') {
      return NextResponse.redirect(new URL('/quiz', req.url));
    }

    if (userData?.quiz_completed && pathname === '/quiz') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (pathname === '/' || pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/quiz',
    '/dashboard',
    '/calories',
    '/diet',
    '/workout',
    '/history',
    '/evolution',
    '/body-simulator',
    '/upgrade',
    '/ranking',
    '/profile/:path*',
  ],
};
