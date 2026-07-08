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

  const rateLimit = await checkAndIncrement(supabase, user.id, 'analise');
  if (!rateLimit.allowed) return rateLimit.response;

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem foi enviada' }, { status: 400 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
Você é um nutricionista expert. Analise esta imagem de comida e identifique o alimento.

Forneça as seguintes informações em formato JSON (sem formatação markdown, apenas o JSON puro):

{
  "alimento": "Nome específico do alimento ou prato",
  "calorias": número estimado de calorias totais,
  "equivalencia": "Texto explicando a equivalência (ex: 'Equivale a 3 fatias de pizza')",
  "proteinas": gramas de proteína,
  "carboidratos": gramas de carboidratos,
  "gorduras": gramas de gordura
}

Seja preciso na identificação e nas estimativas nutricionais.`;

    const result = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Data}` } },
        ],
      }],
    });

    const responseText = result.choices[0].message.content || '';
    const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const tempoQueima = {
      caminhada:    Math.round(parsed.calorias / 5),
      corrida:      Math.round(parsed.calorias / 10),
      bike:         Math.round(parsed.calorias / 8),
      musculacao:   Math.round(parsed.calorias / 6),
    };

    return NextResponse.json({
      alimento:     parsed.alimento,
      calorias:     parsed.calorias,
      equivalencia: parsed.equivalencia,
      proteinas:    parsed.proteinas,
      carboidratos: parsed.carboidratos,
      gorduras:     parsed.gorduras,
      tempoQueima,
    });

  } catch (error: unknown) {
    console.error('Erro ao analisar comida:', error);
    return NextResponse.json(
      { error: 'Não consegui identificar o alimento. Tente outra foto mais clara.' },
      { status: 500 }
    );
  }
}
