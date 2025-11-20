// ============================================
// RANKING - QUEIMA AI
// Comparação de progresso entre usuários
// ============================================
'use client';

import { useState } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Eye, EyeOff, Medal, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RankingUser {
  id: string;
  nome: string;
  avatar: string;
  pesoInicial: number;
  pesoAtual: number;
  pesoObjetivo: number;
  progresso: number;
  posicao: number;
}

export default function RankingPage() {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'perder' | 'ganhar'>('todos');

  // Mock data - em produção, buscar do banco
  const mockRanking: RankingUser[] = [
    {
      id: '1',
      nome: 'João Silva',
      avatar: '👨',
      pesoInicial: 95,
      pesoAtual: 82,
      pesoObjetivo: 75,
      progresso: 65,
      posicao: 1,
    },
    {
      id: '2',
      nome: 'Maria Santos',
      avatar: '👩',
      pesoInicial: 70,
      pesoAtual: 65,
      pesoObjetivo: 60,
      progresso: 50,
      posicao: 2,
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      avatar: '👨',
      pesoInicial: 85,
      pesoAtual: 78,
      pesoObjetivo: 72,
      progresso: 54,
      posicao: 3,
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      avatar: '👩',
      pesoInicial: 68,
      pesoAtual: 64,
      pesoObjetivo: 58,
      progresso: 40,
      posicao: 4,
    },
    {
      id: '5',
      nome: 'Carlos Mendes',
      avatar: '👨',
      pesoInicial: 100,
      pesoAtual: 92,
      pesoObjetivo: 80,
      progresso: 40,
      posicao: 5,
    },
  ];

  const getMedalColor = (posicao: number) => {
    if (posicao === 1) return 'text-yellow-500';
    if (posicao === 2) return 'text-gray-400';
    if (posicao === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getMedalIcon = (posicao: number) => {
    if (posicao <= 3) return <Medal className={`w-6 h-6 ${getMedalColor(posicao)}`} />;
    return <span className="text-gray-500 font-semibold">#{posicao}</span>;
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-[#00AEEF]" />
              Ranking
            </h1>
            <p className="text-sm text-gray-400">Compare seu progresso com outros usuários</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Privacy Toggle */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Eye className="w-5 h-5 text-[#00AEEF]" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="font-semibold">Perfil Público</div>
                <div className="text-sm text-gray-400">
                  {isPublic ? 'Seu progresso está visível' : 'Seu progresso está privado'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isPublic ? 'bg-[#00AEEF]' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filter === 'todos'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('perder')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filter === 'perder'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Perder Peso
          </button>
          <button
            onClick={() => setFilter('ganhar')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filter === 'ganhar'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Ganhar Peso
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Top 3
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* 2nd Place */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 flex flex-col items-center">
              <div className="text-4xl mb-2">{mockRanking[1].avatar}</div>
              <Medal className="w-8 h-8 text-gray-400 mb-2" />
              <div className="text-sm font-semibold text-center mb-1">{mockRanking[1].nome}</div>
              <div className="text-xs text-gray-400">{mockRanking[1].progresso}% progresso</div>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 rounded-xl p-4 border-2 border-yellow-500 flex flex-col items-center -mt-4">
              <div className="text-5xl mb-2">{mockRanking[0].avatar}</div>
              <Medal className="w-10 h-10 text-yellow-500 mb-2" />
              <div className="text-sm font-semibold text-center mb-1">{mockRanking[0].nome}</div>
              <div className="text-xs text-gray-400">{mockRanking[0].progresso}% progresso</div>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 flex flex-col items-center">
              <div className="text-4xl mb-2">{mockRanking[2].avatar}</div>
              <Medal className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-sm font-semibold text-center mb-1">{mockRanking[2].nome}</div>
              <div className="text-xs text-gray-400">{mockRanking[2].progresso}% progresso</div>
            </div>
          </div>
        </div>

        {/* Full Ranking List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ranking Completo</h3>
          <div className="space-y-3">
            {mockRanking.map((user) => (
              <div
                key={user.id}
                className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-[#00AEEF]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className="flex-shrink-0 w-10 flex justify-center">
                    {getMedalIcon(user.posicao)}
                  </div>

                  {/* Avatar */}
                  <div className="text-3xl">{user.avatar}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1">{user.nome}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{user.pesoInicial} kg</span>
                      <TrendingUp className="w-4 h-4 text-[#00AEEF]" />
                      <span className="text-[#00AEEF] font-semibold">{user.pesoAtual} kg</span>
                      <span className="text-gray-600">→</span>
                      <span>{user.pesoObjetivo} kg</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-[#00AEEF]">{user.progresso}%</div>
                    <div className="text-xs text-gray-500">progresso</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#00AEEF] to-[#0088CC] h-full transition-all duration-500"
                    style={{ width: `${user.progresso}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Position (if not public) */}
        {!isPublic && (
          <div className="mt-8 bg-gradient-to-br from-[#00AEEF]/10 to-[#0088CC]/10 border border-[#00AEEF]/30 rounded-xl p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">Quer aparecer no ranking?</h4>
              <p className="text-sm text-gray-400 mb-4">
                Ative seu perfil público e mostre seu progresso para a comunidade!
              </p>
              <button
                onClick={() => setIsPublic(true)}
                className="bg-[#00AEEF] hover:bg-[#0088CC] text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Tornar Público
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
