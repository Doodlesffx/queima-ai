'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Flame, Loader2, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setError('Cadastro feito! Verifique seu email para confirmar a conta.');
          setIsLoading(false);
          return;
        }

        router.push('/quiz');
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('quiz_completed')
            .eq('id', user.id)
            .single();

          router.push(!profile?.quiz_completed ? '/quiz' : '/dashboard');
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a2e] to-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12 text-[#00AEEF]" />
            <h1 className="text-4xl font-bold text-white">Queima AI</h1>
          </div>
          <p className="text-gray-400">Transforme sua relação com alimentação e exercícios</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h2>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00AEEF] to-[#0088CC] hover:from-[#0088CC] hover:to-[#006699] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{isSignUp ? 'Criando conta...' : 'Entrando...'}</>
              ) : (
                <>{isSignUp ? 'Criar Conta' : 'Entrar'}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-gray-400 hover:text-[#00AEEF] transition-colors text-sm"
            >
              {isSignUp ? (
                <>Já tem uma conta? <span className="font-semibold">Entrar</span></>
              ) : (
                <>Não tem uma conta? <span className="font-semibold">Criar conta</span></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Grátis para começar • Sem cartão de crédito
        </p>
      </div>
    </div>
  );
}
