'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Flame, Clock, Zap, ArrowLeft, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import ShareMenu from '@/components/ShareMenu';

interface AnalysisResult {
  alimento: string;
  calorias: number;
  equivalencia: string;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  tempoQueima: {
    caminhada: number;
    corrida: number;
    bike: number;
    musculacao: number;
  };
}

const loadingMessages = [
  "Identificando o alimento...",
  "Analisando a imagem...",
  "Calculando as calorias...",
  "Estimando os macronutrientes...",
  "Calculando tempo de queima...",
  "Finalizando análise..."
];

export default function CaloriesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [needsDescription, setNeedsDescription] = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const saveToHistory = (analysisData: AnalysisResult) => {
    if (!userId) return;
    const historyItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      foodName: analysisData.alimento,
      calories: analysisData.calorias,
      protein: analysisData.proteinas,
      carbs: analysisData.carboidratos,
      fat: analysisData.gorduras,
    };
    const key = `foodHistory_${userId}`;
    const currentHistory = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedHistory = [historyItem, ...currentHistory].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);
      setPageLoading(false);
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAnalyzing) return;
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
        setNeedsDescription(false);
        setUserDescription('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (descricao?: string) => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setNeedsDescription(false);
    setLoadingMessage(loadingMessages[0]);

    try {
      const body = descricao
        ? { imageBase64: selectedImage, userDescription: descricao }
        : { imageBase64: selectedImage };

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar imagem');
      }

      // IA não conseguiu identificar — pede descrição ao usuário
      if (data.needsUserInput) {
        setNeedsDescription(true);
        return;
      }

      // Garante que tempoQueima nunca seja undefined
      const safeResult: AnalysisResult = {
        ...data,
        tempoQueima: data.tempoQueima ?? {
          caminhada: 0,
          corrida: 0,
          bike: 0,
          musculacao: 0,
        },
      };

      setResult(safeResult);
      saveToHistory(safeResult);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar imagem');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDescriptionSubmit = () => {
    if (!userDescription.trim()) return;
    handleAnalyze(userDescription.trim());
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setNeedsDescription(false);
    setUserDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShare = () => {
    if (!result) return;
    setShowShareMenu(true);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  const getShareText = () => {
    if (!result) return { title: '', description: '' };
    return {
      title: `🍽️ ${result.alimento}`,
      description: `🔥 ${result.calorias} calorias
💪 ${result.proteinas}g proteínas | 🍞 ${result.carboidratos}g carboidratos | 🥑 ${result.gorduras}g gorduras

⏱️ Tempo para queimar:
🚶 Caminhada: ${result.tempoQueima.caminhada} min
🏃 Corrida: ${result.tempoQueima.corrida} min
🚴 Bike: ${result.tempoQueima.bike} min
💪 Musculação: ${result.tempoQueima.musculacao} min

${result.equivalencia}`
    };
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
          <div>
            <h1 className="text-2xl font-bold">Leitor de Calorias</h1>
            <p className="text-sm text-gray-400">Analise sua comida com IA</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Upload Area */}
        {!selectedImage && (
          <div className="mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-dashed border-gray-700 rounded-2xl p-12 hover:border-[#00AEEF] transition-all duration-300 group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-[#00AEEF]/10 p-6 rounded-full group-hover:bg-[#00AEEF]/20 transition-colors">
                  <Camera className="w-12 h-12 text-[#00AEEF]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Envie uma foto da sua comida</h3>
                  <p className="text-gray-400">Clique para selecionar ou tire uma foto</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Image Preview with Loading */}
        {selectedImage && !result && (
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto max-h-96 object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-[#00AEEF] animate-spin mb-4" />
                  <p className="text-xl font-semibold text-white mb-2">Analisando...</p>
                  <p className="text-gray-300 animate-pulse">{loadingMessage}</p>
                </div>
              )}
            </div>

            {/* Pede descrição se IA não identificou */}
            {needsDescription ? (
              <div className="bg-gray-900 border border-yellow-500/40 rounded-xl p-6 mb-4">
                <p className="text-yellow-400 font-semibold mb-1">Não consegui identificar o alimento 🤔</p>
                <p className="text-gray-400 text-sm mb-4">Descreva o que é e eu calculo as calorias!</p>
                <input
                  type="text"
                  value={userDescription}
                  onChange={(e) => setUserDescription(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDescriptionSubmit()}
                  placeholder="Ex: arroz com feijão e frango grelhado"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDescriptionSubmit}
                    disabled={!userDescription.trim()}
                    className="flex-1 bg-[#00AEEF] hover:bg-[#0088CC] text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calcular Calorias
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnalyze()}
                  disabled={isAnalyzing}
                  className="flex-1 bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analisar Calorias
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={selectedImage!}
                alt="Analyzed food"
                className="w-full h-auto max-h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <h2 className="text-3xl font-bold mb-2">{result.alimento}</h2>
                <p className="text-gray-300">{result.equivalencia}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00AEEF] to-[#0088CC] rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 mx-auto mb-4" />
              <div className="text-6xl font-bold mb-2">{result.calorias}</div>
              <div className="text-xl opacity-90">calorias totais</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                <div className="text-2xl font-bold text-[#00AEEF] mb-1">{result.proteinas}g</div>
                <div className="text-sm text-gray-400">Proteínas</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                <div className="text-2xl font-bold text-[#00AEEF] mb-1">{result.carboidratos}g</div>
                <div className="text-sm text-gray-400">Carboidratos</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                <div className="text-2xl font-bold text-[#00AEEF] mb-1">{result.gorduras}g</div>
                <div className="text-sm text-gray-400">Gorduras</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#00AEEF]" />
                Tempo para queimar
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">🚶 Caminhada</div>
                  <div className="text-3xl font-bold text-[#00AEEF]">{result.tempoQueima.caminhada} min</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">🏃 Corrida</div>
                  <div className="text-3xl font-bold text-[#00AEEF]">{result.tempoQueima.corrida} min</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">🚴 Bicicleta</div>
                  <div className="text-3xl font-bold text-[#00AEEF]">{result.tempoQueima.bike} min</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">💪 Musculação</div>
                  <div className="text-3xl font-bold text-[#00AEEF]">{result.tempoQueima.musculacao} min</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <button
                onClick={handleShare}
                className="bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Analisar Outra Foto
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>

      {showShareMenu && result && (
        <ShareMenu
          title={getShareText().title}
          description={getShareText().description}
          onClose={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}