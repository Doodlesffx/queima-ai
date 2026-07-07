'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Bio {
  massaMuscular: string;
  massaMagra: string;
  massaOssea: string;
  massaGordura: string;
  aguaCorporal: string;
  gorduraVisceral: string;
  tmb: string;
  idadeMetabolica: string;
}

const emptyBio: Bio = {
  massaMuscular: '',
  massaMagra: '',
  massaOssea: '',
  massaGordura: '',
  aguaCorporal: '',
  gorduraVisceral: '',
  tmb: '',
  idadeMetabolica: '',
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    peso: '',
    altura: '',
    objetivo: 'perder',
    peso_objetivo: '0',
  });

  const [bio, setBio] = useState<Bio>(emptyBio);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from('users')
        .select('nome, peso, altura, objetivo, peso_objetivo')
        .eq('id', user.id)
        .single();

      if (data) {
        setForm({
          nome: data.nome || '',
          peso: String(data.peso ?? ''),
          altura: String(data.altura ?? ''),
          objetivo: data.objetivo || 'perder',
          peso_objetivo: String(data.peso_objetivo ?? 0),
        });
      }

      const storedBio = localStorage.getItem(`bioimpedancia_${user.id}`);
      if (storedBio) setBio(JSON.parse(storedBio));

      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);

    localStorage.setItem(`bioimpedancia_${userId}`, JSON.stringify(bio));

    const { error: updateError } = await supabase
      .from('users')
      .update({
        nome: form.nome.trim() || null,
        peso: parseFloat(form.peso) || null,
        altura: parseInt(form.altura) || null,
        objetivo: form.objetivo,
        peso_objetivo: parseInt(form.peso_objetivo) || 0,
      })
      .eq('id', userId);

    setSaving(false);
    if (updateError) {
      setError('Erro ao salvar. Tente novamente.');
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1200);
    }
  };

  const setBioField = (field: keyof Bio, value: string) =>
    setBio((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
            <p className="text-sm text-gray-400">Atualize suas informações</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">

        {/* ── Dados Básicos ── */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-5">
          <h2 className="text-lg font-semibold text-white">Dados Pessoais</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Seu nome"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Peso (kg)</label>
              <input
                type="number"
                value={form.peso}
                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                placeholder="Ex: 75"
                min="30" max="300"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Altura (cm)</label>
              <input
                type="number"
                value={form.altura}
                onChange={(e) => setForm({ ...form, altura: e.target.value })}
                placeholder="Ex: 170"
                min="100" max="250"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'perder', label: 'Perder peso' },
                { value: 'ganhar', label: 'Ganhar peso' },
                { value: 'acompanhar', label: 'Manter peso' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, objetivo: opt.value })}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                    form.objetivo === opt.value
                      ? 'border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF]'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta de variação de peso (kg)
              <span className="text-gray-500 font-normal ml-2">negativo = perder, positivo = ganhar</span>
            </label>
            <input
              type="number"
              value={form.peso_objetivo}
              onChange={(e) => setForm({ ...form, peso_objetivo: e.target.value })}
              placeholder="Ex: -5"
              min="-50" max="50"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
            />
          </div>
        </div>

        {/* ── Bioimpedância ── */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Bioimpedância</h2>
            <p className="text-sm text-gray-400 mt-1">
              Insira os dados da sua balança de bioimpedância
            </p>
          </div>

          {/* Massa Muscular + Massa Magra */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💪 Massa Muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={bio.massaMuscular}
                onChange={(e) => setBioField('massaMuscular', e.target.value)}
                placeholder="Ex: 35.4"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎯 Massa Magra (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={bio.massaMagra}
                onChange={(e) => setBioField('massaMagra', e.target.value)}
                placeholder="Ex: 58.2"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
          </div>

          {/* Massa Óssea + Massa de Gordura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🦴 Massa Óssea (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={bio.massaOssea}
                onChange={(e) => setBioField('massaOssea', e.target.value)}
                placeholder="Ex: 2.8"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ⚖️ Massa de Gordura (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={bio.massaGordura}
                onChange={(e) => setBioField('massaGordura', e.target.value)}
                placeholder="Ex: 18.5"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
          </div>

          {/* Água Corporal + Gordura Visceral */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💧 Água Corporal Total (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={bio.aguaCorporal}
                onChange={(e) => setBioField('aguaCorporal', e.target.value)}
                placeholder="Ex: 58.3"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔴 Gordura Visceral (nível)
              </label>
              <input
                type="number"
                step="1"
                value={bio.gorduraVisceral}
                onChange={(e) => setBioField('gorduraVisceral', e.target.value)}
                placeholder="Ex: 7"
                min="1" max="59"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
          </div>

          {/* TMB + Idade Metabólica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔥 Taxa Metabólica Basal (kcal)
              </label>
              <input
                type="number"
                step="1"
                value={bio.tmb}
                onChange={(e) => setBioField('tmb', e.target.value)}
                placeholder="Ex: 1680"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ⚡ Idade Metabólica (anos)
              </label>
              <input
                type="number"
                step="1"
                value={bio.idadeMetabolica}
                onChange={(e) => setBioField('idadeMetabolica', e.target.value)}
                placeholder="Ex: 24"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
            <p className="text-green-400 text-sm">Salvo com sucesso! Redirecionando...</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#00AEEF] hover:bg-[#0088CC] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="w-5 h-5" /> Salvar Alterações</>
          )}
        </button>
      </div>
    </div>
  );
}
