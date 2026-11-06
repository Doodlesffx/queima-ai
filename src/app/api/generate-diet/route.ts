import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkRateLimit, incrementUsage } from '@/lib/rateLimit';
import { parseJsonContent, aiChatCompletion } from '@/lib/ai';

type AlimentoPorcao = { nome: string; quantidade: string };

function normalizeAlimentos(raw: unknown): AlimentoPorcao[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item): AlimentoPorcao[] => {
    if (typeof item === 'string') {
      const splitDash = item.match(/^(.+?)\s*[—\-–]\s*(.+)$/);
      if (splitDash) {
        return [{ nome: splitDash[1].trim(), quantidade: splitDash[2].trim() }];
      }
      return [{ nome: item.trim(), quantidade: '' }];
    }

    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      const nome = String(o.nome ?? o.alimento ?? '').trim();
      const quantidade = String(o.quantidade ?? o.medida ?? o.porcao ?? '').trim();
      return nome ? [{ nome, quantidade }] : [];
    }

    return [];
  });
}

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

  const rateLimit = await checkRateLimit(supabase, user.id, 'dieta');
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
      "alimentos": [
        { "nome": "Banana prata", "quantidade": "80g (1 unidade média)" },
        { "nome": "Iogurte natural desnatado", "quantidade": "200ml" }
      ],
      "calorias": 300
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

REGRAS OBRIGATÓRIAS DE PORÇÃO:
- NUNCA liste um alimento sem quantidade. Sempre informe medida prática: g, ml, unidade, fatia, colher de sopa, xícara.
- As porções de cada refeição, somadas, devem bater (com margem de ~10%) as calorias daquela refeição. Ex.: café da manhã de 300 kcal NÃO pode ter 2L de iogurte nem 10 bananas.
- Use porções realistas do dia a dia (ex.: banana 80g, iogurte 170–200ml, frango 120g, arroz 100g cozido).
- Evite "a vontade", "a gosto" ou nomes soltos sem medida. Folhas verdes podem ser "à vontade" só se o restante da refeição já fechar as calorias.

Crie 6 refeições balanceadas (Café, Lanche Manhã, Almoço, Lanche Tarde, Jantar, Ceia).
${preferencias ? `IMPORTANTE: Considere as preferências: ${preferencias}` : ''}
${restricoes ? `IMPORTANTE: Evite completamente: ${restricoes}` : ''}`;

    const responseText = await aiChatCompletion([{ role: 'user', content: prompt }]);
    const parsed = parseJsonContent<{
      refeicoes?: Array<{
        nome?: string;
        horario?: string;
        calorias?: number;
        alimentos?: unknown[];
      }>;
      dicas?: unknown[];
      exercicios?: unknown[];
    }>(responseText);

    const proteinas    = Math.round((caloriasAlvo * 0.3) / 4);
    const carboidratos = Math.round((caloriasAlvo * 0.4) / 4);
    const gorduras     = Math.round((caloriasAlvo * 0.3) / 9);

    const refeicoes = (parsed.refeicoes || []).map((refeicao) => ({
      nome: refeicao.nome || 'Refeição',
      horario: refeicao.horario || '',
      calorias: refeicao.calorias || 0,
      alimentos: normalizeAlimentos(refeicao.alimentos),
    }));

    await incrementUsage(supabase, user.id, 'dieta');

    return NextResponse.json({
      caloriasAlvo,
      macros: { proteinas, carboidratos, gorduras },
      refeicoes,
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
