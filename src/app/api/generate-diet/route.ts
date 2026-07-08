import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkAndIncrement } from '@/lib/rateLimit';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

  const rateLimit = await checkAndIncrement(supabase, user.id, 'dieta');
  if (!rateLimit.allowed) return rateLimit.response;

  try {
    const { objetivo, peso, altura, preferencias, restricoes, caloriasAlvo: caloriasAlvoFrontend } = await req.json();

    if (!objetivo || !peso || !altura) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    let caloriasAlvo: number;
    if (caloriasAlvoFrontend && caloriasAlvoFrontend > 0) {
      caloriasAlvo = caloriasAlvoFrontend;
    } else {
      const tmb = 10 * peso + 6.25 * altura - 5 * 30 + 5;
      if (objetivo === 'perder')      caloriasAlvo = Math.round(tmb * 0.8);
      else if (objetivo === 'ganhar') caloriasAlvo = Math.round(tmb * 1.2);
      else                            caloriasAlvo = Math.round(tmb);
    }

    const prompt = `
Você é um nutricionista profissional. Crie um plano alimentar completo com base nos seguintes dados:

- Objetivo: ${objetivo === 'perder' ? 'Perder peso' : objetivo === 'ganhar' ? 'Ganhar massa muscular' : 'Manter peso'}
- Peso atual: ${peso}kg
- Altura: ${altura}cm
- Meta calórica diária: ${caloriasAlvo} kcal
${preferencias ? `- Preferências alimentares: ${preferencias}` : ''}
${restricoes ? `- Restrições/Alergias: ${restricoes}` : ''}

Responda APENAS com um JSON válido (sem markdown, sem backticks) neste formato:

{
  "refeicoes": [
    {
      "nome": "Café da Manhã",
      "horario": "07:00",
      "alimentos": ["Alimento 1", "Alimento 2"],
      "calorias": 400
    }
  ],
  "dicas": ["Dica 1", "Dica 2"],
  "exercicios": [
    {
      "tipo": "Caminhada",
      "duracao": "30 minutos",
      "calorias": 150
    }
  ]
}

Crie 6 refeições balanceadas (Café, Lanche Manhã, Almoço, Lanche Tarde, Jantar, Ceia).
${preferencias ? `IMPORTANTE: Considere as preferências: ${preferencias}` : ''}
${restricoes ? `IMPORTANTE: Evite completamente: ${restricoes}` : ''}`;

    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });
    const responseText = result.choices[0].message.content || '';
    const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const proteinas    = Math.round((caloriasAlvo * 0.3) / 4);
    const carboidratos = Math.round((caloriasAlvo * 0.4) / 4);
    const gorduras     = Math.round((caloriasAlvo * 0.3) / 9);

    return NextResponse.json({
      caloriasAlvo,
      macros: { proteinas, carboidratos, gorduras },
      refeicoes:  parsed.refeicoes  || [],
      dicas:      parsed.dicas      || [],
      exercicios: parsed.exercicios || [],
    });

  } catch (error: unknown) {
    console.error('Erro ao gerar dieta:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano alimentar. Tente novamente.' },
      { status: 500 }
    );
  }
}
