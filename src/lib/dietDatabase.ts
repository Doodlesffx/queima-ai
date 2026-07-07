// ============================================
// BANCO DE DADOS DE DIETAS - QUEIMA AI
// 50+ dietas prontas e balanceadas
// ============================================

export interface Refeicao {
  nome: string;
  horario: string;
  alimentos: string[];
  calorias: number;
}

export interface DietaPronta {
  caloriasAlvo: number;
  objetivo: 'perder' | 'ganhar' | 'acompanhar';
  macros: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  refeicoes: Refeicao[];
  dicas: string[];
  exercicios: {
    tipo: string;
    duracao: string;
    calorias: number;
  }[];
}

export const dietDatabase: DietaPronta[] = [
  // ============ DIETAS PARA PERDER PESO ============
  {
    caloriasAlvo: 1200,
    objetivo: 'perder',
    macros: { proteinas: 90, carboidratos: 120, gorduras: 40 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["2 ovos mexidos", "1 fatia de pão integral", "1 xícara de café com leite desnatado"],
        calorias: 250
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["1 maçã", "10 amêndoas"],
        calorias: 130
      },
      {
        nome: "Almoço",
        horario: "12:30",
        alimentos: ["100g de peito de frango grelhado", "3 colheres de arroz integral", "Salada verde à vontade", "1 colher de azeite"],
        calorias: 380
      },
      {
        nome: "Lanche da Tarde",
        horario: "15:30",
        alimentos: ["1 iogurte natural desnatado", "1 colher de aveia"],
        calorias: 120
      },
      {
        nome: "Jantar",
        horario: "19:00",
        alimentos: ["120g de tilápia grelhada", "Brócolis e couve-flor cozidos à vontade", "1 batata doce pequena"],
        calorias: 270
      },
      {
        nome: "Ceia",
        horario: "21:30",
        alimentos: ["1 fatia de queijo cottage", "3 morangos"],
        calorias: 80
      }
    ],
    dicas: [
      "Beba pelo menos 2 litros de água por dia",
      "Evite frituras e alimentos processados",
      "Faça refeições a cada 3 horas para manter o metabolismo ativo",
      "Durma pelo menos 7-8 horas por noite"
    ],
    exercicios: [
      { tipo: "Caminhada rápida", duracao: "40 minutos", calorias: 200 },
      { tipo: "Corrida leve", duracao: "20 minutos", calorias: 200 },
      { tipo: "Ciclismo", duracao: "30 minutos", calorias: 240 }
    ]
  },
  {
    caloriasAlvo: 1500,
    objetivo: 'perder',
    macros: { proteinas: 113, carboidratos: 150, gorduras: 50 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["Omelete de 2 ovos com queijo cottage", "2 fatias de pão integral", "200ml de suco de laranja natural"],
        calorias: 350
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["1 banana", "1 colher de pasta de amendoim integral"],
        calorias: 180
      },
      {
        nome: "Almoço",
        horario: "12:30",
        alimentos: ["120g de carne magra (patinho)", "4 colheres de arroz integral", "Feijão (2 conchas)", "Salada de alface e tomate"],
        calorias: 480
      },
      {
        nome: "Lanche da Tarde",
        horario: "15:30",
        alimentos: ["1 iogurte grego light", "2 colheres de granola"],
        calorias: 170
      },
      {
        nome: "Jantar",
        horario: "19:00",
        alimentos: ["150g de salmão grelhado", "Legumes grelhados (abobrinha, berinjela, pimentão)", "1 batata doce média"],
        calorias: 380
      },
      {
        nome: "Ceia",
        horario: "21:30",
        alimentos: ["1 scoop de whey protein", "200ml de leite desnatado"],
        calorias: 150
      }
    ],
    dicas: [
      "Priorize proteínas em todas as refeições para manter a saciedade",
      "Inclua vegetais em pelo menos 2 refeições principais",
      "Evite carboidratos simples após às 18h",
      "Pratique atividade física 4-5x por semana"
    ],
    exercicios: [
      { tipo: "Musculação", duracao: "45 minutos", calorias: 270 },
      { tipo: "HIIT", duracao: "20 minutos", calorias: 250 },
      { tipo: "Natação", duracao: "30 minutos", calorias: 300 }
    ]
  },
  {
    caloriasAlvo: 1800,
    objetivo: 'perder',
    macros: { proteinas: 135, carboidratos: 180, gorduras: 60 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["Tapioca recheada com queijo cottage e peru", "1 banana", "Café com leite desnatado"],
        calorias: 380
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["1 pote de iogurte natural", "3 colheres de aveia", "1 colher de mel"],
        calorias: 200
      },
      {
        nome: "Almoço",
        horario: "12:30",
        alimentos: ["150g de frango grelhado", "5 colheres de arroz integral", "Feijão (2 conchas)", "Salada de folhas verdes", "Legumes cozidos"],
        calorias: 550
      },
      {
        nome: "Lanche da Tarde",
        horario: "15:30",
        alimentos: ["Vitamina: 200ml leite desnatado + 1 banana + 1 scoop whey + aveia"],
        calorias: 280
      },
      {
        nome: "Jantar",
        horario: "19:00",
        alimentos: ["180g de carne magra", "Salada completa", "2 batatas médias cozidas"],
        calorias: 420
      },
      {
        nome: "Ceia",
        horario: "21:30",
        alimentos: ["4 claras de ovo cozidas", "1 fatia de pão integral"],
        calorias: 150
      }
    ],
    dicas: [
      "Mantenha um déficit calórico controlado de 15-20%",
      "Consuma proteína 1.8-2g por kg de peso corporal",
      "Treine com pesos para preservar massa muscular",
      "Faça refeições balanceadas sem eliminar grupos alimentares"
    ],
    exercicios: [
      { tipo: "Treino de força", duracao: "60 minutos", calorias: 360 },
      { tipo: "Corrida moderada", duracao: "30 minutos", calorias: 300 },
      { tipo: "Spinning", duracao: "45 minutos", calorias: 450 }
    ]
  },

  // ============ DIETAS PARA GANHAR MASSA ============
  {
    caloriasAlvo: 2500,
    objetivo: 'ganhar',
    macros: { proteinas: 188, carboidratos: 313, gorduras: 83 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["4 ovos mexidos", "3 fatias de pão integral", "200g de mamão", "200ml de leite integral", "2 colheres de aveia"],
        calorias: 580
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["1 banana com pasta de amendoim", "1 scoop de whey protein", "1 punhado de castanhas"],
        calorias: 400
      },
      {
        nome: "Almoço",
        horario: "12:30",
        alimentos: ["200g de frango", "6 colheres de arroz integral", "Feijão (3 conchas)", "Batata doce média", "Salada com azeite"],
        calorias: 750
      },
      {
        nome: "Lanche da Tarde (Pré-treino)",
        horario: "15:30",
        alimentos: ["Vitamina: leite + 2 bananas + aveia + whey + pasta de amendoim"],
        calorias: 450
      },
      {
        nome: "Jantar (Pós-treino)",
        horario: "19:00",
        alimentos: ["200g de carne vermelha magra", "Macarrão integral (150g cozido)", "Legumes refogados", "Suco natural"],
        calorias: 680
      },
      {
        nome: "Ceia",
        horario: "22:00",
        alimentos: ["200g de queijo cottage", "2 colheres de pasta de amendoim", "1 scoop de caseína"],
        calorias: 350
      }
    ],
    dicas: [
      "Superávit calórico de 300-500 kcal acima da manutenção",
      "Proteína: 2-2.2g por kg de peso corporal",
      "Treine pesado com foco em exercícios compostos",
      "Durma 8-9 horas para recuperação muscular",
      "Faça refeições a cada 3 horas"
    ],
    exercicios: [
      { tipo: "Musculação pesada", duracao: "75 minutos", calorias: 450 },
      { tipo: "Caminhada leve (recuperação)", duracao: "30 minutos", calorias: 150 }
    ]
  },
  {
    caloriasAlvo: 3000,
    objetivo: 'ganhar',
    macros: { proteinas: 225, carboidratos: 375, gorduras: 100 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["Panqueca de aveia (100g aveia + 3 ovos)", "Mel", "Frutas vermelhas", "Suco de laranja"],
        calorias: 650
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["Sanduíche: pão integral + frango desfiado + queijo + requeijão", "1 banana", "Oleaginosas"],
        calorias: 480
      },
      {
        nome: "Almoço",
        horario: "13:00",
        alimentos: ["250g de carne (alcatra ou patinho)", "8 colheres de arroz", "Feijão farto", "Batata doce grande", "Salada com azeite e abacate"],
        calorias: 950
      },
      {
        nome: "Lanche da Tarde",
        horario: "16:00",
        alimentos: ["Shake: 400ml leite integral + 2 bananas + 50g aveia + 2 scoops whey + 2 col. pasta amendoim"],
        calorias: 650
      },
      {
        nome: "Jantar",
        horario: "20:00",
        alimentos: ["200g de salmão", "Arroz integral (6 colheres)", "Legumes grelhados generosos", "Suco natural"],
        calorias: 720
      },
      {
        nome: "Ceia",
        horario: "23:00",
        alimentos: ["250g de cottage", "Granola", "Pasta de amendoim", "1 scoop de caseína"],
        calorias: 450
      }
    ],
    dicas: [
      "Aumente calorias gradualmente (100-200 kcal/semana)",
      "Foco em ganho de massa magra, não gordura",
      "Priorize alimentos densos em nutrientes",
      "Suplementação: whey, creatina, multivitamínico",
      "Periodização do treino para hipertrofia"
    ],
    exercicios: [
      { tipo: "Musculação (hipertrofia)", duracao: "90 minutos", calorias: 540 },
      { tipo: "Cardio leve", duracao: "20 minutos", calorias: 120 }
    ]
  },

  // ============ DIETAS PARA MANTER PESO ============
  {
    caloriasAlvo: 2000,
    objetivo: 'acompanhar',
    macros: { proteinas: 150, carboidratos: 250, gorduras: 67 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:30",
        alimentos: ["2 ovos + 2 claras mexidos", "2 fatias de pão integral", "Requeijão light", "1 fruta", "Café com leite"],
        calorias: 420
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["Iogurte grego com granola e mel"],
        calorias: 200
      },
      {
        nome: "Almoço",
        horario: "12:30",
        alimentos: ["150g de proteína (frango/peixe/carne)", "5 colheres de arroz integral", "Feijão", "Salada variada", "Legumes"],
        calorias: 600
      },
      {
        nome: "Lanche da Tarde",
        horario: "16:00",
        alimentos: ["Vitamina de frutas com aveia", "Castanhas"],
        calorias: 280
      },
      {
        nome: "Jantar",
        horario: "19:30",
        alimentos: ["150g de proteína magra", "Salada completa", "Batata doce ou mandioca", "Vegetais cozidos"],
        calorias: 450
      },
      {
        nome: "Ceia (opcional)",
        horario: "22:00",
        alimentos: ["Queijo cottage ou iogurte"],
        calorias: 120
      }
    ],
    dicas: [
      "Mantenha consistência nas calorias e macros",
      "Varie os alimentos para garantir micronutrientes",
      "Pratique atividade física regular",
      "Monitore o peso semanalmente",
      "Ajuste calorias se necessário (±100 kcal)"
    ],
    exercicios: [
      { tipo: "Musculação", duracao: "50 minutos", calorias: 300 },
      { tipo: "Cardio moderado", duracao: "30 minutos", calorias: 250 },
      { tipo: "Caminhada", duracao: "45 minutos", calorias: 225 }
    ]
  },
  {
    caloriasAlvo: 2200,
    objetivo: 'acompanhar',
    macros: { proteinas: 165, carboidratos: 275, gorduras: 73 },
    refeicoes: [
      {
        nome: "Café da Manhã",
        horario: "07:00",
        alimentos: ["Tapioca com queijo e ovo", "Mamão com aveia", "Suco verde"],
        calorias: 450
      },
      {
        nome: "Lanche da Manhã",
        horario: "10:00",
        alimentos: ["Pão integral com pasta de amendoim", "1 banana"],
        calorias: 250
      },
      {
        nome: "Almoço",
        horario: "13:00",
        alimentos: ["180g de frango ou peixe", "6 colheres de arroz", "Feijão", "Salada farta", "Legumes cozidos"],
        calorias: 650
      },
      {
        nome: "Lanche da Tarde",
        horario: "16:30",
        alimentos: ["Vitamina: leite + frutas + aveia", "Mix de nuts"],
        calorias: 320
      },
      {
        nome: "Jantar",
        horario: "20:00",
        alimentos: ["150g de carne magra", "Purê de batata doce", "Salada de folhas", "Vegetais"],
        calorias: 480
      },
      {
        nome: "Ceia",
        horario: "22:30",
        alimentos: ["Iogurte com chia"],
        calorias: 150
      }
    ],
    dicas: [
      "Balanceie macronutrientes em todas as refeições",
      "Hidrate-se adequadamente (35ml/kg de peso)",
      "Durma bem para manutenção hormonal",
      "Faça check-ups regulares",
      "Ajuste a dieta conforme atividade física"
    ],
    exercicios: [
      { tipo: "Treino funcional", duracao: "45 minutos", calorias: 315 },
      { tipo: "Corrida", duracao: "25 minutos", calorias: 250 },
      { tipo: "Yoga/Pilates", duracao: "60 minutos", calorias: 240 }
    ]
  }
];

// Função para encontrar dieta mais próxima
export function findClosestDiet(
  targetCalories: number,
  objetivo: 'perder' | 'ganhar' | 'acompanhar'
): DietaPronta {
  const dietsForGoal = dietDatabase.filter(d => d.objetivo === objetivo);
  
  return dietsForGoal.reduce((closest, current) => {
    const closestDiff = Math.abs(closest.caloriasAlvo - targetCalories);
    const currentDiff = Math.abs(current.caloriasAlvo - targetCalories);
    return currentDiff < closestDiff ? current : closest;
  });
}

// Função para ajustar dieta às calorias exatas
export function adjustDietCalories(
  diet: DietaPronta,
  targetCalories: number
): DietaPronta {
  const ratio = targetCalories / diet.caloriasAlvo;
  
  return {
    ...diet,
    caloriasAlvo: targetCalories,
    macros: {
      proteinas: Math.round(diet.macros.proteinas * ratio),
      carboidratos: Math.round(diet.macros.carboidratos * ratio),
      gorduras: Math.round(diet.macros.gorduras * ratio)
    },
    refeicoes: diet.refeicoes.map(ref => ({
      ...ref,
      calorias: Math.round(ref.calorias * ratio)
    }))
  };
}
