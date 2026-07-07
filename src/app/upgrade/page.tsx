'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  Crown, Check, X, Zap, ArrowLeft, Sparkles, Loader2, ExternalLink,
} from 'lucide-react';

type PlanType = 'monthly' | 'quarterly' | 'annual';

const plans = {
  monthly: {
    name: 'Mensal', price: 19.90, pricePerMonth: 19.90,
    period: 'mês', total: null, badge: null, savings: null,
  },
  quarterly: {
    name: 'Trimestral', price: 49.90, pricePerMonth: 16.63,
    period: '3 meses', total: 49.90, badge: 'MAIS POPULAR', savings: 'Economize 16%',
  },
  annual: {
    name: 'Anual', price: 149.90, pricePerMonth: 12.49,
    period: 'ano', total: 149.90, badge: 'MELHOR OFERTA', savings: 'Economize 37%',
  },
} as const;

const freeFeatures = [
  { text: '1 análise de comida por dia',   ok: true  },
  { text: '1 dieta por semana',            ok: true  },
  { text: '3 treinos por semana',          ok: true  },
  { text: 'Análises ilimitadas',           ok: false },
  { text: 'Dietas ilimitadas',             ok: false },
  { text: 'Treinos ilimitados',            ok: false },
  { text: 'Histórico completo',            ok: false },
  { text: 'Suporte prioritário',           ok: false },
];

const proFeatures = [
  { text: '10 análises de comida por dia'      },
  { text: '3 dietas por dia'                   },
  { text: '5 treinos por dia'                  },
  { text: 'Histórico completo salvo'           },
  { text: 'Simulador corporal (em breve)'      },
  { text: 'Suporte prioritário'                },
  { text: 'Sem anúncios'                       },
];

export default function UpgradePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('quarterly');
  const [userPlan, setUserPlan]         = useState<string>('free');
  const [loadingUser, setLoadingUser]   = useState(true);
  const [checkingOut, setCheckingOut]   = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [notice, setNotice]             = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase.from('users').select('plan').eq('id', user.id).single();
      setUserPlan(data?.plan ?? 'free');
      setLoadingUser(false);

      // Lê query params sem useSearchParams (evita Suspense)
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        setNotice({ type: 'success', msg: '🎉 Assinatura ativada! Bem-vindo ao PRO.' });
        window.history.replaceState({}, '', '/upgrade');
      } else if (params.get('canceled') === 'true') {
        setNotice({ type: 'error', msg: 'Pagamento cancelado. Você pode tentar novamente quando quiser.' });
        window.history.replaceState({}, '', '/upgrade');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (plan: PlanType) => {
    setCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setNotice({ type: 'error', msg: data.error ?? 'Erro ao iniciar pagamento.' });
        setCheckingOut(false);
      }
    } catch {
      setNotice({ type: 'error', msg: 'Erro de conexão. Tente novamente.' });
      setCheckingOut(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setNotice({ type: 'error', msg: 'Erro ao abrir portal. Tente novamente.' });
    } finally {
      setPortalLoading(false);
    }
  };

  const isPro = userPlan === 'pro';

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-7 h-7 text-yellow-500" />
              {isPro ? 'Sua Assinatura PRO' : 'Upgrade para PRO'}
            </h1>
            <p className="text-sm text-gray-400">
              {isPro ? 'Gerencie seu plano e pagamento' : 'Desbloqueie todo o potencial do Queima AI'}
            </p>
          </div>
          {isPro && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Gerenciar Assinatura
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Aviso de sucesso/erro */}
        {notice && (
          <div className={`mb-6 rounded-xl p-4 border text-sm font-medium ${
            notice.type === 'success'
              ? 'bg-green-500/10 border-green-500/40 text-green-400'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            {notice.msg}
          </div>
        )}

        {/* Nota compacta PRO */}
        {isPro && (
          <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/40 rounded-xl px-5 py-3 mb-6">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">Você já é membro PRO! 👑</span>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Gerenciar assinatura
            </button>
          </div>
        )}

        <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-2 mb-6">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">Oferta Especial de Lançamento</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Acelere seus resultados com o
                <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                  Queima AI PRO
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Análises ilimitadas, dietas personalizadas e ferramentas exclusivas
              </p>
            </div>

            {/* Plan selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-900 rounded-2xl p-2 inline-flex gap-2">
                {(Object.keys(plans) as PlanType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedPlan === key
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {plans[key].name}
                    {plans[key].savings && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                        {plans[key].savings}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Free */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Grátis</h3>
                  <div className="text-5xl font-bold mb-4">R$ 0</div>
                  <p className="text-gray-400">Para começar</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {f.ok
                        ? <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        : <X     className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />}
                      <span className={f.ok ? 'text-white' : 'text-gray-600'}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
                >
                  Continuar Grátis
                </button>
              </div>

              {/* PRO */}
              <div className="relative bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 rounded-2xl p-8 border-2 border-yellow-500">
                {plans[selectedPlan].badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      {plans[selectedPlan].badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8 mt-4">
                  <h3 className="text-2xl font-bold mb-2">PRO — {plans[selectedPlan].name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-5xl font-bold text-yellow-500">
                      R$ {plans[selectedPlan].pricePerMonth.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-300">/mês</span>
                  </div>
                  {selectedPlan !== 'monthly' && (
                    <p className="text-gray-400 text-sm">
                      R$ {plans[selectedPlan].price.toFixed(2).replace('.', ',')} cobrado por {plans[selectedPlan].period}
                    </p>
                  )}
                  {plans[selectedPlan].savings && (
                    <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-1 mt-3">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-semibold">{plans[selectedPlan].savings}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white font-medium">{f.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(selectedPlan)}
                  disabled={checkingOut}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-yellow-500/40 flex items-center justify-center gap-2"
                >
                  {checkingOut
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirecionando...</>
                    : <><Crown className="w-5 h-5" /> {isPro ? 'Trocar para este Plano' : `Assinar Plano ${plans[selectedPlan].name}`}</>}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Pagamento seguro via Stripe • Cancele quando quiser • Garantia de 7 dias
                </p>
              </div>
            </div>
        </>

        {/* FAQ */}
        <div className="mt-4">
          <h3 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h3>
          <div className="space-y-3">
            {[
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim! Clique em "Gerenciar Assinatura" e cancele sem taxas ou multas. O acesso PRO fica ativo até o fim do período já pago.',
              },
              {
                q: 'Como funciona a garantia de 7 dias?',
                a: 'Se não ficar satisfeito nos primeiros 7 dias, é só entrar em contato pelo suporte e devolvemos 100% do valor.',
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos cartão de crédito e débito via Stripe, uma das plataformas de pagamento mais seguras do mundo.',
              },
              {
                q: 'Qual a diferença entre os planos?',
                a: 'Todos os planos PRO têm as mesmas funcionalidades. A diferença é só no período e no desconto: quanto maior o período, maior a economia.',
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800 cursor-pointer">
                <summary className="font-semibold select-none">{q}</summary>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
