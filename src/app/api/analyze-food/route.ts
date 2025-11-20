// ============================================
// API ROUTE - ANÁLISE DE ALIMENTOS COM OPENAI
// Processa imagem e retorna análise nutricional
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Chamar OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de comida e retorne APENAS um JSON válido (sem markdown, sem explicações) com a seguinte estrutura:
{
  "alimento": "nome do alimento principal",
  "calorias": número estimado de calorias totais,
  "equivalencia": "descrição visual da equivalência (ex: '2 latinhas de refrigerante', '3 fatias de pizza')",
  "proteinas": gramas de proteína,
  "carboidratos": gramas de carboidratos,
  "gorduras": gramas de gordura
}

Se não conseguir identificar comida na imagem, retorne:
{
  "error": "Não foi possível identificar alimentos na imagem"
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Resposta vazia da API' },
        { status: 500 }
      );
    }

    // Parse da resposta JSON
    let analysisData;
    try {
      analysisData = JSON.parse(content);
    } catch (parseError) {
      // Se não for JSON válido, tentar extrair JSON do texto
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { error: 'Formato de resposta inválido' },
          { status: 500 }
        );
      }
    }

    // Verificar se houve erro na análise
    if (analysisData.error) {
      return NextResponse.json(
        { error: analysisData.error },
        { status: 400 }
      );
    }

    // Calcular tempo de queima baseado nas calorias
    const calorias = analysisData.calorias;
    const tempoQueima = {
      caminhada: Math.round(calorias / 4), // ~4 cal/min
      corrida: Math.round(calorias / 10), // ~10 cal/min
      bike: Math.round(calorias / 8), // ~8 cal/min
      musculacao: Math.round(calorias / 6), // ~6 cal/min
    };

    // Retornar análise completa
    return NextResponse.json({
      alimento: analysisData.alimento,
      calorias: analysisData.calorias,
      equivalencia: analysisData.equivalencia,
      proteinas: analysisData.proteinas || 0,
      carboidratos: analysisData.carboidratos || 0,
      gorduras: analysisData.gorduras || 0,
      tempoQueima,
    });

  } catch (error: any) {
    console.error('Erro na análise:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar imagem' },
      { status: 500 }
    );
  }
}
