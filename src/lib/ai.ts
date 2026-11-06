const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// A Groq descontinua modelos com frequência (foi isso que derrubou o app em 2026).
// Os modelos abaixo são tentados em ordem; se um sumir (404) ou estourar o limite (429),
// o próximo assume. Para trocar sem mexer no código, defina AI_TEXT_MODELS /
// AI_VISION_MODELS na Vercel (lista separada por vírgula).
const DEFAULT_TEXT_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
const DEFAULT_VISION_MODELS = ['qwen/qwen3.8-27b'];

const REQUEST_TIMEOUT_MS = 25_000;

export type AiContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | AiContentPart[];
};

class AiHttpError extends Error {
  constructor(public status: number, public model: string, body: string) {
    super(`Groq API error ${status} (${model}): ${body}`);
  }
}

function modelList(envValue: string | undefined, fallback: string[]): string[] {
  const fromEnv = envValue?.split(',').map((m) => m.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : fallback;
}

async function requestCompletion(
  apiKey: string,
  model: string,
  messages: AiMessage[],
  jsonMode: boolean
): Promise<string> {
  const body: Record<string, unknown> = { model, messages };
  if (jsonMode) body.response_format = { type: 'json_object' };
  // Modelos gpt-oss "pensam" antes de responder; raciocínio curto mantém a resposta rápida.
  if (model.startsWith('openai/gpt-oss')) body.reasoning_effort = 'low';

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new AiHttpError(res.status, model, await res.text());
  }

  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? '';
  if (!text.trim()) {
    throw new Error(`Empty AI response (${model})`);
  }
  return text;
}

export async function aiChatCompletion(
  messages: AiMessage[],
  { vision = false }: { vision?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const models = vision
    ? modelList(process.env.AI_VISION_MODELS, DEFAULT_VISION_MODELS)
    : modelList(process.env.AI_TEXT_MODELS, DEFAULT_TEXT_MODELS);

  let lastError: unknown;
  for (const model of models) {
    try {
      try {
        return await requestCompletion(apiKey, model, messages, true);
      } catch (err) {
        // 400 costuma ser JSON mode não suportado ou JSON malformado: tenta sem ele,
        // o parseJsonContent extrai o JSON do texto.
        if (err instanceof AiHttpError && err.status === 400) {
          return await requestCompletion(apiKey, model, messages, false);
        }
        throw err;
      }
    } catch (err) {
      lastError = err;
      // Chave inválida não melhora trocando de modelo.
      if (err instanceof AiHttpError && (err.status === 401 || err.status === 403)) throw err;
      console.error(`Modelo de IA falhou (${model}), tentando o próximo:`, err);
    }
  }

  throw lastError;
}

export function parseJsonContent<T>(text: string): T {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  if (!cleaned) {
    throw new Error('Empty AI response');
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Invalid JSON from AI');
    }
    return JSON.parse(match[0]) as T;
  }
}
