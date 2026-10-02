// LevelUp Fís — versão web.
//
// Reproduz as telas do app Flutter (frontend/lib/presentation/screens) em
// uma SPA estática com rotas por hash (#/map, #/videos...), para rodar em
// GitHub Pages ou Render Static Site sem nenhum build. Toda a regra de
// jogo continua no backend (ver js/api.js), por isso o progresso é
// compartilhado com o app.

(function main() {
  // O navegador pode ter guardado arquivos de versões diferentes (o GitHub
  // Pages manda guardar cada um por 10 min). Se faltar algo que esta versão
  // usa, busca config/api/plus de novo, sem cache, e só então começa.
  if (!(window.LUP_CONFIG && window.LUP_CONFIG.PLUS && window.API && API.request && window.Plus)) {
    if (main.recarregou) return window.lupFalha && window.lupFalha();
    main.recarregou = true;
    const v = Date.now();
    const carregar = (src) => new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = `${src}?v=${v}`; s.onload = ok; s.onerror = falha;
      document.head.appendChild(s);
    });
    carregar('js/config.js').then(() => carregar('js/api.js')).then(() => carregar('js/plus.js'))
      .then(main, () => window.lupFalha && window.lupFalha());
    return;
  }

  const CFG = window.LUP_CONFIG;
  const $app = document.getElementById('app');

  // ================================================================
  // Utilidades
  // ================================================================
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICON = {
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z"/></svg>',
    battery: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v2h2a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 14a8 8 0 0 1-6.2-3c.9-1.7 3.6-2.8 6.2-2.8s5.3 1.1 6.2 2.8A8 8 0 0 1 12 20z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 5.1 9 3 3 5.3V21l6-2.3 6 2.1 6-2.3V2.8zM10 5.4l4 1.4v11.8l-4-1.4z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>',
    playCircle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 14.5v-9l6 4.5z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-5 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM14 9h-4V7a2 2 0 0 1 4 0z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4.5c-1.1-.4-2.4-.5-3.5-.5-1.9 0-4 .4-5.5 1.5C10.5 4.4 8.4 4 6.5 4S2.5 4.4 1 5.5v14.6c0 .3.3.5.5.5h.3C3.1 19.9 4.9 19.5 6.5 19.5c1.9 0 4 .4 5.5 1.5 1.3-.8 3.8-1.5 5.5-1.5s3.4.3 4.7 1.1c.1.1.2.1.3.1.3 0 .5-.3.5-.5V5.5c-.6-.4-1.3-.8-2-1zM21 18c-1.1-.3-2.3-.5-3.5-.5-1.7 0-4.2.7-5.5 1.5V7.5c1.3-.8 3.8-1.5 5.5-1.5 1.2 0 2.4.2 3.5.5z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm17.6-2.4-1.2-1.2a1 1 0 0 0-1.4 0L12 16.4V19h2.6l6-6a1 1 0 0 0 0-1.4z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1a5 5 0 0 0 4.4 5A5 5 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 0 0 3.6-2.9A5 5 0 0 0 21 8V7a2 2 0 0 0-2-2zM5 8V7h2v3.8A3 3 0 0 1 5 8zm14 0a3 3 0 0 1-2 2.8V7h2z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.2V21h3.8L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 5.7 7.9l1.5 1.5A8 8 0 0 0 12 4zm0 14a6 6 0 0 1-5.7-7.9L4.8 8.6A8 8 0 0 0 12 20v3l4-4-4-4z"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 7.5l5 4 4.5-7 4.5 7 5-4L19.5 18h-15zM4.5 19.5h15V21h-15z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm-4 9h8v2H8zm0-3.5h8v2H8zM8 14.5h5v2H8z"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2.1-7.7-.9.9c-.7.7-1.2 1.3-1.2 2.8h-2v-.5c0-1.1.5-2.1 1.2-2.8l1.2-1.3A2 2 0 1 0 10 9H8a4 4 0 1 1 7.1 2.3z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14zM7 11h5v5H7z"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.4 11.6l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7c0 .6.2 1.1.6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-5 21a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm5-4H7V4h10z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/></svg>',
  };

  const TIPO_ICON = { resumo: 'book', fixacao: 'edit', prova: 'trophy', curiosidade: 'bulb', extra: 'plus' };
  const CATEGORIAS = {
    fixacao: { label: 'FIXAÇÃO', vazio: 'Nenhum exercício cadastrado ainda.' },
    extra: { label: 'EXERCÍCIOS', vazio: 'Nenhum exercício extra cadastrado ainda.' },
  };
  const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function toast(msg, ms = 2800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // Modal genérico. Retorna uma Promise com o valor do botão clicado.
  function modal({ title, text = '', icon = '', buttons = [{ label: 'Entendi', value: true, cls: 'btn-primary' }], light = false, input = null, html = '' }) {
    return new Promise((resolve) => {
      const root = document.getElementById('modal-root');
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.innerHTML = `
        <div class="modal ${light ? 'light' : ''}" role="dialog" aria-modal="true">
          ${icon ? `<div style="color:var(--gold);width:34px;height:34px;margin:0 auto">${icon}</div>` : ''}
          <h3>${esc(title)}</h3>
          ${text ? `<p>${esc(text)}</p>` : ''}
          ${html}
          ${input ? `<input type="text" maxlength="40" value="${esc(input.value || '')}" placeholder="${esc(input.placeholder || '')}">` : ''}
          <div class="actions">
            ${buttons.map((b, i) => `<button class="btn ${b.cls || 'btn-ghost'}" data-i="${i}">${esc(b.label)}</button>`).join('')}
          </div>
        </div>`;
      const inp = wrap.querySelector('input');
      const close = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') close(undefined); };
      wrap.addEventListener('click', (e) => {
        if (e.target === wrap) return close(undefined);
        const b = e.target.closest('[data-i]');
        if (b) {
          const btn = buttons[+b.dataset.i];
          close(input && btn.value === true ? inp.value : btn.value);
        }
      });
      wrap.querySelectorAll('[data-custom]').forEach((el) => el.addEventListener('click', () => close(el.dataset.custom)));
      document.addEventListener('keydown', onKey);
      root.appendChild(wrap);
      if (inp) { inp.focus(); inp.select(); inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') close(inp.value); }); }
    });
  }

  const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

  function fmtSeg(total) {
    total = Math.max(0, Math.round(total || 0));
    const m = Math.floor(total / 60), s = total % 60;
    return m > 0 ? `${m}min ${s}s` : `${s}s`;
  }
  function fmtData(iso) {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function nomeExibicao(u) {
    if (!u) return 'Aluno';
    if (u.nome && u.nome.trim()) return u.nome.trim();
    if (u.email && u.email.includes('@')) return u.email.split('@')[0];
    return u.email || 'Aluno';
  }

  // Converte links do YouTube/Vimeo em URL de embed; outros ficam como link.
  function embedUrl(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      const h = u.hostname.replace('www.', '');
      if (h === 'youtube.com' || h === 'm.youtube.com') {
        if (u.pathname.startsWith('/shorts/')) return 'https://www.youtube.com/embed/' + u.pathname.split('/')[2];
        if (u.pathname.startsWith('/embed/')) return url;
        const v = u.searchParams.get('v');
        if (v) return 'https://www.youtube.com/embed/' + v;
      }
      if (h === 'youtu.be') return 'https://www.youtube.com/embed/' + u.pathname.slice(1);
      if (h === 'vimeo.com') return 'https://player.vimeo.com/video/' + u.pathname.split('/').filter(Boolean)[0];
      if (/\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname)) return 'video:' + url;
    } catch { /* URL inválida */ }
    return null;
  }
  function youtubeThumb(url) {
    const e = embedUrl(url);
    if (e && e.includes('youtube.com/embed/')) return `https://img.youtube.com/vi/${e.split('/embed/')[1].split(/[?&]/)[0]}/hqdefault.jpg`;
    return null;
  }

  // ================================================================
  // Estado em memória (cache simples — o backend é a fonte de verdade)
  // ================================================================
  const S = {
    profile: null,
    curriculo: null, // [{id,titulo,icone,blocos:[{id,titulo,nivel_minimo,capitulos:[]}]}]
    moduloAtual: null,
    questions: {}, // `${topico}|${categoria}` -> lista
  };

  async function loadProfile(force = false) {
    if (S.profile && !force) return S.profile;
    try {
      S.profile = await API.getProfile();
    } catch (e) {
      // Perfil inexistente = sessão inválida (mesma regra do user_provider.dart)
      if (e.status === 404) { doLogout(); throw e; }
      throw e;
    }
    return S.profile;
  }
  // Assinante do LevelUp Plus (e o admin) não tem trava de trilha:
  // tópicos, capítulos, fases e extras ficam todos abertos. Guarda o
  // resultado por 1 min pra não consultar o backend a cada tela.
  async function semTravas(user) {
    if (user && user.is_admin) return true;
    if (S.plusCache && Date.now() - S.plusCache.t < 60e3) return S.plusCache.ativo;
    let ativo = false;
    try { ativo = !!(await Plus.status(user)).ativo; } catch { /* sem resposta: segue com as travas */ }
    S.plusCache = { t: Date.now(), ativo };
    return ativo;
  }

  async function loadCurriculo(force = false) {
    if (S.curriculo && !force) return S.curriculo;
    const areas = await API.getCurriculo();
    areas.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
    areas.forEach((a) => {
      (a.blocos || []).sort((x, y) => (x.ordem ?? 0) - (y.ordem ?? 0));
      a.blocos.forEach((b) => (b.capitulos || []).sort((x, y) => (x.ordem ?? 0) - (y.ordem ?? 0)));
    });
    S.curriculo = areas;
    return areas;
  }
  function findTopico(topicoId) {
    for (const area of S.curriculo || []) {
      for (const b of area.blocos || []) if (b.id === topicoId) return { area, topico: b };
    }
    return { area: null, topico: null };
  }
  async function getQuestions(topico, categoria, force = false) {
    const k = `${topico}|${categoria}`;
    if (!S.questions[k] || force) S.questions[k] = await API.getQuestions(topico, categoria);
    return S.questions[k];
  }

  function doLogout() {
    API.logout();
    Object.assign(S, { profile: null, curriculo: null, moduloAtual: null, questions: {}, plusCache: null });
    go('#/login');
  }
  window.addEventListener('lup:logout', () => {
    Object.assign(S, { profile: null, curriculo: null, questions: {}, plusCache: null });
    if (!location.hash.startsWith('#/login') && !location.hash.startsWith('#/register')) {
      toast('Sessão expirada. Faça login novamente.');
      go('#/login');
    }
  });

  // ================================================================
  // Blocos de layout
  // ================================================================
  function loading() { return `<div class="center fill"><div class="spinner"></div></div>`; }
  function errorBox(msg, retryLabel = 'Tentar novamente') {
    return `<div class="center fill stack"><p>${esc(msg)}</p><button class="btn btn-primary" data-retry>${esc(retryLabel)}</button></div>`;
  }
  function bindRetry() {
    const b = $app.querySelector('[data-retry]');
    if (b) b.onclick = () => render();
  }
  function topStats(u) {
    return `
      <div class="topstats">
        <span class="stat" title="Joules (XP)"><span style="color:var(--gold)">${ICON.bolt}</span>${u?.xp ?? 0} J</span>
        <span class="stat" title="Fótons"><span style="color:var(--gold-deep)">${ICON.spark}</span>${u?.moedas ?? 0}</span>
        <span class="stat" title="Cargas"><span style="color:var(--cyan)">${ICON.battery}</span>${u?.vidas ?? 0}</span>
        <a class="icon-btn" href="#/profile" aria-label="Perfil">${ICON.user}</a>
      </div>`;
  }
  function bottomNav(tab) {
    return `
      <nav class="bottomnav"><div class="inner">
        <a class="side-brand" href="#/map"><img src="assets/logo.png" alt="">LevelUp Fís</a>
        <a href="#/map" class="${tab === 'mapa' ? 'on' : ''}">${ICON.map}Mapa</a>
        <a href="#/videos" class="${tab === 'videos' ? 'on' : ''}">${ICON.playCircle}Vídeos</a>
        <a href="#/plus" class="plus-tab ${tab === 'plus' ? 'on' : ''}">${ICON.crown}Plus</a>
        <a href="#/profile" class="${tab === 'perfil' ? 'on' : ''}">${ICON.user}Perfil</a>
      </div></nav>`;
  }
  function pageHead(title, crumb, backHash) {
    return `
      <div class="pagehead">
        <button class="back" data-back="${esc(backHash)}" aria-label="Voltar">${ICON.back}</button>
        <h2>${crumb ? `<span class="crumb">${esc(crumb)}</span>` : ''}${esc(title)}</h2>
      </div>`;
  }
  function bindBack() {
    $app.querySelectorAll('[data-back]').forEach((b) => { b.onclick = () => go(b.dataset.back); });
  }

  // Trilha em zigue-zague com linha tracejada (widgets/exercise_trail.dart)
  // nodes: [{titulo, icon, desbloqueado, concluido, sideBadge?:{icon,on}}]
  function trailHtml(nodes) {
    const ROW = 170, PAD = 20;
    const X = [50, 72, 50, 28];
    const h = PAD + nodes.length * ROW;
    const items = nodes.map((n, i) => {
      const x = X[i % 4], top = PAD + i * ROW;
      const cls = n.concluido ? 'done' : n.desbloqueado ? 'current' : 'locked';
      const iconSvg = n.concluido ? ICON[n.icon] : n.desbloqueado ? (n.playIcon ? ICON.play : ICON[n.icon]) : ICON.lock;
      let badge = '';
      if (n.sideBadge) {
        const bx = x >= 50 ? x - 30 : x + 30;
        badge = `<button class="side-badge ${n.sideBadge.on ? 'on' : ''}" style="left:${bx}%;top:${top + 24}px" data-badge="${i}" title="${esc(n.sideBadge.title || '')}">${n.sideBadge.on ? ICON[n.sideBadge.icon] : ICON.lock}</button>`;
      }
      return `
        <button class="tnode ${cls}" style="left:${x}%;top:${top}px" data-node="${i}">
          <span style="width:96px;height:96px;display:flex;align-items:center;justify-content:center">
            <span class="circle">${iconSvg}${n.concluido ? `<span class="check">${ICON.check}</span>` : ''}</span>
          </span>
          <span class="label">${esc(n.titulo)}</span>
        </button>${badge}`;
    }).join('');
    return `<div class="trail" data-trail='${JSON.stringify({ X, ROW, PAD, n: nodes.length })}' style="height:${h}px">
      <svg class="path"></svg>${items}</div>`;
  }
  function drawTrails() {
    $app.querySelectorAll('.trail').forEach((t) => {
      const { X, ROW, PAD, n } = JSON.parse(t.dataset.trail);
      const w = t.clientWidth;
      const svg = t.querySelector('svg.path');
      let d = '';
      for (let i = 0; i < n - 1; i++) {
        const x1 = (X[i % 4] / 100) * w, x2 = (X[(i + 1) % 4] / 100) * w;
        const y1 = PAD + i * ROW + 128, y2 = PAD + (i + 1) * ROW + 4;
        const my = (y1 + y2) / 2;
        d += `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2} `;
      }
      svg.setAttribute('viewBox', `0 0 ${w} ${t.clientHeight}`);
      svg.innerHTML = d ? `<path d="${d}" fill="none" stroke="#3a4680" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"/>` : '';
    });
  }
  window.addEventListener('resize', drawTrails);

  // ================================================================
  // Telas
  // ================================================================

  // ---------- Login ----------
  function viewLogin() {
    $app.innerHTML = `
      <div class="auth-wrap">
      <aside class="auth-side">
        <img class="logo" src="assets/logo.png" alt="">
        <h2>Física de um jeito que dá vontade de estudar.</h2>
        <ul>
          <li>${ICON.map}Trilhas por capítulo com resumo, exercícios e prova</li>
          <li>${ICON.bolt}Ganhe Joules, suba de nível e desbloqueie conteúdos</li>
          <li>${ICON.sync}O mesmo progresso no app e no site</li>
        </ul>
      </aside>
      <div class="auth center">
        <img class="logo" src="assets/logo.png" alt="">
        <h1>LevelUp Fís</h1>
        <p class="sub">Suba de nível em Física</p>
        <form class="stack" novalidate>
          <label class="field"><span>E-mail</span><input type="email" name="email" autocomplete="email" required></label>
          <label class="field"><span>Senha</span><input type="password" name="password" autocomplete="current-password" required></label>
          <div style="text-align:right"><button type="button" class="btn btn-text" data-forgot>Esqueceu a senha?</button></div>
          <div class="error-msg" data-err></div>
          <button class="btn btn-primary btn-block" type="submit">Entrar</button>
          <a class="btn btn-text btn-block" href="#/register">Ainda não tem conta? Cadastre-se</a>
        </form>
        <p class="sync-note">${ICON.sync}Use a mesma conta do app — seu progresso é o mesmo.</p>
      </div></div>`;
    const f = $app.querySelector('form');
    const err = $app.querySelector('[data-err]');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const email = f.email.value.trim(), password = f.password.value;
      if (!email) return (err.textContent = 'Informe seu e-mail');
      if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = 'E-mail inválido');
      if (!password) return (err.textContent = 'Informe sua senha');
      err.textContent = '';
      const btn = f.querySelector('[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try {
        await API.login(email, password);
        go('#/map');
      } catch (ex) {
        err.textContent = ex.status === 401 ? 'E-mail ou senha incorretos.' : ex.message;
        btn.disabled = false; btn.textContent = 'Entrar';
      }
    };
    $app.querySelector('[data-forgot]').onclick = async () => {
      const email = await modal({
        title: 'Redefinir senha',
        text: 'Informe seu e-mail — enviaremos um link pra você criar uma senha nova.',
        input: { placeholder: 'seuemail@exemplo.com', value: f.email.value.trim() },
        buttons: [{ label: 'Cancelar', value: undefined }, { label: 'Enviar', value: true, cls: 'btn-primary' }],
      });
      if (email === undefined) return;
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return toast('Informe um e-mail válido.');
      try { await API.forgotPassword(email.trim()); } catch { /* sempre responde igual */ }
      toast('Se esse e-mail estiver cadastrado, enviamos um link de redefinição de senha.', 4500);
    };
  }

  // ---------- Cadastro ----------
  function viewRegister() {
    $app.innerHTML = `
      <div class="auth-wrap">
      <aside class="auth-side">
        <img class="logo" src="assets/logo.png" alt="">
        <h2>Física de um jeito que dá vontade de estudar.</h2>
        <ul>
          <li>${ICON.map}Trilhas por capítulo com resumo, exercícios e prova</li>
          <li>${ICON.bolt}Ganhe Joules, suba de nível e desbloqueie conteúdos</li>
          <li>${ICON.sync}O mesmo progresso no app e no site</li>
        </ul>
      </aside>
      <div class="auth center">
        <img class="logo" src="assets/logo.png" alt="">
        <h1>Comece sua jornada</h1>
        <p class="sub">Crie sua conta para começar a subir de nível</p>
        <form class="stack" novalidate>
          <label class="field"><span>E-mail</span><input type="email" name="email" autocomplete="email"></label>
          <label class="field"><span>Senha</span><input type="password" name="password" autocomplete="new-password"></label>
          <label class="field"><span>Confirmar senha</span><input type="password" name="confirm" autocomplete="new-password"></label>
          <div class="error-msg" data-err></div>
          <button class="btn btn-primary btn-block" type="submit">Criar conta</button>
          <a class="btn btn-text btn-block" href="#/login">Já tem conta? Entrar</a>
        </form>
      </div></div>`;
    const f = $app.querySelector('form');
    const err = $app.querySelector('[data-err]');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const email = f.email.value.trim();
      if (!email) return (err.textContent = 'Informe seu e-mail');
      if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = 'E-mail inválido');
      if (f.password.value.length < 6) return (err.textContent = 'A senha deve ter ao menos 6 caracteres');
      if (f.password.value !== f.confirm.value) return (err.textContent = 'As senhas não coincidem');
      err.textContent = '';
      const btn = f.querySelector('[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try {
        await API.register(email, f.password.value);
        go('#/map');
      } catch (ex) {
        err.textContent = ex.message;
        btn.disabled = false; btn.textContent = 'Criar conta';
      }
    };
  }

  // ---------- Mapa ----------
  // Regra de desbloqueio de tópico = topicoDesbloqueadoProvider
  // (topic_progress_provider.dart): nível mínimo + Fixação do tópico
  // anterior concluída. Admin não fica travado.
  async function viewMap() {
    $app.innerHTML = topStats(S.profile) + loading() + bottomNav('mapa');
    let areas, user;
    try {
      [user, areas] = await Promise.all([loadProfile(true), loadCurriculo(true)]);
    } catch (e) {
      $app.innerHTML = topStats(S.profile) + errorBox('Erro ao carregar o currículo.') + bottomNav('mapa');
      return bindRetry();
    }

    if (!S.moduloAtual || !areas.some((a) => a.id === S.moduloAtual)) {
      const mec = areas.find((a) => a.id === 'mecanica' && a.blocos.length);
      S.moduloAtual = (mec || areas.find((a) => a.blocos.length) || areas[0] || {}).id;
    }
    const modulo = areas.find((a) => a.id === S.moduloAtual);
    const topicos = modulo ? modulo.blocos : [];

    // Busca o progresso de todos os tópicos do módulo em paralelo.
    const info = await Promise.all(topicos.map(async (t) => {
      const [prog, cap, att, cont] = await Promise.all([
        API.getTopicProgress(t.id).catch(() => ({})),
        API.getCapituloProgress(t.id).catch(() => ({})),
        API.getAttempts(t.id).catch(() => []),
        API.getTopicContent(t.id).catch(() => ({})),
      ]);
      return { prog, cap, att, cont };
    }));

    const livre = await semTravas(user);
    const nivel = user.nivel ?? 1;
    const idxAtual = areas.findIndex((a) => a.id === S.moduloAtual);

    let html = topStats(user);
    if (livre && !user.is_admin) html += `<div class="plus-free"><span>${ICON.crown}</span>LevelUp Plus: todas as trilhas liberadas — estude na ordem que quiser.</div>`;
    html += `<div class="modstrip">${areas.map((a, i) => `
        ${i > 0 ? `<span class="mod-link ${i <= idxAtual ? 'lit' : ''}"></span>` : ''}
        <button class="mod ${a.id === S.moduloAtual ? 'active' : ''} ${a.blocos.length || livre ? 'available' : ''}" data-mod="${esc(a.id)}">
          <span class="circle">${esc(a.icone || '•')}</span>${esc(a.titulo)}
        </button>`).join('')}</div>`;

    if (!topicos.length) {
      html += `<div class="card muted" style="margin-top:24px">O conteúdo de ${esc(modulo ? modulo.titulo : 'este módulo')} ainda está sendo preparado. Assim que os tópicos forem publicados, eles aparecem aqui${livre ? ' — já liberados pra você' : ''}.</div>`;
    }

    const trilhas = [];
    const blocos = topicos.map((t, i) => {
      let b = '';
      const { prog, cap, att, cont } = info[i];
      const nivelMin = cont.nivel_minimo ?? t.nivel_minimo ?? 1;
      let liberado;
      if (livre) liberado = true;
      else if (nivel < nivelMin) liberado = false;
      else if (i === 0) liberado = true;
      else liberado = !!info[i - 1].prog.fixacao_concluida;

      if (!liberado) {
        const motivo = nivel < nivelMin
          ? `Disponível a partir do nível ${nivelMin}.`
          : 'Conclua a Fixação do capítulo anterior para desbloquear.';
        b += `
          <div class="card topic-locked">
            <span class="lock-circle">${ICON.lock}</span>
            <div><div style="font-weight:800;color:var(--muted)">${esc(t.titulo)}</div>
            <div class="small muted">${motivo}</div></div>
          </div>`;
        return b;
      }

      b += `<div class="topic-banner"><div class="k">${esc(modulo.titulo)}</div><div class="t">${esc(t.titulo)}</div></div>`;

      const provaConcluida = (att || []).some((a) => a.finalizado_em);
      const concluido = (c) => {
        switch (c.tipo) {
          case 'resumo': return !!prog.resumo_concluido;
          case 'fixacao': return !!prog.fixacao_concluida;
          case 'prova': return provaConcluida;
          case 'curiosidade': return !!cap[String(c.id)];
          default: return false;
        }
      };
      const seq = (t.capitulos || []).filter((c) => c.tipo !== 'extra');
      const extra = (t.capitulos || []).find((c) => c.tipo === 'extra');

      if (!seq.length) {
        b += `<div class="card muted" style="margin:8px 0 20px">O conteúdo deste tópico ainda está sendo preparado.</div>`;
        return b;
      }
      const nodes = seq.map((c, k) => ({
        titulo: c.titulo,
        icon: TIPO_ICON[c.tipo] || 'bulb',
        desbloqueado: livre || k === 0 || concluido(seq[k - 1]),
        concluido: concluido(c),
        sideBadge: c.tipo === 'fixacao' && extra
          ? { icon: 'plus', on: livre || !!prog.fixacao_concluida, title: extra.titulo } : null,
      }));
      trilhas.push({ topico: t, seq, nodes, extra });
      b += `<div data-trilha="${trilhas.length - 1}">${trailHtml(nodes)}</div>`;
      return b;
    });
    html += `<div class="topics">${blocos.map((b) => `<section class="topic-block">${b}</section>`).join('')}</div>`;

    html += `<p class="sync-note">${ICON.sync}Progresso sincronizado com o app</p>`;
    html += bottomNav('mapa');
    $app.innerHTML = html;
    drawTrails();

    $app.querySelectorAll('[data-mod]').forEach((b) => {
      b.onclick = () => {
        const a = areas.find((x) => x.id === b.dataset.mod);
        if (a.id === S.moduloAtual) return window.scrollTo({ top: 0, behavior: 'smooth' });
        // Módulo ainda sem tópicos cadastrados: aluno comum vê o aviso do
        // app; assinante do Plus entra mesmo assim (vê "em preparação").
        if (!a.blocos.length && !livre) {
          return modal({ title: 'Quase lá!', text: 'Você ainda não chegou aqui.', icon: ICON.lock });
        }
        S.moduloAtual = a.id;
        viewMap();
      };
    });

    $app.querySelectorAll('[data-trilha]').forEach((wrap) => {
      const tr = trilhas[+wrap.dataset.trilha];
      wrap.querySelectorAll('[data-node]').forEach((b) => {
        b.onclick = () => {
          const i = +b.dataset.node;
          if (!tr.nodes[i].desbloqueado) return toast('Conclua o capítulo anterior para desbloquear.');
          abrirCapitulo(tr.topico, tr.seq[i]);
        };
      });
      wrap.querySelectorAll('[data-badge]').forEach((b) => {
        b.onclick = () => {
          const i = +b.dataset.badge;
          if (!tr.nodes[i].sideBadge.on) return toast('Conclua a Fixação para desbloquear.');
          go(`#/t/${encodeURIComponent(tr.topico.id)}/trilha/extra`);
        };
      });
    });
  }

  function abrirCapitulo(topico, cap) {
    const t = encodeURIComponent(topico.id);
    switch (cap.tipo) {
      case 'resumo': return go(`#/t/${t}/resumo`);
      case 'fixacao': return go(`#/t/${t}/trilha/fixacao`);
      case 'prova': return go(`#/t/${t}/prova`);
      case 'curiosidade': return go(`#/t/${t}/cur/${cap.id}`);
    }
  }

  // ---------- Resumo ----------
  async function viewResumo(topicoId) {
    $app.innerHTML = loading();
    let conteudo, prog;
    try {
      await loadCurriculo();
      [conteudo, prog] = await Promise.all([API.getTopicContent(topicoId), API.getTopicProgress(topicoId)]);
    } catch (e) {
      $app.innerHTML = pageHead('Resumo', '', '#/map') + errorBox('Não foi possível carregar o conteúdo do resumo agora.');
      bindBack(); return bindRetry();
    }
    const { area, topico } = findTopico(topicoId);
    const cap = topico?.capitulos?.find((c) => c.tipo === 'resumo');
    const pdf = conteudo.resumo_pdf_url && conteudo.resumo_pdf_url.trim();
    const texto = conteudo.resumo_texto && conteudo.resumo_texto.trim();

    let body;
    if (pdf) {
      body = `<iframe class="pdf-frame" src="${esc(pdf)}#toolbar=0" title="Resumo em PDF"></iframe>
              <p class="small muted" style="text-align:center">Não carregou? <a href="${esc(pdf)}" target="_blank" rel="noopener">Abrir o PDF em outra aba</a></p>`;
    } else if (texto) {
      body = `<div class="prose">${esc(conteudo.resumo_texto)}</div>`;
    } else {
      body = `<p class="muted">O conteúdo do resumo deste tópico ainda não foi cadastrado no painel administrativo.</p>`;
    }

    $app.className = 'app no-nav';
    $app.innerHTML = pageHead(cap?.titulo || 'Resumo', [area?.titulo, topico?.titulo].filter(Boolean).join(' · '), '#/map') + `
      <div class="card">${body}</div>
      <div class="bottom-cta">
        <div class="error-msg" data-err style="margin-bottom:8px"></div>
        <button class="btn btn-primary btn-block" data-ok>${prog.resumo_concluido ? 'CONTINUAR' : 'ENTENDIDO'}</button>
      </div>`;
    bindBack();
    const btn = $app.querySelector('[data-ok]');
    btn.onclick = async () => {
      if (prog.resumo_concluido) return go('#/map');
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try {
        const r = await API.marcarResumo(topicoId);
        if (S.profile) S.profile.xp = r.joules_totais;
        if (r.joules_ganhos > 0) toast(`Resumo concluído! +${r.joules_ganhos} J`);
        go('#/map');
      } catch (e) {
        $app.querySelector('[data-err]').textContent = e.message;
        btn.disabled = false; btn.textContent = 'ENTENDIDO';
      }
    };
  }

  // ---------- Curiosidade ----------
  async function viewCuriosidade(topicoId, capId) {
    $app.innerHTML = loading();
    try { await loadCurriculo(); } catch {
      $app.innerHTML = errorBox('Erro ao carregar o currículo.'); return bindRetry();
    }
    const { area, topico } = findTopico(topicoId);
    const cap = topico?.capitulos?.find((c) => String(c.id) === String(capId));
    if (!cap) return go('#/map');
    const c = cap.conteudo || {};
    const parts = [];
    if (c.imagem_url) parts.push(`<img class="media-img" src="${esc(c.imagem_url)}" alt="" onerror="this.outerHTML='<p class=muted>Não foi possível carregar a imagem.</p>'">`);
    if (c.texto && c.texto.trim()) parts.push(`<div class="prose">${esc(c.texto)}</div>`);
    if (c.pdf_url) parts.push(`<iframe class="pdf-frame" src="${esc(c.pdf_url)}#toolbar=0" title="PDF"></iframe><p class="small muted" style="text-align:center"><a href="${esc(c.pdf_url)}" target="_blank" rel="noopener">Abrir o PDF em outra aba</a></p>`);
    if (c.video_url) {
      const em = embedUrl(c.video_url);
      if (em && em.startsWith('video:')) parts.push(`<div class="video-embed"><video src="${esc(em.slice(6))}" controls></video></div>`);
      else if (em) parts.push(`<div class="video-embed"><iframe src="${esc(em)}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe></div>`);
      else parts.push(`<a class="btn btn-ghost btn-block" href="${esc(c.video_url)}" target="_blank" rel="noopener">${ICON.playCircle} Assistir vídeo</a>`);
    }
    if (!parts.length) parts.push(`<p class="muted">O conteúdo desta Curiosidade ainda não foi cadastrado no painel administrativo.</p>`);

    $app.className = 'app no-nav';
    $app.innerHTML = pageHead(cap.titulo, [area?.titulo, topico?.titulo].filter(Boolean).join(' · '), '#/map') + `
      <div class="card stack">${parts.join('')}</div>
      <div class="bottom-cta"><div class="error-msg" data-err style="margin-bottom:8px"></div>
      <button class="btn btn-primary btn-block" data-ok>CONTINUAR</button></div>`;
    bindBack();
    const btn = $app.querySelector('[data-ok]');
    btn.onclick = async () => {
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try { await API.concluirCapitulo(cap.id); go('#/map'); } catch {
        $app.querySelector('[data-err]').textContent = 'Não foi possível continuar agora. Tente de novo.';
        btn.disabled = false; btn.textContent = 'CONTINUAR';
      }
    };
  }

  // ---------- Trilha de exercícios (Fixação / Exercícios extra) ----------
  async function viewTrilha(topicoId, categoria) {
    const catInfo = CATEGORIAS[categoria] || CATEGORIAS.fixacao;
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let qs, livre;
    try {
      await loadCurriculo();
      qs = await getQuestions(topicoId, categoria, true);
      livre = await semTravas(await loadProfile());
    } catch {
      $app.innerHTML = pageHead(catInfo.label, '', '#/map') + errorBox('Erro ao carregar o mapa.');
      bindBack(); return bindRetry();
    }
    const { area, topico } = findTopico(topicoId);
    const cap = topico?.capitulos?.find((c) => c.tipo === categoria);
    const titulo = cap?.titulo || (categoria === 'extra' ? 'Exercícios' : 'Fixação');

    let html = pageHead(titulo, [area?.titulo, topico?.titulo].filter(Boolean).join(' · '), '#/map');
    if (!qs.length) {
      html += `<div class="card muted" style="margin-top:20px">${catInfo.vazio}</div>`;
      $app.innerHTML = html; return bindBack();
    }
    const feitas = qs.filter((q) => q.respondida_corretamente).length;
    html += `<div class="card row" style="margin:8px 0 4px"><span style="color:var(--gold)">${ICON.edit.replace('<svg', '<svg width="22" height="22"')}</span>
      <span style="font-weight:800">${catInfo.label}</span><span class="spacer"></span>
      <span class="muted" style="font-weight:800">${feitas}/${qs.length}</span></div>`;
    const nodes = qs.map((q, i) => ({
      titulo: `Fase ${i + 1}`,
      icon: 'play',
      concluido: !!q.respondida_corretamente,
      desbloqueado: livre || i === 0 || !!qs[i - 1].respondida_corretamente || !!q.respondida_corretamente,
    }));
    html += trailHtml(nodes);
    $app.innerHTML = html;
    bindBack();
    drawTrails();
    $app.querySelectorAll('[data-node]').forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.node;
        if (!nodes[i].desbloqueado) return toast('Conclua a fase anterior para desbloquear.');
        go(`#/t/${encodeURIComponent(topicoId)}/q/${categoria}/${i}`);
      };
    });
    const atual = nodes.findIndex((n) => !n.concluido);
    if (atual > 1) {
      const el = $app.querySelectorAll('[data-node]')[atual];
      el && el.scrollIntoView({ block: 'center' });
    }
  }

  // ---------- Exercício ----------
  let exTimer = null;
  async function viewExercicio(topicoId, categoria, idx) {
    idx = +idx;
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let qs, livre;
    try {
      await Promise.all([loadCurriculo(), loadProfile()]);
      qs = await getQuestions(topicoId, categoria);
      livre = await semTravas(S.profile);
    } catch {
      $app.innerHTML = errorBox('Erro ao carregar a questão.'); return bindRetry();
    }
    const q = qs[idx];
    const trilhaHash = `#/t/${encodeURIComponent(topicoId)}/trilha/${categoria}`;
    if (!q) return go(trilhaHash);
    if (!livre && idx > 0 && !qs[idx - 1].respondida_corretamente && !q.respondida_corretamente) return go(trilhaHash);

    const { area, topico } = findTopico(topicoId);
    let selecionada = null;
    let seg = 0;

    const cargasHtml = () => {
      const n = S.profile?.vidas ?? 0;
      return `<span class="cargas" title="${n} Cargas">${Array.from({ length: CFG.CARGAS_MAXIMAS }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
    };

    const isMC = q.tipo === 'multipla_escolha' && Array.isArray(q.opcoes);
    $app.innerHTML = `
      <div class="ex-top">
        <button class="back" data-back="${trilhaHash}" aria-label="Sair">${ICON.close}</button>
        <div class="title"><div class="k">${esc(area?.icone || '')} ${esc(area?.titulo || '')}</div>${esc(topico?.titulo || topicoId)} · Fase ${idx + 1}</div>
        <span class="timer" data-timer>00:00</span>
        ${cargasHtml()}
      </div>
      <div class="enunciado">${esc(q.enunciado)}</div>
      ${isMC
        ? `<div class="opts">${q.opcoes.map((o, i) => `
            <button class="opt" data-opt="${i}"><span class="letter">${LETRAS[i] || i + 1}</span><span class="txt">${esc(o)}</span></button>`).join('')}</div>`
        : `<label class="field"><span>Sua resposta</span><input type="text" data-text autocomplete="off"></label>`}
      <div class="bottom-cta"><button class="btn btn-primary btn-block" data-send>RESPONDER</button></div>`;
    bindBack();

    clearInterval(exTimer);
    const tEl = $app.querySelector('[data-timer]');
    exTimer = setInterval(() => {
      if (!document.body.contains(tEl)) return clearInterval(exTimer);
      seg++;
      tEl.textContent = `${String(Math.floor(seg / 60) % 60).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
    }, 1000);

    $app.querySelectorAll('[data-opt]').forEach((b) => {
      b.onclick = () => {
        $app.querySelectorAll('[data-opt]').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        selecionada = q.opcoes[+b.dataset.opt];
      };
    });
    const txt = $app.querySelector('[data-text]');
    if (txt) { txt.focus(); txt.onkeydown = (e) => { if (e.key === 'Enter') send.click(); }; }

    const send = $app.querySelector('[data-send]');
    send.onclick = async () => {
      const resposta = isMC ? selecionada : (txt.value || '').trim();
      if (!resposta) return toast('Escolha ou digite uma resposta');
      send.disabled = true; send.innerHTML = '<span class="spinner small"></span>';
      try {
        const r = await API.answer(q.id, resposta);
        if (r.acertou) {
          Object.assign(S.profile || {}, { xp: r.joules_totais, moedas: r.fotons_totais, nivel: r.nivel_atual });
          q.respondida_corretamente = true;
        } else {
          try { S.profile = await API.loseCharge(); } catch { /* não bloqueia o resultado */ }
        }
        clearInterval(exTimer);
        viewResultado(r, trilhaHash);
      } catch (e) {
        toast('Erro ao enviar resposta: ' + e.message);
        send.disabled = false; send.textContent = 'RESPONDER';
      }
    };
  }

  // ---------- Resultado ----------
  function viewResultado(r, backHash) {
    const cor = r.acertou ? 'var(--success)' : 'var(--error)';
    $app.innerHTML = `
      <div class="result">
        <div class="badge" style="background:${r.acertou ? 'rgba(76,217,123,.15)' : 'rgba(255,92,122,.15)'};color:${cor}">${r.acertou ? ICON.check : ICON.close}</div>
        <h2 style="color:${cor}">${r.acertou ? 'Mandou bem!' : 'Quase lá!'}</h2>
        <div class="answer-box"><div class="k">RESPOSTA CORRETA</div><div style="font-weight:800;margin-top:4px">${esc(r.resposta_correta)}</div></div>
        <div class="rewards">
          <span class="chip"><span style="color:var(--gold)">${ICON.bolt}</span>+${r.xp_ganho} J</span>
          ${r.moedas_ganhas > 0 ? `<span class="chip"><span style="color:var(--gold-deep)">${ICON.spark}</span>+${r.moedas_ganhas}</span>` : ''}
          ${!r.acertou ? `<span class="chip"><span style="color:var(--cyan)">${ICON.battery}</span>−1 Carga</span>` : ''}
        </div>
        ${r.capitulo_desbloqueado ? `<div class="unlock"><div class="k">CAPÍTULO CONCLUÍDO!</div>
          <div class="small">Bônus de +${r.bonus_capitulo_ganho} J · Próximo capítulo e Treino/Prova liberados!</div></div>` : ''}
        ${r.explicacao ? `<div class="card explain"><div class="k">EXPLICAÇÃO</div><div class="prose">${esc(r.explicacao)}</div></div>` : ''}
        <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>CONTINUAR</button></div>
      </div>`;
    $app.querySelector('[data-ok]').onclick = () => go(backHash);
    window.scrollTo(0, 0);
  }

  // ---------- Prova: estatísticas ----------
  async function viewProvaStats(topicoId) {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let att;
    try {
      await loadCurriculo();
      att = await API.getAttempts(topicoId);
    } catch {
      $app.innerHTML = pageHead('Prova', '', '#/map') + errorBox('Erro ao carregar estatísticas.');
      bindBack(); return bindRetry();
    }
    const { topico } = findTopico(topicoId);
    const fin = att.filter((a) => a.finalizado_em);
    let html = pageHead(`${topico?.titulo || topicoId} · Prova`, '', '#/map');
    html += `<button class="btn btn-primary btn-block" data-start style="margin:8px 0 22px">${fin.length ? '↻ Tentar novamente' : 'Iniciar prova'}</button>`;
    html += `<div style="font-weight:800;margin-bottom:10px">Histórico (${fin.length} ${fin.length === 1 ? 'tentativa' : 'tentativas'})</div>`;
    if (!fin.length) html += `<p class="muted" style="text-align:center;padding:20px 0">Nenhuma tentativa concluída ainda.</p>`;
    html += fin.map((a) => {
      const total = (a.acertos || 0) + (a.erros || 0);
      const media = total && a.tempo_total_segundos != null ? a.tempo_total_segundos / total : null;
      return `<div class="card attempt" style="margin-bottom:10px">
        <div class="top"><span>${fmtData(a.iniciado_em)}</span><span class="tag ${a.modo === 'dificil' ? 'hard' : ''}">${a.modo === 'dificil' ? 'Modo difícil' : 'Modo fácil'}</span></div>
        <div class="kv"><span>Acertos <b style="color:var(--success)">${a.acertos ?? 0}</b></span><span>Erros <b style="color:var(--error)">${a.erros ?? 0}</b></span>
        <span>Tempo total <b>${fmtSeg(a.tempo_total_segundos)}</b></span></div>
        ${media != null ? `<div class="small muted">≈ ${fmtSeg(media)} por questão</div>` : ''}
      </div>`;
    }).join('');
    $app.innerHTML = html;
    bindBack();
    $app.querySelector('[data-start]').onclick = async () => {
      const modo = await modal({
        title: 'Como você quer fazer a prova?',
        buttons: [],
        html: `<div class="stack" style="text-align:left">
          <button class="card btn-block" data-custom="facil" style="cursor:pointer;text-align:left;color:var(--cream);font:inherit">
            <div style="font-weight:900">Fácil</div><div class="small muted">Sem restrições — pode usar o computador normalmente.</div></button>
          <button class="card btn-block" data-custom="dificil" style="cursor:pointer;text-align:left;color:var(--cream);font:inherit">
            <div style="font-weight:900;color:var(--error)">Difícil</div><div class="small muted">Tela cheia, exige internet desligada durante a prova, e avisa se você tentar sair sem terminar.</div></button>
        </div>`,
      });
      if (modo === 'facil' || modo === 'dificil') {
        // Tela cheia precisa ser pedida dentro do clique do usuário.
        if (modo === 'dificil' && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        go(`#/t/${encodeURIComponent(topicoId)}/prova/run/${modo}`);
      }
    };
  }

  // ---------- Prova: execução ----------
  // Mesmo fluxo do exam_screen.dart: a correção só acontece no backend ao
  // finalizar. No modo difícil: baixa online → exige offline para
  // responder → pede para reconectar só para enviar.
  let examCleanup = null;
  async function viewProvaRun(topicoId, modo) {
    const statsHash = `#/t/${encodeURIComponent(topicoId)}/prova`;
    const dificil = modo === 'dificil';
    document.body.classList.add('exam-mode');
    $app.className = 'app no-nav exam';
    try { await loadCurriculo(); } catch { /* só o título */ }
    const { topico } = findTopico(topicoId);
    const titulo = `${topico?.titulo || topicoId} · Prova`;

    const E = {
      fase: dificil ? (navigator.onLine ? 'baixando' : 'aguardandoOnlineInicial') : 'baixando',
      attemptId: null, questoes: [], respostas: {}, atual: 0,
      inicio: 0, tempoQ: {}, entrouEm: 0, saidas: 0, resultado: null, erro: null, enviando: false,
    };

    const registrarTempo = () => {
      if (!E.entrouEm) return;
      E.tempoQ[E.atual] = (E.tempoQ[E.atual] || 0) + Math.round((Date.now() - E.entrouEm) / 1000);
      E.entrouEm = Date.now();
    };
    const emAndamento = () => ['emAndamento', 'aguardandoOffline', 'aguardandoOnline'].includes(E.fase) || (!dificil && E.fase === 'respondendo');

    const onBeforeUnload = (e) => { if (emAndamento() && !E.resultado) { e.preventDefault(); e.returnValue = ''; } };
    const onOnline = () => { if (E.fase === 'aguardandoOnlineInicial') baixar(); else paint(); };
    const onOffline = () => { if (E.fase === 'aguardandoOffline') { E.fase = 'emAndamento'; E.entrouEm = Date.now(); } paint(); };
    const onVisibility = () => {
      if (dificil && document.hidden && E.fase === 'emAndamento') { E.saidas++; }
      if (!document.hidden) paint();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisibility);
    examCleanup = () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisibility);
      document.body.classList.remove('exam-mode');
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
      examCleanup = null;
    };

    async function sair() {
      if (!E.resultado && E.attemptId && !E.erro) {
        const ok = await modal({
          light: true, title: 'Sair da prova?',
          text: 'Se você sair agora, todo o progresso e a pontuação desta tentativa serão perdidos.',
          buttons: [{ label: 'Continuar prova', value: false, cls: 'btn-dark' }, { label: 'Sair mesmo assim', value: true, cls: 'btn-outline' }],
        });
        if (!ok) return;
      }
      go(statsHash);
    }

    async function baixar() {
      E.fase = 'baixando'; E.erro = null; paint();
      try {
        const r = await API.startExam(topicoId, modo);
        E.attemptId = r.attempt_id;
        E.questoes = r.questoes || [];
        E.inicio = Date.now();
        E.entrouEm = Date.now();
        E.fase = dificil ? (navigator.onLine ? 'aguardandoOffline' : 'emAndamento') : 'respondendo';
      } catch (e) {
        E.fase = 'erro';
        E.erro = e.status === 404 ? 'Nenhuma questão de prova cadastrada para este tópico.' : 'Erro ao iniciar a prova. ' + e.message;
      }
      paint();
    }

    async function confirmarFinalizar() {
      registrarTempo();
      const falta = E.questoes.length - Object.keys(E.respostas).length;
      const ok = await modal({
        light: true, title: 'Finalizar prova?',
        text: falta > 0
          ? `Você ainda tem ${falta} questão(ões) sem resposta. Depois de finalizar não é possível mudar nenhuma resposta.`
          : 'Todas as questões foram respondidas. Depois de finalizar não é possível mudar nenhuma resposta.',
        buttons: [{ label: 'Revisar', value: false, cls: 'btn-outline' }, { label: 'Finalizar', value: true, cls: 'btn-dark' }],
      });
      if (!ok) return;
      if (dificil && !navigator.onLine) { E.fase = 'aguardandoOnline'; return paint(); }
      enviar();
    }

    async function enviar() {
      if (E.enviando) return;
      if (!navigator.onLine) { toast('Ainda sem internet — tente de novo.'); return; }
      E.enviando = true; paint();
      const respostas = Object.entries(E.respostas).map(([i, resp]) => ({
        question_id: E.questoes[+i].id, resposta: resp, tempo_segundos: E.tempoQ[i] || 0,
      }));
      try {
        E.resultado = await API.finishExam(E.attemptId, respostas, Math.round((Date.now() - E.inicio) / 1000));
        E.fase = 'finalizada';
        toast('Prova enviada com sucesso!');
      } catch (e) {
        toast('Erro ao enviar a prova: ' + e.message);
      }
      E.enviando = false;
      paint();
    }

    function phase(title, text, btn) {
      return `<div class="phase">${btn === 'spinner' ? '<div class="spinner"></div>' : ''}<h3>${esc(title)}</h3><p>${esc(text)}</p>
        ${btn && btn !== 'spinner' ? `<button class="btn btn-dark" data-phase>${E.enviando ? '<span class="spinner small"></span>' : esc(btn)}</button>` : ''}</div>`;
    }

    function paint() {
      if (!location.hash.includes('/prova/run/')) return;
      let body = '';
      const head = `<div class="pagehead"><button class="back" data-exit aria-label="Sair">${ICON.close}</button><h2>${esc(titulo)}${dificil ? ' <span class="tag hard">DIFÍCIL</span>' : ''}</h2></div>`;
      switch (E.fase) {
        case 'aguardandoOnlineInicial':
          body = phase('Ative a internet para baixar a prova', 'No modo difícil, a internet só é necessária agora (pra baixar as questões) e no final (pra enviar).', 'Verificar novamente'); break;
        case 'baixando':
          body = phase('Baixando a prova...', dificil ? 'Depois disso você vai poder desligar a internet pra começar.' : '', 'spinner'); break;
        case 'aguardandoOffline':
          body = phase('Desative a internet para continuar', 'O modo difícil exige que o Wi-Fi e os dados estejam desligados enquanto você responde. Suas respostas ficam salvas nesta página.', 'Verificar novamente'); break;
        case 'aguardandoOnline':
          body = phase('Reative a internet para enviar', 'Suas respostas continuam salvas. Ligue o Wi-Fi ou os dados e toque em enviar.', 'Enviar prova'); break;
        case 'erro':
          body = `<div class="phase"><h3>Não foi possível iniciar</h3><p>${esc(E.erro)}</p><button class="btn btn-dark" data-retry-exam>Tentar novamente</button></div>`; break;
        case 'finalizada': {
          const r = E.resultado;
          const total = (r.acertos || 0) + (r.erros || 0);
          body = `<div class="phase" style="padding-top:6vh"><h3>Prova finalizada</h3></div>
            <div class="res-line"><span>Acertos</span><span>${r.acertos ?? 0}</span></div>
            <div class="res-line"><span>Erros</span><span>${r.erros ?? 0}</span></div>
            <div class="res-line"><span>Tempo total</span><span>${fmtSeg(r.tempo_total_segundos)}</span></div>
            ${total ? `<div class="res-line"><span>Tempo médio por questão</span><span>${fmtSeg(r.tempo_total_segundos / total)}</span></div>` : ''}
            <div class="nav"><button class="btn btn-dark" data-done>Voltar à trilha</button></div>`;
          break;
        }
        default: { // respondendo / emAndamento
          if (dificil && navigator.onLine && E.fase === 'emAndamento') {
            body = phase('Desative a internet para continuar', 'A conexão voltou. Desligue o Wi-Fi/dados para continuar respondendo.', 'Verificar novamente');
            break;
          }
          const q = E.questoes[E.atual];
          const resp = E.respostas[E.atual];
          const ult = E.atual === E.questoes.length - 1;
          const isMC = q.tipo === 'multipla_escolha' && Array.isArray(q.opcoes);
          body = `
            ${dificil && E.saidas > 0 ? `<div class="warn-bar">Você saiu da tela da prova ${E.saidas} vez(es). Mantenha esta aba aberta até finalizar.</div>` : ''}
            <div class="qhead"><span>Questão ${E.atual + 1} de ${E.questoes.length}</span>
              <button class="btn btn-outline" style="padding:8px 12px" data-grid>${ICON.grid.replace('<svg', '<svg width="16" height="16"')} Todas as questões</button></div>
            <div class="enun">${esc(q.enunciado)}</div>
            ${isMC ? `<div class="opts">${q.opcoes.map((o, i) => `<button class="opt ${resp === o ? 'sel' : ''}" data-opt="${i}"><span class="letter">${LETRAS[i] || i + 1}</span><span class="txt">${esc(o)}</span></button>`).join('')}</div>`
              : `<label class="field"><span style="color:#555">Sua resposta</span><input type="text" data-text value="${esc(resp || '')}" autocomplete="off"></label>`}
            <div class="nav">
              <button class="btn btn-outline" data-prev ${E.atual === 0 ? 'disabled' : ''}>Anterior</button>
              <button class="btn btn-dark" data-next>${ult ? 'Finalizar' : 'Próxima'}</button>
            </div>`;
        }
      }
      $app.innerHTML = head + body;

      $app.querySelector('[data-exit]').onclick = sair;
      const ph = $app.querySelector('[data-phase]');
      if (ph) ph.onclick = () => {
        if (E.fase === 'aguardandoOnlineInicial') { if (navigator.onLine) baixar(); else toast('Ainda sem internet — tente de novo.'); }
        else if (E.fase === 'aguardandoOnline') enviar();
        else if (!navigator.onLine) { E.fase = 'emAndamento'; E.entrouEm = Date.now(); paint(); }
        else toast('Ainda detectamos internet ativa.');
      };
      const rt = $app.querySelector('[data-retry-exam]'); if (rt) rt.onclick = baixar;
      const dn = $app.querySelector('[data-done]'); if (dn) dn.onclick = () => go(statsHash);
      $app.querySelectorAll('[data-opt]').forEach((b) => {
        b.onclick = () => { E.respostas[E.atual] = E.questoes[E.atual].opcoes[+b.dataset.opt]; paint(); };
      });
      const tx = $app.querySelector('[data-text]');
      if (tx) tx.oninput = () => { const v = tx.value.trim(); if (v) E.respostas[E.atual] = v; else delete E.respostas[E.atual]; };
      const irPara = (i) => { registrarTempo(); E.atual = i; paint(); window.scrollTo(0, 0); };
      const pv = $app.querySelector('[data-prev]'); if (pv) pv.onclick = () => irPara(E.atual - 1);
      const nx = $app.querySelector('[data-next]');
      if (nx) nx.onclick = () => (E.atual === E.questoes.length - 1 ? confirmarFinalizar() : irPara(E.atual + 1));
      const gr = $app.querySelector('[data-grid]');
      if (gr) gr.onclick = async () => {
        const v = await modal({
          light: true, title: 'Todas as questões', text: 'Clique em um número para ir direto pra questão.', buttons: [],
          html: `<div class="qgrid">${E.questoes.map((_, i) => `<button data-custom="${i}" class="${E.respostas[i] !== undefined ? 'ans' : ''} ${i === E.atual ? 'cur' : ''}">${i + 1}</button>`).join('')}</div>`,
        });
        if (v !== undefined) irPara(+v);
      };
    }

    if (E.fase === 'baixando') baixar(); else paint();
  }

  // ---------- Vídeos ----------
  async function viewVideos() {
    $app.innerHTML = `<div class="pagehead"><h2>Vídeos</h2></div>` + loading() + bottomNav('videos');
    let vids;
    try { vids = await API.getVideos(); } catch {
      $app.innerHTML = `<div class="pagehead"><h2>Vídeos</h2></div>` + errorBox('Erro ao carregar os vídeos.') + bottomNav('videos');
      return bindRetry();
    }
    const curtas = vids.filter((v) => v.tipo_video === 'curta_cotidiano');
    const aulas = vids.filter((v) => v.tipo_video === 'aula_completa' && v.desbloqueado);
    const thumb = (v) => v.thumbnail_url || youtubeThumb(v.url_video);
    const dur = (s) => (s >= 60 ? `${Math.floor(s / 60)} min` : `${s}s`);

    let html = `<div class="pagehead"><h2>Vídeos</h2></div>`;
    if (curtas.length) {
      html += `<div class="section-title">Física no seu dia a dia</div><div class="carousel">${curtas.map((v) => `
        <button class="vcard ${v.desbloqueado ? '' : 'locked'}" data-v="${v.id}">
          <div class="thumb" style="${thumb(v) ? `background-image:url('${esc(thumb(v))}')` : ''}">
            ${v.desbloqueado ? ICON.playCircle : ICON.lock}
            ${v.assistido ? `<span class="watched">${ICON.check}</span>` : ''}
          </div>
          <div class="meta">${esc(v.titulo)}${!v.desbloqueado ? `<div class="small muted">Nível ${v.nivel_desbloqueio}</div>` : ''}</div>
        </button>`).join('')}</div>`;
    }
    if (aulas.length) {
      html += `<div class="section-title">Aulas completas</div><div class="vlist">${aulas.map((v) => `
        <button class="vtile" data-v="${v.id}">
          <span class="thumb" style="${thumb(v) ? `background-image:url('${esc(thumb(v))}')` : ''}">${thumb(v) ? '' : ICON.playCircle}</span>
          <span><span class="t">${esc(v.titulo)}</span>
          <span class="small muted" style="display:block">${v.duracao_segundos ? dur(v.duracao_segundos) : ''}${v.assistido ? ' · ✓ Assistido' : ''}</span>
          ${v.descricao ? `<span class="small muted" style="display:block">${esc(v.descricao)}</span>` : ''}</span>
        </button>`).join('')}</div>`;
    }
    if (!curtas.length && !aulas.length) html += `<p class="muted" style="text-align:center;padding:32px">Nenhum vídeo disponível ainda.</p>`;
    html += bottomNav('videos');
    $app.innerHTML = html;

    $app.querySelectorAll('[data-v]').forEach((b) => {
      b.onclick = () => {
        const v = vids.find((x) => String(x.id) === b.dataset.v);
        if (!v.desbloqueado) return toast(`Esse vídeo desbloqueia no nível ${v.nivel_desbloqueio}. Continue completando exercícios para subir de nível!`, 4000);
        API.markWatched(v.id).catch(() => {});
        const w = window.open(v.url_video, '_blank', 'noopener');
        if (!w) toast('Não foi possível abrir o vídeo.');
        v.assistido = true;
      };
    });
  }

  // ---------- Perfil ----------
  async function viewProfile() {
    $app.innerHTML = `<div class="pagehead"><h2>Perfil</h2></div>` + loading() + bottomNav('perfil');
    let u;
    try { u = await loadProfile(true); } catch {
      $app.innerHTML = `<div class="pagehead"><h2>Perfil</h2></div>` + errorBox('Erro ao carregar o perfil.') + bottomNav('perfil');
      return bindRetry();
    }
    const plusSt = await Plus.status(u).catch(() => ({}));
    const plusAtivo = !!plusSt.ativo;
    const xpNoNivel = (u.xp ?? 0) % CFG.XP_POR_NIVEL;
    let proxima = '';
    if ((u.vidas ?? 0) < CFG.CARGAS_MAXIMAS && u.vidas_atualizado_em) {
      const alvo = new Date(u.vidas_atualizado_em).getTime() + CFG.HORAS_RECARGA * 3600e3;
      const rest = Math.max(0, alvo - Date.now());
      const h = Math.floor(rest / 3600e3), m = Math.floor((rest % 3600e3) / 60e3);
      proxima = `Próxima Carga em ${h}h ${String(m).padStart(2, '0')}min`;
    }
    $app.innerHTML = `
      <div class="pagehead"><h2>Perfil</h2><button class="btn btn-danger" style="padding:8px 14px" data-logout>Sair</button></div>
      <div class="profile-grid"><div class="pcol">
      <div class="profile-hero">
        <div class="avatar"><span class="lvl-badge">N${u.nivel ?? 1}</span></div>
        <div class="name">${esc(nomeExibicao(u))}<button data-edit aria-label="Editar nome">${ICON.pencil}</button></div>
        <div class="small muted">${esc(u.email || '')}</div>
      </div>
      </div><div class="pcol">
      <div class="card xp-card">
        <div class="row"><b>Nível ${u.nivel ?? 1}</b><span class="spacer"></span><span class="small muted">${xpNoNivel} / ${CFG.XP_POR_NIVEL} J para o próximo nível</span></div>
        <div class="xpbar"><i style="width:${(xpNoNivel / CFG.XP_POR_NIVEL) * 100}%"></i></div>
      </div>
      <div class="stats-grid" style="margin-top:12px">
        <div class="card"><span style="color:var(--cyan)">${ICON.battery}</span><div class="v">${u.vidas ?? 0}</div><div class="k">Cargas</div></div>
        <div class="card"><span style="color:var(--gold)">${ICON.bolt}</span><div class="v">${u.xp ?? 0} J</div><div class="k">Joules</div></div>
        <div class="card"><span style="color:var(--gold-deep)">${ICON.spark}</span><div class="v">${u.moedas ?? 0}</div><div class="k">Fótons</div></div>
      </div>
      ${proxima ? `<p class="small muted" style="text-align:center;margin:10px 0 0">${proxima}</p>` : ''}
      <a class="card plus-profile ${plusAtivo ? 'on' : ''}" href="#/plus">
        <span class="ic">${ICON.crown}</span>
        <div style="flex:1"><b>LevelUp Plus</b><div class="small muted">${plusAtivo ? esc(validadePlus(plusSt)) : 'Dúvidas com o professor, plantões e aulas com desconto'}</div></div>
        <span class="tag ${plusAtivo ? 'ok' : ''}">${plusAtivo ? 'ATIVO' : 'CONHEÇA'}</span>
      </a>
      </div></div>
      ${bottomNav('perfil')}`;

    $app.querySelector('[data-logout]').onclick = doLogout;
    $app.querySelector('[data-edit]').onclick = async () => {
      const nome = await modal({
        title: 'Seu nome', input: { value: u.nome || '', placeholder: 'Como podemos te chamar?' },
        buttons: [{ label: 'Cancelar', value: undefined }, { label: 'Salvar', value: true, cls: 'btn-primary' }],
      });
      if (nome === undefined || !nome.trim()) return;
      try { await API.updateNome(nome.trim()); S.profile.nome = nome.trim(); viewProfile(); } catch {
        toast('Não foi possível salvar o nome agora.');
      }
    };
  }

  // ================================================================
  // LevelUp Plus (dados em js/plus.js)
  // ================================================================
  const PC = Plus.cfg;
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const DIAS_SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const DIAS_LONGO = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtSlot = (s) => {
    const d = Plus.parseSlot(s);
    return `${DIAS_LONGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} · ${s.split('T')[1]}`;
  };
  const fmtCurto = (iso) => {
    const d = new Date(iso);
    return `${d.getDate()} ${MESES[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const AULA_STATUS = {
    aguardando_pagamento: { label: 'Aguardando pagamento', cls: 'wait' },
    confirmada: { label: 'Confirmada', cls: 'ok' },
    cancelada: { label: 'Cancelada', cls: '' },
    expirada: { label: 'Reserva expirada', cls: '' },
    concluida: { label: 'Concluída', cls: '' },
    conflito: { label: 'Pagamento recebido · em análise', cls: 'wait' },
  };
  const demoBtn = (attr, label) => (Plus.demo
    ? `<button class="btn btn-text demo-btn" ${attr}>${esc(label)} <span class="tag">DEMO</span></button>` : '');

  async function plusStatus() {
    const u = await loadProfile();
    const st = await Plus.status(u);
    S.plusCache = { t: Date.now(), ativo: !!st.ativo };
    return { u, st };
  }
  // Telas só de assinante: quem não é volta para a página de venda.
  // Admin que NÃO é assinante pode só visualizar a área do assinante
  // (o backend continua recusando as ações de assinante para ele).
  const PREVIEW_KEY = 'lup.plus.preview';
  const emPreview = (st) => {
    try { return !!st.admin && !st.ativo && sessionStorage.getItem(PREVIEW_KEY) === '1'; } catch { return false; }
  };
  const setPreview = (v) => { try { if (v) sessionStorage.setItem(PREVIEW_KEY, '1'); else sessionStorage.removeItem(PREVIEW_KEY); } catch { /* ignore */ } };
  const fmtDia = (iso) => { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
  // Texto da validade do Plus, igual no Plus e no Perfil.
  function validadePlus(st) {
    if (!st.expira_em) return 'Assinatura ativa';
    const ate = fmtDia(st.expira_em);
    if (st.status === 'cancelada') return `Assinatura cancelada · acesso até ${ate}`;
    if (st.status === 'atrasada') return `Pagamento da renovação atrasado · acesso até ${ate}`;
    if (st.plano === 'mensal') return `Plano mensal · renova até ${ate}`;
    if (st.plano === 'semestral') return `Plano de 6 meses · válido até ${ate}`;
    return `Acesso liberado até ${ate}`;
  }

  async function exigirPlus() {
    const r = await plusStatus();
    if (!r.st.ativo && !emPreview(r.st)) { go('#/plus'); return null; }
    return r;
  }

  // ---------- Plus: venda ou área do assinante ----------
  async function viewPlus() {
    $app.innerHTML = topStats(S.profile) + loading() + bottomNav('plus');
    let u, st;
    try { ({ u, st } = await plusStatus()); } catch {
      $app.innerHTML = topStats(S.profile) + errorBox('Erro ao carregar o LevelUp Plus.') + bottomNav('plus');
      return bindRetry();
    }
    if (st.ativo || emPreview(st)) return viewPlusMembro(u, st);

    const pct = Math.round(PC.AULA_DESCONTO_PLUS * 100);
    const planos = PC.PLANOS || [];
    let planoSel = planos[0];
    const beneficios = [
      ['phone', 'App com conteúdo e simulações', 'Tudo que você já usa no LevelUp Fís: trilhas, resumos, exercícios e simulações físicas.'],
      ['chat', 'Comunidade de alunos', 'Grupo exclusivo no WhatsApp para trocar ideias, resoluções e se ajudar.'],
      ['question', `Dúvidas respondidas em até ${PC.PRAZO_RESPOSTA_HORAS}h`, `Mande sua dúvida pelo site e receba a explicação do professor. ${PC.HORARIO_SUPORTE}.`],
      ['live', '1 plantão ao vivo por mês', 'Encontro em grupo, ao vivo, para tirar dúvidas coletivas antes das provas.'],
      ['flag', 'Desafios mensais', 'Um problema novo todo mês para manter o ritmo e testar o que você aprendeu.'],
      ['tag', `${pct}% de desconto em aulas particulares`, 'Desconto de assinante em todas as aulas individuais com o professor.'],
    ];
    $app.innerHTML = topStats(u) + `
      <div class="plus-layout">
        <div class="plus-main">
          ${st.admin ? `<div class="card admin-bar"><span class="small"><b>Você é o administrador</b> e não tem assinatura ativa — por isso vê a página de venda, como um aluno comum.</span>
            <button class="btn btn-ghost" data-preview>Visualizar área do assinante</button></div>` : ''}
          <section class="plus-hero">
            <span class="plus-badge">${ICON.crown} LevelUp Plus</span>
            <h1>Física com acompanhamento de perto</h1>
            <p>O app te leva pela trilha. No Plus, o professor caminha junto: dúvidas respondidas, plantões ao vivo e aulas particulares com desconto.</p>
          </section>
          <div class="benefits">${beneficios.map(([ic, t, d]) => `
            <div class="benefit"><span class="ic">${ICON[ic]}</span><div><div class="t">${esc(t)}</div><div class="small muted">${esc(d)}</div></div></div>`).join('')}
          </div>
        </div>
        <aside class="plus-side">
          ${st.pendente ? `
            <div class="card pending-card">
              <div class="row"><span class="ic">${ICON.clock}</span><div><b>Pagamento em análise</b>
              <div class="small muted">Assim que a Hotmart confirmar, seu acesso ao Plus é liberado nesta conta (${esc(u.email || '')}). Normalmente leva poucas horas.</div></div></div>
              ${demoBtn('data-demo-ativar', 'Simular aprovação')}
            </div>` : ''}
          <div class="card checkout-card">
            <div class="section-title" style="margin-top:0">Escolha seu plano</div>
            <div class="prices" role="radiogroup" aria-label="Plano">${planos.map((p) => `
              <button class="price-card ${p === planoSel ? 'on' : ''}" data-plano="${esc(p.id)}" role="radio" aria-checked="${p === planoSel}">
                <span class="radio"></span>
                <div class="k">${esc(p.nome)}</div>
                <div class="v">${esc(p.preco)}<small>${esc(p.sufixo || '')}</small></div>
                <div class="small muted">${esc(p.obs || '')}</div>
              </button>`).join('')}
            </div>
            <button class="btn btn-primary btn-block btn-lg" data-assinar>${ICON.crown} <span data-cta></span></button>
            <p class="small muted" style="text-align:center;margin:8px 0 0">Pagamento seguro pela Hotmart · Pix, cartão ou boleto.<br>Use o mesmo e-mail da sua conta: ${esc(u.email || '')}</p>
            ${!st.pendente ? demoBtn('data-demo-ativar', 'Ver como assinante') : ''}
          </div>
          <div class="card upsell">
            <div class="row"><span class="ic">${ICON.calendar}</span><div><b>Só quer uma aula particular?</b>
            <div class="small muted">Aula avulsa por ${brl(PC.AULA_VALOR)}. Assinantes têm ${pct}% de desconto.</div></div></div>
            <a class="btn btn-ghost btn-block" href="#/plus/agendar" style="margin-top:12px">Ver horários disponíveis</a>
          </div>
        </aside>
      </div>
      ${bottomNav('plus')}`;

    const cta = $app.querySelector('[data-cta]');
    const pintarPlano = () => {
      $app.querySelectorAll('[data-plano]').forEach((b) => {
        const on = b.dataset.plano === planoSel.id;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on);
      });
      cta.textContent = `Assinar ${planoSel.nome} · ${planoSel.preco}`;
    };
    pintarPlano();
    $app.querySelectorAll('[data-plano]').forEach((b) => {
      b.onclick = () => { planoSel = planos.find((p) => p.id === b.dataset.plano); pintarPlano(); };
    });
    $app.querySelector('[data-assinar]').onclick = async () => {
      const ref = `plus-${planoSel.id}-${(API.Session.get() || {}).user_id || ''}`;
      window.open(Plus.checkout(planoSel.checkout, { nome: u.nome, ref }), '_blank', 'noopener');
      await Plus.marcarAssinaturaPendente();
      viewPlus();
    };
    const da = $app.querySelector('[data-demo-ativar]');
    if (da) da.onclick = async () => { await Plus.demoAtivar(true); toast('Bem-vindo ao Plus! (demonstração)'); viewPlus(); };
    const pv = $app.querySelector('[data-preview]');
    if (pv) pv.onclick = () => { setPreview(true); viewPlus(); };
  }

  async function viewPlusMembro(u, st = {}) {
    const preview = !st.ativo;
    let duvidas = [], aulas = [];
    try { [duvidas, aulas] = await Promise.all([Plus.listarDuvidas(), Plus.listarAulas()]); } catch { /* cartões ficam vazios */ }
    const aguardando = duvidas.filter((d) => d.status === 'aguardando').length;
    const agora = Plus.slotKey(new Date());
    const proxima = aulas.find((a) => a.inicio >= agora && ['confirmada', 'aguardando_pagamento'].includes(a.status));
    const plantao = PC.PLANTAO && PC.PLANTAO.data ? PC.PLANTAO : null;
    const desafio = PC.DESAFIO && PC.DESAFIO.titulo ? PC.DESAFIO : null;

    $app.innerHTML = topStats(u) + `
      ${preview ? `<div class="card admin-bar warn"><span class="small"><b>Visualização do administrador.</b> Você NÃO é assinante: enviar dúvidas e ter o desconto nas aulas continuam bloqueados para esta conta.</span>
        <button class="btn btn-ghost" data-sair-preview>Sair da visualização</button></div>` : ''}
      <section class="plus-hero member">
        <span class="plus-badge">${ICON.crown} ${preview ? 'Visualização' : 'Plus ativo'}</span>
        <h1>Olá, ${esc(nomeExibicao(u))}!</h1>
        <p>${preview ? 'É assim que os assinantes veem esta área.' : esc(validadePlus(st))}</p>
      </section>
      <div class="actions-grid">
        <a class="action-tile" href="${esc(PC.WHATSAPP_COMUNIDADE)}" target="_blank" rel="noopener">
          <span class="ic green">${ICON.chat}</span><span class="t">Acesse a comunidade</span><span class="small muted">Grupo de alunos no WhatsApp</span></a>
        <a class="action-tile" href="#/plus/duvidas">
          <span class="ic">${ICON.question}</span><span class="t">Dúvidas</span>
          <span class="small muted">${aguardando ? `${aguardando} aguardando resposta` : `Resposta em até ${PC.PRAZO_RESPOSTA_HORAS}h`}</span></a>
        <a class="action-tile" href="#/plus/agendar">
          <span class="ic">${ICON.calendar}</span><span class="t">Agendar aula</span>
          <span class="small muted">${Math.round(PC.AULA_DESCONTO_PLUS * 100)}% de desconto de assinante</span></a>
      </div>

      <div class="plus-cols">
        <div class="card info-card">
          <div class="row"><span class="ic">${ICON.calendar}</span><div style="flex:1"><div class="k">SUA PRÓXIMA AULA</div>
          ${proxima
            ? `<b>${esc(fmtSlot(proxima.inicio))}</b><div style="margin-top:6px"><span class="tag ${AULA_STATUS[proxima.status].cls}">${AULA_STATUS[proxima.status].label}</span></div>`
            : '<b>Nenhuma aula marcada</b><div class="small muted">Agende pelo botão “Agendar aula” acima.</div>'}</div></div>
          <a class="btn btn-ghost btn-block" href="#/plus/aulas">Minhas aulas</a>
        </div>
      ${plantao ? `
        <div class="card info-card">
          <div class="row"><span class="ic">${ICON.live}</span><div style="flex:1"><div class="k">PLANTÃO AO VIVO DO MÊS</div>
          <b>${esc(fmtCurto(plantao.data))}</b>${plantao.tema ? `<div class="small muted">${esc(plantao.tema)}</div>` : ''}</div></div>
          ${plantao.link ? `<a class="btn btn-ghost btn-block" href="${esc(plantao.link)}" target="_blank" rel="noopener">Entrar no plantão</a>` : ''}
        </div>` : ''}
      ${desafio ? `
        <div class="card info-card wide">
          <div class="row"><span class="ic">${ICON.flag}</span><div style="flex:1"><div class="k">DESAFIO DO MÊS${desafio.prazo ? ` · ATÉ ${esc(desafio.prazo.split('-').reverse().slice(0, 2).join('/'))}` : ''}</div>
          <b>${esc(desafio.titulo)}</b></div></div>
          <div class="prose" style="font-size:15px">${esc(desafio.texto)}</div>
          <a class="btn btn-ghost btn-block" href="${esc(PC.WHATSAPP_COMUNIDADE)}" target="_blank" rel="noopener">Enviar resolução na comunidade</a>
        </div>` : ''}
      </div>
      ${Plus.demo ? `<div style="text-align:center">${demoBtn('data-demo-sair', 'Voltar a ver como não assinante')}</div>` : ''}
      ${bottomNav('plus')}`;
    const sp = $app.querySelector('[data-sair-preview]');
    if (sp) sp.onclick = () => { setPreview(false); viewPlus(); };
    const ds = $app.querySelector('[data-demo-sair]');
    if (ds) ds.onclick = async () => { await Plus.demoAtivar(false); viewPlus(); };
  }

  // ---------- Dúvidas ----------
  async function viewDuvidas() {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let lista;
    try { if (!(await exigirPlus())) return; lista = await Plus.listarDuvidas(); } catch {
      $app.innerHTML = pageHead('Dúvidas', 'LevelUp Plus', '#/plus') + errorBox('Erro ao carregar suas dúvidas.');
      bindBack(); return bindRetry();
    }
    const prazo = (d) => new Date(new Date(d.criada_em).getTime() + PC.PRAZO_RESPOSTA_HORAS * 3600e3);
    $app.innerHTML = pageHead('Dúvidas', 'LevelUp Plus', '#/plus') + `
      <div class="card row" style="margin:8px 0 14px"><span class="ic-sm">${ICON.clock}</span>
        <div class="small">Respostas em até <b>${PC.PRAZO_RESPOSTA_HORAS}h</b> · ${esc(PC.HORARIO_SUPORTE)}</div></div>
      <a class="btn btn-primary btn-block" href="#/plus/duvidas/nova">+ Nova dúvida</a>
      <div class="section-title">Suas dúvidas (${lista.length})</div>
      ${lista.length ? `<div class="card-list">${lista.map((d) => `
        <a class="card doubt" href="#/plus/duvidas/${esc(d.id)}">
          <div class="top"><span class="tag ${d.status === 'respondida' ? 'ok' : 'wait'}">${d.status === 'respondida' ? 'Respondida' : 'Aguardando'}</span>
            ${d.topico ? `<span class="small muted">${esc(d.topico)}</span>` : ''}<span class="spacer"></span><span class="small muted">${esc(fmtCurto(d.criada_em))}</span></div>
          <div class="txt">${esc(d.texto)}</div>
          ${d.status !== 'respondida' ? `<div class="small muted">Resposta até ${esc(fmtCurto(prazo(d)))}</div>` : ''}
        </a>`).join('')}</div>` : `<p class="muted" style="text-align:center;padding:24px 0">Você ainda não mandou nenhuma dúvida.<br>Travou em algum exercício? Pergunta aqui!</p>`}`;
    bindBack();
  }

  async function viewNovaDuvida() {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    try { if (!(await exigirPlus())) return; await loadCurriculo().catch(() => {}); } catch {
      $app.innerHTML = errorBox('Erro ao carregar.'); return bindRetry();
    }
    const topicos = (S.curriculo || []).flatMap((a) => (a.blocos || []).map((b) => `${a.titulo} · ${b.titulo}`));
    $app.innerHTML = pageHead('Nova dúvida', 'LevelUp Plus', '#/plus/duvidas') + `
      <form class="stack" novalidate style="margin-top:8px">
        <label class="field"><span>Assunto</span>
          <select name="topico"><option value="">Geral / outro assunto</option>${topicos.map((t) => `<option>${esc(t)}</option>`).join('')}</select></label>
        <label class="field"><span>Sua dúvida</span>
          <textarea name="texto" rows="8" maxlength="3000" placeholder="Descreva a dúvida com o máximo de detalhes: enunciado da questão, até onde você chegou, onde travou…"></textarea></label>
        <p class="small muted">Dica: se for de um exercício, cole o enunciado e conte o que você já tentou. Para mandar foto da resolução, use a comunidade no WhatsApp.</p>
        <div class="error-msg" data-err></div>
        <button class="btn btn-primary btn-block" type="submit">Enviar dúvida</button>
      </form>`;
    bindBack();
    const f = $app.querySelector('form');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const texto = f.texto.value.trim();
      if (texto.length < 10) return ($app.querySelector('[data-err]').textContent = 'Escreva um pouco mais sobre a sua dúvida.');
      const btn = f.querySelector('[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try {
        const d = await Plus.enviarDuvida({ topico: f.topico.value, texto });
        toast(`Dúvida enviada! Resposta em até ${PC.PRAZO_RESPOSTA_HORAS}h.`);
        go(`#/plus/duvidas/${d.id}`);
      } catch (ex) {
        $app.querySelector('[data-err]').textContent = ex.message || 'Não foi possível enviar agora.';
        btn.disabled = false; btn.textContent = 'Enviar dúvida';
      }
    };
  }

  async function viewDuvida(id) {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let d;
    try { if (!(await exigirPlus())) return; d = (await Plus.listarDuvidas()).find((x) => String(x.id) === String(id)); } catch {
      $app.innerHTML = errorBox('Erro ao carregar a dúvida.'); return bindRetry();
    }
    if (!d) return go('#/plus/duvidas');
    const prazo = new Date(new Date(d.criada_em).getTime() + PC.PRAZO_RESPOSTA_HORAS * 3600e3);
    $app.innerHTML = pageHead('Dúvida', d.topico || 'LevelUp Plus', '#/plus/duvidas') + `
      <div class="thread">
        <div class="bubble me"><div class="who">Você · ${esc(fmtCurto(d.criada_em))}</div><div class="prose">${esc(d.texto)}</div></div>
        ${d.status === 'respondida'
          ? `<div class="bubble prof"><div class="who">${ICON.crown} Professor · ${esc(fmtCurto(d.respondida_em))}</div><div class="prose">${esc(d.resposta)}</div></div>`
          : `<div class="bubble waiting"><span class="ic-sm">${ICON.clock}</span><div><b>Aguardando resposta</b>
              <div class="small muted">O professor responde até ${esc(fmtCurto(prazo))}. ${esc(PC.HORARIO_SUPORTE)}.</div></div></div>`}
      </div>
      ${d.status !== 'respondida' ? demoBtn('data-demo-resp', 'Simular resposta do professor') : ''}
      <a class="btn btn-ghost btn-block" href="#/plus/duvidas/nova" style="margin-top:16px">Mandar outra dúvida</a>`;
    bindBack();
    const b = $app.querySelector('[data-demo-resp]');
    if (b) b.onclick = async () => { await Plus.demoResponder(d.id); viewDuvida(id); };
  }

  // ---------- Agendar aula ----------
  // Passos: escolhe o dia → o horário → revisa → reserva (segura o horário
  // por AULA_RESERVA_HORAS) → paga na Hotmart → você confere e confirma.
  async function viewAgendar() {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let u, st, dias;
    try { ({ u, st } = await plusStatus()); dias = await Plus.agenda(); } catch {
      $app.innerHTML = pageHead('Agendar aula', '', '#/plus') + errorBox('Erro ao carregar a agenda.');
      bindBack(); return bindRetry();
    }
    const plus = st.ativo;
    const valor = Plus.valorAula(plus);
    const aulaAberta = !!(plus ? PC.HOTMART_AULA_PLUS : PC.HOTMART_AULA);
    const comHorario = dias.filter((d) => d.slots.some((s) => s.livre));
    let diaSel = comHorario[0]?.data || null;
    let slotSel = null;

    const paint = () => {
      const dia = dias.find((d) => d.data === diaSel);
      $app.innerHTML = pageHead('Agendar aula', plus ? 'LevelUp Plus' : 'Aula avulsa', '#/plus') + `
        <div class="card row" style="margin:8px 0 4px"><span class="ic-sm">${ICON.calendar}</span>
          <div class="small" style="flex:1">Aula individual online · <b>${PC.AULA_DURACAO_MIN} min</b></div>
          <div class="price-inline">${plus ? `<s>${brl(PC.AULA_VALOR)}</s>` : ''}<b>${brl(valor)}</b></div></div>
        ${!plus ? `<a class="small" href="#/plus" style="display:block;text-align:center;margin:6px 0 0">Assinantes Plus têm ${Math.round(PC.AULA_DESCONTO_PLUS * 100)}% de desconto →</a>` : ''}

        <div class="agenda-layout"><div class="agenda-main">
        <div class="section-title">1. Escolha o dia</div>
        ${comHorario.length ? `<div class="day-strip">${dias.map((d) => {
          const livre = d.slots.some((s) => s.livre);
          return `<button class="day-chip ${d.data === diaSel ? 'on' : ''}" data-dia="${d.data}" ${livre ? '' : 'disabled'}>
            <span class="w">${DIAS_SEM[d.date.getDay()]}</span><span class="n">${d.date.getDate()}</span><span class="m">${MESES[d.date.getMonth()]}</span></button>`;
        }).join('')}</div>` : `<p class="muted" style="text-align:center;padding:16px 0">Nenhum horário livre nas próximas semanas.
          <br><a href="https://wa.me/${esc(PC.WHATSAPP_PROFESSOR)}" target="_blank" rel="noopener">Fale com o professor</a></p>`}

        ${dia ? `<div class="section-title">2. Escolha o horário <span class="small muted" style="font-weight:700">· ${esc(DIAS_LONGO[dia.date.getDay()])}</span></div>
          <div class="time-grid">${dia.slots.map((s) => `
            <button class="time-chip ${s.slot === slotSel ? 'on' : ''}" data-slot="${s.slot}" ${s.livre ? '' : 'disabled'}>${s.slot.split('T')[1]}</button>`).join('')}</div>` : ''}
        </div><aside class="agenda-side">
        ${slotSel ? `<div class="section-title">3. Confirme</div>
          <div class="card summary">
            <div class="res"><span>Quando</span><b>${esc(fmtSlot(slotSel))}</b></div>
            <div class="res"><span>Duração</span><b>${PC.AULA_DURACAO_MIN} min</b></div>
            <div class="res"><span>Valor</span><b>${brl(valor)}${plus ? ` <span class="tag ok">−${Math.round(PC.AULA_DESCONTO_PLUS * 100)}% Plus</span>` : ''}</b></div>
          </div>
          <p class="small muted">Ao continuar, o horário fica reservado por ${PC.AULA_RESERVA_HORAS || 2}h enquanto você paga na Hotmart. Depois que o pagamento for confirmado, a aula aparece como <b>Confirmada</b> e você recebe o link.</p>
          <div class="bottom-cta"><div class="error-msg" data-err style="margin-bottom:8px"></div>
            ${aulaAberta
              ? '<button class="btn btn-primary btn-block" data-reservar>Reservar e ir para o pagamento</button>'
              : `<button class="btn btn-primary btn-block" disabled>Pagamento online em breve</button>
                 <a class="btn btn-ghost btn-block" style="margin-top:10px" href="https://wa.me/${esc(PC.WHATSAPP_PROFESSOR)}?text=${encodeURIComponent(`Oi, professor! Quero marcar uma aula em ${fmtSlot(slotSel)}.`)}" target="_blank" rel="noopener">Combinar pelo WhatsApp</a>`}</div>`
          : `<div class="card summary-empty only-desk"><span class="ic">${ICON.clock}</span><div class="small muted">Escolha um dia e um horário para ver o resumo da aula.</div></div>`}
        </aside></div>`;
      bindBack();
      $app.querySelectorAll('[data-dia]').forEach((b) => { b.onclick = () => { diaSel = b.dataset.dia; slotSel = null; paint(); }; });
      $app.querySelectorAll('[data-slot]').forEach((b) => {
        b.onclick = () => { slotSel = b.dataset.slot; paint(); $app.querySelector('.summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
      });
      const r = $app.querySelector('[data-reservar]');
      if (r) r.onclick = async () => {
        r.disabled = true; r.innerHTML = '<span class="spinner small"></span>';
        // Abre a aba já no clique (senão o navegador bloqueia o pop-up) e
        // aponta para o checkout quando a reserva voltar.
        const w = window.open('', '_blank');
        try {
          const aula = await Plus.reservarAula(slotSel, plus);
          const url = Plus.checkout(plus ? PC.HOTMART_AULA_PLUS : PC.HOTMART_AULA, { nome: u.nome, ref: 'aula-' + aula.id });
          if (w) { w.opener = null; w.location = url; }
          go(`#/plus/aulas/${aula.id}${w ? '' : '?pagar=1'}`);
        } catch (ex) {
          if (w) w.close();
          $app.querySelector('[data-err]').textContent = ex.message || 'Não foi possível reservar agora.';
          r.disabled = false; r.textContent = 'Reservar e ir para o pagamento';
        }
      };
    };
    paint();
  }

  // ---------- Minhas aulas ----------
  async function viewAulas() {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let aulas;
    try { aulas = await Plus.listarAulas(); } catch {
      $app.innerHTML = pageHead('Minhas aulas', '', '#/plus') + errorBox('Erro ao carregar suas aulas.');
      bindBack(); return bindRetry();
    }
    const agora = Plus.slotKey(new Date());
    const prox = aulas.filter((a) => a.inicio >= agora && ['confirmada', 'aguardando_pagamento'].includes(a.status));
    const resto = aulas.filter((a) => !prox.includes(a)).reverse();
    const item = (a) => `
      <a class="card doubt" href="#/plus/aulas/${esc(a.id)}">
        <div class="top"><span class="tag ${AULA_STATUS[a.status]?.cls || ''}">${AULA_STATUS[a.status]?.label || a.status}</span><span class="spacer"></span><b>${brl(a.valor)}</b></div>
        <div class="txt" style="font-weight:800">${esc(fmtSlot(a.inicio))}</div>
      </a>`;
    $app.innerHTML = pageHead('Minhas aulas', 'LevelUp Plus', '#/plus') + `
      <a class="btn btn-primary btn-block" href="#/plus/agendar" style="margin-top:8px">+ Agendar nova aula</a>
      <div class="section-title">Próximas</div>
      ${prox.length ? `<div class="card-list">${prox.map(item).join('')}</div>` : '<p class="muted">Nenhuma aula marcada.</p>'}
      ${resto.length ? `<div class="section-title">Histórico</div><div class="card-list">${resto.map(item).join('')}</div>` : ''}`;
    bindBack();
  }

  async function viewAula(id) {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let u, aula;
    try { u = await loadProfile(); aula = (await Plus.listarAulas()).find((a) => String(a.id) === String(id)); } catch {
      $app.innerHTML = errorBox('Erro ao carregar a aula.'); return bindRetry();
    }
    if (!aula) return go('#/plus/aulas');
    const pagarUrl = Plus.checkout(aula.plus ? PC.HOTMART_AULA_PLUS : PC.HOTMART_AULA, { nome: u.nome, ref: 'aula-' + aula.id });
    const ini = Plus.parseSlot(aula.inicio);
    const fim = new Date(ini.getTime() + aula.duracao_min * 60e3);
    const g = (d) => `${Plus.ymd(d).replace(/-/g, '')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Aula de Física — LevelUp Fís')}&dates=${g(ini)}/${g(fim)}&ctz=America/Sao_Paulo&details=${encodeURIComponent('Aula particular agendada pelo LevelUp Fís.')}`;
    const zap = `https://wa.me/${PC.WHATSAPP_PROFESSOR}?text=${encodeURIComponent(`Oi, professor! Sou ${nomeExibicao(u)} (${u.email || ''}). Sobre a aula de ${fmtSlot(aula.inicio)} (reserva ${aula.id}).`)}`;
    const passo = (n, t, estado, extra = '') => `<li class="${estado}"><span class="dot">${estado === 'done' ? ICON.check : n}</span><div><b>${t}</b>${extra}</div></li>`;
    const st = aula.status;
    const pago = st === 'confirmada' || st === 'concluida';

    $app.innerHTML = pageHead('Sua aula', 'LevelUp Plus', '#/plus/aulas') + `
      <div class="aula-layout"><div>
      <div class="card class-hero ${pago ? 'ok' : ''}">
        ${pago ? `<div class="badge-ok">${ICON.check}</div><h2>Aula confirmada!</h2>` : `<h2>${AULA_STATUS[st]?.label || st}</h2>`}
        <div class="when">${esc(fmtSlot(aula.inicio))}</div>
        <div class="small muted">${aula.duracao_min} min · ${brl(aula.valor)}</div>
      </div>
      </div><div>
      ${['cancelada', 'expirada'].includes(st) ? `
        <p class="muted" style="text-align:center">${st === 'expirada' ? `O pagamento não foi identificado em ${PC.AULA_RESERVA_HORAS || 2}h e o horário foi liberado.` : 'Esta reserva foi cancelada.'}</p>
        <a class="btn btn-primary btn-block" href="#/plus/agendar">Escolher outro horário</a>` : `
      <ol class="steps">
        ${passo(1, 'Horário reservado', 'done', `<div class="small muted">${esc(fmtCurto(aula.criada_em))}</div>`)}
        ${passo(2, 'Pagamento na Hotmart', pago ? 'done' : 'current', pago ? '' : `<div class="small muted">Use o e-mail ${esc(u.email || '')}. Reserva válida por ${PC.AULA_RESERVA_HORAS || 2}h.</div>`)}
        ${passo(3, 'Aula confirmada', pago ? 'done' : '', pago
          ? `<div class="small muted">${aula.link_aula ? 'O link da aula está logo abaixo.' : 'O professor coloca o link da aula aqui antes do horário.'}</div>`
          : '<div class="small muted">Assim que a Hotmart confirmar o pagamento, sua aula aparece aqui como confirmada.</div>')}
      </ol>
      ${st === 'aguardando_pagamento' ? `
        <a class="btn btn-primary btn-block" href="${esc(pagarUrl)}" target="_blank" rel="noopener">Pagar agora · ${brl(aula.valor)}</a>
        ${demoBtn('data-demo-pagar', 'Simular pagamento aprovado')}
        <button class="btn btn-danger btn-block" data-cancelar style="margin-top:10px">Cancelar reserva</button>` : st === 'conflito' ? `
        <p class="muted" style="text-align:center">Seu pagamento foi recebido, mas esse horário acabou ocupado por outra aula. O professor vai falar com você para remarcar.</p>` : `
        ${aula.link_aula ? `<a class="btn btn-primary btn-block" href="${esc(aula.link_aula)}" target="_blank" rel="noopener" style="margin-bottom:10px">${ICON.live.replace('<svg', '<svg width="18" height="18"')} Entrar na aula</a>` : ''}
        <a class="btn ${aula.link_aula ? 'btn-ghost' : 'btn-primary'} btn-block" href="${esc(gcal)}" target="_blank" rel="noopener">${ICON.calendar.replace('<svg', '<svg width="18" height="18"')} Adicionar ao Google Agenda</a>`}
      <a class="btn btn-ghost btn-block" href="${esc(zap)}" target="_blank" rel="noopener" style="margin-top:10px">Falar com o professor no WhatsApp</a>`}
      </div></div>`;
    bindBack();

    if (location.hash.includes('pagar=1')) toast('Seu navegador bloqueou a nova aba. Toque em "Pagar agora".', 4500);
    const dp = $app.querySelector('[data-demo-pagar]');
    if (dp) dp.onclick = async () => { await Plus.demoConfirmarPagamento(aula.id); toast('Pagamento aprovado! (demonstração)'); viewAula(id); };
    const c = $app.querySelector('[data-cancelar]');
    if (c) c.onclick = async () => {
      const ok = await modal({
        title: 'Cancelar reserva?', text: 'O horário volta a ficar disponível para outros alunos. Se você já pagou, fale com o professor antes.',
        buttons: [{ label: 'Manter', value: false }, { label: 'Cancelar reserva', value: true, cls: 'btn-danger' }],
      });
      if (!ok) return;
      await Plus.cancelarAula(aula.id);
      viewAula(id);
    };
  }

  // ================================================================
  // Roteador
  // ================================================================
  async function render() {
    if (examCleanup && !location.hash.includes('/prova/run/')) examCleanup();
    clearInterval(exTimer);
    document.getElementById('modal-root').innerHTML = '';
    $app.className = 'app';
    window.scrollTo(0, 0);

    const hash = (location.hash || '#/').split('?')[0];
    const parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const logged = !!API.Session.get();

    if (!logged && !['login', 'register'].includes(parts[0])) return go('#/login');
    if (logged && ['login', 'register', ''].includes(parts[0])) return go('#/map');

    switch (parts[0]) {
      case 'login': $app.className = 'app no-nav'; return viewLogin();
      case 'register': $app.className = 'app no-nav'; return viewRegister();
      case 'map': return viewMap();
      case 'videos': return viewVideos();
      case 'profile': return viewProfile();
      case 'plus': {
        const [, a, b] = parts;
        if (a === 'duvidas' && b === 'nova') return viewNovaDuvida();
        if (a === 'duvidas' && b) return viewDuvida(b);
        if (a === 'duvidas') return viewDuvidas();
        if (a === 'agendar') return viewAgendar();
        if (a === 'aulas' && b) return viewAula(b);
        if (a === 'aulas') return viewAulas();
        return viewPlus();
      }
      case 't': {
        const [, topico, kind, a, b] = parts;
        if (kind === 'resumo') return viewResumo(topico);
        if (kind === 'cur') return viewCuriosidade(topico, a);
        if (kind === 'trilha') return viewTrilha(topico, a);
        if (kind === 'q') return viewExercicio(topico, a, b);
        if (kind === 'prova' && a === 'run') return viewProvaRun(topico, b === 'dificil' ? 'dificil' : 'facil');
        if (kind === 'prova') return viewProvaStats(topico);
        return go('#/map');
      }
      default: return go('#/map');
    }
  }

  // ================================================================
  // Fundo estrelado (TrailStarfield)
  // ================================================================
  function starfield() {
    const c = document.getElementById('starfield');
    const ctx = c.getContext('2d');
    let stars = [];
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((innerWidth * innerHeight) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.3, a: Math.random() * 0.5 + 0.15, p: Math.random() * Math.PI * 2,
      }));
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const s of stars) {
        const a = reduce ? s.a : s.a * (0.6 + 0.4 * Math.sin(t / 1400 + s.p));
        ctx.fillStyle = `rgba(124,132,184,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) requestAnimationFrame(draw);
    };
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  starfield();
  window.addEventListener('hashchange', render);
  render();
})();
