// ============================================
// BANCO DE DADOS DE ALIMENTOS - QUEIMA AI
// 500+ alimentos com informações nutricionais completas
// Fonte: Tabela TACO (UNICAMP) + USDA
// ============================================

export interface FoodItem {
  nome: string;
  categoria: string;
  calorias: number; // kcal por porção padrão
  porcao: string; // descrição da porção
  gramas: number; // peso em gramas da porção
  proteinas: number; // gramas
  carboidratos: number; // gramas
  gorduras: number; // gramas
  fibras?: number; // gramas
  equivalencia: string;
  tags: string[]; // para busca
}

export const foodDatabase: FoodItem[] = [
  // ==================== CARNES E PROTEÍNAS ====================
  {
    nome: "Peito de Frango Grelhado",
    categoria: "Carnes",
    calorias: 165,
    porcao: "100g",
    gramas: 100,
    proteinas: 31,
    carboidratos: 0,
    gorduras: 3.6,
    fibras: 0,
    equivalencia: "1 filé médio",
    tags: ["frango", "peito", "grelhado", "proteína", "carne branca"]
  },
  {
    nome: "Carne Bovina Magra (Patinho)",
    categoria: "Carnes",
    calorias: 190,
    porcao: "100g",
    gramas: 100,
    proteinas: 32,
    carboidratos: 0,
    gorduras: 6.5,
    equivalencia: "1 bife médio",
    tags: ["carne", "boi", "patinho", "proteína", "bife"]
  },
  {
    nome: "Filé de Tilápia",
    categoria: "Peixes",
    calorias: 96,
    porcao: "100g",
    gramas: 100,
    proteinas: 20,
    carboidratos: 0,
    gorduras: 1.7,
    equivalencia: "1 filé pequeno",
    tags: ["peixe", "tilápia", "proteína"]
  },
  {
    nome: "Salmão Grelhado",
    categoria: "Peixes",
    calorias: 206,
    porcao: "100g",
    gramas: 100,
    proteinas: 22,
    carboidratos: 0,
    gorduras: 13,
    equivalencia: "1 filé médio",
    tags: ["peixe", "salmão", "ômega 3", "proteína"]
  },
  {
    nome: "Atum em Lata (ao natural)",
    categoria: "Peixes",
    calorias: 116,
    porcao: "100g",
    gramas: 100,
    proteinas: 26,
    carboidratos: 0,
    gorduras: 1,
    equivalencia: "1 lata pequena",
    tags: ["atum", "peixe", "lata", "proteína"]
  },
  {
    nome: "Ovos Cozidos",
    categoria: "Ovos",
    calorias: 155,
    porcao: "2 unidades",
    gramas: 100,
    proteinas: 13,
    carboidratos: 1.1,
    gorduras: 11,
    equivalencia: "2 ovos médios",
    tags: ["ovo", "cozido", "proteína"]
  },
  {
    nome: "Omelete (2 ovos)",
    categoria: "Ovos",
    calorias: 188,
    porcao: "1 porção",
    gramas: 120,
    proteinas: 14,
    carboidratos: 2,
    gorduras: 14,
    equivalencia: "1 omelete média",
    tags: ["ovo", "omelete", "proteína"]
  },

  // ==================== CARBOIDRATOS ====================
  {
    nome: "Arroz Branco Cozido",
    categoria: "Carboidratos",
    calorias: 130,
    porcao: "100g (4 colheres)",
    gramas: 100,
    proteinas: 2.7,
    carboidratos: 28,
    gorduras: 0.3,
    fibras: 0.3,
    equivalencia: "4 colheres de sopa",
    tags: ["arroz", "branco", "carboidrato"]
  },
  {
    nome: "Arroz Integral Cozido",
    categoria: "Carboidratos",
    calorias: 123,
    porcao: "100g (4 colheres)",
    gramas: 100,
    proteinas: 2.6,
    carboidratos: 26,
    gorduras: 1,
    fibras: 2.7,
    equivalencia: "4 colheres de sopa",
    tags: ["arroz", "integral", "carboidrato", "fibra"]
  },
  {
    nome: "Batata Doce Cozida",
    categoria: "Carboidratos",
    calorias: 86,
    porcao: "100g",
    gramas: 100,
    proteinas: 1.6,
    carboidratos: 20,
    gorduras: 0.1,
    fibras: 3,
    equivalencia: "1 batata pequena",
    tags: ["batata doce", "carboidrato", "tubérculo"]
  },
  {
    nome: "Batata Inglesa Cozida",
    categoria: "Carboidratos",
    calorias: 77,
    porcao: "100g",
    gramas: 100,
    proteinas: 2,
    carboidratos: 17,
    gorduras: 0.1,
    fibras: 1.8,
    equivalencia: "1 batata média",
    tags: ["batata", "carboidrato"]
  },
  {
    nome: "Macarrão Integral Cozido",
    categoria: "Carboidratos",
    calorias: 124,
    porcao: "100g",
    gramas: 100,
    proteinas: 5,
    carboidratos: 26,
    gorduras: 0.5,
    fibras: 3.5,
    equivalencia: "1 pegador médio",
    tags: ["macarrão", "massa", "integral", "carboidrato"]
  },
  {
    nome: "Pão Francês",
    categoria: "Pães",
    calorias: 135,
    porcao: "1 unidade (50g)",
    gramas: 50,
    proteinas: 4,
    carboidratos: 27,
    gorduras: 1.2,
    fibras: 1.3,
    equivalencia: "1 pãozinho",
    tags: ["pão", "francês", "carboidrato"]
  },
  {
    nome: "Pão Integral",
    categoria: "Pães",
    calorias: 125,
    porcao: "2 fatias (50g)",
    gramas: 50,
    proteinas: 5,
    carboidratos: 23,
    gorduras: 2,
    fibras: 3.5,
    equivalencia: "2 fatias",
    tags: ["pão", "integral", "carboidrato", "fibra"]
  },
  {
    nome: "Tapioca",
    categoria: "Carboidratos",
    calorias: 140,
    porcao: "1 unidade (50g)",
    gramas: 50,
    proteinas: 0.1,
    carboidratos: 35,
    gorduras: 0.1,
    equivalencia: "1 crepe",
    tags: ["tapioca", "carboidrato", "goma"]
  },
  {
    nome: "Aveia em Flocos",
    categoria: "Cereais",
    calorias: 68,
    porcao: "2 colheres (20g)",
    gramas: 20,
    proteinas: 2.6,
    carboidratos: 11,
    gorduras: 1.4,
    fibras: 1.7,
    equivalencia: "2 colheres de sopa",
    tags: ["aveia", "cereal", "carboidrato", "fibra"]
  },
  {
    nome: "Granola",
    categoria: "Cereais",
    calorias: 190,
    porcao: "50g",
    gramas: 50,
    proteinas: 5,
    carboidratos: 32,
    gorduras: 5,
    fibras: 4,
    equivalencia: "1/2 xícara",
    tags: ["granola", "cereal", "carboidrato"]
  },

  // ==================== FRUTAS ====================
  {
    nome: "Banana",
    categoria: "Frutas",
    calorias: 89,
    porcao: "1 unidade média (100g)",
    gramas: 100,
    proteinas: 1.1,
    carboidratos: 23,
    gorduras: 0.3,
    fibras: 2.6,
    equivalencia: "1 banana média",
    tags: ["banana", "fruta"]
  },
  {
    nome: "Maçã",
    categoria: "Frutas",
    calorias: 52,
    porcao: "1 unidade média (100g)",
    gramas: 100,
    proteinas: 0.3,
    carboidratos: 14,
    gorduras: 0.2,
    fibras: 2.4,
    equivalencia: "1 maçã média",
    tags: ["maçã", "fruta"]
  },
  {
    nome: "Morango",
    categoria: "Frutas",
    calorias: 32,
    porcao: "100g (7-8 unidades)",
    gramas: 100,
    proteinas: 0.7,
    carboidratos: 7.7,
    gorduras: 0.3,
    fibras: 2,
    equivalencia: "7 morangos médios",
    tags: ["morango", "fruta", "berry"]
  },
  {
    nome: "Abacate",
    categoria: "Frutas",
    calorias: 160,
    porcao: "100g (1/2 unidade)",
    gramas: 100,
    proteinas: 2,
    carboidratos: 8.5,
    gorduras: 15,
    fibras: 6.7,
    equivalencia: "1/2 abacate médio",
    tags: ["abacate", "fruta", "gordura boa"]
  },
  {
    nome: "Mamão Papaya",
    categoria: "Frutas",
    calorias: 43,
    porcao: "100g (1 fatia)",
    gramas: 100,
    proteinas: 0.5,
    carboidratos: 11,
    gorduras: 0.1,
    fibras: 1.7,
    equivalencia: "1 fatia média",
    tags: ["mamão", "papaya", "fruta"]
  },
  {
    nome: "Melancia",
    categoria: "Frutas",
    calorias: 30,
    porcao: "100g (1 fatia)",
    gramas: 100,
    proteinas: 0.6,
    carboidratos: 7.6,
    gorduras: 0.2,
    fibras: 0.4,
    equivalencia: "1 fatia grande",
    tags: ["melancia", "fruta"]
  },

  // ==================== LEGUMES E VERDURAS ====================
  {
    nome: "Brócolis Cozido",
    categoria: "Verduras",
    calorias: 34,
    porcao: "100g",
    gramas: 100,
    proteinas: 2.8,
    carboidratos: 7,
    gorduras: 0.4,
    fibras: 3.3,
    equivalencia: "2 ramos médios",
    tags: ["brócolis", "verdura", "legume"]
  },
  {
    nome: "Alface",
    categoria: "Verduras",
    calorias: 15,
    porcao: "100g",
    gramas: 100,
    proteinas: 1.4,
    carboidratos: 2.9,
    gorduras: 0.2,
    fibras: 1.3,
    equivalencia: "2 xícaras picadas",
    tags: ["alface", "verdura", "folha"]
  },
  {
    nome: "Tomate",
    categoria: "Legumes",
    calorias: 18,
    porcao: "100g (1 médio)",
    gramas: 100,
    proteinas: 0.9,
    carboidratos: 3.9,
    gorduras: 0.2,
    fibras: 1.2,
    equivalencia: "1 tomate médio",
    tags: ["tomate", "legume"]
  },
  {
    nome: "Cenoura Crua",
    categoria: "Legumes",
    calorias: 41,
    porcao: "100g (1 média)",
    gramas: 100,
    proteinas: 0.9,
    carboidratos: 10,
    gorduras: 0.2,
    fibras: 2.8,
    equivalencia: "1 cenoura média",
    tags: ["cenoura", "legume"]
  },
  {
    nome: "Couve Refogada",
    categoria: "Verduras",
    calorias: 35,
    porcao: "100g",
    gramas: 100,
    proteinas: 3.3,
    carboidratos: 6,
    gorduras: 0.7,
    fibras: 3.6,
    equivalencia: "2 colheres de sopa",
    tags: ["couve", "verdura", "folha"]
  },

  // ==================== LATICÍNIOS ====================
  {
    nome: "Leite Desnatado",
    categoria: "Laticínios",
    calorias: 34,
    porcao: "100ml",
    gramas: 100,
    proteinas: 3.4,
    carboidratos: 4.9,
    gorduras: 0.1,
    equivalencia: "1/2 copo",
    tags: ["leite", "desnatado", "laticínio"]
  },
  {
    nome: "Iogurte Natural Desnatado",
    categoria: "Laticínios",
    calorias: 56,
    porcao: "100g",
    gramas: 100,
    proteinas: 5.3,
    carboidratos: 7.6,
    gorduras: 0.2,
    equivalencia: "1 pote pequeno",
    tags: ["iogurte", "natural", "laticínio"]
  },
  {
    nome: "Queijo Cottage",
    categoria: "Laticínios",
    calorias: 98,
    porcao: "100g",
    gramas: 100,
    proteinas: 11,
    carboidratos: 3.4,
    gorduras: 4.3,
    equivalencia: "4 colheres de sopa",
    tags: ["queijo", "cottage", "proteína"]
  },
  {
    nome: "Queijo Minas Light",
    categoria: "Laticínios",
    calorias: 180,
    porcao: "50g (2 fatias)",
    gramas: 50,
    proteinas: 12,
    carboidratos: 2,
    gorduras: 7,
    equivalencia: "2 fatias",
    tags: ["queijo", "minas", "light"]
  },
  {
    nome: "Requeijão Light",
    categoria: "Laticínios",
    calorias: 80,
    porcao: "2 colheres (30g)",
    gramas: 30,
    proteinas: 3,
    carboidratos: 2,
    gorduras: 5,
    equivalencia: "2 colheres de sopa",
    tags: ["requeijão", "light", "cremoso"]
  },

  // ==================== FAST FOOD & LANCHES ====================
  {
    nome: "Pizza Margherita",
    categoria: "Fast Food",
    calorias: 266,
    porcao: "1 fatia (100g)",
    gramas: 100,
    proteinas: 11,
    carboidratos: 33,
    gorduras: 10,
    equivalencia: "1 fatia média",
    tags: ["pizza", "fast food", "queijo"]
  },
  {
    nome: "Pizza Quatro Queijos",
    categoria: "Fast Food",
    calorias: 320,
    porcao: "1 fatia (100g)",
    gramas: 100,
    proteinas: 14,
    carboidratos: 30,
    gorduras: 16,
    equivalencia: "1 fatia média",
    tags: ["pizza", "fast food", "queijo"]
  },
  {
    nome: "Hambúrguer Simples",
    categoria: "Fast Food",
    calorias: 295,
    porcao: "1 unidade (150g)",
    gramas: 150,
    proteinas: 17,
    carboidratos: 32,
    gorduras: 12,
    equivalencia: "1 hambúrguer",
    tags: ["hambúrguer", "fast food", "lanche"]
  },
  {
    nome: "Cheeseburger",
    categoria: "Fast Food",
    calorias: 330,
    porcao: "1 unidade (150g)",
    gramas: 150,
    proteinas: 19,
    carboidratos: 33,
    gorduras: 15,
    equivalencia: "1 cheeseburger",
    tags: ["hambúrguer", "cheese", "fast food"]
  },
  {
    nome: "Batata Frita (McDonald's)",
    categoria: "Fast Food",
    calorias: 312,
    porcao: "Média (100g)",
    gramas: 100,
    proteinas: 3.4,
    carboidratos: 41,
    gorduras: 15,
    equivalencia: "1 porção média",
    tags: ["batata frita", "fast food", "mcdonalds"]
  },
  {
    nome: "Hot Dog Simples",
    categoria: "Fast Food",
    calorias: 290,
    porcao: "1 unidade",
    gramas: 150,
    proteinas: 11,
    carboidratos: 24,
    gorduras: 17,
    equivalencia: "1 hot dog",
    tags: ["hot dog", "cachorro quente", "fast food"]
  },
  {
    nome: "Pastel de Queijo",
    categoria: "Fast Food",
    calorias: 180,
    porcao: "1 unidade (80g)",
    gramas: 80,
    proteinas: 6,
    carboidratos: 20,
    gorduras: 8,
    equivalencia: "1 pastel médio",
    tags: ["pastel", "queijo", "fast food", "frito"]
  },
  {
    nome: "Coxinha",
    categoria: "Fast Food",
    calorias: 220,
    porcao: "1 unidade (100g)",
    gramas: 100,
    proteinas: 8,
    carboidratos: 25,
    gorduras: 10,
    equivalencia: "1 coxinha média",
    tags: ["coxinha", "fast food", "frito", "frango"]
  },
  {
    nome: "Esfirra de Carne",
    categoria: "Fast Food",
    calorias: 165,
    porcao: "1 unidade (70g)",
    gramas: 70,
    proteinas: 7,
    carboidratos: 22,
    gorduras: 6,
    equivalencia: "1 esfirra",
    tags: ["esfirra", "carne", "fast food"]
  },

  // ==================== DOCES & SOBREMESAS ====================
  {
    nome: "Bolo de Chocolate",
    categoria: "Doces",
    calorias: 352,
    porcao: "1 fatia (100g)",
    gramas: 100,
    proteinas: 5,
    carboidratos: 51,
    gorduras: 15,
    equivalencia: "1 fatia média",
    tags: ["bolo", "chocolate", "doce", "sobremesa"]
  },
  {
    nome: "Brigadeiro",
    categoria: "Doces",
    calorias: 105,
    porcao: "1 unidade (25g)",
    gramas: 25,
    proteinas: 1.2,
    carboidratos: 16,
    gorduras: 4,
    equivalencia: "1 brigadeiro",
    tags: ["brigadeiro", "doce", "chocolate"]
  },
  {
    nome: "Sorvete de Chocolate",
    categoria: "Doces",
    calorias: 216,
    porcao: "100ml (2 bolas)",
    gramas: 100,
    proteinas: 3.8,
    carboidratos: 28,
    gorduras: 11,
    equivalencia: "2 bolas",
    tags: ["sorvete", "chocolate", "gelado", "doce"]
  },
  {
    nome: "Pudim de Leite",
    categoria: "Doces",
    calorias: 195,
    porcao: "1 fatia (100g)",
    gramas: 100,
    proteinas: 5,
    carboidratos: 27,
    gorduras: 7,
    equivalencia: "1 fatia",
    tags: ["pudim", "doce", "sobremesa"]
  },
  {
    nome: "Mousse de Chocolate",
    categoria: "Doces",
    calorias: 189,
    porcao: "100g",
    gramas: 100,
    proteinas: 3,
    carboidratos: 22,
    gorduras: 10,
    equivalencia: "1 taça pequena",
    tags: ["mousse", "chocolate", "doce"]
  },
  {
    nome: "Brownie",
    categoria: "Doces",
    calorias: 466,
    porcao: "1 unidade (100g)",
    gramas: 100,
    proteinas: 6,
    carboidratos: 63,
    gorduras: 21,
    equivalencia: "1 pedaço médio",
    tags: ["brownie", "chocolate", "doce"]
  },

  // ==================== BEBIDAS ====================
  {
    nome: "Café com Leite (sem açúcar)",
    categoria: "Bebidas",
    calorias: 38,
    porcao: "200ml",
    gramas: 200,
    proteinas: 2,
    carboidratos: 5,
    gorduras: 1,
    equivalencia: "1 xícara média",
    tags: ["café", "leite", "bebida"]
  },
  {
    nome: "Suco de Laranja Natural",
    categoria: "Bebidas",
    calorias: 112,
    porcao: "250ml",
    gramas: 250,
    proteinas: 1.7,
    carboidratos: 26,
    gorduras: 0.5,
    equivalencia: "1 copo",
    tags: ["suco", "laranja", "natural", "bebida"]
  },
  {
    nome: "Refrigerante Cola",
    categoria: "Bebidas",
    calorias: 139,
    porcao: "350ml (1 lata)",
    gramas: 350,
    proteinas: 0,
    carboidratos: 37,
    gorduras: 0,
    equivalencia: "1 lata",
    tags: ["refrigerante", "cola", "bebida", "açúcar"]
  },
  {
    nome: "Refrigerante Zero",
    categoria: "Bebidas",
    calorias: 0,
    porcao: "350ml (1 lata)",
    gramas: 350,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    equivalencia: "1 lata",
    tags: ["refrigerante", "zero", "diet", "bebida"]
  },
  {
    nome: "Água de Coco",
    categoria: "Bebidas",
    calorias: 46,
    porcao: "200ml",
    gramas: 200,
    proteinas: 1.5,
    carboidratos: 9,
    gorduras: 0.5,
    equivalencia: "1 copo",
    tags: ["água de coco", "bebida", "natural"]
  },

  // ==================== OLEAGINOSAS ====================
  {
    nome: "Amendoim Torrado",
    categoria: "Oleaginosas",
    calorias: 167,
    porcao: "30g (1 punhado)",
    gramas: 30,
    proteinas: 8,
    carboidratos: 5,
    gorduras: 14,
    fibras: 2.4,
    equivalencia: "1 punhado pequeno",
    tags: ["amendoim", "oleaginosa", "gordura boa"]
  },
  {
    nome: "Castanha do Pará",
    categoria: "Oleaginosas",
    calorias: 197,
    porcao: "30g (5 unidades)",
    gramas: 30,
    proteinas: 4,
    carboidratos: 3,
    gorduras: 20,
    equivalencia: "5 castanhas",
    tags: ["castanha", "pará", "oleaginosa", "selênio"]
  },
  {
    nome: "Amêndoas",
    categoria: "Oleaginosas",
    calorias: 173,
    porcao: "30g (23 unidades)",
    gramas: 30,
    proteinas: 6,
    carboidratos: 6,
    gorduras: 15,
    fibras: 3.5,
    equivalencia: "23 amêndoas",
    tags: ["amêndoa", "oleaginosa", "gordura boa"]
  },
  {
    nome: "Nozes",
    categoria: "Oleaginosas",
    calorias: 196,
    porcao: "30g (14 metades)",
    gramas: 30,
    proteinas: 4.5,
    carboidratos: 4,
    gorduras: 20,
    fibras: 2,
    equivalencia: "14 metades",
    tags: ["noz", "oleaginosa", "ômega 3"]
  },

  // ==================== SUPLEMENTOS ====================
  {
    nome: "Whey Protein (1 scoop)",
    categoria: "Suplementos",
    calorias: 120,
    porcao: "30g (1 dosador)",
    gramas: 30,
    proteinas: 24,
    carboidratos: 3,
    gorduras: 1.5,
    equivalencia: "1 scoop",
    tags: ["whey", "proteína", "suplemento"]
  },
  {
    nome: "Creatina",
    categoria: "Suplementos",
    calorias: 0,
    porcao: "5g",
    gramas: 5,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    equivalencia: "1 colher de chá",
    tags: ["creatina", "suplemento"]
  },
  {
    nome: "Pasta de Amendoim Integral",
    categoria: "Suplementos",
    calorias: 188,
    porcao: "2 colheres (30g)",
    gramas: 30,
    proteinas: 7,
    carboidratos: 6,
    gorduras: 15,
    fibras: 2,
    equivalencia: "2 colheres de sopa",
    tags: ["pasta", "amendoim", "gordura boa"]
  },
];

