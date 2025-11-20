// ============================================
// PÁGINA DE UPGRADE - QUEIMA AI
// Paywall e planos PRO
// ============================================
'use client';

import { useRouter } from 'next/navigation';
import { Crown, Check, X, Zap, ArrowLeft } from 'lucide-react';

export default function UpgradePage() {
  const router = useRouter();

  const freeFeatures = [
    { text: '1 análise por semana', included: true },
    { text: 'Resultados com blur parcial', included: true },
    { text: 'Acesso ao ranking', included: true },
    { text: 'Dieta básica com IA', included: true },
    { text: 'Análises ilimitadas', included: false },
    { text: 'Resultados sem blur', included: false },
    { text: 'Simulador corporal ilimitado', included: false },
    { text: 'Histórico completo', included: false },
    { text: 'Suporte prioritário', included: false },
  ];

  const proFeatures = [
    { text: 'Análises ilimitadas', included: true },
    { text: 'Resultados sem blur', included: true },
    { text: 'Simulador corporal ilimitado', included: true },
    { text: 'Histórico completo', included: true },
    { text: 'Dietas personalizadas avançadas', included: true },
    { text: 'Ranking premium', included: true },
    { text: 'Badges exclusivos', included: true },
    { text: 'Suporte prioritário', included: true },
    { text: 'Sem anúncios', included: true },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-7 h-7 text-yellow-500" />
              Upgrade para PRO
            </h1>
            <p className="text-sm text-gray-400">Desbloqueie todo o potencial do Queima AI</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
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
            Análises ilimitadas, resultados sem blur e ferramentas exclusivas para transformar seu corpo
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Grátis</h3>
              <div className="text-5xl font-bold mb-4">R$ 0</div>
              <p className="text-gray-400">Para começar</p>
            </div>

            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? 'text-white' : 'text-gray-600'}>
                    {feature.text}
                  </span>
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

          {/* PRO Plan */}
          <div className="relative bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 rounded-2xl p-8 border-2 border-yellow-500">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" />
                MAIS POPULAR
              </div>
            </div>

            <div className="text-center mb-8 mt-4">
              <h3 className="text-2xl font-bold mb-2">PRO</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-2xl text-gray-400 line-through">R$ 49,90</span>
                <span className="text-5xl font-bold text-yellow-500">R$ 29,90</span>
              </div>
              <p className="text-gray-300">por mês</p>
              <div className="inline-block bg-red-500/20 border border-red-500/50 rounded-full px-4 py-1 mt-2">
                <span className="text-red-400 text-sm font-semibold">40% OFF - Oferta Limitada</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => alert('Integração de pagamento será implementada em breve!')}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Assinar PRO Agora
            </button>
            <p className="text-center text-sm text-gray-400 mt-4">
              Cancele quando quiser • Garantia de 7 dias
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-center">Por que escolher o PRO?</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-[#00AEEF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#00AEEF]" />
              </div>
              <h4 className="font-semibold mb-2">Resultados Mais Rápidos</h4>
              <p className="text-sm text-gray-400">
                Análises ilimitadas para acompanhar cada refeição e acelerar seus resultados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#00AEEF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-[#00AEEF]" />
              </div>
              <h4 className="font-semibold mb-2">Experiência Premium</h4>
              <p className="text-sm text-gray-400">
                Sem blur, sem limitações, sem anúncios. Foco total nos seus objetivos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#00AEEF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#00AEEF]" />
              </div>
              <h4 className="font-semibold mb-2">Suporte Dedicado</h4>
              <p className="text-sm text-gray-400">
                Atendimento prioritário e ferramentas exclusivas para sua jornada
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h3>
          <div className="space-y-4">
            <details className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <summary className="font-semibold cursor-pointer">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="text-gray-400 mt-4">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas.
              </p>
            </details>
            <details className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <summary className="font-semibold cursor-pointer">
                Como funciona a garantia de 7 dias?
              </summary>
              <p className="text-gray-400 mt-4">
                Se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu dinheiro.
              </p>
            </details>
            <details className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <summary className="font-semibold cursor-pointer">
                Quais formas de pagamento são aceitas?
              </summary>
              <p className="text-gray-400 mt-4">
                Aceitamos cartão de crédito, PIX e boleto bancário.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
