// ============================================
// API ROUTE - GERAÇÃO DE DIETA COM IA
// Cria plano alimentar personalizado com OpenAI
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { objetivo, peso, altura, preferencias, restricoes } = await request.json();

    if (!objetivo || !peso || !altura) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Calcular TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
    const tmb = 10 * peso + 6.25 * altura - 5 * 25 + 5; // Assumindo idade média de 25 anos
    
    // Ajustar calorias baseado no objetivo
    let caloriasAlvo = tmb;
    if (objetivo === 'perder') {
      caloriasAlvo = tmb - 500; // Déficit de 500 calorias
    } else if (objetivo === 'ganhar') {
      caloriasAlvo = tmb + 500; // Superávit de 500 calorias
    }

    // Prompt para OpenAI
    const prompt = `Crie um plano alimentar personalizado em formato JSON com a seguinte estrutura:

{
  "caloriasAlvo": ${Math.round(caloriasAlvo)},
  "macros": {
    "proteinas": número em gramas,
    "carboidratos": número em gramas,
    "gorduras": número em gramas
  },
  "refeicoes": [
    {
      "nome": "Café da Manhã",
      "horario": "07:00",
      "alimentos": ["alimento 1", "alimento 2", ...],
      "calorias": número
    },
    ... (5 refeições: café, lanche manhã, almoço, lanche tarde, jantar)
  ],
  "dicas": ["dica 1", "dica 2", "dica 3"],
  "exercicios": [
    {
      "tipo": "nome do exercício",
      "duracao": "tempo em minutos",
      "calorias": número de calorias queimadas
    }
  ]
}

Informações do usuário:
- Objetivo: ${objetivo === 'perder' ? 'perder peso' : objetivo === 'ganhar' ? 'ganhar peso' : 'manter peso'}
- Peso: ${peso} kg
- Altura: ${altura} cm
- Calorias alvo: ${Math.round(caloriasAlvo)} kcal/dia
${preferencias ? `- Preferências alimentares: ${preferencias}` : ''}
${restricoes ? `- Restrições: ${restricoes}` : ''}

Crie um plano equilibrado, saudável e realista. Retorne APENAS o JSON, sem markdown ou explicações.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado em criar planos alimentares personalizados. Retorne sempre JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Resposta vazia da API' },
        { status: 500 }
      );
    }

    // Parse da resposta JSON
    let dietData;
    try {
      dietData = JSON.parse(content);
    } catch (parseError) {
      // Tentar extrair JSON do texto
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        dietData = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { error: 'Formato de resposta inválido' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(dietData);

  } catch (error: any) {
    console.error('Erro ao gerar dieta:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar plano alimentar' },
      { status: 500 }
    );
  }
}
