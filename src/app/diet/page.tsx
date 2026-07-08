'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Loader2, Utensils, Flame, Clock, Share2, Zap, TrendingDown, TrendingUp, Brain, Target, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { usePostHog } from 'posthog-js/react';
import type { QuizData } from '@/lib/types';
import ShareMenu from '@/components/ShareMenu';

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

const loadingSteps = [
  { message: "Analisando seus dados...", duration: 3000 },
  { message: "Calculando suas calorias diárias...", duration: 3000 },
  { message: "Montando suas refeições...", duration: 4000 },
  { message: "Ajustando os macronutrientes...", duration: 3000 },
  { message: "Selecionando os melhores alimentos...", duration: 4000 },
  { message: "Personalizando sua dieta...", duration: 3000 },
  { message: "Finalizando sua dieta personalizada...", duration: 0 },
];

// ─── Fórmula de Mifflin-St Jeor ────────────────────────────────────────────
const calcularTMB = (peso: number, altura: number, idade = 30, sexo = 'neutro'): number => {
  const s = sexo?.toLowerCase();
  if (s === 'masculino' || s === 'male' || s === 'm') {
    return Math.round(10 * peso + 6.25 * altura - 5 * idade + 5);
  }
  if (s === 'feminino' || s === 'female' || s === 'f') {
    return Math.round(10 * peso + 6.25 * altura - 5 * idade - 161);
  }
  // Média neutro (sem sexo informado)
  const masc = 10 * peso + 6.25 * altura - 5 * idade + 5;
  const fem  = 10 * peso + 6.25 * altura - 5 * idade - 161;
  return Math.round((masc + fem) / 2);
};

const calcularTDEE = (tmb: number, nivelAtividade?: string): number => {
  const multipliers: Record<string, number> = {
    sedentario: 1.2,
    leve:       1.375,
    moderado:   1.55,
    intenso:    1.725,
  };
  return Math.round(tmb * (multipliers[nivelAtividade || ''] ?? 1.375));
};

const calcularCaloriasAuto = (tdee: number, objetivo: string): number => {
  if (objetivo === 'perder')      return Math.round(tdee - 500);
  if (objetivo === 'ganhar')      return Math.round(tdee + 300);
  return tdee;
};
// ───────────────────────────────────────────────────────────────────────────

