// ============================================
// DIETA COM IA - QUEIMA AI
// Geração de plano alimentar personalizado
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Utensils, Flame, Clock, TrendingDown, Share2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { QuizData } from '@/lib/types';

interface DietPlan {
  caloriasAlvo: number;
  macros: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  refeicoes: Array<{
    nome: string;
    horario: string;
    alimentos: string[];
    calorias: number;
  }>;
  dicas: string[];
  exercicios: Array<{
    tipo: string;
    duracao: string;
    calorias: number;
  }>;
}

export default function DietPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [preferencias, setPreferencias] = useState('');
  const [restricoes, setRestricoes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedQuizData = localStorage.getItem('quizData');
    if (savedQuizData) {
      setQuizData(JSON.parse(savedQuizData));
    }
  }, []);

  const handleGenerate = async () => {
    if (!quizData) {
      setError('Complete o quiz primeiro');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo: quizData.objetivo,
          peso: quizData.peso,
          altura: quizData.altura,
          preferencias,
          restricoes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar dieta');
      }

      setDietPlan(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar plano alimentar');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Utensils className="w-7 h-7 text-[#00AEEF]" />
              Dieta com IA
            </h1>
            <p className="text-sm text-gray-400">Plano alimentar personalizado para você</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Form */}
        {!dietPlan && (
          <div className="space-y-6">
            {/* User Info Card */}
            {quizData && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Seus Dados</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Objetivo</div>
                    <div className="font-semibold text-[#00AEEF]">
                      {quizData.objetivo === 'perder' && 'Perder peso'}
                      {quizData.objetivo === 'ganhar' && 'Ganhar peso'}
                      {quizData.objetivo === 'acompanhar' && 'Manter'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Peso</div>
                    <div className="font-semibold">{quizData.peso} kg</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Altura</div>
                    <div className="font-semibold">{quizData.altura} cm</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Meta</div>
                    <div className="font-semibold text-[#00AEEF]">
                      {quizData.pesoObjetivo > 0 ? '+' : ''}{quizData.pesoObjetivo} kg
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Form */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Personalize sua dieta</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    O que você gosta de comer?
                  </label>
                  <textarea
                    value={preferencias}
                    onChange={(e) => setPreferencias(e.target.value)}
                    placeholder="Ex: frango, arroz integral, batata doce, frutas..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-[#00AEEF] transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alguma restrição alimentar?
                  </label>
                  <textarea
                    value={restricoes}
                    onChange={(e) => setRestricoes(e.target.value)}
                    placeholder="Ex: intolerância à lactose, vegetariano, alergia a frutos do mar..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-[#00AEEF] transition-colors resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !quizData}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando seu plano...
                </>
              ) : (
                <>
                  <Utensils className="w-5 h-5" />
                  Gerar Plano Alimentar
                </>
              )}
            </button>
          </div>
        )}

        {/* Diet Plan Results */}
        {dietPlan && (
          <div className="space-y-6">
            {/* Calories Target */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 mx-auto mb-4" />
              <div className="text-6xl font-bold mb-2">{dietPlan.caloriasAlvo}</div>
              <div className="text-xl opacity-90">calorias por dia</div>
            </div>

            {/* Macros */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Macronutrientes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">
                    {dietPlan.macros.proteinas}g
                  </div>
                  <div className="text-sm text-gray-400">Proteínas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">
                    {dietPlan.macros.carboidratos}g
                  </div>
                  <div className="text-sm text-gray-400">Carboidratos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">
                    {dietPlan.macros.gorduras}g
                  </div>
                  <div className="text-sm text-gray-400">Gorduras</div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Suas Refeições</h3>
              <div className="space-y-4">
                {dietPlan.refeicoes.map((refeicao, index) => (
                  <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{refeicao.nome}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {refeicao.horario}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#00AEEF]">{refeicao.calorias}</div>
                        <div className="text-xs text-gray-400">kcal</div>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {refeicao.alimentos.map((alimento, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-[#00AEEF] rounded-full" />
                          {alimento}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises */}
            {dietPlan.exercicios && dietPlan.exercicios.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Exercícios Recomendados</h3>
                <div className="space-y-3">
                  {dietPlan.exercicios.map((exercicio, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-semibold">{exercicio.tipo}</div>
                        <div className="text-sm text-gray-400">{exercicio.duracao}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#00AEEF]">{exercicio.calorias}</div>
                        <div className="text-xs text-gray-400">kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {dietPlan.dicas && dietPlan.dicas.length > 0 && (
              <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0088CC]/10 border border-[#00AEEF]/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">💡 Dicas Importantes</h3>
                <ul className="space-y-2">
                  {dietPlan.dicas.map((dica, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-[#00AEEF] rounded-full mt-2 flex-shrink-0" />
                      <span>{dica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => {/* Implementar compartilhamento */}}
                className="bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
              <button
                onClick={() => setDietPlan(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Gerar Nova Dieta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
