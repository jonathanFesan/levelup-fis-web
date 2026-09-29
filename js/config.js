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
};