export default function DietPage() {
  const router = useRouter();
  const [quizData, setQuizData]                     = useState<QuizData | null>(null);
  const [preferencias, setPreferencias]             = useState('');
  const [restricoes, setRestricoes]                 = useState('');
  const [modoCaloria, setModoCaloria]               = useState<'automatico' | 'personalizado'>('automatico');
  const [caloriasCustom, setCaloriasCustom]         = useState('');
  const [isGenerating, setIsGenerating]             = useState(false);
  const [loadingMessage, setLoadingMessage]         = useState(loadingSteps[0].message);
  const [dietPlan, setDietPlan]                     = useState<DietPlan | null>(null);
  const [error, setError]                           = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu]           = useState(false);
  const [loading, setLoading]                       = useState(true);
  const [userId, setUserId]                         = useState<string | null>(null);
  const posthog = usePostHog();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ── Cálculos de metabolismo ──────────────────────────────────────────────
  const metabolismo = useMemo(() => {
    if (!quizData) return null;
    const tmb  = calcularTMB(
      quizData.peso,
      quizData.altura,
      (quizData as any).idade,
      (quizData as any).genero,
    );
    const tdee = calcularTDEE(tmb, (quizData as any).nivelAtividade);
    const auto = calcularCaloriasAuto(tdee, quizData.objetivo);
    return { tmb, tdee, auto };
  }, [quizData]);

  const caloriasAlvoFinal = useMemo(() => {
    if (modoCaloria === 'personalizado' && caloriasCustom) return Number(caloriasCustom);
    return metabolismo?.auto ?? null;
  }, [modoCaloria, caloriasCustom, metabolismo]);

  const deficitInfo = useMemo(() => {
    if (!metabolismo || !dietPlan) return null;
    const diff = metabolismo.tdee - dietPlan.caloriasAlvo;
    return {
      valor:      Math.abs(diff),
      tipo:       diff > 50 ? 'deficit' : diff < -50 ? 'superavit' : 'manutencao',
      percentual: Math.round((Math.abs(diff) / metabolismo.tdee) * 100),
      kgSemana:   Math.round((Math.abs(diff) * 7) / 7700 * 10) / 10,
    };
  }, [metabolismo, dietPlan]);
  // ────────────────────────────────────────────────────────────────────────

  const saveDietToHistory = (dietData: DietPlan, userData: QuizData) => {
    if (!userId) return;
    const historyItem = {
      id:             Date.now().toString(),
      date:           new Date().toISOString(),
      goal:           userData.objetivo === 'perder' ? 'Perder peso' : userData.objetivo === 'ganhar' ? 'Ganhar peso' : 'Manter peso',
      totalCalories:  dietData.caloriasAlvo,
      meals:          dietData.refeicoes.map((meal) => ({
        name:  meal.nome,
        time:  meal.horario,
        foods: meal.alimentos || [],
      })),
    };
    const key = `dietHistory_${userId}`;
    const currentHistory  = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedHistory  = [historyItem, ...currentHistory].slice(0, 30);
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUserId(user.id);

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('peso, altura, objetivo, peso_objetivo')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { router.push('/quiz'); return; }
          throw fetchError;
        }
        if (data) {
          const extras = JSON.parse(localStorage.getItem(`quizExtras_${user.id}`) || '{}');
          setQuizData({
            peso: data.peso ?? 0,
            altura: data.altura ?? 0,
            objetivo: data.objetivo ?? 'acompanhar',
            pesoObjetivo: data.peso_objetivo ?? 0,
            ...extras,
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

  useEffect(() => {
    if (!isGenerating) return;
    let currentStep = 0;
    setLoadingMessage(loadingSteps[0].message);
    const scheduleNextStep = () => {
      if (currentStep < loadingSteps.length - 1) {
        currentStep++;
        setLoadingMessage(loadingSteps[currentStep].message);
        if (loadingSteps[currentStep].duration > 0) setTimeout(scheduleNextStep, loadingSteps[currentStep].duration);
      }
    };
    const t = setTimeout(scheduleNextStep, loadingSteps[0].duration);
    return () => clearTimeout(t);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!quizData) { setError('Complete o quiz primeiro'); return; }
    setIsGenerating(true);
    setError(null);
    setLoadingMessage(loadingSteps[0].message);

    try {
      const response = await fetch('/api/generate-diet', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          objetivo:     quizData.objetivo,
          peso:         quizData.peso,
          altura:       quizData.altura,
          preferencias,
          restricoes,
          caloriasAlvo: caloriasAlvoFinal, // ✅ Bug corrigido: envia a meta corretamente
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao gerar dieta');
      setDietPlan(data);
      posthog?.capture('diet_generated', { objetivo: quizData?.objetivo });
      saveDietToHistory(data, quizData);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar plano alimentar');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  const handleShare = () => { if (dietPlan) setShowShareMenu(true); };

  const getShareText = () => {
    if (!dietPlan) return { title: '', description: '' };
    const refeicoesText = dietPlan.refeicoes.map(r => `${r.nome}: ${r.calorias} kcal`).join('\n');
    return {
      title:       '🔥 Minha Dieta Personalizada',
      description: `🎯 ${dietPlan.caloriasAlvo} calorias por dia\n\n💪 Macros:\n• Proteínas: ${dietPlan.macros.proteinas}g\n• Carboidratos: ${dietPlan.macros.carboidratos}g\n• Gorduras: ${dietPlan.macros.gorduras}g\n\n🍽️ Minhas Refeições:\n${refeicoesText}\n\n✨ Dica principal: ${dietPlan.dicas[0] || 'Beba bastante água!'}\n\n🔥 Feito com Queima AI\n👉 queimaai.com`,
    };
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
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

        {/* ── Loading Overlay ─────────────────────────────────────────────── */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md mx-4 border border-gray-800">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-[#00AEEF] animate-spin mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Gerando sua dieta...</h3>
                <p className="text-gray-300 animate-pulse text-lg">{loadingMessage}</p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Formulário (antes de gerar) ─────────────────────────────────── */}
        {!dietPlan && (
          <div className="space-y-6">

            {/* Seus Dados */}
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
                    <div className="font-semibold text-[#00AEEF]">{quizData.peso} kg</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Altura</div>
                    <div className="font-semibold text-[#00AEEF]">{quizData.altura} cm</div>
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

            {/* ── Card de Metabolismo ──────────────────────────────────────── */}
            {metabolismo && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Seu Metabolismo</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* TMB */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Taxa Metabólica Basal (TMB)</div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-yellow-400">{metabolismo.tmb}</span>
                      <span className="text-sm text-gray-400 mb-1">kcal/dia</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">🛌 Calorias que você gasta totalmente em repouso</div>
                  </div>

                  {/* TDEE */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Gasto Diário Total (TDEE)</div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-orange-400">{metabolismo.tdee}</span>
                      <span className="text-sm text-gray-400 mb-1">kcal/dia</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">🚶 Com sua atividade física informada</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>Valores estimados pela fórmula Mifflin-St Jeor. Podem variar conforme sua idade, sexo e nível de atividade real.</span>
                </div>
              </div>
            )}

            {/* ── Seletor de modo calórico ─────────────────────────────────── */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Como definir suas calorias?</h3>
              <p className="text-sm text-gray-400 mb-4">Escolha o modo que prefere para sua dieta</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Automático */}
                <button
                  onClick={() => setModoCaloria('automatico')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    modoCaloria === 'automatico'
                      ? 'border-[#00AEEF] bg-[#00AEEF]/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <Brain className="w-6 h-6 text-[#00AEEF] mb-2" />
                  <div className="font-semibold text-sm">🤖 Automático</div>
                  <div className="text-xs text-gray-400 mt-1">Nós identificamos o melhor pra você</div>
                  {metabolismo && (
                    <div className="text-xs text-[#00AEEF] font-bold mt-2">
                      ~{metabolismo.auto} kcal/dia
                    </div>
                  )}
                </button>

                {/* Personalizado */}
                <button
                  onClick={() => setModoCaloria('personalizado')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    modoCaloria === 'personalizado'
                      ? 'border-[#00AEEF] bg-[#00AEEF]/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <Target className="w-6 h-6 text-[#00AEEF] mb-2" />
                  <div className="font-semibold text-sm">🎯 Personalizado</div>
                  <div className="text-xs text-gray-400 mt-1">Você determina quantas kcal quer por dia</div>
                </button>
              </div>

              {/* Input de calorias (modo personalizado) */}
              {modoCaloria === 'personalizado' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Meta de calorias diárias</label>
                  <input
                    type="number"
                    value={caloriasCustom}
                    onChange={(e) => setCaloriasCustom(e.target.value)}
                    placeholder="Ex: 1200"
                    min="600"
                    max="6000"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-[#00AEEF] transition-colors text-white text-xl font-bold"
                  />
                  {/* Preview de déficit em tempo real */}
                  {caloriasCustom && metabolismo && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                      Number(caloriasCustom) < metabolismo.tdee
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {Number(caloriasCustom) < metabolismo.tdee
                        ? <TrendingDown className="w-4 h-4 flex-shrink-0" />
                        : <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      }
                      <span>
                        {Number(caloriasCustom) < metabolismo.tdee
                          ? `Déficit de ${metabolismo.tdee - Number(caloriasCustom)} kcal/dia • ~${Math.round((metabolismo.tdee - Number(caloriasCustom)) * 7 / 7700 * 10) / 10}kg/semana de perda estimada`
                          : `Superávit de ${Number(caloriasCustom) - metabolismo.tdee} kcal/dia em relação ao seu TDEE`
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Resumo automático */}
              {modoCaloria === 'automatico' && metabolismo && quizData && (
                <div className={`flex items-start gap-3 p-4 rounded-xl ${
                  quizData.objetivo === 'perder' ? 'bg-green-500/10 border border-green-500/20'
                  : quizData.objetivo === 'ganhar' ? 'bg-orange-500/10 border border-orange-500/20'
                  : 'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  {quizData.objetivo === 'perder'
                    ? <TrendingDown className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    : quizData.objetivo === 'ganhar'
                    ? <TrendingUp className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    : <Flame className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  }
                  <div>
                    <div className={`font-semibold text-sm ${
                      quizData.objetivo === 'perder' ? 'text-green-400'
                      : quizData.objetivo === 'ganhar' ? 'text-orange-400'
                      : 'text-blue-400'
                    }`}>
                      {quizData.objetivo === 'perder'
                        ? `Déficit de ${metabolismo.tdee - metabolismo.auto} kcal/dia`
                        : quizData.objetivo === 'ganhar'
                        ? `Superávit de ${metabolismo.auto - metabolismo.tdee} kcal/dia`
                        : 'Calorias de manutenção'
                      }
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {quizData.objetivo === 'perder'
                        ? `Déficit moderado para perda sustentável • ~${Math.round((metabolismo.tdee - metabolismo.auto) * 7 / 7700 * 10) / 10}kg/semana`
                        : quizData.objetivo === 'ganhar'
                        ? 'Superávit controlado para ganho de massa muscular'
                        : 'Ideal para manter o peso atual'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Preferências ─────────────────────────────────────────────── */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Personalize sua dieta</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">O que você gosta de comer?</label>
                  <textarea
                    value={preferencias}
                    onChange={(e) => setPreferencias(e.target.value)}
                    placeholder="Ex: frango, arroz integral, batata doce, frutas..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-[#00AEEF] transition-colors resize-none text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alguma restrição alimentar?</label>
                  <textarea
                    value={restricoes}
                    onChange={(e) => setRestricoes(e.target.value)}
                    placeholder="Ex: intolerância à lactose, vegetariano, alergia a frutos do mar..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-[#00AEEF] transition-colors resize-none text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Botão gerar */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !quizData || (modoCaloria === 'personalizado' && !caloriasCustom)}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando seu plano...</>
              ) : (
                <><Utensils className="w-5 h-5" /> Gerar Plano Alimentar
                  {caloriasAlvoFinal ? ` • ${caloriasAlvoFinal} kcal` : ''}
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Resultados da dieta ────────────────────────────────────────── */}
        {dietPlan && (
          <div className="space-y-6">

            {/* Total de calorias */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 mx-auto mb-4" />
              <div className="text-6xl font-bold mb-2">{dietPlan.caloriasAlvo}</div>
              <div className="text-xl opacity-90">calorias por dia</div>
            </div>

            {/* ── Card de déficit (NOVO) ──────────────────────────────────── */}
            {deficitInfo && metabolismo && (
              <div className={`rounded-xl p-5 border flex items-center gap-4 ${
                deficitInfo.tipo === 'deficit'
                  ? 'bg-green-500/10 border-green-500/30'
                  : deficitInfo.tipo === 'superavit'
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                {deficitInfo.tipo === 'deficit'
                  ? <TrendingDown className="w-9 h-9 text-green-400 flex-shrink-0" />
                  : deficitInfo.tipo === 'superavit'
                  ? <TrendingUp className="w-9 h-9 text-orange-400 flex-shrink-0" />
                  : <Flame className="w-9 h-9 text-blue-400 flex-shrink-0" />
                }
                <div className="flex-1">
                  <div className={`font-bold text-lg ${
                    deficitInfo.tipo === 'deficit' ? 'text-green-400'
                    : deficitInfo.tipo === 'superavit' ? 'text-orange-400'
                    : 'text-blue-400'
                  }`}>
                    {deficitInfo.tipo === 'deficit'
                      ? `🔥 Déficit de ${deficitInfo.valor} kcal/dia`
                      : deficitInfo.tipo === 'superavit'
                      ? `📈 Superávit de ${deficitInfo.valor} kcal/dia`
                      : '⚖️ Dieta de manutenção'
                    }
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    Seu TDEE é <span className="text-white font-medium">{metabolismo.tdee} kcal/dia</span>
                    {' '}• {deficitInfo.percentual}% {deficitInfo.tipo === 'deficit' ? 'abaixo' : 'acima'} do seu gasto
                    {deficitInfo.tipo === 'deficit' && (
                      <span className="text-green-400 font-medium"> • ~{deficitInfo.kgSemana}kg/semana de perda estimada</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Macronutrientes */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Macronutrientes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">{dietPlan.macros.proteinas}g</div>
                  <div className="text-sm text-gray-400">Proteínas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">{dietPlan.macros.carboidratos}g</div>
                  <div className="text-sm text-gray-400">Carboidratos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00AEEF] mb-1">{dietPlan.macros.gorduras}g</div>
                  <div className="text-sm text-gray-400">Gorduras</div>
                </div>
              </div>
            </div>

            {/* Refeições */}
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

            {/* Exercícios */}
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

            {/* Dicas */}
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

            {/* Ações */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={handleShare}
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

      {/* Share Menu */}
      {showShareMenu && dietPlan && (
        <ShareMenu
          title={getShareText().title}
          description={getShareText().description}
          onClose={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
