'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Target, Flame, Award, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { createBrowserClient } from '@supabase/ssr';

interface WeightEntry {
  date: string;
  weight: number;
  calories?: number;
}

interface Stats {
  totalAnalyses: number;
  totalDiets: number;
  daysActive: number;
  averageCalories: number;
  weightChange: number;
}

export default function EvolutionPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [caloriesData, setCaloriesData] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAnalyses: 0,
    totalDiets: 0,
    daysActive: 0,
    averageCalories: 0,
    weightChange: 0,
  });
  const [currentWeight, setCurrentWeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [pesoInicialCalc, setPesoInicialCalc] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      // Load profile from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('peso, peso_objetivo')
        .eq('id', user.id)
        .single();

      const uid = user.id;
      const currentPeso = userData?.peso || 70;
      const metaChange = userData?.peso_objetivo || 0;
      const pesoMeta = currentPeso + metaChange;

      setCurrentWeight(currentPeso);
      setGoalWeight(pesoMeta);

      // User-scoped localStorage keys
      const foodHistory: any[] = JSON.parse(localStorage.getItem(`foodHistory_${uid}`) || '[]');
      const dietHistory: any[] = JSON.parse(localStorage.getItem(`dietHistory_${uid}`) || '[]');
      const weightHistory: WeightEntry[] = JSON.parse(localStorage.getItem(`weightHistory_${uid}`) || '[]');

      // Initialize pesoInicial if first time
      const pesoInicialKey = `pesoInicial_${uid}`;
      if (!localStorage.getItem(pesoInicialKey) && currentPeso) {
        localStorage.setItem(pesoInicialKey, currentPeso.toString());
      }

      // Compute pesoInicial for progress bar
      let pesoInicial = currentPeso;
      if (weightHistory.length > 0) {
        pesoInicial = weightHistory[0].weight;
      } else {
        const saved = localStorage.getItem(pesoInicialKey);
        if (saved) pesoInicial = parseFloat(saved);
      }
      setPesoInicialCalc(pesoInicial);

      // Weight chart data
      if (weightHistory.length === 0) {
        setWeightData(generateMockWeightData(currentPeso, 7));
      } else {
        setWeightData(weightHistory);
      }

      // Calories chart data (last 7 days)
      const last7Days = getLast7Days();
      const caloriesPerDay = last7Days.map(date => {
        const dayAnalyses = foodHistory.filter((item: any) =>
          new Date(item.date).toDateString() === new Date(date).toDateString()
        );
        const totalCalories = dayAnalyses.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
        return {
          date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          calorias: totalCalories,
          analises: dayAnalyses.length,
        };
      });
      setCaloriesData(caloriesPerDay);

      // Stats
      const totalCals = foodHistory.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
      const avgCals = foodHistory.length > 0 ? Math.round(totalCals / foodHistory.length) : 0;
      const variacaoPeso = currentPeso - pesoInicial;

      setStats({
        totalAnalyses: foodHistory.length,
        totalDiets: dietHistory.length,
        daysActive: new Set(foodHistory.map((item: any) => new Date(item.date).toDateString())).size,
        averageCalories: avgCals,
        weightChange: variacaoPeso,
      });

      setPageLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateMockWeightData = (startWeight: number, days: number): WeightEntry[] => {
    const data: WeightEntry[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.5;
      const weight = parseFloat((startWeight - i * 0.1 + variation).toFixed(1));
      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        weight,
      });
    }
    return data;
  };

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  const pesoAlvo = goalWeight;
  const pesoAtual = currentWeight;
  const diferencaTotal = Math.abs(pesoAlvo - pesoInicialCalc);
  const progressoFeito = Math.abs(pesoAtual - pesoInicialCalc);
  const faltam = Math.abs(pesoAtual - pesoAlvo);
  const progressoAtual = diferencaTotal > 0 ? (progressoFeito / diferencaTotal) * 100 : 0;
  const progressPercentage = Math.min(100, Math.max(0, progressoAtual));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>

            <h1 className="text-2xl font-bold">Evolução</h1>

            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-400">Análises</span>
            </div>
            <div className="text-3xl font-bold text-[#00AEEF]">{stats.totalAnalyses}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-400">Dias Ativos</span>
            </div>
            <div className="text-3xl font-bold text-[#00AEEF]">{stats.daysActive}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-400">Média Cal</span>
            </div>
            <div className="text-3xl font-bold text-[#00AEEF]">{stats.averageCalories}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {stats.weightChange <= 0 ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-400">Variação</span>
            </div>
            <div className={`text-3xl font-bold ${stats.weightChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}kg
            </div>
          </div>
        </div>

        {/* Progresso da Meta */}
        <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0088CC]/10 border border-[#00AEEF]/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Progresso da Meta</h3>
              <p className="text-sm text-gray-400">
                Inicial: {pesoInicialCalc}kg • Atual: {currentWeight}kg • Meta: {goalWeight}kg
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Faltam</div>
              <div className="text-4xl font-bold text-[#00AEEF]">
                {faltam.toFixed(1)}kg
              </div>
            </div>
          </div>

          <div className="relative mt-8">
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00AEEF] to-[#0088CC] transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{pesoInicialCalc}kg</span>
              <span className="font-semibold text-[#00AEEF]">{progressPercentage.toFixed(0)}% completo</span>
              <span>{goalWeight}kg</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Peso */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-[#00AEEF]" />
            Evolução de Peso (últimos 7 dias)
          </h3>

          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00AEEF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => [`${value} kg`, 'Peso']}
                />
                <Area type="monotone" dataKey="weight" stroke="#00AEEF" strokeWidth={3} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Comece a registrar seu peso para ver sua evolução</p>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico de Calorias */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Calorias Consumidas (últimos 7 dias)
          </h3>

          {caloriesData.some(d => d.calorias > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'calorias') return [`${value} kcal`, 'Calorias'];
                    return [`${value}`, 'Análises'];
                  }}
                />
                <Bar dataKey="calorias" fill="#00AEEF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Flame className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Analise suas refeições para ver suas calorias</p>
                <button
                  onClick={() => router.push('/calories')}
                  className="mt-4 px-6 py-2 bg-[#00AEEF] hover:bg-[#0088CC] rounded-lg font-medium transition-colors"
                >
                  Analisar Comida
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Dica para melhor acompanhamento</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Registre seu peso toda semana no mesmo dia e horário</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Analise todas suas refeições principais para dados mais precisos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Pequenas variações de peso são normais - foque na tendência geral</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
