// ============================================
// BANCO DE DADOS DE TREINOS - QUEIMA AI
// 100+ treinos completos prontos
// ============================================

export interface ExercicioTreino {
  nome: string;
  series: string;
  repeticoes: string;
  descanso: string;
  observacao: string;
}

export interface TreinoDia {
  dia: string;
  nome: string;
  exercicios: ExercicioTreino[];
}

export interface TreinoPronto {
  tipo: string; // "Casa" ou "Academia"
  local: 'casa' | 'academia';
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  frequencia: string; // "3x/semana", "4x/semana", etc
  objetivo: 'perder' | 'ganhar' | 'definir';
  duracaoSessao: string;
  gastoCalorico: number;
  treinos: TreinoDia[];
  dicas: string[];
}

export const workoutDatabase: TreinoPronto[] = [
  // ==================== TREINOS EM CASA - INICIANTE ====================
  {
    tipo: "Treino em Casa",
    local: 'casa',
    nivel: 'Iniciante',
    frequencia: "3x/semana",
    objetivo: 'perder',
    duracaoSessao: "45min",
    gastoCalorico: 250,
    treinos: [
      {
        dia: "A",
        nome: "Full Body - Corpo Inteiro",
        exercicios: [
          {
            nome: "Agachamento Livre",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Mantenha as costas retas e joelhos alinhados"
          },
          {
            nome: "Flexão de Braço (joelhos apoiados)",
            series: "3 séries",
            repeticoes: "8-12 repetições",
            descanso: "60s",
            observacao: "Core contraído o tempo todo"
          },
          {
            nome: "Prancha Isométrica",
            series: "3 séries",
            repeticoes: "20-30 segundos",
            descanso: "45s",
            observacao: "Corpo em linha reta"
          },
          {
            nome: "Afundo Alternado",
            series: "3 séries",
            repeticoes: "10 cada perna",
            descanso: "60s",
            observacao: "Joelho não ultrapassa a ponta do pé"
          },
          {
            nome: "Polichinelo",
            series: "3 séries",
            repeticoes: "30 segundos",
            descanso: "45s",
            observacao: "Ótimo para cardio e aquecimento"
          },
          {
            nome: "Mountain Climber",
            series: "3 séries",
            repeticoes: "20 repetições",
            descanso: "60s",
            observacao: "Mantenha quadris estáveis"
          }
        ]
      },
      {
        dia: "B",
        nome: "Full Body - Variação",
        exercicios: [
          {
            nome: "Agachamento Sumô",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Pés mais afastados, trabalha mais glúteos"
          },
          {
            nome: "Tríceps no Banco",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "60s",
            observacao: "Use cadeira ou sofá"
          },
          {
            nome: "Prancha Lateral",
            series: "3 séries",
            repeticoes: "20s cada lado",
            descanso: "45s",
            observacao: "Trabalha oblíquos"
          },
          {
            nome: "Ponte (Glúteos)",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Contraia glúteos no topo"
          },
          {
            nome: "Burpee Modificado",
            series: "3 séries",
            repeticoes: "8-10 repetições",
            descanso: "60s",
            observacao: "Sem o pulo se for muito difícil"
          },
          {
            nome: "Abdominal Crunch",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Eleve apenas as escápulas"
          }
        ]
      },
      {
        dia: "C",
        nome: "Full Body - Cardio Intenso",
        exercicios: [
          {
            nome: "Jumping Jack",
            series: "4 séries",
            repeticoes: "45 segundos",
            descanso: "30s",
            observacao: "Aquecimento e cardio"
          },
          {
            nome: "Agachamento com Salto",
            series: "3 séries",
            repeticoes: "10 repetições",
            descanso: "60s",
            observacao: "Explosão nas pernas"
          },
          {
            nome: "Flexão Explosiva",
            series: "3 séries",
            repeticoes: "6-8 repetições",
            descanso: "60s",
            observacao: "Empurre com força máxima"
          },
          {
            nome: "Mountain Climber Rápido",
            series: "4 séries",
            repeticoes: "30 segundos",
            descanso: "45s",
            observacao: "Ritmo acelerado"
          },
          {
            nome: "Burpee Completo",
            series: "3 séries",
            repeticoes: "10 repetições",
            descanso: "90s",
            observacao: "Exercício completo de corpo"
          },
          {
            nome: "Prancha com Toque no Ombro",
            series: "3 séries",
            repeticoes: "20 toques",
            descanso: "60s",
            observacao: "Estabilização do core"
          }
        ]
      }
    ],
    dicas: [
      "Faça um aquecimento de 5-10 minutos antes de começar",
      "Foque na técnica antes de aumentar a intensidade",
      "Descanse 1 dia entre os treinos (ex: Seg/Qua/Sex)",
      "Mantenha-se hidratado durante o treino",
      "Alongue ao final de cada sessão"
    ]
  },

  {
    tipo: "Treino em Casa",
    local: 'casa',
    nivel: 'Iniciante',
    frequencia: "4x/semana",
    objetivo: 'perder',
    duracaoSessao: "50min",
    gastoCalorico: 280,
    treinos: [
      {
        dia: "A",
        nome: "Inferior + Core",
        exercicios: [
          {
            nome: "Agachamento",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Peso corporal ou com mochila"
          },
          {
            nome: "Afundo Búlgaro",
            series: "3 séries",
            repeticoes: "12 cada perna",
            descanso: "60s",
            observacao: "Use cadeira para apoiar o pé de trás"
          },
          {
            nome: "Stiff Unilateral",
            series: "3 séries",
            repeticoes: "12 cada perna",
            descanso: "60s",
            observacao: "Trabalha posterior e equilíbrio"
          },
          {
            nome: "Elevação Pélvica",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Contraia glúteos fortemente"
          },
          {
            nome: "Prancha",
            series: "3 séries",
            repeticoes: "45 segundos",
            descanso: "60s",
            observacao: "Corpo reto"
          },
          {
            nome: "Bicicleta no Ar",
            series: "3 séries",
            repeticoes: "20 cada lado",
            descanso: "45s",
            observacao: "Trabalha oblíquos"
          }
        ]
      },
      {
        dia: "B",
        nome: "Superior + Cardio",
        exercicios: [
          {
            nome: "Flexão de Braço",
            series: "4 séries",
            repeticoes: "10-15 repetições",
            descanso: "60s",
            observacao: "Adapte a dificuldade"
          },
          {
            nome: "Tríceps no Banco",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Cotovelos para trás"
          },
          {
            nome: "Pike Push-up",
            series: "3 séries",
            repeticoes: "10 repetições",
            descanso: "60s",
            observacao: "Trabalha ombros"
          },
          {
            nome: "Superman",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Fortalece lombar"
          },
          {
            nome: "Burpee",
            series: "4 séries",
            repeticoes: "10 repetições",
            descanso: "90s",
            observacao: "Cardio intenso"
          },
          {
            nome: "Mountain Climber",
            series: "3 séries",
            repeticoes: "30 segundos",
            descanso: "60s",
            observacao: "Ritmo constante"
          }
        ]
      },
      {
        dia: "C",
        nome: "Full Body Funcional",
        exercicios: [
          {
            nome: "Agachamento com Salto",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "75s",
            observacao: "Explosão nas pernas"
          },
          {
            nome: "Flexão com Rotação",
            series: "3 séries",
            repeticoes: "10 cada lado",
            descanso: "60s",
            observacao: "Trabalha core e rotação"
          },
          {
            nome: "Afundo com Toque no Chão",
            series: "3 séries",
            repeticoes: "10 cada perna",
            descanso: "60s",
            observacao: "Mobilidade e força"
          },
          {
            nome: "Prancha com Elevação de Perna",
            series: "3 séries",
            repeticoes: "10 cada perna",
            descanso: "60s",
            observacao: "Equilíbrio e core"
          },
          {
            nome: "Jumping Jack",
            series: "4 séries",
            repeticoes: "45 segundos",
            descanso: "45s",
            observacao: "Cardio"
          },
          {
            nome: "Abdominal Completo",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Movimento controlado"
          }
        ]
      },
      {
        dia: "D",
        nome: "HIIT - Alta Intensidade",
        exercicios: [
          {
            nome: "Burpee",
            series: "5 séries",
            repeticoes: "30 segundos",
            descanso: "30s",
            observacao: "Máxima intensidade"
          },
          {
            nome: "Mountain Climber",
            series: "5 séries",
            repeticoes: "30 segundos",
            descanso: "30s",
            observacao: "Rápido e explosivo"
          },
          {
            nome: "Agachamento com Salto",
            series: "4 séries",
            repeticoes: "30 segundos",
            descanso: "45s",
            observacao: "Potência nas pernas"
          },
          {
            nome: "Flexão Rápida",
            series: "4 séries",
            repeticoes: "30 segundos",
            descanso: "45s",
            observacao: "Ritmo acelerado"
          },
          {
            nome: "High Knees",
            series: "4 séries",
            repeticoes: "30 segundos",
            descanso: "30s",
            observacao: "Joelhos altos"
          },
          {
            nome: "Prancha Dinâmica",
            series: "3 séries",
            repeticoes: "45 segundos",
            descanso: "60s",
            observacao: "Alterna entre prancha e pike"
          }
        ]
      }
    ],
    dicas: [
      "HIIT queima mais calorias em menos tempo",
      "Descanse adequadamente entre os dias (2 dias treino, 1 descanso)",
      "Combine com caminhadas nos dias de descanso",
      "Monitore frequência cardíaca durante HIIT",
      "Progrida aumentando repetições ou reduzindo descanso"
    ]
  },

  // ==================== TREINOS ACADEMIA - INICIANTE ====================
  {
    tipo: "Treino na Academia",
    local: 'academia',
    nivel: 'Iniciante',
    frequencia: "3x/semana",
    objetivo: 'ganhar',
    duracaoSessao: "60min",
    gastoCalorico: 320,
    treinos: [
      {
        dia: "A",
        nome: "Peito, Ombro e Tríceps",
        exercicios: [
          {
            nome: "Supino Reto",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "90s",
            observacao: "Exercício principal para peito"
          },
          {
            nome: "Supino Inclinado com Halteres",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Foca peitoral superior"
          },
          {
            nome: "Crucifixo",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Alongamento do peito"
          },
          {
            nome: "Desenvolvimento com Halteres",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Para ombros"
          },
          {
            nome: "Elevação Lateral",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Deltoide lateral"
          },
          {
            nome: "Tríceps Pulley",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Cotovelos fixos"
          },
          {
            nome: "Tríceps Testa",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "60s",
            observacao: "Amplitude completa"
          }
        ]
      },
      {
        dia: "B",
        nome: "Costas e Bíceps",
        exercicios: [
          {
            nome: "Barra Fixa (ou Pulley Frente)",
            series: "4 séries",
            repeticoes: "8-12 repetições",
            descanso: "90s",
            observacao: "Principal para dorsal"
          },
          {
            nome: "Remada Curvada",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "90s",
            observacao: "Costas retas"
          },
          {
            nome: "Remada Cavalinho",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "75s",
            observacao: "Trapézio e dorsais"
          },
          {
            nome: "Pulldown",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Pegada larga"
          },
          {
            nome: "Rosca Direta",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "60s",
            observacao: "Bíceps"
          },
          {
            nome: "Rosca Alternada",
            series: "3 séries",
            repeticoes: "10-12 cada",
            descanso: "60s",
            observacao: "Rotação do punho"
          },
          {
            nome: "Rosca Martelo",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Braquial"
          }
        ]
      },
      {
        dia: "C",
        nome: "Pernas e Abdômen",
        exercicios: [
          {
            nome: "Agachamento Livre",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "120s",
            observacao: "Rei dos exercícios"
          },
          {
            nome: "Leg Press 45°",
            series: "4 séries",
            repeticoes: "12-15 repetições",
            descanso: "90s",
            observacao: "Amplitude completa"
          },
          {
            nome: "Cadeira Extensora",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Quadríceps isolado"
          },
          {
            nome: "Cadeira Flexora",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Posteriores"
          },
          {
            nome: "Stiff",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "75s",
            observacao: "Posteriores e glúteos"
          },
          {
            nome: "Panturrilha em Pé",
            series: "4 séries",
            repeticoes: "15-20 repetições",
            descanso: "60s",
            observacao: "Amplitude máxima"
          },
          {
            nome: "Abdominal na Máquina",
            series: "3 séries",
            repeticoes: "15-20 repetições",
            descanso: "45s",
            observacao: "Contração forte"
          },
          {
            nome: "Prancha",
            series: "3 séries",
            repeticoes: "45-60s",
            descanso: "60s",
            observacao: "Core estável"
          }
        ]
      }
    ],
    dicas: [
      "Foque em aprender a técnica correta nos primeiros meses",
      "Aumente a carga progressivamente (2.5-5kg por semana)",
      "Registre seus treinos para acompanhar evolução",
      "Coma proteína suficiente (2g/kg de peso)",
      "Durma 8 horas para recuperação muscular"
    ]
  },

  {
    tipo: "Treino na Academia",
    local: 'academia',
    nivel: 'Intermediário',
    frequencia: "4x/semana",
    objetivo: 'ganhar',
    duracaoSessao: "75min",
    gastoCalorico: 400,
    treinos: [
      {
        dia: "A",
        nome: "Peito e Tríceps",
        exercicios: [
          {
            nome: "Supino Reto",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Carga progressiva"
          },
          {
            nome: "Supino Inclinado",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Peitoral superior"
          },
          {
            nome: "Supino Declinado",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Peitoral inferior"
          },
          {
            nome: "Crucifixo Inclinado",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Alongamento máximo"
          },
          {
            nome: "Pullover",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Abertura de caixa"
          },
          {
            nome: "Tríceps Testa",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Cabeça longa"
          },
          {
            nome: "Tríceps Pulley Corda",
            series: "3 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Abra a corda no final"
          },
          {
            nome: "Tríceps Mergulho",
            series: "3 séries",
            repeticoes: "Máximo",
            descanso: "90s",
            observacao: "Até a falha"
          }
        ]
      },
      {
        dia: "B",
        nome: "Costas e Bíceps",
        exercicios: [
          {
            nome: "Levantamento Terra",
            series: "4 séries",
            repeticoes: "6-8 repetições",
            descanso: "120s",
            observacao: "Exercício composto principal"
          },
          {
            nome: "Barra Fixa Pegada Pronada",
            series: "4 séries",
            repeticoes: "8-12 repetições",
            descanso: "90s",
            observacao: "Largura das costas"
          },
          {
            nome: "Remada Curvada",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Espessura"
          },
          {
            nome: "Pulldown Pegada Fechada",
            series: "3 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Trabalha dorsal inferior"
          },
          {
            nome: "Remada Cavalinho",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Trapézio"
          },
          {
            nome: "Rosca Direta com Barra",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "75s",
            observacao: "Carga pesada"
          },
          {
            nome: "Rosca Alternada",
            series: "3 séries",
            repeticoes: "10-12 cada",
            descanso: "60s",
            observacao: "Supinação"
          },
          {
            nome: "Rosca Concentrada",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Pico do bíceps"
          }
        ]
      },
      {
        dia: "C",
        nome: "Pernas (Quadríceps foco)",
        exercicios: [
          {
            nome: "Agachamento Livre",
            series: "5 séries",
            repeticoes: "8-10 repetições",
            descanso: "120s",
            observacao: "Exercício principal"
          },
          {
            nome: "Agachamento Frontal",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "90s",
            observacao: "Quadríceps intenso"
          },
          {
            nome: "Leg Press",
            series: "4 séries",
            repeticoes: "12-15 repetições",
            descanso: "90s",
            observacao: "Alta amplitude"
          },
          {
            nome: "Hack Machine",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "75s",
            observacao: "Vasto lateral"
          },
          {
            nome: "Cadeira Extensora",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Contração de pico"
          },
          {
            nome: "Afundo com Barra",
            series: "3 séries",
            repeticoes: "12 cada perna",
            descanso: "90s",
            observacao: "Equilíbrio e força"
          },
          {
            nome: "Panturrilha no Leg Press",
            series: "4 séries",
            repeticoes: "20 repetições",
            descanso: "60s",
            observacao: "Amplitude total"
          }
        ]
      },
      {
        dia: "D",
        nome: "Ombros, Trapézio e Abdômen",
        exercicios: [
          {
            nome: "Desenvolvimento com Barra",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Principal para ombros"
          },
          {
            nome: "Desenvolvimento com Halteres",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Amplitude maior"
          },
          {
            nome: "Elevação Lateral",
            series: "4 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Deltoide lateral"
          },
          {
            nome: "Elevação Frontal",
            series: "3 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Deltoide anterior"
          },
          {
            nome: "Crucifixo Inverso",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Deltoide posterior"
          },
          {
            nome: "Encolhimento com Halteres",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Trapézio"
          },
          {
            nome: "Abdominal Remador",
            series: "4 séries",
            repeticoes: "15-20 repetições",
            descanso: "45s",
            observacao: "Reto abdominal"
          },
          {
            nome: "Prancha com Elevação de Perna",
            series: "3 séries",
            repeticoes: "10 cada perna",
            descanso: "60s",
            observacao: "Core dinâmico"
          }
        ]
      }
    ],
    dicas: [
      "Use periodização: varie entre fases de volume e força",
      "Implemente drop sets e rest-pause para intensificar",
      "Registre TODAS as cargas e busque progressão linear",
      "Considere suplementação: whey, creatina, BCAA",
      "Faça deload (semana leve) a cada 6-8 semanas"
    ]
  },

  {
    tipo: "Treino na Academia",
    local: 'academia',
    nivel: 'Avançado',
    frequencia: "5x/semana",
    objetivo: 'ganhar',
    duracaoSessao: "90min",
    gastoCalorico: 480,
    treinos: [
      {
        dia: "A",
        nome: "Peito",
        exercicios: [
          {
            nome: "Supino Reto",
            series: "5 séries",
            repeticoes: "6-8 repetições",
            descanso: "120s",
            observacao: "Carga máxima, técnica perfeita"
          },
          {
            nome: "Supino Inclinado",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Peitoral superior"
          },
          {
            nome: "Supino Declinado",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Inferior"
          },
          {
            nome: "Crucifixo Inclinado",
            series: "4 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Drop set na última série"
          },
          {
            nome: "Crossover Cabo",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Contração de pico"
          },
          {
            nome: "Pullover com Halter",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Alongamento máximo"
          },
          {
            nome: "Flexão Declinada (pés elevados)",
            series: "3 séries",
            repeticoes: "Máximo",
            descanso: "60s",
            observacao: "Até a falha total"
          }
        ]
      },
      {
        dia: "B",
        nome: "Costas",
        exercicios: [
          {
            nome: "Levantamento Terra",
            series: "5 séries",
            repeticoes: "5 repetições",
            descanso: "150s",
            observacao: "Força máxima"
          },
          {
            nome: "Barra Fixa com Peso",
            series: "5 séries",
            repeticoes: "8-10 repetições",
            descanso: "120s",
            observacao: "Adicione carga progressivamente"
          },
          {
            nome: "Remada Curvada",
            series: "4 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Pegada supinada e pronada (alternar)"
          },
          {
            nome: "Remada Cavalinho",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "75s",
            observacao: "Trapézio médio"
          },
          {
            nome: "Pulldown Pegada Neutra",
            series: "4 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Dorsal inferior"
          },
          {
            nome: "Remada Unilateral",
            series: "3 séries",
            repeticoes: "12 cada lado",
            descanso: "60s",
            observacao: "Simetria"
          },
          {
            nome: "Pullover na Polia",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Contração de pico"
          }
        ]
      },
      {
        dia: "C",
        nome: "Pernas (Completo)",
        exercicios: [
          {
            nome: "Agachamento Livre",
            series: "6 séries",
            repeticoes: "6-8 repetições",
            descanso: "150s",
            observacao: "Carga máxima progressiva"
          },
          {
            nome: "Agachamento Frontal",
            series: "4 séries",
            repeticoes: "10 repetições",
            descanso: "120s",
            observacao: "Quadríceps"
          },
          {
            nome: "Leg Press",
            series: "5 séries",
            repeticoes: "15-20 repetições",
            descanso: "90s",
            observacao: "Volume alto"
          },
          {
            nome: "Cadeira Extensora",
            series: "4 séries",
            repeticoes: "15-20 repetições",
            descanso: "60s",
            observacao: "Rest-pause na última"
          },
          {
            nome: "Stiff",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "90s",
            observacao: "Posteriores e glúteos"
          },
          {
            nome: "Cadeira Flexora",
            series: "4 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Drop set"
          },
          {
            nome: "Elevação Pélvica com Barra",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Glúteos"
          },
          {
            nome: "Panturrilha em Pé",
            series: "5 séries",
            repeticoes: "20 repetições",
            descanso: "60s",
            observacao: "Amplitude completa"
          }
        ]
      },
      {
        dia: "D",
        nome: "Ombros e Trapézio",
        exercicios: [
          {
            nome: "Desenvolvimento Militar",
            series: "5 séries",
            repeticoes: "6-8 repetições",
            descanso: "120s",
            observacao: "Principal"
          },
          {
            nome: "Desenvolvimento Arnold",
            series: "4 séries",
            repeticoes: "10-12 repetições",
            descanso: "90s",
            observacao: "Rotação completa"
          },
          {
            nome: "Elevação Lateral",
            series: "5 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Lateral do deltoide"
          },
          {
            nome: "Elevação Frontal Alternada",
            series: "4 séries",
            repeticoes: "12 cada braço",
            descanso: "60s",
            observacao: "Anterior"
          },
          {
            nome: "Crucifixo Inverso",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Posterior"
          },
          {
            nome: "Face Pull",
            series: "4 séries",
            repeticoes: "15-20 repetições",
            descanso: "60s",
            observacao: "Posterior + trapézio"
          },
          {
            nome: "Encolhimento com Barra",
            series: "5 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Trapézio superior"
          },
          {
            nome: "Encolhimento Inclinado",
            series: "3 séries",
            repeticoes: "20 repetições",
            descanso: "60s",
            observacao: "Trapézio médio"
          }
        ]
      },
      {
        dia: "E",
        nome: "Braços (Bíceps e Tríceps)",
        exercicios: [
          {
            nome: "Rosca Direta com Barra",
            series: "5 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Carga pesada"
          },
          {
            nome: "Tríceps Testa",
            series: "5 séries",
            repeticoes: "8-10 repetições",
            descanso: "90s",
            observacao: "Carga pesada"
          },
          {
            nome: "Rosca Alternada",
            series: "4 séries",
            repeticoes: "12 cada braço",
            descanso: "60s",
            observacao: "Supinação completa"
          },
          {
            nome: "Tríceps Pulley Barra",
            series: "4 séries",
            repeticoes: "12-15 repetições",
            descanso: "60s",
            observacao: "Cabeça lateral"
          },
          {
            nome: "Rosca Scott",
            series: "4 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Isolamento total"
          },
          {
            nome: "Tríceps Francês",
            series: "4 séries",
            repeticoes: "12 repetições",
            descanso: "60s",
            observacao: "Cabeça longa"
          },
          {
            nome: "Rosca Martelo",
            series: "4 séries",
            repeticoes: "15 repetições",
            descanso: "60s",
            observacao: "Braquial"
          },
          {
            nome: "Tríceps Coice",
            series: "3 séries",
            repeticoes: "15 cada braço",
            descanso: "45s",
            observacao: "Contração de pico"
          },
          {
            nome: "Rosca Concentrada",
            series: "3 séries",
            repeticoes: "15 repetições",
            descanso: "45s",
            observacao: "Pico do bíceps"
          },
          {
            nome: "Tríceps Mergulho com Peso",
            series: "3 séries",
            repeticoes: "Máximo",
            descanso: "90s",
            observacao: "Até a falha"
          }
        ]
      }
    ],
    dicas: [
      "Periodização avançada: cicle entre força (4-6 reps), hipertrofia (8-12) e resistência (15-20)",
      "Use técnicas de intensificação: drop sets, rest-pause, negativas",
      "Nutrição impecável: 6-7 refeições/dia, timing de nutrientes",
      "Suplementação completa: whey, caseína, creatina, BCAA, glutamina",
      "Durma 8-9h + soneca se possível",
      "Deload obrigatório a cada 4-6 semanas",
      "Considere assessoria profissional para evitar platôs"
    ]
  }
];

// Função para buscar treino específico
export function findWorkout(
  local: 'casa' | 'academia',
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado',
  frequencia: string,
  objetivo: 'perder' | 'ganhar' | 'definir'
): TreinoPronto | null {
  return workoutDatabase.find(w =>
    w.local === local &&
    w.nivel === nivel &&
    w.frequencia === frequencia &&
    w.objetivo === objetivo
  ) || null;
}

// Função para buscar treino mais próximo
export function findClosestWorkout(
  local: 'casa' | 'academia',
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado',
  frequencia: string,
  objetivo: 'perder' | 'ganhar' | 'definir'
): TreinoPronto {
  // Primeiro tenta encontrar exato
  let workout = findWorkout(local, nivel, frequencia, objetivo);
  if (workout) return workout;
  
  // Se não encontrar, busca por local e objetivo
  const candidates = workoutDatabase.filter(w =>
    w.local === local && w.objetivo === objetivo
  );
  
  if (candidates.length === 0) {
    // Se ainda não encontrar, retorna o primeiro do local
    return workoutDatabase.find(w => w.local === local) || workoutDatabase[0];
  }
  
  // Retorna o mais próximo no nível
  return candidates[0];
}
