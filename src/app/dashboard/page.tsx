// ============================================
// DASHBOARD PRINCIPAL - QUEIMA AI
// Hub central com acesso a todas as funcionalidades
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, TrendingUp, Users, Utensils, Award, Zap, Crown, Edit2, Dumbbell, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { usePostHog } from 'posthog-js/react';
import type { QuizData } from '@/lib/types';
import UserProfile from '@/components/UserProfile';
import SupportWidget from '@/components/SupportWidget';

export default function DashboardPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userName, setUserName] = useState('Usuário');
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const posthog = usePostHog();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [conquistas, setConquistas] = useState({ analises: 0, diasAtivos: 0 });

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
        setUserId(user.id);

        // Carrega conquistas do localStorage
        const foodHistory: any[] = JSON.parse(localStorage.getItem(`foodHistory_${user.id}`) || '[]');
        const diasAtivos = new Set(foodHistory.map((i: any) => new Date(i.date).toDateString())).size;
        setConquistas({ analises: foodHistory.length, diasAtivos });

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
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
          setUserName(data.nome || user.email?.split('@')[0] || 'Usuário');
          setIsAdmin(data.is_admin === true);
          setIsPro(data.plan === 'pro' || data.is_admin === true);
          posthog?.identify(user.id, { email: user.email, plan: data.plan, is_admin: data.is_admin ?? false });
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

  const handleEditField = (field: string, currentValue: string | number) => {
    setEditingField(field);
    setTempValue(String(currentValue));
  };

  const handleSaveField = async (field: string) => {
    if (!quizData || !userId) return;

    const updatedData = { ...quizData };
    const supabaseUpdate: Record<string, unknown> = {};

    if (field === 'peso') {
      updatedData.peso = parseFloat(tempValue) || quizData.peso;
      supabaseUpdate.peso = updatedData.peso;
    } else if (field === 'altura') {
      updatedData.altura = parseInt(tempValue) || quizData.altura;
      supabaseUpdate.altura = updatedData.altura;
    } else if (field === 'pesoObjetivo') {
      updatedData.pesoObjetivo = parseInt(tempValue) || quizData.pesoObjetivo;
      supabaseUpdate.peso_objetivo = updatedData.pesoObjetivo;
    } else if (field === 'objetivo') {
      updatedData.objetivo = tempValue as any;
      supabaseUpdate.objetivo = updatedData.objetivo;
    }

    setQuizData(updatedData);
    await supabase.from('users').update(supabaseUpdate).eq('id', userId);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  const objetivos = [
    { value: 'perder', label: 'Perder peso' },
    { value: 'ganhar', label: 'Ganhar peso' },
    { value: 'acompanhar', label: 'Manter peso' },
  ];

  const getObjetivoLabel = (value: string) => {
    return objetivos.find(obj => obj.value === value)?.label || value;
  };

  const features = [
    {
      icon: Camera,
      title: 'Leitor de Calorias',
      description: 'Analise suas refeições com IA',
      color: 'from-[#00AEEF] to-[#0088CC]',
      route: '/calories',
      disabled: false,
    },
    {
      icon: Dumbbell,
      title: 'Plano de Treino',
      description: 'Treino personalizado com IA',
      color: 'from-purple-500 to-purple-700',
      route: '/workout',
      disabled: false,
    },
    {
      icon: Utensils,
      title: 'Dieta com IA',
      description: 'Plano alimentar personalizado',
      color: 'from-green-500 to-green-700',
      route: '/diet',
      disabled: false,
    },
    {
      icon: Users,
      title: 'Ranking',
      description: 'Compare seu progresso',
      color: 'from-orange-500 to-orange-700',
      route: '/ranking',
      disabled: true,
      badge: 'Em Breve',
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
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold cursor-default select-none">
                  <Crown className="w-4 h-4 fill-yellow-300" />
                  ADMIN
                </div>
              ) : isPro ? (
                <button
                  onClick={() => router.push('/upgrade')}
                  className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-500/30 transition-all"
                >
                  <Crown className="w-4 h-4 fill-yellow-400" />
                  PRO
                </button>
              ) : (
                <button
                  onClick={() => router.push('/upgrade')}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade
                </button>
              )}
              <UserProfile userName={userName} isPro={isPro} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {quizData && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta, {userName}! 👋</h2>
            
            {/* Objetivo - Editável */}
            <div className="mb-4">
              {editingField === 'objetivo' ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Objetivo:</span>
                  <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="bg-gray-800 text-[#00AEEF] font-semibold px-3 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-[#00AEEF]"
                    autoFocus
                  >
                    {objetivos.map(obj => (
                      <option key={obj.value} value={obj.value}>{obj.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSaveField('objetivo')}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  Objetivo:{' '}
                  <button
                    onClick={() => handleEditField('objetivo', quizData.objetivo)}
                    className="text-[#00AEEF] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    {getObjetivoLabel(quizData.objetivo)}
                    <Edit2 className="w-3 h-3" />
                  </button>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Peso Atual */}
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Peso Atual</div>
                {editingField === 'peso' ? (
                  <div className="mt-1">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-gray-800 text-[#00AEEF] font-bold px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-[#00AEEF]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveField('peso');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => handleSaveField('peso')}
                        className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 rounded text-xs"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditField('peso', quizData.peso)}
                    className="text-xl font-bold text-[#00AEEF] hover:text-[#00CCFF] transition-colors flex items-center gap-1"
                  >
                    {quizData.peso} kg
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Altura */}
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Altura</div>
                {editingField === 'altura' ? (
                  <div className="mt-1">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-gray-800 text-[#00AEEF] font-bold px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-[#00AEEF]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveField('altura');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => handleSaveField('altura')}
                        className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 rounded text-xs"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditField('altura', quizData.altura)}
                    className="text-xl font-bold text-[#00AEEF] hover:text-[#00CCFF] transition-colors flex items-center gap-1"
                  >
                    {quizData.altura} cm
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Meta */}
              <div className="bg-black/30 rounded-xl p-3">
                <div className="text-sm text-gray-400">Meta</div>
                {editingField === 'pesoObjetivo' ? (
                  <div className="mt-1">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-gray-800 text-[#00AEEF] font-bold px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-[#00AEEF]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveField('pesoObjetivo');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => handleSaveField('pesoObjetivo')}
                        className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 rounded text-xs"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditField('pesoObjetivo', quizData.pesoObjetivo)}
                    className="text-xl font-bold text-[#00AEEF] hover:text-[#00CCFF] transition-colors flex items-center gap-1"
                  >
                    {quizData.pesoObjetivo > 0 ? '+' : ''}{quizData.pesoObjetivo} kg
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* IMC */}
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
              const isDisabled = feature.disabled;
              
              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && router.push(feature.route)}
                  disabled={isDisabled}
                  className={`group relative bg-gray-900 rounded-2xl p-6 text-left transition-all duration-300 border border-gray-800 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-800 hover:border-[#00AEEF]/50 hover:scale-105'
                  }`}
                >
                  {/* Badge "Em Breve" */}
                  {isDisabled && feature.badge && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      {feature.badge}
                    </div>
                  )}

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 ${
                    isDisabled ? 'grayscale' : ''
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                  
                  {!isDisabled && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-pulse" />
                    </div>
                  )}
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
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{conquistas.analises}</div>
              <div className="text-sm text-gray-400">Análises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{conquistas.diasAtivos}</div>
              <div className="text-sm text-gray-400">Dias Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00AEEF] mb-1">{isPro ? 1 : 0}</div>
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

      {/* Widget de Suporte */}
      <SupportWidget />
    </div>
  );
}
