import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkRateLimit, incrementUsage } from '@/lib/rateLimit';
import { parseJsonContent, aiChatCompletion } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { local, nivel, frequencia, objetivo, peso, altura } = await req.json();

    if (!local || !nivel || !frequencia || !objetivo) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const cacheKey = `${local}:${nivel}:${frequencia}:${objetivo}`;

    const { data: cached } = await supabase
      .from('workout_cache')
      .select('resultado')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cached) {
      return NextResponse.json(cached.resultado);
    }

    const rateLimit = await checkRateLimit(supabase, user.id, 'treino');
    if (!rateLimit.allowed) return rateLimit.response;

    // Cache miss — gera com IA (Groq)
    const prompt = `
Você é personal trainer. Crie plano de treino:
- Local: ${local === 'casa' ? 'Casa (sem equipamentos)' : 'Academia'}
- Nível: ${nivel}
- Frequência: ${frequencia}x/semana
- Objetivo: ${objetivo}
- Peso: ${peso}kg, Altura: ${altura}cm

Responda APENAS JSON (sem markdown):
{
  "tipo": "${local === 'casa' ? 'Casa' : 'Academia'}",
  "frequencia": "${frequencia}x/semana",
  "duracaoSessao": "60min",
  "gastoCalorico": 350,
  "treinos": [
    {
      "dia": "A",
      "nome": "Peito/Tríceps",
      "exercicios": [
        {"nome": "Supino", "series": "4x", "repeticoes": "10-12", "descanso": "60s", "observacao": "Boa forma"}
      ]
    }
  ],
  "dicas": ["Aqueça 5-10min"]
}`;

    const text = await aiChatCompletion([{ role: 'user', content: prompt }]);
    const parsed = parseJsonContent<{
      tipo: string;
      frequencia: string;
      duracaoSessao: string;
      gastoCalorico: number;
      treinos: unknown[];
      dicas: unknown[];
    }>(text);

    const workout = {
      tipo:          parsed.tipo,
      frequencia:    parsed.frequencia,
      duracaoSessao: parsed.duracaoSessao,
      gastoCalorico: parsed.gastoCalorico,
      treinos:       parsed.treinos,
      dicas:         parsed.dicas,
    };

    await incrementUsage(supabase, user.id, 'treino');

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    supabase.from('workout_cache').upsert(
      { cache_key: cacheKey, resultado: workout, expires_at: expiresAt },
      { onConflict: 'cache_key' }
    ).then(({ error }) => {
      if (error) console.error('Erro ao salvar cache de treino:', error);
    });

    return NextResponse.json(workout);

  } catch (error: unknown) {
    console.error('Erro ao gerar treino:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar treino. Tente novamente.' },
      { status: 500 }
    );
  }
}
