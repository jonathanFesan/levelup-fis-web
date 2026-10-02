// Configuração do site LevelUp Fís.
//
// API_BASE aponta para o MESMO backend usado pelo app Android
// (frontend/lib/core/constants/app_constants.dart → baseUrl). É isso que
// mantém o progresso sincronizado entre o app e o site: os dois leem e
// gravam nas mesmas tabelas do Supabase, através da mesma API.
window.LUP_CONFIG = {
  API_BASE: 'https://levelup-fis.onrender.com',

  // Espelham AppConstants / backend (progress.py, questions.py)
  CARGAS_MAXIMAS: 5,
  XP_POR_NIVEL: 100,
  CUSTO_CARGA_EMERGENCIA: 20,
  HORAS_RECARGA: 4,

  // ------------------------------------------------------------------
  // LevelUp Plus — tudo que você (professor) ajusta fica aqui.
  // Troque os links/valores marcados com TODO pelos seus.
  // ------------------------------------------------------------------
  PLUS: {
    // false = usa o backend de verdade (rotas /plus/* + webhook da Hotmart).
    // true = modo demonstração: tudo fica só no navegador do aluno e
    // aparecem botões "DEMO" para simular pagamentos (bom para testar o
    // visual sem mexer no banco).
    DEMO: false,

    // Só no modo demonstração: e-mails tratados como assinantes. Com o
    // backend, libere acessos manuais pelo painel (/painel → aba Plus).
    ASSINANTES: [],

    // Planos da assinatura (cada um com o seu checkout na Hotmart)
    PLANOS: [
      { id: 'mensal', nome: '1 mês', preco: 'R$ 49', sufixo: '/mês', obs: 'Renova todo mês',
        checkout: 'https://pay.hotmart.com/C107855080D?off=9fkc5c3l' },
      { id: 'semestral', nome: '6 meses', preco: 'R$ 340', sufixo: '/6 meses', obs: 'Pagamento único, sem renovação',
        checkout: 'https://pay.hotmart.com/C107855080D?off=kn8uf8xj' },
    ],

    // Checkouts da Hotmart do produto "aula avulsa"
    // null = produto ainda não criado: o site mostra os horários, mas no
    // lugar do pagamento aparece "em breve" com o contato do WhatsApp.
    HOTMART_AULA: null,      // TODO: link da oferta de R$ 80
    HOTMART_AULA_PLUS: null, // TODO: link da oferta de R$ 68 (assinante)

    WHATSAPP_COMUNIDADE: 'https://chat.whatsapp.com/SEU_CONVITE', // TODO
    WHATSAPP_PROFESSOR: '5500000000000', // TODO: DDI+DDD+número (só dígitos) — usado no "falar com o professor"

    // Suporte a dúvidas
    PRAZO_RESPOSTA_HORAS: 24,
    HORARIO_SUPORTE: 'Segunda a sexta, das 8h às 20h', // TODO: seus horários

    // Aulas particulares
    AULA_VALOR: 80,             // aula avulsa (R$)
    AULA_DESCONTO_PLUS: 0.15,   // 15% para assinantes
    AULA_DURACAO_MIN: 60,
    // A AGENDA de verdade (horários, bloqueios, antecedência, semanas
    // abertas) é editada no painel → aba Agenda. Os 5 itens abaixo só valem
    // no modo demonstração (DEMO: true).
    AULA_ANTECEDENCIA_HORAS: 24,
    AULA_RESERVA_HORAS: 2,       // reserva sem pagamento libera o horário depois disso
    AULA_SEMANAS_ABERTAS: 3,     // quantas semanas à frente aparecem
    // Sua agenda semanal: dia da semana (0 = domingo … 6 = sábado) → horários de início
    AGENDA_SEMANAL: {
      1: ['18:00', '19:00', '20:00'],
      2: ['14:00', '15:00'],
      3: ['18:00', '19:00', '20:00'],
      4: ['14:00', '15:00'],
      6: ['09:00', '10:00', '11:00'],
    },
    // Datas sem aula (feriados, viagens…), formato AAAA-MM-DD
    AGENDA_BLOQUEIOS: [],
    // Horários avulsos extras, formato 'AAAA-MM-DDTHH:MM'
    AGENDA_EXTRAS: [],

    // Plantão ao vivo em grupo (1 por mês)
    PLANTAO: {
      data: '2026-10-24T15:00', // TODO
      link: 'https://meet.google.com/SEU-LINK', // TODO: aparece só para assinantes
      tema: 'Revisão de Cinemática e Leis de Newton',
    },
    // Desafio do mês
    DESAFIO: {
      titulo: 'Desafio de Outubro: o elevador maluco',
      texto: 'Um elevador acelera para cima a 2 m/s². Quanto marca a balança de uma pessoa de 60 kg dentro dele? (g = 10 m/s²) Mande sua resolução na comunidade até o fim do mês — os 3 primeiros acertos ganham destaque!',
      prazo: '2026-10-31',
    },
  },
};
