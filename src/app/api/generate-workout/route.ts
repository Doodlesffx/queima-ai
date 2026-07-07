import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkAndIncrement } from '@/lib/rateLimit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

  const rateLimit = await checkAndIncrement(supabase, user.id, 'treino');
  if (!rateLimit.allowed) return rateLimit.response;

  try {
    const { local, nivel, frequencia, objetivo, peso, altura } = await req.json();

    if (!local || !nivel || !frequencia || !objetivo) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      tipo:          parsed.tipo,
      frequencia:    parsed.frequencia,
      duracaoSessao: parsed.duracaoSessao,
      gastoCalorico: parsed.gastoCalorico,
      treinos:       parsed.treinos,
      dicas:         parsed.dicas,
    });

  } catch (error: unknown) {
    console.error('Erro ao gerar treino:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar treino. Tente novamente.' },
      { status: 500 }
    );
  }
}
