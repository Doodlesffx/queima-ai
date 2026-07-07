// ============================================
// BANCO DE DADOS DE EXERCÍCIOS - QUEIMA AI
// Informações detalhadas para modal "Como fazer?"
// ============================================

export interface ExerciseInfo {
  instrucoes: string[];
  musculos: string[];
  errosComuns: string[];
  dicas: string[];
}

export const exerciseDatabase: { [key: string]: ExerciseInfo } = {
  // ============ PEITO ============
  'supino': {
    instrucoes: [
      'Deite no banco com os pés firmes no chão',
      'Pegue a barra com as mãos um pouco mais largas que os ombros',
      'Desça a barra de forma controlada até tocar o peito',
      'Empurre a barra de volta até a posição inicial',
      'Mantenha as escápulas retraídas durante todo o movimento'
    ],
    musculos: ['Peitoral maior', 'Tríceps', 'Deltoides anterior'],
    errosComuns: [
      'Arquear excessivamente as costas',
      'Não tocar a barra no peito',
      'Empinar os quadris do banco',
      'Barra desalinhada (não em linha reta)'
    ],
    dicas: [
      'Mantenha as escápulas retraídas e deprimidas',
      'Controle a descida (2-3 segundos)',
      'Expire ao empurrar a barra',
      'Pegada muito larga sobrecarrega os ombros'
    ]
  },
  'supino inclinado': {
    instrucoes: [
      'Ajuste o banco em 30-45 graus de inclinação',
      'Deite e posicione os pés firmes no chão',
      'Pegue a barra com pegada um pouco mais larga que os ombros',
      'Desça a barra até a parte superior do peito',
      'Empurre de volta à posição inicial'
    ],
    musculos: ['Peitoral superior', 'Deltoides anterior', 'Tríceps'],
    errosComuns: [
      'Banco muito inclinado (vira ombro)',
      'Deixar o quadril sair do banco',
      'Barra muito baixa no peito'
    ],
    dicas: [
      'Inclinação ideal: 30-45 graus',
      'Foque na contração do peitoral superior',
      'Não tranque os cotovelos no topo'
    ]
  },
  'crucifixo': {
    instrucoes: [
      'Deite no banco com um halter em cada mão',
      'Inicie com os braços estendidos acima do peito',
      'Abra os braços lateralmente mantendo uma leve flexão nos cotovelos',
      'Desça até sentir alongamento no peito',
      'Retorne à posição inicial contraindo o peitoral'
    ],
    musculos: ['Peitoral maior', 'Deltoides anterior'],
    errosComuns: [
      'Flexionar demais os cotovelos (vira supino)',
      'Descer muito (lesão nos ombros)',
      'Usar carga excessiva'
    ],
    dicas: [
      'Mantenha a mesma curvatura nos cotovelos',
      'Movimento deve ser amplo mas controlado',
      'Imagine abraçar uma árvore'
    ]
  },
  'flexão': {
    instrucoes: [
      'Posicione as mãos um pouco mais largas que os ombros',
      'Mantenha o corpo em linha reta da cabeça aos pés',
      'Desça flexionando os cotovelos até o peito quase tocar o chão',
      'Empurre de volta até estender completamente os braços',
      'Mantenha o abdômen contraído o tempo todo'
    ],
    musculos: ['Peitoral', 'Tríceps', 'Deltoides', 'Core'],
    errosComuns: [
      'Deixar o quadril cair ou subir',
      'Não descer o suficiente',
      'Cotovelos muito abertos (acima de 45°)',
      'Cabeça olhando para cima'
    ],
    dicas: [
      'Core sempre contraído',
      'Se for difícil, apoie os joelhos',
      'Cotovelos em 45° do corpo',
      'Olhe para baixo mantendo o pescoço neutro'
    ]
  },

  // ============ COSTAS ============
  'remada': {
    instrucoes: [
      'Incline o tronco para frente mantendo as costas retas',
      'Joelhos levemente flexionados',
      'Segure a barra com pegada pronada (palmas para baixo)',
      'Puxe a barra em direção ao abdômen baixo',
      'Controle a descida até esticar completamente os braços'
    ],
    musculos: ['Dorsal', 'Trapézio', 'Romboides', 'Bíceps', 'Deltoides posterior'],
    errosComuns: [
      'Usar impulso do corpo (tranco)',
      'Arredondar as costas',
      'Não retrair as escápulas',
      'Puxar muito alto (vira trapézio)'
    ],
    dicas: [
      'Puxe com os cotovelos, não com as mãos',
      'Aproxime as escápulas no topo',
      'Mantenha o core estável',
      'Tronco ~45° do chão'
    ]
  },
  'levantamento terra': {
    instrucoes: [
      'Posicione os pés na largura dos ombros, barra sobre o meio dos pés',
      'Agache e segure a barra com pegada mista ou pronada',
      'Mantenha as costas completamente retas, peito elevado',
      'Empurre o chão com os pés e estenda os quadris',
      'Finalize ficando completamente ereto, ombros para trás'
    ],
    musculos: ['Lombar', 'Glúteos', 'Isquiotibiais', 'Quadríceps', 'Trapézio', 'Core'],
    errosComuns: [
      'Arredondar as costas (MUITO PERIGOSO)',
      'Iniciar o movimento com as costas',
      'Barra longe do corpo',
      'Hiperextender as costas no topo'
    ],
    dicas: [
      'Imagine empurrar o chão, não puxar a barra',
      'Barra SEMPRE próxima às pernas',
      'Core contraído do início ao fim',
      'Olhe ligeiramente para baixo'
    ]
  },
  'barra fixa': {
    instrucoes: [
      'Pegue a barra com pegada pronada (palmas para frente)',
      'Pendure com braços completamente estendidos',
      'Puxe o corpo para cima até o queixo passar da barra',
      'Controle a descida até estender completamente os braços',
      'Evite balanço excessivo do corpo'
    ],
    musculos: ['Dorsal', 'Bíceps', 'Trapézio', 'Core'],
    errosComuns: [
      'Não estender completamente os braços',
      'Balançar o corpo (kipping)',
      'Não atingir amplitude completa',
      'Pescoço tenso'
    ],
    dicas: [
      'Se não conseguir, use elástico de assistência',
      'Puxe com os cotovelos para baixo e para trás',
      'Deprima as escápulas no início',
      'Pegada mais larga = mais dorsal'
    ]
  },
  'pulldown': {
    instrucoes: [
      'Sente e ajuste as almofadas sobre as coxas',
      'Pegue a barra com pegada larga, palmas para frente',
      'Incline levemente o tronco para trás',
      'Puxe a barra até a altura do peito',
      'Controle a subida até estender completamente os braços'
    ],
    musculos: ['Dorsal', 'Bíceps', 'Trapézio médio'],
    errosComuns: [
      'Puxar atrás da cabeça (perigoso)',
      'Usar impulso excessivo',
      'Não estender completamente',
      'Soltar o peso bruscamente'
    ],
    dicas: [
      'Puxe para a frente do corpo, não atrás',
      'Imagine quebrar a barra ao puxar',
      'Retraia as escápulas no final',
      'Pegada larga trabalha mais a largura'
    ]
  },

  // ============ PERNAS ============
  'agachamento': {
    instrucoes: [
      'Posicione os pés na largura dos ombros, pés levemente apontados para fora',
      'Mantenha o peito elevado e olhar para frente',
      'Desça flexionando joelhos e quadris simultaneamente',
      'Desça até as coxas ficarem paralelas ao chão (ou mais)',
      'Empurre pelos calcanhares para subir, mantendo o core contraído'
    ],
    musculos: ['Quadríceps', 'Glúteos', 'Isquiotibiais', 'Core', 'Lombar'],
    errosComuns: [
      'Joelhos ultrapassando muito os pés',
      'Arredondar a coluna lombar',
      'Não descer profundo o suficiente',
      'Calcanhares saindo do chão'
    ],
    dicas: [
      'Imagine sentar em uma cadeira',
      'Mantenha o peso nos calcanhares',
      'Core sempre contraído',
      'Joelhos alinhados com os pés'
    ]
  },
  'leg press': {
    instrucoes: [
      'Sente no aparelho com as costas apoiadas',
      'Posicione os pés na plataforma na largura dos ombros',
      'Destrave o aparelho e flexione os joelhos',
      'Desça até formar 90° nos joelhos',
      'Empurre a plataforma de volta sem trancar os joelhos'
    ],
    musculos: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    errosComuns: [
      'Tirar o quadril do apoio na descida',
      'Trancar os joelhos no topo',
      'Amplitude muito curta',
      'Pés muito juntos ou muito afastados'
    ],
    dicas: [
      'Quadril sempre apoiado',
      'Pés mais altos = mais glúteos',
      'Pés mais baixos = mais quadríceps',
      'Não tranque os joelhos completamente'
    ]
  },
  'cadeira extensora': {
    instrucoes: [
      'Sente no aparelho e ajuste o apoio nos tornozelos',
      'Segure as alças laterais',
      'Estenda completamente as pernas contraindo o quadríceps',
      'Controle a descida até a posição inicial',
      'Mantenha as costas apoiadas'
    ],
    musculos: ['Quadríceps (reto femoral, vasto lateral, vasto medial, vasto intermédio)'],
    errosComuns: [
      'Usar impulso',
      'Não estender completamente',
      'Tirar as costas do apoio',
      'Carga excessiva'
    ],
    dicas: [
      'Movimento controlado',
      'Contraia fortemente no topo por 1 segundo',
      'Pontas dos pés para cima trabalham mais o vasto medial',
      'Não balance o tronco'
    ]
  },
  'cadeira flexora': {
    instrucoes: [
      'Deite de bruços no aparelho',
      'Ajuste o rolo nos tornozelos',
      'Flexione os joelhos trazendo os pés em direção aos glúteos',
      'Contraia fortemente os posteriores no topo',
      'Controle a descida até estender quase completamente'
    ],
    musculos: ['Isquiotibiais (bíceps femoral, semitendinoso, semimembranoso)', 'Gastrocnêmio'],
    errosComuns: [
      'Elevar os quadris do banco',
      'Não contrair no topo',
      'Amplitude incompleta',
      'Usar impulso'
    ],
    dicas: [
      'Quadris sempre no banco',
      'Contraia por 1 segundo no topo',
      'Pontas dos pés para baixo isolam mais os posteriores',
      'Descida controlada em 2-3 segundos'
    ]
  },
  'stiff': {
    instrucoes: [
      'Fique em pé com uma barra ou halteres',
      'Pés na largura dos quadris, joelhos levemente flexionados',
      'Incline o tronco para frente mantendo as costas retas',
      'Desça até sentir alongamento nos posteriores',
      'Retorne à posição inicial contraindo glúteos e posteriores'
    ],
    musculos: ['Isquiotibiais', 'Glúteos', 'Lombar'],
    errosComuns: [
      'Arredondar as costas',
      'Flexionar muito os joelhos (vira agachamento)',
      'Não ir até a amplitude completa',
      'Barra longe do corpo'
    ],
    dicas: [
      'Costas SEMPRE retas',
      'Joelhos levemente flexionados e fixos',
      'Barra próxima às pernas',
      'Foco no alongamento dos posteriores'
    ]
  },

  // ============ OMBROS ============
  'desenvolvimento': {
    instrucoes: [
      'Sente com as costas apoiadas (ou em pé)',
      'Segure os halteres na altura dos ombros, cotovelos a 90°',
      'Empurre os pesos para cima até estender os braços',
      'Desça controladamente até a posição inicial',
      'Não tranque completamente os cotovelos no topo'
    ],
    musculos: ['Deltoides (anterior, médio, posterior)', 'Tríceps', 'Trapézio superior'],
    errosComuns: [
      'Arquear excessivamente as costas',
      'Usar impulso das pernas',
      'Não estender completamente',
      'Descer muito pouco'
    ],
    dicas: [
      'Core contraído para proteger a lombar',
      'Expire ao empurrar',
      'Cotovelos ligeiramente à frente no início',
      'Halteres podem ficar paralelos ou em neutra'
    ]
  },
  'elevação lateral': {
    instrucoes: [
      'Fique em pé com um halter em cada mão ao lado do corpo',
      'Mantenha os cotovelos levemente flexionados',
      'Eleve os braços lateralmente até a altura dos ombros',
      'Controle a descida até a posição inicial',
      'Evite balançar o corpo'
    ],
    musculos: ['Deltoides médio (porção lateral)'],
    errosComuns: [
      'Elevar acima da linha dos ombros (trapézio assume)',
      'Usar impulso e balanço',
      'Rodar os punhos para baixo no topo',
      'Carga excessiva'
    ],
    dicas: [
      'Pare na linha dos ombros',
      'Imagine despejar água de dois copos',
      'Cotovelos levemente mais altos que os punhos',
      'Movimento controlado, sem impulso'
    ]
  },
  'elevação frontal': {
    instrucoes: [
      'Fique em pé com halteres ou barra à frente das coxas',
      'Mantenha os braços quase estendidos',
      'Eleve o peso à frente até a altura dos ombros',
      'Controle a descida até a posição inicial',
      'Mantenha o core contraído'
    ],
    musculos: ['Deltoides anterior', 'Peitoral superior'],
    errosComuns: [
      'Elevar acima dos ombros',
      'Balançar o corpo',
      'Usar impulso',
      'Arquear as costas'
    ],
    dicas: [
      'Pare na altura dos ombros',
      'Não balance o tronco',
      'Pode alternar os braços',
      'Pegada neutra (martelo) reduz estresse no ombro'
    ]
  },

  // ============ BRAÇOS ============
  'rosca direta': {
    instrucoes: [
      'Fique em pé com a barra nas mãos, pegada supinada (palmas para cima)',
      'Cotovelos próximos ao corpo',
      'Flexione os cotovelos elevando a barra até o peito',
      'Contraia os bíceps no topo',
      'Desça controladamente até estender completamente'
    ],
    musculos: ['Bíceps braquial', 'Braquial', 'Braquiorradial'],
    errosComuns: [
      'Balançar o corpo (usar impulso)',
      'Cotovelos saindo para frente',
      'Não estender completamente',
      'Amplitude parcial'
    ],
    dicas: [
      'Cotovelos fixos ao lado do corpo',
      'Apenas o antebraço se move',
      'Contraia fortemente no topo',
      'Pegada na largura dos ombros'
    ]
  },
  'rosca alternada': {
    instrucoes: [
      'Fique em pé com um halter em cada mão, braços estendidos',
      'Flexione um cotovelo elevando o halter',
      'Rotacione o punho durante a subida (supinação)',
      'Desça controladamente e repita com o outro braço',
      'Alterne os braços mantendo o outro fixo'
    ],
    musculos: ['Bíceps braquial', 'Braquial'],
    errosComuns: [
      'Balançar o corpo',
      'Não fazer a rotação completa',
      'Movimento muito rápido',
      'Cotovelos instáveis'
    ],
    dicas: [
      'Rotacione o punho ao subir',
      'Contraia forte no topo',
      'Mantenha tensão contínua',
      'Um braço trabalha enquanto o outro descansa'
    ]
  },
  'rosca martelo': {
    instrucoes: [
      'Fique em pé com halteres, pegada neutra (palmas voltadas uma para outra)',
      'Mantenha essa pegada durante todo o movimento',
      'Flexione os cotovelos elevando os pesos',
      'Contraia no topo',
      'Desça controladamente'
    ],
    musculos: ['Braquial', 'Braquiorradial', 'Bíceps braquial'],
    errosComuns: [
      'Rotar os punhos durante o movimento',
      'Balançar o corpo',
      'Amplitude incompleta'
    ],
    dicas: [
      'Pegada neutra o tempo todo',
      'Trabalha mais o braquial (espessura do braço)',
      'Pode fazer alternado ou simultâneo',
      'Menos estresse nos punhos que a rosca normal'
    ]
  },
  'tríceps testa': {
    instrucoes: [
      'Deite em um banco com barra ou halteres acima do peito',
      'Mantenha os cotovelos fixos apontando para cima',
      'Flexione apenas os cotovelos, descendo o peso até perto da testa',
      'Estenda os cotovelos retornando à posição inicial',
      'Cotovelos permanecem fixos durante todo o movimento'
    ],
    musculos: ['Tríceps (cabeça longa e lateral)'],
    errosComuns: [
      'Mover os ombros e cotovelos',
      'Amplitude muito curta',
      'Cotovelos muito abertos',
      'Bater na testa (cuidado!)'
    ],
    dicas: [
      'APENAS os antebraços se movem',
      'Cotovelos ligeiramente para dentro',
      'Desça devagar, suba explosivo',
      'Pode descer atrás da cabeça em vez da testa'
    ]
  },
  'tríceps pulley': {
    instrucoes: [
      'Fique de frente para a polia alta',
      'Segure a barra com pegada pronada',
      'Cotovelos fixos ao lado do corpo',
      'Empurre a barra para baixo até estender completamente',
      'Contraia o tríceps no final',
      'Retorne controladamente'
    ],
    musculos: ['Tríceps (todas as porções)'],
    errosComuns: [
      'Mover os cotovelos',
      'Não estender completamente',
      'Usar o corpo para empurrar',
      'Soltar muito rápido na subida'
    ],
    dicas: [
      'Cotovelos colados ao corpo',
      'Estenda completamente e contraia',
      'Pegada pronada = mais cabeça lateral',
      'Pegada supinada = mais cabeça medial'
    ]
  },
  'tríceps francês': {
    instrucoes: [
      'Fique em pé ou sentado com halter acima da cabeça',
      'Segure com ambas as mãos',
      'Desça o peso atrás da cabeça flexionando os cotovelos',
      'Mantenha os cotovelos fixos apontando para cima',
      'Estenda até a posição inicial'
    ],
    musculos: ['Tríceps (especialmente cabeça longa)'],
    errosComuns: [
      'Cotovelos se abrindo',
      'Não ir até a amplitude completa',
      'Arquear as costas',
      'Usar peso excessivo'
    ],
    dicas: [
      'Cotovelos sempre próximos e fixos',
      'Alongamento total na descida',
      'Core contraído',
      'Excelente para a cabeça longa do tríceps'
    ]
  },

  // ============ ABDÔMEN ============
  'abdominal': {
    instrucoes: [
      'Deite com joelhos flexionados, pés no chão',
      'Mãos atrás da cabeça ou cruzadas no peito',
      'Contraia o abdômen elevando as escápulas do chão',
      'Mantenha a contração no topo',
      'Desça controladamente'
    ],
    musculos: ['Reto abdominal', 'Oblíquos'],
    errosComuns: [
      'Puxar o pescoço com as mãos',
      'Subir muito (usar o quadril)',
      'Movimento muito rápido',
      'Não contrair no topo'
    ],
    dicas: [
      'Eleve apenas as escápulas',
      'Olhe para o teto',
      'Expire ao subir',
      'Qualidade > quantidade'
    ]
  },
  'prancha': {
    instrucoes: [
      'Apoie os antebraços e as pontas dos pés no chão',
      'Mantenha o corpo em linha reta',
      'Contraia abdômen e glúteos',
      'Segure a posição pelo tempo determinado',
      'Mantenha a respiração natural'
    ],
    musculos: ['Core (reto abdominal, transverso, oblíquos)', 'Lombar', 'Ombros'],
    errosComuns: [
      'Elevar ou deixar cair os quadris',
      'Não contrair o abdômen',
      'Prender a respiração',
      'Cabeça muito elevada ou baixa'
    ],
    dicas: [
      'Corpo em linha reta perfeita',
      'Core MUITO contraído',
      'Glúteos também contraídos',
      'Olhe para baixo mantendo pescoço neutro'
    ]
  },

  // ============ EXERCÍCIOS FUNCIONAIS ============
  'burpee': {
    instrucoes: [
      'Comece em pé',
      'Agache e coloque as mãos no chão',
      'Jogue os pés para trás ficando em posição de flexão',
      'Faça uma flexão (opcional)',
      'Traga os pés de volta e pule para cima'
    ],
    musculos: ['Corpo inteiro', 'Cardio'],
    errosComuns: [
      'Não fazer a flexão completa',
      'Pular muito alto gastando energia desnecessária',
      'Desabar na flexão',
      'Movimento descoordenado'
    ],
    dicas: [
      'Mantenha ritmo constante',
      'Respire de forma controlada',
      'Excelente para condicionamento',
      'Pode remover o pulo se for iniciante'
    ]
  },
  'mountain climber': {
    instrucoes: [
      'Comece em posição de prancha (apoio)',
      'Traga um joelho em direção ao peito',
      'Retorne e traga o outro joelho',
      'Alterne os joelhos de forma rápida e controlada',
      'Mantenha o core estável'
    ],
    musculos: ['Core', 'Ombros', 'Quadríceps', 'Cardio'],
    errosComuns: [
      'Elevar os quadris',
      'Não trazer o joelho próximo o suficiente',
      'Perder a estabilidade do core',
      'Ombros instáveis'
    ],
    dicas: [
      'Quadris no mesmo nível',
      'Core sempre contraído',
      'Movimento rápido mas controlado',
      'Ótimo para cardio e core'
    ]
  },
  'jumping jack': {
    instrucoes: [
      'Comece em pé, pés juntos, braços ao lado do corpo',
      'Salte abrindo pernas e elevando braços acima da cabeça',
      'Salte voltando à posição inicial',
      'Mantenha ritmo constante',
      'Movimente braços e pernas simultaneamente'
    ],
    musculos: ['Corpo inteiro', 'Cardio'],
    errosComuns: [
      'Não abrir completamente',
      'Ritmo irregular',
      'Pousar com joelhos rígidos',
      'Não coordenar braços e pernas'
    ],
    dicas: [
      'Ótimo para aquecimento',
      'Mantenha abdômen contraído',
      'Pouso suave nos pés',
      'Respiração ritmada'
    ]
  },
};

