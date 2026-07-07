import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export type Resource = 'analise' | 'dieta' | 'treino';

const LIMITS = {
  free: { analise: 1,  dieta: 1, treino: 3 },
  pro:  { analise: 10, dieta: 3, treino: 5 },
} as const;

const FREE_MESSAGES: Record<Resource, string> = {
  analise: 'Você atingiu o limite de 1 análise por dia no plano gratuito. Faça upgrade para PRO e analise até 10 vezes ao dia.',
  dieta:   'Você atingiu o limite de 1 dieta por semana no plano gratuito. Faça upgrade para PRO e gere até 3 dietas por dia.',
  treino:  'Você atingiu o limite de 3 treinos por semana no plano gratuito. Faça upgrade para PRO e gere até 5 treinos por dia.',
};

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function currentMondayISO(): string {
  const d = new Date();
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return d.toISOString().split('T')[0];
}

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; response: NextResponse };

export async function checkAndIncrement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  resource: Resource
): Promise<RateLimitResult> {
  const { data: profile } = await supabase
    .from('users')
    .select('plan, uso_analises, uso_analises_data, uso_dietas, uso_dietas_semana, uso_treinos, uso_treinos_semana')
    .eq('id', userId)
    .single();

  if (!profile) {
    return {
      allowed: false,
      response: NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 }),
    };
  }

  const plan: 'free' | 'pro' = profile.plan === 'pro' ? 'pro' : 'free';
  const limit = LIMITS[plan][resource];
  const today = todayISO();
  const monday = currentMondayISO();

  let count: number;
  const updates: Record<string, string | number> = {};

  if (resource === 'analise') {
    // Diário: reseta se a data mudou
    if (profile.uso_analises_data !== today) {
      count = 0;
      updates.uso_analises_data = today;
    } else {
      count = profile.uso_analises ?? 0;
    }
  } else if (resource === 'dieta') {
    // Semanal: reseta se a semana mudou
    if (profile.uso_dietas_semana !== monday) {
      count = 0;
      updates.uso_dietas_semana = monday;
    } else {
      count = profile.uso_dietas ?? 0;
    }
  } else {
    // treino — semanal
    if (profile.uso_treinos_semana !== monday) {
      count = 0;
      updates.uso_treinos_semana = monday;
    } else {
      count = profile.uso_treinos ?? 0;
    }
  }

  if (count >= limit) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: plan === 'free'
            ? FREE_MESSAGES[resource]
            : 'Serviço temporariamente indisponível, tente mais tarde.',
          limitReached: true,
        },
        { status: 429 }
      ),
    };
  }

  // Incrementa o contador
  if (resource === 'analise')  updates.uso_analises = count + 1;
  else if (resource === 'dieta') updates.uso_dietas = count + 1;
  else                           updates.uso_treinos = count + 1;

  await supabase.from('users').update(updates).eq('id', userId);

  return { allowed: true };
}
