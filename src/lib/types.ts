// ============================================
// TIPOS E INTERFACES DO QUEIMA AI
// ============================================

export interface QuizData {
  objetivo: 'perder' | 'ganhar' | 'acompanhar' | 'curiosidade';
  peso: number;
  altura: number;
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'intenso';
  fazeExercicios: 'sim' | 'nao' | 'as-vezes';
  fastFoodFrequencia: '0' | '1-2' | '3-4' | '5+';
  rotinaAlimentar: 'boa' | 'mais-ou-menos' | 'ruim' | 'caotica';
  tipoMetas: 'faceis' | 'normais' | 'dificeis';
  tempoExercicio: '0' | '10-15' | '20-30' | '40+';
  tipoTreino: 'caminhada' | 'corrida' | 'bicicleta' | 'musculacao' | 'nao-gosto';
  pesoObjetivo: number;
}

export interface FoodAnalysis {
  alimento: string;
  calorias: number;
  equivalencia: string;
  tempoQueima: {
    caminhada: number;
    corrida: number;
    bike: number;
    musculacao: number;
  };
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  isPro: boolean;
  usosGratuitos: number;
  quizCompleto: boolean;
  quizData?: QuizData;
  createdAt: Date;
}

export interface RankingEntry {
  userId: string;
  nome: string;
  pesoInicial: number;
  pesoAtual: number;
  pesoObjetivo: number;
  progresso: number;
  isPublico: boolean;
}
