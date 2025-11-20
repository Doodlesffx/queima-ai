// ============================================
// SIMULADOR CORPORAL - QUEIMA AI
// Upload de foto + slider de peso + visualização
// ============================================
'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Loader2, TrendingDown, TrendingUp, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BodySimulatorPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [weightChange, setWeightChange] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);

    // Simulação de geração (em produção, chamar API de geração de imagem)
    setTimeout(() => {
      // Por enquanto, mantém a mesma imagem (placeholder)
      setGeneratedImage(selectedImage);
      setIsGenerating(false);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setWeightChange(0);
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
            <h1 className="text-2xl font-bold">Simulador Corporal</h1>
            <p className="text-sm text-gray-400">Visualize sua transformação</p>
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
              className="w-full bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-2 border-dashed border-purple-700 rounded-2xl p-12 hover:border-purple-500 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-purple-500/10 p-6 rounded-full group-hover:bg-purple-500/20 transition-colors">
                  <Upload className="w-12 h-12 text-purple-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Envie uma foto sua (corpo inteiro)</h3>
                  <p className="text-gray-400">Para melhores resultados, use foto de frente com boa iluminação</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Image + Slider */}
        {selectedImage && !generatedImage && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>

            {/* Weight Slider */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Quanto peso você quer {weightChange >= 0 ? 'ganhar' : 'perder'}?
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <TrendingDown className="w-6 h-6 text-red-500" />
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={weightChange}
                  onChange={(e) => setWeightChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-[#00AEEF] mb-2">
                  {weightChange > 0 ? '+' : ''}{weightChange} kg
                </div>
                <p className="text-gray-400 text-sm">
                  {weightChange === 0 && 'Ajuste o slider para ver a simulação'}
                  {weightChange > 0 && `Ganhar ${weightChange} kg`}
                  {weightChange < 0 && `Perder ${Math.abs(weightChange)} kg`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || weightChange === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Simulação'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isGenerating}
                className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Results - Before/After Comparison */}
        {generatedImage && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-2xl p-6 border border-purple-700/50">
              <h3 className="text-xl font-semibold mb-4 text-center">Sua Transformação</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Before */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 text-center">Antes</div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedImage!}
                      alt="Before"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-full text-sm">
                      Original
                    </div>
                  </div>
                </div>

                {/* After */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 text-center">Depois</div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={generatedImage}
                      alt="After"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 px-3 py-1 rounded-full text-sm">
                      {weightChange > 0 ? '+' : ''}{weightChange} kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-black/30 rounded-xl p-4 text-center">
                <p className="text-gray-300">
                  {weightChange > 0 
                    ? `Assim você ficaria ganhando ${weightChange} kg`
                    : `Assim você ficaria perdendo ${Math.abs(weightChange)} kg`
                  }
                </p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={() => {/* Implementar compartilhamento */}}
              className="w-full bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar Resultado
            </button>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Nova Simulação
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Voltar
              </button>
            </div>

            {/* Pro Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-300">
                💎 <span className="text-yellow-500 font-semibold">Usuários PRO</span> têm acesso a simulações ilimitadas sem blur
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #00AEEF;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #00AEEF;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
