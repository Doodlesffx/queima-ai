// ============================================
// LANDING PAGE - QUEIMA AI
// Design dark premium com CTAs principais
// ============================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Zap, TrendingUp, Users, Award, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = () => {
    setIsLoading(true);
    router.push('/quiz');
  };

  const handleCaloriesAnalysis = () => {
    router.push('/calories');
  };

  const handleBodySimulator = () => {
    router.push('/body-simulator');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Zap className="w-12 h-12 text-[#00AEEF]" />
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Queima AI
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Inteligência artificial que transforma sua relação com alimentação e exercícios
            </p>
          </div>

          {/* Main CTAs */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* CTA 1 - Análise de Calorias */}
            <button
              onClick={handleCaloriesAnalysis}
              className="group relative bg-gradient-to-br from-[#00AEEF] to-[#0088CC] p-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#00AEEF]/50"
            >
              <Camera className="w-12 h-12 mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-2">Envie sua foto da comida</h3>
              <p className="text-white/80 text-sm">
                Descubra quantas calorias tem seu prato e quanto você precisa treinar para queimar
              </p>
              <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
              </div>
            </button>

            {/* CTA 2 - Simulador Corporal */}
            <button
              onClick={handleBodySimulator}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl border border-gray-700 hover:border-[#00AEEF]/50"
            >
              <TrendingUp className="w-12 h-12 mb-4 text-[#00AEEF]" />
              <h3 className="text-2xl font-bold mb-2">Teste sua transformação</h3>
              <p className="text-gray-400 text-sm">
                Veja como seu corpo ficaria com a perda ou ganho de peso desejado
              </p>
              <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 text-[#00AEEF]/60 animate-pulse" />
              </div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <Users className="w-8 h-8 text-[#00AEEF] mb-3" />
              <h4 className="font-semibold mb-2">Ranking Global</h4>
              <p className="text-sm text-gray-400">Compare seu progresso com outros usuários</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <Award className="w-8 h-8 text-[#00AEEF] mb-3" />
              <h4 className="font-semibold mb-2">Gamificação</h4>
              <p className="text-sm text-gray-400">Conquiste badges e compartilhe resultados</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <Sparkles className="w-8 h-8 text-[#00AEEF] mb-3" />
              <h4 className="font-semibold mb-2">Dieta com IA</h4>
              <p className="text-sm text-gray-400">Plano alimentar personalizado para você</p>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="bg-[#00AEEF] hover:bg-[#0088CC] text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-[#00AEEF]/50 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : 'Começar Agora'}
            </button>
            <p className="text-sm text-gray-500 mt-4">Grátis para começar • Sem cartão de crédito</p>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-900/30 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#00AEEF] mb-2">10k+</div>
              <div className="text-gray-400">Usuários ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00AEEF] mb-2">50k+</div>
              <div className="text-gray-400">Fotos analisadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00AEEF] mb-2">95%</div>
              <div className="text-gray-400">Satisfação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2024 Queima AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
