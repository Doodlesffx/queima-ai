// ============================================
// PROFILE PAGE - QUEIMA AI (CORRIGIDO)
// Caminho: src/app/profile/page.tsx
//
// CORREÇÕES:
// - Lê dados do Supabase (era do localStorage, por isso aparecia vazio
//   depois de logar de novo / em outro navegador)
// - Mostra loading enquanto busca
// - Redireciona pro login se não tiver usuário
// - Botão de logout funcional
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  ArrowLeft, User, TrendingUp, Award, Calendar,
  Zap, Target, Activity, Crown, Edit2, Loader2, LogOut,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  nome: string | null;
  peso: number | null;
  altura: number | null;
  objetivo: string | null;
  peso_objetivo: number | null;
  quiz_completed: boolean;
  plan: string;
  is_admin: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ analises: 0, dietas: 0, diasAtivos: 0 });
  const [bioImpedancia, setBioImpedancia] = useState<Record<string, string> | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          // Se não existe registro, manda fazer quiz
          if (fetchError.code === 'PGRST116') {
            router.push('/quiz');
            return;
          }
          throw fetchError;
        }

        setProfile(data);

        const foodHistory: any[] = JSON.parse(localStorage.getItem(`foodHistory_${user.id}`) || '[]');
        const dietHistory: any[] = JSON.parse(localStorage.getItem(`dietHistory_${user.id}`) || '[]');
        const diasAtivos = new Set(foodHistory.map((i: any) => new Date(i.date).toDateString())).size;
        setStats({ analises: foodHistory.length, dietas: dietHistory.length, diasAtivos });

        const storedBio = localStorage.getItem(`bioimpedancia_${user.id}`);
        if (storedBio) setBioImpedancia(JSON.parse(storedBio));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar perfil';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const calculateIMC = (): string => {
    if (!profile?.peso || !profile?.altura) return '0';
    return (profile.peso / Math.pow(profile.altura / 100, 2)).toFixed(1);
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-yellow-500' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-500' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-orange-500' };
    return { label: 'Obesidade', color: 'text-red-500' };
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  // ===== ERROR =====
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-400 mb-4">{error || 'Não foi possível carregar o perfil.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#00AEEF] hover:bg-[#0088CC] text-white px-6 py-2 rounded-xl font-semibold"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const imc = parseFloat(calculateIMC());
  const imcCategory = getIMCCategory(imc);
  const userName = profile.nome || profile.email.split('@')[0] || 'Usuário';
  const isAdmin = profile.is_admin === true;
  const isPro = isAdmin || profile.plan === 'pro';
  const joinDate = new Date(profile.created_at).toLocaleDateString('pt-BR');

  const badges = [
    { icon: '🔥', name: 'Primeira Análise', unlocked: true },
    { icon: '💪', name: '7 Dias Ativos', unlocked: false },
    { icon: '🎯', name: 'Meta Atingida', unlocked: false },
    { icon: '⭐', name: 'Membro PRO', unlocked: isPro },
  ];

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
              <User className="w-7 h-7 text-[#00AEEF]" />
              Meu Perfil
            </h1>
            <p className="text-sm text-gray-400">Visualize e gerencie suas informações</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0088CC] flex items-center justify-center text-5xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              {isPro && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">{userName}</h2>
              <p className="text-sm text-gray-400 mb-3">{profile.email}</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isAdmin
                      ? 'bg-yellow-400/20 border border-yellow-400 text-yellow-300'
                      : isPro
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {isAdmin ? '👑 ADMIN' : isPro ? '👑 PRO' : '🆓 Gratuito'}
                </span>
                <span className="px-3 py-1 bg-[#00AEEF]/20 text-[#00AEEF] rounded-full text-sm font-semibold">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Desde {joinDate}
                </span>
              </div>
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-[#00AEEF] hover:bg-[#0088CC] text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {profile.peso && profile.altura && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#00AEEF]/10 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-[#00AEEF]" />
                </div>
                <span className="text-sm text-gray-400">Peso Atual</span>
              </div>
              <div className="text-3xl font-bold text-[#00AEEF]">{profile.peso} kg</div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-gray-400">Altura</span>
              </div>
              <div className="text-3xl font-bold text-purple-500">{profile.altura} cm</div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-gray-400">IMC</span>
              </div>
              <div className={`text-3xl font-bold ${imcCategory.color}`}>{imc}</div>
              <div className="text-xs text-gray-400 mt-1">{imcCategory.label}</div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-sm text-gray-400">Meta</span>
              </div>
              <div className="text-3xl font-bold text-yellow-500">
                {(profile.peso_objetivo ?? 0) > 0 ? '+' : ''}
                {profile.peso_objetivo ?? 0} kg
              </div>
            </div>
          </div>
        )}

        {/* Objetivo Card */}
        {profile.objetivo && (
          <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0088CC]/10 border border-[#00AEEF]/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#00AEEF]" />
              Seu Objetivo
            </h3>
            <div className="text-2xl font-bold text-[#00AEEF] mb-2">
              {profile.objetivo === 'perder' && '🔥 Perder peso'}
              {profile.objetivo === 'ganhar' && '💪 Ganhar massa muscular'}
              {profile.objetivo === 'acompanhar' && '📊 Manter peso'}
              {profile.objetivo === 'curiosidade' && '🤖 Testar a IA'}
            </div>
            <p className="text-gray-400">
              {profile.objetivo === 'perder' && 'Seu plano foi otimizado para perda de peso saudável'}
              {profile.objetivo === 'ganhar' && 'Seu plano foi otimizado para ganho de massa muscular'}
              {profile.objetivo === 'acompanhar' && 'Seu plano foi otimizado para manutenção do peso'}
              {profile.objetivo === 'curiosidade' && 'Explore o app à vontade!'}
            </p>
          </div>
        )}

        {/* Badges */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#00AEEF]" />
            Conquistas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  badge.unlocked
                    ? 'bg-[#00AEEF]/10 border-[#00AEEF] hover:scale-105'
                    : 'bg-gray-800/50 border-gray-700 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold">{badge.name}</div>
                {!badge.unlocked && (
                  <div className="text-xs text-gray-500 mt-1">Bloqueado</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00AEEF]" />
            Estatísticas
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{stats.analises}</div>
              <div className="text-sm text-gray-400">Análises Feitas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{stats.dietas}</div>
              <div className="text-sm text-gray-400">Dietas Geradas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{stats.diasAtivos}</div>
              <div className="text-sm text-gray-400">Dias Ativos</div>
            </div>
          </div>
        </div>

        {/* Bioimpedância */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              Bioimpedância
            </h3>
            <button
              onClick={() => router.push('/profile/edit')}
              className="text-sm text-[#00AEEF] hover:text-[#0088CC] font-medium transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              {bioImpedancia ? 'Atualizar' : 'Adicionar dados'}
            </button>
          </div>

          {bioImpedancia ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: '💪', label: 'Massa Muscular', key: 'massaMuscular', unit: 'kg' },
                { emoji: '🎯', label: 'Massa Magra',    key: 'massaMagra',    unit: 'kg' },
                { emoji: '🦴', label: 'Massa Óssea',   key: 'massaOssea',    unit: 'kg' },
                { emoji: '⚖️', label: 'Massa Gordura',  key: 'massaGordura',  unit: 'kg' },
                { emoji: '💧', label: 'Água Corporal',  key: 'aguaCorporal',  unit: '%'  },
                { emoji: '🔴', label: 'Gord. Visceral', key: 'gorduraVisceral', unit: 'nível' },
                { emoji: '🔥', label: 'TMB',            key: 'tmb',           unit: 'kcal' },
                { emoji: '⚡', label: 'Idade Metab.',   key: 'idadeMetabolica', unit: 'anos' },
              ].map(({ emoji, label, key, unit }) => (
                <div key={key} className="bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className="font-bold text-white text-lg leading-none">
                    {bioImpedancia[key] || '—'}
                    {bioImpedancia[key] && (
                      <span className="text-xs text-gray-400 font-normal ml-1">{unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🔬</div>
              <p className="text-gray-400 text-sm mb-4">
                Nenhum dado de bioimpedância registrado ainda.
              </p>
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-[#00AEEF] hover:bg-[#0088CC] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Adicionar agora
              </button>
            </div>
          )}
        </div>

        {/* CTA Upgrade */}
        {!isPro && (
          <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Desbloqueie todo o potencial!</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Com o PRO você tem análises ilimitadas, histórico completo, gráficos de evolução e muito mais!
                </p>
                <button
                  onClick={() => router.push('/upgrade')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                >
                  Fazer Upgrade Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