// Função auxiliar para buscar exercício
export function getExerciseInfo(exerciseName: string): ExerciseInfo {
  const exerciseLower = exerciseName.toLowerCase();
  
  // Busca exata primeiro
  if (exerciseDatabase[exerciseLower]) {
    return exerciseDatabase[exerciseLower];
  }
  
  // Busca por palavra-chave
  for (const [key, info] of Object.entries(exerciseDatabase)) {
    if (exerciseLower.includes(key) || key.includes(exerciseLower.split(' ')[0])) {
      return info;
    }
  }
  
  // Se não encontrar, retorna info genérica mas útil
  return {
    instrucoes: [
      'Execute o movimento de forma controlada e com amplitude completa',
      'Mantenha a postura correta e o core contraído durante todo o exercício',
      'Concentre-se na contração e alongamento muscular',
      'Respire adequadamente: expire no esforço, inspire no relaxamento',
      'Aqueça o grupo muscular antes e alongue depois'
    ],
    musculos: ['Consulte seu instrutor para informações específicas deste exercício'],
    errosComuns: [
      'Usar carga excessiva comprometendo a técnica',
      'Fazer o movimento muito rápido perdendo controle',
      'Não aquecer adequadamente antes do exercício',
      'Compensar com outros músculos por fraqueza ou fadiga'
    ],
    dicas: [
      'Sempre priorize a técnica sobre a carga',
      'Aumente o peso progressivamente ao longo das semanas',
      'Peça orientação de um profissional de educação física',
      'Mantenha um registro do seu progresso'
    ]
  };
}
