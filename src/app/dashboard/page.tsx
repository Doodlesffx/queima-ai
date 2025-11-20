// ============================================
// DASHBOARD PRINCIPAL - QUEIMA AI
// Hub central com acesso a todas as funcionalidades
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, TrendingUp, Users, Utensils, Award, Zap, Crown } from 'lucide-react';
import type { QuizData } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Carregar dados do quiz
    const savedQuizData = localStorage.getItem('quizData');
    if (savedQuizData) {
      setQuizData(JSON.parse(savedQuizData));
    }
  }, []);

  const features = [
    {
      icon: Camera,
      title: 'Leitor de Calorias',
      description: 'Analise suas refeições com IA',
      color: 'from-[#00AEEF] to-[#0088CC]',
      route: '/calories',
    },
    {
      icon: TrendingUp,
      title: 'Simulador Corporal',
      description: 'Veja sua transformação',
      color: 'from-purple-500 to-purple-700',
      route: '/body-simulator',
    },
    {
      icon: Utensils,
      title: 'Dieta com IA',
      description: 'Plano alimentar personalizado',
      color: 'from-green-500 to-green-700',
      route: '/diet',
    },
    {
      icon: Users,
      title: 'Ranking',
      description: 'Compare seu progresso',
      color: 'from-orange-500 to-orange-700',
      route: '/ranking',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-[#00AEEF]" />
              <h1 className="text-2xl font-bold">Queima AI</h1>
            </div>
            <button
              onClick={() => router.push('/upgrade')}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            >
              <Crown className="w-4 h-4" />
              {isPro ? 'PRO' : 'Upgrade'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {quizData && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta! 👋</h2>
            <p className="text-gray-400 mb-4">
              Objetivo: <span className="text-[#00AEEF] font-semibold">
                {quizData.objetivo === 'perder' && 'Perder peso'}
                {quizData.objetivo === 'ganhar' && 'Ganhar peso'}
                {quizData.objetivo === 'acompanhar' && 'Acompanhar alimentação'}
                {quizData.objetivo === 'curiosidade' && 'Explorar o app'}
              </span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Peso Atual</div>
                <div className="text-xl font-bold text-[#00AEEF]">{quizData.peso} kg</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Altura</div>
                <div className="text-xl font-bold text-[#00AEEF]">{quizData.altura} cm</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Meta</div>
                <div className="text-xl font-bold text-[#00AEEF]">
                  {quizData.pesoObjetivo > 0 ? '+' : ''}{quizData.pesoObjetivo} kg
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">IMC</div>
                <div className="text-xl font-bold text-[#00AEEF]">
                  {(quizData.peso / Math.pow(quizData.altura / 100, 2)).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Ferramentas</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(feature.route)}
                  className="group relative bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 text-left transition-all duration-300 border border-gray-800 hover:border-[#00AEEF]/50 hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-pulse" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#00AEEF]" />
            Suas Conquistas
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">0</div>
              <div className="text-sm text-gray-400">Análises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">0</div>
              <div className="text-sm text-gray-400">Dias Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">0</div>
              <div className="text-sm text-gray-400">Badges</div>
            </div>
          </div>
        </div>

        {/* Free User Limitation */}
        {!isPro && (
          <div className="mt-8 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Upgrade para PRO</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Análises ilimitadas, sem blur nos resultados e acesso a todas as funcionalidades premium
                </p>
                <button
                  onClick={() => router.push('/upgrade')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                >
                  Ver Planos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
