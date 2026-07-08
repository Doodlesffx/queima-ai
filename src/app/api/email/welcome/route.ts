import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { name } = await req.json().catch(() => ({}));
  const displayName = name || user.email.split('@')[0];

  try {
    await sendWelcomeEmail(user.email, displayName);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar welcome email:', err);
    return NextResponse.json({ error: 'Falha ao enviar email' }, { status: 500 });
  }
}