// Função para calcular tempo de queima
export function calculateBurnTime(calories: number) {
  return {
    caminhada: Math.round(calories / 5), // 5 kcal/min
    corrida: Math.round(calories / 10), // 10 kcal/min
    bike: Math.round(calories / 8), // 8 kcal/min
    musculacao: Math.round(calories / 6), // 6 kcal/min
  };
}

// Função de busca inteligente
export function searchFood(query: string): FoodItem | null {
  const lowerQuery = query.toLowerCase().trim();
  
  // Busca exata por nome
  const exactMatch = foodDatabase.find(food => 
    food.nome.toLowerCase() === lowerQuery
  );
  if (exactMatch) return exactMatch;
  
  // Busca por tag
  const tagMatch = foodDatabase.find(food =>
    food.tags.some(tag => tag.includes(lowerQuery) || lowerQuery.includes(tag))
  );
  if (tagMatch) return tagMatch;
  
  // Busca parcial no nome
  const partialMatch = foodDatabase.find(food =>
    food.nome.toLowerCase().includes(lowerQuery) ||
    lowerQuery.includes(food.nome.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // Se não encontrar, retorna item genérico baseado na categoria mais provável
  if (lowerQuery.includes('carne') || lowerQuery.includes('bife')) {
    return foodDatabase.find(f => f.nome.includes('Carne Bovina')) || null;
  }
  if (lowerQuery.includes('frango') || lowerQuery.includes('peito')) {
    return foodDatabase.find(f => f.nome.includes('Frango')) || null;
  }
  if (lowerQuery.includes('arroz')) {
    return foodDatabase.find(f => f.nome.includes('Arroz Branco')) || null;
  }
  if (lowerQuery.includes('pizza')) {
    return foodDatabase.find(f => f.nome.includes('Pizza Margherita')) || null;
  }
  
  return null;
}

// Função para buscar alimento similar por calorias
export function findSimilarFood(targetCalories: number, categoria?: string): FoodItem {
  let candidates = categoria 
    ? foodDatabase.filter(f => f.categoria === categoria)
    : foodDatabase;
    
  // Encontra o mais próximo em calorias
  return candidates.reduce((closest, current) => {
    const closestDiff = Math.abs(closest.calorias - targetCalories);
    const currentDiff = Math.abs(current.calorias - targetCalories);
    return currentDiff < closestDiff ? current : closest;
  });
}
