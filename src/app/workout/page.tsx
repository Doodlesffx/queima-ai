'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Dumbbell, Info, X, Flame, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { usePostHog } from 'posthog-js/react';
import type { QuizData } from '@/lib/types';
import { getExerciseInfo } from '@/lib/exerciseDatabase';

interface Exercicio {
  nome: string;
  series: string;
  repeticoes: string;
  descanso: string;
  observacao: string;
}

interface Treino {
  dia: string;
  nome: string;
  exercicios: Exercicio[];
}

interface WorkoutPlan {
  tipo: string;
  frequencia: string;
  duracaoSessao: string;
  gastoCalorico: number;
  treinos: Treino[];
  dicas: string[];
}

export default function WorkoutPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [local, setLocal] = useState<'casa' | 'academia'>('academia');
  const [nivel, setNivel] = useState('Iniciante');
  const [frequencia, setFrequencia] = useState('3');
  const [objetivo, setObjetivo] = useState('perder');
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const posthog = usePostHog();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('peso, altura, objetivo, peso_objetivo')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            router.push('/quiz');
            return;
          }
          throw fetchError;
        }

        if (data) {
          setQuizData({
            peso: data.peso ?? 0,
            altura: data.altura ?? 0,
            objetivo: data.objetivo ?? 'acompanhar',
            pesoObjetivo: data.peso_objetivo ?? 0,
          } as QuizData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!quizData) {
      setError('Complete o quiz primeiro');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          local,
          nivel,
          frequencia,
          objetivo,
          peso: quizData.peso,
          altura: quizData.altura,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar treino');
      }

      setWorkoutPlan(data);
      posthog?.capture('workout_generated', { local, nivel, frequencia, objetivo });
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar plano de treino');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExerciseClick = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
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
              <Dumbbell className="w-7 h-7 text-[#00AEEF]" />
              Plano de Treino
            </h1>
            <p className="text-sm text-gray-400">Treino personalizado com IA</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {!workoutPlan && (
          <div className="space-y-6">
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

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Configure seu treino</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Onde você vai treinar?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLocal('casa')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        local === 'casa'
                          ? 'bg-[#00AEEF]/10 border-[#00AEEF] text-[#00AEEF]'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏠</div>
                      <div className="font-semibold">Em Casa</div>
                      <div className="text-xs text-gray-400">Sem equipamentos</div>
                    </button>
                    <button
                      onClick={() => setLocal('academia')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        local === 'academia'
                          ? 'bg-[#00AEEF]/10 border-[#00AEEF] text-[#00AEEF]'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏋️</div>
                      <div className="font-semibold">Academia</div>
                      <div className="text-xs text-gray-400">Com equipamentos</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seu nível</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Iniciante', 'Intermediário', 'Avançado'].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNivel(n)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          nivel === n
                            ? 'bg-[#00AEEF] text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Frequência semanal</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['3', '4', '5', '6'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrequencia(f)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          frequencia === f
                            ? 'bg-[#00AEEF] text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {f}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objetivo do treino</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setObjetivo('perder')}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        objetivo === 'perder'
                          ? 'bg-[#00AEEF] text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Perder Gordura
                    </button>
                    <button
                      onClick={() => setObjetivo('ganhar')}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        objetivo === 'ganhar'
                          ? 'bg-[#00AEEF] text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Ganhar Massa
                    </button>
                    <button
                      onClick={() => setObjetivo('definir')}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        objetivo === 'definir'
                          ? 'bg-[#00AEEF] text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Definir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !quizData}
              className="w-full bg-gradient-to-r from-[#00AEEF] to-[#0088CC] hover:from-[#0088CC] hover:to-[#006699] text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando seu plano...
                </>
              ) : (
                <>
                  <Dumbbell className="w-5 h-5" />
                  Gerar Plano de Treino
                </>
              )}
            </button>
          </div>
        )}

        {workoutPlan && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#00AEEF] to-[#0088CC] rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">{workoutPlan.tipo}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-80">Frequência</div>
                  <div className="text-xl font-bold">{workoutPlan.frequencia}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Duração</div>
                  <div className="text-xl font-bold flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    {workoutPlan.duracaoSessao}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Gasto</div>
                  <div className="text-xl font-bold flex items-center gap-1">
                    <Flame className="w-5 h-5" />
                    {workoutPlan.gastoCalorico} kcal
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Seus Treinos</h3>
              <div className="space-y-4">
                {workoutPlan.treinos.map((treino, index) => (
                  <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-[#00AEEF] w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {treino.dia}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold">{treino.nome}</h4>
                        <div className="text-sm text-gray-400">
                          {treino.exercicios.length} exercícios
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {treino.exercicios.map((ex, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-white mb-1">{ex.nome}</div>
                              <div className="text-sm text-gray-400">
                                {ex.series} • {ex.repeticoes} • Descanso: {ex.descanso}
                              </div>
                              {ex.observacao && (
                                <div className="text-xs text-gray-500 mt-1">💡 {ex.observacao}</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleExerciseClick(ex.nome)}
                              className="ml-3 flex items-center gap-1 px-3 py-1 bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 text-[#00AEEF] rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                            >
                              <Info className="w-4 h-4" />
                              Como fazer?
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {workoutPlan.dicas && workoutPlan.dicas.length > 0 && (
              <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0088CC]/10 border border-[#00AEEF]/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">💡 Dicas Importantes</h3>
                <ul className="space-y-2">
                  {workoutPlan.dicas.map((dica, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-[#00AEEF] rounded-full mt-2 flex-shrink-0" />
                      <span>{dica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setWorkoutPlan(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
            >
              Gerar Novo Treino
            </button>
          </div>
        )}
      </div>

      {showModal && selectedExercise && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedExercise}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {(() => {
                const info = getExerciseInfo(selectedExercise);
                return (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-[#00AEEF]">📋 Como executar</h4>
                      <ol className="space-y-2">
                        {info.instrucoes.map((inst, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </span>
                            <span className="text-gray-300">{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-[#00AEEF]">💪 Músculos trabalhados</h4>
                      <div className="flex flex-wrap gap-2">
                        {info.musculos.map((musculo, i) => (
                          <span key={i} className="px-3 py-1 bg-[#00AEEF]/20 text-[#00AEEF] rounded-full text-sm">
                            {musculo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-red-400">⚠️ Erros comuns</h4>
                      <ul className="space-y-2">
                        {info.errosComuns.map((erro, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span className="text-gray-300">{erro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-green-400">💡 Dicas importantes</h4>
                      <ul className="space-y-2">
                        {info.dicas.map((dica, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="text-gray-300">{dica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-[#00AEEF] hover:bg-[#0088CC] text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
