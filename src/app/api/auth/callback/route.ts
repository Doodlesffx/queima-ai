// ============================================
// AUTH CALLBACK - QUEIMA AI (CORRIGIDO)
// Caminho: src/app/api/auth/callback/route.ts
//
// CORREÇÕES:
// - Trocado @supabase/auth-helpers-nextjs (descontinuado) por @supabase/ssr
// - Compatível com Next.js 15 (cookies() agora é async)
// - Não tenta mais criar registro na tabela users no client
//   (isso agora é feito pelo TRIGGER no Supabase — ver SQL no final do pacote)
// ============================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado quando chamado de um Server Component
          }
        },
      },
    }
  );

  // Troca o code pela sessão (cria os cookies de auth)
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('Erro ao trocar code por sessão:', exchangeError);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // O TRIGGER do Supabase já criou o registro em public.users.
  // Aqui só decidimos pra onde mandar o usuário.
  const { data: profile } = await supabase
    .from('users')
    .select('quiz_completed')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.quiz_completed) {
    return NextResponse.redirect(new URL('/quiz', request.url));
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
