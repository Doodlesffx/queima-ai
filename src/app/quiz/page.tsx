// ============================================
// QUIZ DE ONBOARDING - QUEIMA AI
// Coleta dados do usuário para personalização
// ============================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { QuizData } from '@/lib/types';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<Partial<QuizData>>({});

  const questions = [
    {
      id: 'objetivo',
      title: 'Qual é o seu objetivo principal?',
      type: 'options',
      options: [
        { value: 'perder', label: 'Perder peso' },
        { value: 'ganhar', label: 'Ganhar peso' },
        { value: 'acompanhar', label: 'Só acompanhar minha alimentação' },
        { value: 'curiosidade', label: 'Curiosidade / Testar a IA' },
      ],
    },
    {
      id: 'peso',
      title: 'Qual o seu peso atual?',
      type: 'number',
      placeholder: 'Ex: 75',
      unit: 'kg',
    },
    {
      id: 'altura',
      title: 'Qual a sua altura?',
      type: 'number',
      placeholder: 'Ex: 170',
      unit: 'cm',
    },
    {
      id: 'nivelAtividade',
      title: 'Qual seu nível de atividade?',
      type: 'options',
      options: [
        { value: 'sedentario', label: 'Sedentário' },
        { value: 'leve', label: 'Leve' },
        { value: 'moderado', label: 'Moderado' },
        { value: 'intenso', label: 'Intenso' },
      ],
    },
    {
      id: 'fazeExercicios',
      title: 'Você costuma fazer exercícios?',
      type: 'options',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
        { value: 'as-vezes', label: 'Às vezes' },
      ],
    },
    {
      id: 'fastFoodFrequencia',
      title: 'Quantas vezes por semana você come fast food?',
      type: 'options',
      options: [
        { value: '0', label: '0' },
        { value: '1-2', label: '1–2' },
        { value: '3-4', label: '3–4' },
        { value: '5+', label: '5+' },
      ],
    },
    {
      id: 'rotinaAlimentar',
      title: 'Como você avaliaria sua rotina alimentar?',
      type: 'options',
      options: [
        { value: 'boa', label: 'Boa' },
        { value: 'mais-ou-menos', label: 'Mais ou menos' },
        { value: 'ruim', label: 'Ruim' },
        { value: 'caotica', label: 'Caótica' },
      ],
    },
    {
      id: 'tipoMetas',
      title: 'Você quer receber metas fáceis ou metas desafiadoras?',
      type: 'options',
      options: [
        { value: 'faceis', label: 'Fáceis' },
        { value: 'normais', label: 'Normais' },
        { value: 'dificeis', label: 'Difíceis' },
      ],
    },
    {
      id: 'tempoExercicio',
      title: 'Quanto tempo quer dedicar por dia pra se exercitar?',
      type: 'options',
      options: [
        { value: '0', label: '0 min' },
        { value: '10-15', label: '10–15 min' },
        { value: '20-30', label: '20–30 min' },
        { value: '40+', label: '40+ min' },
      ],
    },
    {
      id: 'tipoTreino',
      title: 'Você prefere treinos de qual tipo?',
      type: 'options',
      options: [
        { value: 'caminhada', label: 'Caminhada' },
        { value: 'corrida', label: 'Corrida' },
        { value: 'bicicleta', label: 'Bicicleta' },
        { value: 'musculacao', label: 'Musculação' },
        { value: 'nao-gosto', label: 'Não gosto, quero só ver calorias' },
      ],
    },
    {
      id: 'pesoObjetivo',
      title: 'Quanto peso você gostaria de perder/ganhar nos próximos 30 dias?',
      type: 'slider',
      min: -20,
      max: 20,
      unit: 'kg',
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Salvar dados e redirecionar para dashboard
      localStorage.setItem('quizData', JSON.stringify(quizData));
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (value: string) => {
    setQuizData({ ...quizData, [currentQuestion.id]: value });
  };

  const handleNumberChange = (value: number) => {
    setQuizData({ ...quizData, [currentQuestion.id]: value });
  };

  const isStepValid = () => {
    return quizData[currentQuestion.id as keyof QuizData] !== undefined;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-[#00AEEF] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-sm text-gray-400">
          {currentStep + 1} de {questions.length}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            {currentQuestion.title}
          </h2>

          {/* Options Type */}
          {currentQuestion.type === 'options' && (
            <div className="grid gap-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    quizData[currentQuestion.id as keyof QuizData] === option.value
                      ? 'bg-[#00AEEF] text-white scale-105'
                      : 'bg-gray-900 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {quizData[currentQuestion.id as keyof QuizData] === option.value && (
                      <Check className="w-6 h-6" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Number Type */}
          {currentQuestion.type === 'number' && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-xs">
                <input
                  type="number"
                  placeholder={currentQuestion.placeholder}
                  value={quizData[currentQuestion.id as keyof QuizData] || ''}
                  onChange={(e) => handleNumberChange(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-2xl text-center focus:outline-none focus:border-[#00AEEF] transition-colors"
                />
                {currentQuestion.unit && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    {currentQuestion.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Slider Type */}
          {currentQuestion.type === 'slider' && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-6xl font-bold text-[#00AEEF]">
                {quizData[currentQuestion.id as keyof QuizData] || 0} {currentQuestion.unit}
              </div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={quizData[currentQuestion.id as keyof QuizData] || 0}
                onChange={(e) => handleNumberChange(Number(e.target.value))}
                className="w-full max-w-md h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between w-full max-w-md text-sm text-gray-500">
                <span>{currentQuestion.min} kg</span>
                <span>{currentQuestion.max} kg</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="w-full bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentStep === questions.length - 1 ? (
            <>
              <Check className="w-5 h-5" />
              Finalizar
            </>
          ) : (
            <>
              Próxima
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
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
