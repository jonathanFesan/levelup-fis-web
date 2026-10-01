// LevelUp Plus — camada de dados.
//
// Com LUP_CONFIG.PLUS.DEMO = true tudo fica no localStorage do navegador
// (por aluno), para você testar e mostrar o fluxo antes de existir backend.
// Com DEMO = false, as mesmas funções chamam as rotas /plus/* da API —
// o contrato esperado está no README ("LevelUp Plus"). As telas em app.js
// só conhecem window.Plus, então a troca não mexe nelas.

(function () {
  const P = window.LUP_CONFIG.PLUS;
  const uid = () => (API.Session.get() || {}).user_id || 'anon';
  const email = () => ((API.Session.get() || {}).email || '').toLowerCase();
  const key = () => 'lup.plus.' + uid();

  const vazio = () => ({ demoAtivo: false, pendente: false, duvidas: [], aulas: [] });
  function ler() {
    try { return { ...vazio(), ...JSON.parse(localStorage.getItem(key())) }; } catch { return vazio(); }
  }
  function gravar(d) {
    try { localStorage.setItem(key(), JSON.stringify(d)); } catch { /* modo privado */ }
  }
  const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // ---- Datas locais (horário de Brasília do professor = horário do navegador) ----
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const slotKey = (d) => `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const parseSlot = (s) => {
    const [dt, hm] = s.split('T');
    const [y, m, d] = dt.split('-').map(Number);
    const [h, mi] = hm.split(':').map(Number);
    return new Date(y, m - 1, d, h, mi);
  };

  // Gera os horários livres a partir da agenda semanal do config.
  function gerarSlots(ocupados) {
    const agora = Date.now();
    const minimo = agora + P.AULA_ANTECEDENCIA_HORAS * 3600e3;
    const bloqueios = new Set(P.AGENDA_BLOQUEIOS || []);
    const ocup = new Set(ocupados);
    const dias = [];
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    for (let i = 0; i < P.AULA_SEMANAS_ABERTAS * 7; i++) {
      const d = new Date(hoje); d.setDate(hoje.getDate() + i);
      const k = ymd(d);
      const horas = [...(P.AGENDA_SEMANAL[d.getDay()] || [])];
      (P.AGENDA_EXTRAS || []).forEach((x) => { if (x.startsWith(k)) horas.push(x.split('T')[1]); });
      const slots = bloqueios.has(k) ? [] : [...new Set(horas)].sort().map((h) => {
        const s = `${k}T${h}`;
        const t = parseSlot(s).getTime();
        return { slot: s, livre: t >= minimo && !ocup.has(s) };
      });
      dias.push({ data: k, date: d, slots });
    }
    return dias;
  }

  // Reserva não paga segura o horário só por AULA_RESERVA_HORAS.
  function comExpiracao(a) {
    if (a.status === 'aguardando_pagamento' &&
        Date.now() - new Date(a.criada_em).getTime() > (P.AULA_RESERVA_HORAS || 2) * 3600e3) {
      return { ...a, status: 'expirada' };
    }
    return a;
  }
  const ativos = (aulas) => aulas.map(comExpiracao).filter((a) => !['cancelada', 'expirada'].includes(a.status));

  const demo = {
    async status(profile) {
      const d = ler();
      const ativo = !!(profile && (profile.plus_ativo || profile.is_admin)) ||
        (P.ASSINANTES || []).map((e) => e.toLowerCase()).includes(email()) || d.demoAtivo;
      return { ativo, pendente: !ativo && d.pendente };
    },
    async marcarAssinaturaPendente() { const d = ler(); d.pendente = true; gravar(d); },
    async demoAtivar(v = true) { const d = ler(); d.demoAtivo = v; d.pendente = false; gravar(d); },

    async listarDuvidas() {
      return ler().duvidas.sort((a, b) => b.criada_em.localeCompare(a.criada_em));
    },
    async enviarDuvida({ topico, texto }) {
      const d = ler();
      const q = { id: novoId(), topico, texto, status: 'aguardando', resposta: null, criada_em: new Date().toISOString(), respondida_em: null };
      d.duvidas.push(q); gravar(d); return q;
    },
    async demoResponder(id) {
      const d = ler();
      const q = d.duvidas.find((x) => x.id === id);
      if (q) {
        q.status = 'respondida'; q.respondida_em = new Date().toISOString();
        q.resposta = '(Resposta de demonstração) Ótima pergunta! Aqui o professor explica a resolução passo a passo. Quando o backend estiver ligado, a resposta real aparece neste espaço.';
      }
      gravar(d); return q;
    },

    async agenda() { return gerarSlots(ativos(ler().aulas).map((a) => a.inicio)); },
    async listarAulas() { return ler().aulas.map(comExpiracao).sort((a, b) => a.inicio.localeCompare(b.inicio)); },
    async reservarAula(inicio, plus) {
      const d = ler();
      if (ativos(d.aulas).some((a) => a.inicio === inicio)) throw new Error('Esse horário acabou de ser reservado. Escolha outro.');
      const aula = {
        id: novoId(), inicio, duracao_min: P.AULA_DURACAO_MIN, valor: valorAula(plus), plus: !!plus,
        status: 'aguardando_pagamento', criada_em: new Date().toISOString(),
      };
      d.aulas.push(aula); gravar(d); return aula;
    },
    async cancelarAula(id) {
      const d = ler(); const a = d.aulas.find((x) => x.id === id);
      if (a) a.status = 'cancelada'; gravar(d);
    },
    async demoConfirmarPagamento(id) {
      const d = ler(); const a = d.aulas.find((x) => x.id === id);
      if (a) a.status = 'confirmada'; gravar(d);
    },
  };

  // Mesmas funções, falando com o backend.
  // "Pagamento em análise" é só um aviso visual: guarda quando o aluno
  // foi pro checkout e some quando o webhook da Hotmart ativa o Plus.
  const chavePendente = () => 'lup.plus.pendente.' + uid();
  const remoto = {
    async status() {
      const r = await API.request('/plus/status');
      let pendente = false;
      try {
        const t = +localStorage.getItem(chavePendente());
        if (r.ativo) localStorage.removeItem(chavePendente());
        else pendente = !!t && Date.now() - t < 3 * 86400e3;
      } catch { /* modo privado */ }
      return { ...r, pendente };
    },
    async marcarAssinaturaPendente() {
      try { localStorage.setItem(chavePendente(), String(Date.now())); } catch { /* modo privado */ }
    },
    listarDuvidas: () => API.request('/plus/duvidas'),
    enviarDuvida: (body) => API.request('/plus/duvidas', { method: 'POST', body }),
    async agenda() {
      const r = await API.request('/plus/agenda'); // { ocupados: ['AAAA-MM-DDTHH:MM', ...] }
      return gerarSlots(r.ocupados || []);
    },
    listarAulas: () => API.request('/plus/aulas'),
    reservarAula: (inicio) => API.request('/plus/aulas', { method: 'POST', body: { inicio } }),
    cancelarAula: (id) => API.request(`/plus/aulas/${id}/cancelar`, { method: 'POST' }),
  };

  function valorAula(plus) {
    return Math.round(P.AULA_VALOR * (plus ? 1 - P.AULA_DESCONTO_PLUS : 1) * 100) / 100;
  }

  // Link do checkout da Hotmart com os dados do aluno preenchidos e o
  // código da reserva em `sck` (aparece no relatório de vendas da Hotmart,
  // pra você saber qual horário aquele pagamento está pagando).
  function checkout(base, { nome, ref } = {}) {
    try {
      const u = new URL(base);
      if (email()) u.searchParams.set('email', email());
      if (nome) u.searchParams.set('name', nome);
      if (ref) u.searchParams.set('sck', ref);
      return u.toString();
    } catch { return base; }
  }

  window.Plus = {
    ...(P.DEMO ? demo : remoto),
    demo: !!P.DEMO,
    cfg: P,
    valorAula,
    checkout,
    parseSlot,
    slotKey,
    ymd,
  };
})();
