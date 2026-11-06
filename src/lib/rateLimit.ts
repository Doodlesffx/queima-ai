import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export type Resource = 'analise' | 'dieta' | 'treino';

const LIMITS = {
  free: { analise: 1,  dieta: 1, treino: 3 },
  pro:  { analise: 10, dieta: 3, treino: 5 },
} as const;

const FREE_MESSAGES: Record<Resource, string> = {
  analise: 'Você atingiu o limite de 1 análise por dia no plano gratuito. No PRO o uso é ilimitado no dia a dia.',
  dieta:   'Você atingiu o limite de 1 dieta por semana no plano gratuito. No PRO o uso é ilimitado no dia a dia.',
  treino:  'Você atingiu o limite de 3 treinos por semana no plano gratuito. No PRO o uso é ilimitado no dia a dia.',
};

const PRO_FAIR_USE_MESSAGE =
  'Detectamos um volume de uso fora do comum nesta conta. Tente novamente amanhã.';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function currentMondayISO(): string {
  const d = new Date();
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return d.toISOString().split('T')[0];
}

type RateLimitBlocked = { allowed: false; response: NextResponse };

type UsageState = {
  updates: Record<string, string | number>;
  nextCount: number;
};

async function getUsageState(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  resource: Resource
): Promise<RateLimitBlocked | { allowed: true; userId: string; state: UsageState }> {
  const { data: profile } = await supabase
    .from('users')
    .select('plan, is_admin, uso_analises, uso_analises_data, uso_dietas, uso_dietas_semana, uso_treinos, uso_treinos_semana')
    .eq('id', userId)
    .single();

  if (!profile) {
    return {
      allowed: false,
      response: NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 }),
    };
  }

  if (profile.is_admin) {
    return { allowed: true, userId, state: { updates: {}, nextCount: 0 } };
  }

  const plan: 'free' | 'pro' = profile.plan === 'pro' ? 'pro' : 'free';
  const limit = LIMITS[plan][resource];
  const today = todayISO();
  const monday = currentMondayISO();

  let count: number;
  const updates: Record<string, string | number> = {};

  if (resource === 'analise') {
    if (profile.uso_analises_data !== today) {
      count = 0;
      updates.uso_analises_data = today;
    } else {
      count = profile.uso_analises ?? 0;
    }
  } else if (resource === 'dieta') {
    // Grátis: 1 por semana. PRO: teto diário de uso justo (anti-abuso).
    const periodKey = plan === 'pro' ? today : monday;
    if (profile.uso_dietas_semana !== periodKey) {
      count = 0;
      updates.uso_dietas_semana = periodKey;
    } else {
      count = profile.uso_dietas ?? 0;
    }
  } else {
    const periodKey = plan === 'pro' ? today : monday;
    if (profile.uso_treinos_semana !== periodKey) {
      count = 0;
      updates.uso_treinos_semana = periodKey;
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
            : PRO_FAIR_USE_MESSAGE,
          limitReached: true,
        },
        { status: 429 }
      ),
    };
  }

  if (resource === 'analise')  updates.uso_analises = count + 1;
  else if (resource === 'dieta') updates.uso_dietas = count + 1;
  else                           updates.uso_treinos = count + 1;

  return { allowed: true, userId, state: { updates, nextCount: count + 1 } };
}

export async function checkRateLimit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  resource: Resource
): Promise<{ allowed: true } | RateLimitBlocked> {
  const result = await getUsageState(supabase, userId, resource);
  if (!result.allowed) return result;
  return { allowed: true };
}

export async function incrementUsage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  resource: Resource
): Promise<void> {
  const result = await getUsageState(supabase, userId, resource);
  if (!result.allowed) return;
  if (Object.keys(result.state.updates).length === 0) return;

  const { error } = await supabase.from('users').update(result.state.updates).eq('id', userId);
  if (error) console.error('Erro ao registrar uso:', error);
}
