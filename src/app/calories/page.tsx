// ============================================
// LEITOR DE CALORIAS - QUEIMA AI
// Upload e análise de fotos de alimentos
// ============================================
'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Flame, Clock, Zap, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function CaloriesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar imagem');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar imagem');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* Image Preview */}
        {selectedImage && !result && (
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
                className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
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
            {/* Image with Result */}
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

            {/* Calories Card */}
            <div className="bg-gradient-to-br from-[#00AEEF] to-[#0088CC] rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 mx-auto mb-4" />
              <div className="text-6xl font-bold mb-2">{result.calorias}</div>
              <div className="text-xl opacity-90">calorias totais</div>
            </div>

            {/* Macros Grid */}
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

            {/* Burn Time Cards */}
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Analisar Outra Foto
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
