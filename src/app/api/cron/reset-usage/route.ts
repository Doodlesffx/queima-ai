import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Chamado pelo Vercel Cron todo dia à meia-noite UTC (vercel.json).
// O reset on-the-fly em rateLimit.ts já garante os limites por usuário;
// este cron limpa contadores antigos globalmente como backup.

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const today  = new Date().toISOString().split('T')[0];
  const d      = new Date();
  const day    = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + (day === 0 ? -6 : 1 - day));
  const monday = d.toISOString().split('T')[0];

  const [r1, r2, r3] = await Promise.all([
    supabase.from('users').update({ uso_analises: 0, uso_analises_data: today }).neq('uso_analises_data', today),
    supabase.from('users').update({ uso_dietas:   0, uso_dietas_semana: monday }).neq('uso_dietas_semana', monday),
    supabase.from('users').update({ uso_treinos:  0, uso_treinos_semana: monday }).neq('uso_treinos_semana', monday),
  ]);

  const errors = [r1.error, r2.error, r3.error].filter(Boolean);
  if (errors.length) {
    console.error('Cron reset errors:', errors);
    return NextResponse.json({ error: 'Partial failure', errors }, { status: 500 });
  }

  return NextResponse.json({ ok: true, resetAt: new Date().toISOString() });
}
