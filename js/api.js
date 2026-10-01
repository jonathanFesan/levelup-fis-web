// Cliente da API do LevelUp Fís — mesmas rotas que o app Flutter usa
// (frontend/lib/data/repositories/game_repository.dart e
// auth_repository.dart). Nenhuma regra de jogo é calculada aqui: XP,
// Fótons, Cargas, desbloqueios e correção ficam no backend, então o
// progresso feito no site aparece no app e vice-versa.

(function () {
  const BASE = window.LUP_CONFIG.API_BASE.replace(/\/$/, '');
  const KEY = 'lup.session';

  // ---- Sessão (equivalente ao SharedPreferences do app) ----
  const Session = {
    get() {
      try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
    },
    set(s) {
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* modo privado */ }
    },
    clear() {
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    },
  };

  class ApiError extends Error {
    constructor(message, status) { super(message); this.status = status; }
  }

  // O backend fica no plano gratuito do Render, que "dorme" depois de um
  // tempo parado — a primeira requisição pode levar ~50s. Mostramos um
  // aviso se a resposta demorar.
  let pendentes = 0;
  let wakeTimer = null;
  function inicioRequisicao() {
    pendentes++;
    if (!wakeTimer) {
      wakeTimer = setTimeout(() => {
        const b = document.getElementById('wake-banner');
        if (b && pendentes > 0) b.hidden = false;
      }, 4000);
    }
  }
  function fimRequisicao() {
    pendentes = Math.max(0, pendentes - 1);
    if (pendentes === 0) {
      clearTimeout(wakeTimer); wakeTimer = null;
      const b = document.getElementById('wake-banner');
      if (b) b.hidden = true;
    }
  }

  async function rawFetch(path, { method = 'GET', body, token, query, timeout = 75000 } = {}) {
    let url = BASE + path;
    if (query) {
      const qs = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.set(k, v); });
      const s = qs.toString();
      if (s) url += '?' + s;
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    inicioRequisicao();
    let res;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
    } catch (e) {
      throw new ApiError(
        e.name === 'AbortError'
          ? 'Tempo esgotado. Confira sua conexão e tente de novo.'
          : 'Sem conexão com o servidor. Confira sua internet.',
        0,
      );
    } finally {
      clearTimeout(t);
      fimRequisicao();
    }

    let data = null;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
      const detail = data && typeof data === 'object' && data.detail
        ? (typeof data.detail === 'string' ? data.detail : 'Dados inválidos.')
        : `Erro ${res.status}`;
      throw new ApiError(detail, res.status);
    }
    return data;
  }

  // Renova o access_token usando o refresh_token salvo (POST /auth/refresh),
  // igual ao _restaurarSessao() do app. Uma renovação por vez.
  let refreshing = null;
  async function refreshSession() {
    const s = Session.get();
    if (!s || !s.refresh_token) throw new ApiError('Sessão expirada.', 401);
    if (!refreshing) {
      refreshing = rawFetch('/auth/refresh', { method: 'POST', body: { refresh_token: s.refresh_token } })
        .then((d) => {
          const nova = { ...s, access_token: d.access_token, refresh_token: d.refresh_token, user_id: d.user_id, email: d.email };
          Session.set(nova);
          return nova;
        })
        .finally(() => { refreshing = null; });
    }
    return refreshing;
  }

  // Requisição autenticada: se o token expirou (401), renova uma vez e
  // repete. Se nem o refresh funcionar, a sessão é encerrada.
  async function authed(path, opts = {}) {
    const s = Session.get();
    if (!s) throw new ApiError('Sessão expirada. Faça login novamente.', 401);
    try {
      return await rawFetch(path, { ...opts, token: s.access_token });
    } catch (e) {
      if (e.status !== 401) throw e;
      let nova;
      try { nova = await refreshSession(); } catch {
        Session.clear();
        window.dispatchEvent(new Event('lup:logout'));
        throw new ApiError('Sessão expirada. Faça login novamente.', 401);
      }
      return rawFetch(path, { ...opts, token: nova.access_token });
    }
  }

  const uid = () => (Session.get() || {}).user_id;

  window.API = {
    Session,
    ApiError,
    refreshSession,
    request: authed, // usado pelo js/plus.js quando PLUS.DEMO = false

    // --- Auth ---
    async login(email, password) {
      const d = await rawFetch('/auth/login', { method: 'POST', body: { email, password } });
      Session.set({ access_token: d.access_token, refresh_token: d.refresh_token, user_id: d.user_id, email: d.email });
      return d;
    },
    async register(email, password) {
      const d = await rawFetch('/auth/register', { method: 'POST', body: { email, password } });
      if (!d.access_token) {
        throw new ApiError(
          'Cadastro criado, mas sem sessão ativa (a confirmação de e-mail pode estar ativada). ' +
          'Confirme o e-mail e depois faça login.', 400);
      }
      // Mesmo fluxo do app: cria o perfil logo após o cadastro.
      await rawFetch('/profile/create', {
        method: 'POST', token: d.access_token, query: { user_id: d.user_id, email: d.email },
      });
      Session.set({ access_token: d.access_token, refresh_token: d.refresh_token, user_id: d.user_id, email: d.email });
      return d;
    },
    forgotPassword: (email) => rawFetch('/auth/forgot-password', { method: 'POST', body: { email } }),
    logout() { Session.clear(); },

    // --- Perfil ---
    getProfile: () => authed(`/profile/${uid()}`),
    updateNome: (nome) => authed(`/profile/${uid()}`, { method: 'PATCH', body: { nome } }),
    loseCharge: () => authed(`/profile/${uid()}/lose-charge`, { method: 'POST' }),
    buyCharge: () => authed(`/profile/${uid()}/buy-charge`, { method: 'POST' }),

    // --- Currículo / conteúdo ---
    getCurriculo: () => authed('/curriculo/areas'),
    getTopicContent: (topico) => authed(`/topic-content/${encodeURIComponent(topico)}`),

    // --- Progresso ---
    getTopicProgress: (topico) => authed(`/topic-progress/${encodeURIComponent(topico)}`),
    marcarResumo: (topico) => authed(`/topic-progress/${encodeURIComponent(topico)}/resumo`, { method: 'POST' }),
    getCapituloProgress: (topico) => authed(`/capitulo-progress/${encodeURIComponent(topico)}`),
    concluirCapitulo: (id) => authed(`/capitulo-progress/${id}/concluir`, { method: 'POST' }),

    // --- Questões ---
    getQuestions: (topico, categoria) => authed('/questions/', { query: { topico, categoria } }),
    answer: (question_id, resposta) => authed('/questions/answer', { method: 'POST', body: { question_id, resposta } }),

    // --- Prova ---
    startExam: (topico, modo) => authed('/exam/start', { method: 'POST', body: { topico, modo } }),
    finishExam: (id, respostas, tempo_total_segundos) =>
      authed(`/exam/${id}/finish`, { method: 'POST', body: { respostas, tempo_total_segundos } }),
    getAttempts: (topico) => authed('/exam/attempts', { query: { topico } }),

    // --- Vídeos ---
    getVideos: () => authed('/videos/'),
    markWatched: (id) => authed(`/videos/${id}/watch`, { method: 'POST' }),
  };
})();
