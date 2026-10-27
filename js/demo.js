// LevelUp Fís — versão demonstração (levelupfis.com.br/demo).
//
// A pessoa deixa nome, e-mail e telefone (tabela demo_leads) e testa o
// currículo da demo: as Áreas com demo = true, montadas no painel → aba
// Demo com as mesmas ferramentas do Currículo final (Áreas → Blocos →
// Capítulos de Resumo, Fixação, Exercícios, Prova, Curiosidade, e os da
// demo: Vídeo e Simulação). Ver backend/sql/023 e 024.
//
// Sem conta e sem backend: lê e grava direto no Supabase com a anon key.
// As respostas são corrigidas aqui no navegador e não existe Joule, Carga
// nem Fóton; o progresso fica só neste navegador.
//
// Abas: Mapa, Plus (vitrine) e Perfil. Visual e classes de css/style.css,
// os mesmos de js/app.js — os trechos copiados de lá estão marcados.

(function demo() {
  const CFG = window.LUP_CONFIG;
  const $app = document.getElementById('app');
  const SITE = '../'; // raiz do site (login, cadastro, simulações)
  const WHATSAPP = 'https://w.app/levelupfisapp'; // botão do Perfil
  const LEAD_KEY = 'lup.demo.lead';
  const PROG_KEY = 'lup.demo.progresso';

  // ================================================================
  // Utilidades (iguais às de js/app.js)
  // ================================================================
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICON = {
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
    atom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 7.5l5 4 4.5-7 4.5 7 5-4L19.5 18h-15zM4.5 19.5h15V21h-15z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm-4 9h8v2H8zm0-3.5h8v2H8zM8 14.5h5v2H8z"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2.1-7.7-.9.9c-.7.7-1.2 1.3-1.2 2.8h-2v-.5c0-1.1.5-2.1 1.2-2.8l1.2-1.3A2 2 0 1 0 10 9H8a4 4 0 1 1 7.1 2.3z"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-5 21a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm5-4H7V4h10z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.4 11.6l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7c0 .6.2 1.1.6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  };
  const TIPO_ICON = { resumo: 'book', fixacao: 'edit', prova: 'trophy', curiosidade: 'bulb', extra: 'plus', video: 'playCircle', simulacao: 'atom' };
  const TIPO_NOME = { resumo: 'Resumo', fixacao: 'Fixação', extra: 'Exercícios', prova: 'Prova', curiosidade: 'Curiosidade', video: 'Vídeo', simulacao: 'Simulação' };
  const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function toast(msg, ms = 2800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // Modal simples (versão enxuta do modal() de js/app.js).
  function modal({ title, text = '', html = '', icon = '', buttons = [{ label: 'Entendi', value: true, cls: 'btn-primary' }] }) {
    return new Promise((resolve) => {
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          ${icon ? `<div style="color:var(--gold);width:34px;height:34px;margin:0 auto">${icon}</div>` : ''}
          <h3>${esc(title)}</h3>
          ${text ? `<p>${esc(text)}</p>` : ''}${html}
          <div class="actions">
            ${buttons.map((b, i) => `<button class="btn ${b.cls || 'btn-ghost'}" data-i="${i}">${esc(b.label)}</button>`).join('')}
          </div>
        </div>`;
      const close = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') close(undefined); };
      wrap.addEventListener('click', (e) => {
        if (e.target === wrap) return close(undefined);
        const b = e.target.closest('[data-i]');
        if (b) close(buttons[+b.dataset.i].value);
      });
      document.addEventListener('keydown', onKey);
      document.getElementById('modal-root').appendChild(wrap);
    });
  }

  const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

  // Mesmas regras de embedUrl() em js/app.js.
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
  function playerHtml(url) {
    const em = embedUrl(url);
    if (em && em.startsWith('video:')) return `<div class="video-embed"><video src="${esc(em.slice(6))}" controls></video></div>`;
    if (em) return `<div class="video-embed"><iframe src="${esc(em)}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe></div>`;
    return `<a class="btn btn-ghost btn-block" href="${esc(url)}" target="_blank" rel="noopener">${ICON.playCircle} Assistir vídeo</a>`;
  }
  // Simulação: caminho do próprio site (/simulacoes/...) ou link completo,
  // sempre no modo embutido (?embed=1, ver simulacoes/assets/js/layout.js):
  // só o palco, sem o cabeçalho do site de simulações.
  function simUrl(url) {
    const u = /^https?:\/\//i.test(url) ? url : SITE + String(url || '').replace(/^\/+/, '');
    return u + (u.includes('?') ? '&' : '?') + 'embed=1';
  }
  // A simulação fica presa na demo: sandbox sem allow-top-navigation nem
  // allow-popups (não navega a página nem abre abas). Fica invisível até
  // carregar, para não piscar nada antes do modo embutido aplicar.
  // topo = barra que só aparece com a simulação em tela cheia (a pergunta
  // do exercício, ver simNaQuestaoHtml).
  function simFrameHtml(url, titulo, cls = '', topo = '') {
    return `<div class="sim-frame ${cls}">${topo}<div class="spinner"></div>
      <iframe src="${esc(simUrl(url))}" title="${esc(titulo)}" sandbox="allow-scripts allow-same-origin"
        allow="fullscreen" allowfullscreen referrerpolicy="no-referrer" onload="this.classList.add('ok')"></iframe></div>`;
  }

  // Cor tema — mesma conta de temaVars() em js/app.js (Bloco, senão Área).
  const corTema = (area, bloco) => (bloco && bloco.cor) || (area && area.cor) || '';
  function temaVars(cor) {
    if (!/^#[0-9a-f]{6}$/i.test(cor || '')) return '';
    const n = parseInt(cor.slice(1), 16);
    const rgb = [n >> 16, (n >> 8) & 255, n & 255];
    const deep = '#' + rgb.map((v) => Math.round(v * 0.82).toString(16).padStart(2, '0')).join('');
    const luz = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    const ink = luz > 0.55 ? 'var(--bg)' : 'var(--white)';
    return `--acc:${cor};--acc-deep:${deep};--acc-rgb:${rgb.join(',')};--acc-ink:${ink}`;
  }

  // ================================================================
  // Dados: Supabase direto (anon key) + progresso no navegador
  // ================================================================
  async function sb(path, opts = {}) {
    const res = await fetch(`${CFG.SUPABASE_URL}/rest/v1/${path}`, Object.assign({}, opts, {
      headers: Object.assign({
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CFG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }, opts.headers || {}),
    }));
    if (!res.ok) {
      const e = new Error(`Erro ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return res.status === 204 || res.status === 201 ? null : res.json();
  }

  const ler = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado */ } };
  const apagar = (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } };
  const lead = () => ler(LEAD_KEY, null);

  // Progresso: Capítulos concluídos (c), perguntas acertadas (q) e
  // desafios do tutorial da simulação (t: capítulo → índices feitos).
  const prog = () => Object.assign({ c: {}, q: {}, t: {} }, ler(PROG_KEY, {}));
  const salvarProg = (p) => gravar(PROG_KEY, p);
  const capConcluido = (id) => !!prog().c[id];
  function concluirCap(id) { const p = prog(); p.c[id] = true; salvarProg(p); }
  function acertarPergunta(id) { const p = prog(); p.q[id] = true; salvarProg(p); }

  const S = { areas: null, moduloAtual: null, questions: {} };
  async function loadCurriculo(force = false) {
    if (S.areas && !force) return S.areas;
    const areas = await sb('areas?select=id,titulo,icone,ordem,cor,'
      + 'blocos(id,titulo,ordem,cor,capitulos(id,titulo,tipo,ordem,trancado,capitulo_conteudo(texto,pdf_url,imagem_url,video_url,simulacao_url,blocos)))'
      + '&demo=eq.true&order=ordem.asc&blocos.order=ordem.asc&blocos.capitulos.order=ordem.asc,id.asc');
    areas.forEach((a) => (a.blocos || []).forEach((b) => (b.capitulos || []).forEach((c) => {
      // capitulo_conteudo é 1–1: o PostgREST devolve objeto (ou lista, em versões antigas)
      const cc = c.capitulo_conteudo;
      c.conteudo = (Array.isArray(cc) ? cc[0] : cc) || {};
    })));
    S.areas = areas;
    return areas;
  }
  function findCap(id) {
    for (const area of S.areas || []) {
      for (const bloco of area.blocos || []) {
        const cap = (bloco.capitulos || []).find((c) => String(c.id) === String(id));
        if (cap) return { area, bloco, cap };
      }
    }
    return {};
  }
  async function getQuestions(cap) {
    if (!S.questions[cap.id]) {
      S.questions[cap.id] = await sb(`questions?capitulo_id=eq.${cap.id}&select=id,enunciado,tipo,opcoes,resposta_correta,explicacao,ordem&order=ordem.asc,id.asc`);
    }
    return S.questions[cap.id];
  }
  // Mesma correção do backend (routes/questions.py): sem diferenciar maiúsculas e espaços nas pontas.
  const corrigir = (q, resposta) => String(resposta).trim().toLowerCase() === String(q.resposta_correta || '').trim().toLowerCase();

  // ================================================================
  // Blocos de layout
  // ================================================================
  const loading = () => `<div class="center fill"><div class="spinner"></div></div>`;
  function errorBox(msg) {
    return `<div class="center fill stack"><p>${esc(msg)}</p><button class="btn btn-primary" data-retry>Tentar novamente</button></div>`;
  }
  function bindRetry() {
    const b = $app.querySelector('[data-retry]');
    if (b) b.onclick = () => render();
  }
  function topBar() {
    const l = lead();
    return `
      <div class="topstats">
        <span class="demo-pill">Versão demo</span>
        <span class="demo-ola">Olá, ${esc((l?.nome || '').split(' ')[0] || 'visitante')}!</span>
        <a class="icon-btn" href="#/profile" aria-label="Perfil">${ICON.user}</a>
      </div>`;
  }
  function bottomNav(tab) {
    return `
      <nav class="bottomnav"><div class="inner">
        <a class="side-brand" href="#/map"><img src="${SITE}assets/logo.png" alt="">LevelUp Fís</a>
        <a href="#/map" class="${tab === 'mapa' ? 'on' : ''}">${ICON.map}Mapa</a>
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
  const crumbDe = (area, bloco) => [area?.titulo, bloco?.titulo].filter(Boolean).join(' · ');
  // Capítulo trancado no painel: convite para a versão completa.
  async function avisoCompleta(titulo) {
    const r = await modal({
      title: titulo ? `"${titulo}" está na versão completa` : 'Disponível na versão completa',
      text: 'Crie sua conta grátis para liberar a trilha inteira, com recompensas e o seu progresso salvo.',
      icon: ICON.lock,
      buttons: [{ label: 'Agora não', value: false }, { label: 'Criar conta', value: true, cls: 'btn-primary' }],
    });
    if (r) location.href = `${SITE}#/register`;
  }

  // Trilha em zigue-zague — cópia de trailHtml()/drawTrails() de js/app.js.
  function trailHtml(nodes) {
    const ROW = 170, PAD = 20;
    const X = [50, 72, 50, 28];
    const h = PAD + nodes.length * ROW;
    const items = nodes.map((n, i) => {
      const x = X[i % 4], top = PAD + i * ROW;
      const cls = n.concluido ? 'done' : n.desbloqueado ? 'current' : 'locked';
      const iconSvg = n.concluido ? ICON[n.icon] : n.desbloqueado ? (n.playIcon ? ICON.play : ICON[n.icon]) : ICON.lock;
      const bx = x >= 50 ? x - 30 : x + 30;
      const badge = (n.sideBadges || []).map((sb, j) =>
        `<button class="side-badge ${sb.on ? 'on' : ''}" style="left:${bx}%;top:${top + 24 + j * 58}px" data-badge="${i}:${j}" title="${esc(sb.title || '')}">${sb.on ? ICON[sb.icon] : ICON.lock}</button>`).join('');
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

  // ---------- Entrada: logo grande + cadastro ----------
  const soDigitos = (s) => String(s || '').replace(/\D/g, '');
  function mascaraTelefone(v) {
    const d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function viewEntrada() {
    $app.className = 'app no-nav';
    $app.innerHTML = `
      <div class="demo-gate center">
        <img class="demo-logo" src="${SITE}assets/logo.png" alt="LevelUp Fís">
        <h1>Seja um dos primeiros a testar o início da maior plataforma de ensino de física do Brasil</h1>
        <form class="stack" novalidate>
          <label class="field"><span>Nome</span><input type="text" name="nome" autocomplete="name" maxlength="120" required></label>
          <label class="field"><span>E-mail</span><input type="email" name="email" autocomplete="email" maxlength="200" required></label>
          <label class="field"><span>Telefone (WhatsApp)</span><input type="tel" name="telefone" autocomplete="tel" inputmode="tel" placeholder="(11) 91234-5678" required></label>
          <div class="error-msg" data-err></div>
          <button class="btn btn-primary btn-block btn-lg" type="submit">Testar agora!</button>
        </form>
      </div>`;
    const f = $app.querySelector('form');
    const err = $app.querySelector('[data-err]');
    f.telefone.addEventListener('input', () => { f.telefone.value = mascaraTelefone(f.telefone.value); });
    f.onsubmit = async (e) => {
      e.preventDefault();
      const nome = f.nome.value.trim().replace(/\s+/g, ' ');
      const email = f.email.value.trim().toLowerCase();
      const telefone = f.telefone.value.trim();
      if (nome.length < 2) return (err.textContent = 'Informe seu nome');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return (err.textContent = 'E-mail inválido');
      if (soDigitos(telefone).length < 10) return (err.textContent = 'Informe o telefone com DDD');
      err.textContent = '';
      const btn = f.querySelector('[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="spinner small"></span>';
      try {
        await sb('demo_leads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ nome, email, telefone }) });
      } catch (ex) {
        // 409 = esse e-mail já se cadastrou antes: entra do mesmo jeito.
        if (ex.status !== 409) {
          err.textContent = 'Não foi possível enviar agora. Confira a internet e tente de novo.';
          btn.disabled = false; btn.textContent = 'Testar agora!';
          return;
        }
      }
      gravar(LEAD_KEY, { nome, email, telefone, em: new Date().toISOString() });
      go('#/map');
    };
  }

  // ---------- Mapa ----------
  // Igual ao viewMap() de js/app.js: faixa de Áreas, um tópico por Bloco e
  // a trilha dos Capítulos (Exercícios ao lado do capítulo anterior). Na
  // demo os Blocos ficam todos abertos; dentro de cada um, o próximo
  // capítulo libera quando o anterior é concluído. Trancado = cadeado
  // sempre, e não segura o resto da trilha.
  async function viewMap() {
    $app.innerHTML = topBar() + loading() + bottomNav('mapa');
    let areas;
    try { areas = await loadCurriculo(true); } catch {
      $app.innerHTML = topBar() + errorBox('Erro ao carregar o mapa.') + bottomNav('mapa');
      return bindRetry();
    }
    if (!S.moduloAtual || !areas.some((a) => a.id === S.moduloAtual)) {
      S.moduloAtual = (areas.find((a) => (a.blocos || []).length) || areas[0] || {}).id;
    }
    const modulo = areas.find((a) => a.id === S.moduloAtual);
    const topicos = modulo ? modulo.blocos || [] : [];
    const idxAtual = areas.findIndex((a) => a.id === S.moduloAtual);
    const concluido = (c) => capConcluido(c.id);

    let html = topBar();
    html += `<div class="card demo-aviso"><b>Bem-vindo à versão demonstração!</b>
      <span class="small muted">Explore a trilha à vontade. Aqui você não ganha Joules, Cargas nem Fótons — isso fica para a versão completa.</span></div>`;
    if (areas.length > 1) {
      html += `<div class="modstrip">${areas.map((a, i) => `
        ${i > 0 ? `<span class="mod-link ${i <= idxAtual ? 'lit' : ''}" style="${temaVars(a.cor)}"></span>` : ''}
        <button class="mod ${a.id === S.moduloAtual ? 'active' : ''} ${(a.blocos || []).length ? 'available' : ''}" data-mod="${esc(a.id)}" style="${temaVars(a.cor)}">
          <span class="circle">${esc(a.icone || '•')}</span>${esc(a.titulo)}
        </button>`).join('')}</div>`;
    }
    if (!areas.length) {
      html += `<div class="card muted" style="margin-top:24px">O conteúdo da demonstração está sendo preparado. Volte em breve!</div>`;
    } else if (!topicos.length) {
      html += `<div class="card muted" style="margin-top:24px">O conteúdo de ${esc(modulo ? modulo.titulo : 'este módulo')} ainda está sendo preparado.</div>`;
    }

    const trilhas = [];
    const blocos = topicos.map((t) => {
      let b = `<div class="topic-banner"><div class="k">${esc(modulo.titulo)}</div><div class="t">${esc(t.titulo)}</div></div>`;
      const todos = t.capitulos || [];
      const seq = todos.filter((c) => c.tipo !== 'extra');
      const extrasPorNo = seq.map(() => []);
      todos.forEach((c, pos) => {
        if (c.tipo !== 'extra' || !seq.length) return;
        const antes = todos.slice(0, pos).filter((x) => x.tipo !== 'extra');
        const ancora = [...antes].reverse().find((x) => x.tipo === 'fixacao') || antes[antes.length - 1] || seq[0];
        extrasPorNo[seq.indexOf(ancora)].push(c);
      });
      if (!seq.length) {
        return b + `<div class="card muted" style="margin:8px 0 20px">O conteúdo deste tópico ainda está sendo preparado.</div>`;
      }
      const nodes = seq.map((c, k) => {
        const anterior = seq.slice(0, k).reverse().find((x) => !x.trancado);
        return {
          titulo: c.titulo,
          icon: TIPO_ICON[c.tipo] || 'bulb',
          desbloqueado: !c.trancado && (!anterior || concluido(anterior) || concluido(c)),
          concluido: !c.trancado && concluido(c),
          sideBadges: extrasPorNo[k].map((e) => ({ icon: 'plus', on: !e.trancado && !c.trancado && concluido(c), title: e.titulo, cap: e })),
        };
      });
      trilhas.push({ seq, nodes });
      return b + `<div data-trilha="${trilhas.length - 1}">${trailHtml(nodes)}</div>`;
    });
    html += `<div class="topics">${blocos.map((b, i) => `<section class="topic-block" style="${temaVars(corTema(modulo, topicos[i]))}">${b}</section>`).join('')}</div>`;
    html += bottomNav('mapa');
    $app.innerHTML = html;
    drawTrails();

    $app.querySelectorAll('[data-mod]').forEach((b) => {
      b.onclick = () => {
        const a = areas.find((x) => x.id === b.dataset.mod);
        if (a.id === S.moduloAtual) return window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!(a.blocos || []).length) return modal({ title: 'Quase lá!', text: 'Esse módulo ainda está sendo preparado.', icon: ICON.lock });
        S.moduloAtual = a.id;
        viewMap();
      };
    });
    $app.querySelectorAll('[data-trilha]').forEach((wrap) => {
      const tr = trilhas[+wrap.dataset.trilha];
      wrap.querySelectorAll('[data-node]').forEach((b) => {
        b.onclick = () => {
          const i = +b.dataset.node;
          if (tr.seq[i].trancado) return avisoCompleta(tr.seq[i].titulo);
          if (!tr.nodes[i].desbloqueado) return toast('Conclua o capítulo anterior para desbloquear.');
          go(`#/c/${tr.seq[i].id}`);
        };
      });
      wrap.querySelectorAll('[data-badge]').forEach((b) => {
        b.onclick = () => {
          const [i, j] = b.dataset.badge.split(':').map(Number);
          const sb = tr.nodes[i].sideBadges[j];
          if (sb.cap.trancado) return avisoCompleta(sb.cap.titulo);
          if (!sb.on) return toast(`Conclua "${tr.seq[i].titulo}" para desbloquear.`);
          go(`#/c/${sb.cap.id}`);
        };
      });
    });
  }

  // ---------- Capítulo: abre a tela do tipo dele ----------
  async function viewCapitulo(capId) {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    try { await loadCurriculo(); } catch {
      $app.innerHTML = pageHead('Demo', '', '#/map') + errorBox('Erro ao carregar o conteúdo.');
      bindBack(); return bindRetry();
    }
    const ctx = findCap(capId);
    if (!ctx.cap) return go('#/map');
    if (ctx.cap.trancado) { go('#/map'); return avisoCompleta(ctx.cap.titulo); }
    $app.style.cssText = temaVars(corTema(ctx.area, ctx.bloco));
    switch (ctx.cap.tipo) {
      case 'fixacao': case 'extra': return viewTrilha(ctx);
      case 'prova': return viewProva(ctx);
      default: return viewConteudo(ctx);
    }
  }

  // Resumo, Curiosidade, Vídeo e Simulação: conteúdo + CONTINUAR.
  function viewConteudo({ area, bloco, cap }) {
    const c = cap.conteudo || {};
    const cartoes = window.Cartoes && Cartoes.temConteudo(c.blocos) ? Cartoes.render(c.blocos) : '';
    const descricao = c.texto && c.texto.trim() ? `<div class="prose" style="font-size:15px">${esc(c.texto)}</div>` : '';
    let body;
    if (cap.tipo === 'video') {
      body = `<div class="card stack">${c.video_url ? playerHtml(c.video_url) : '<p class="muted">O vídeo deste capítulo ainda não foi cadastrado.</p>'}${descricao}</div>`;
    } else if (cap.tipo === 'simulacao') {
      const tut = tutorialDe(c.simulacao_url);
      body = c.simulacao_url
        ? `<div class="${tut ? 'sim-tut-layout' : ''}"><div>${simFrameHtml(c.simulacao_url, cap.titulo, tut ? 'com-tut' : '', tut ? tutorialFsHtml(cap, tut) : '')
          + (c.texto ? `<p class="small muted" style="margin:10px 0 0">${esc(c.texto)}</p>` : '')}</div>
          ${tut ? tutorialHtml(cap, tut) : ''}</div>`
        : '<div class="card"><p class="muted">A simulação deste capítulo ainda não foi cadastrada.</p></div>';
    } else if (cartoes) {
      body = cartoes;
    } else {
      // Mesma ordem do site: Resumo → PDF, senão texto; Curiosidade → tudo que tiver.
      const parts = [];
      if (c.imagem_url) parts.push(`<img class="media-img" src="${esc(c.imagem_url)}" alt="" onerror="this.outerHTML='<p class=muted>Não foi possível carregar a imagem.</p>'">`);
      if (c.pdf_url) parts.push(`<iframe class="pdf-frame" src="${esc(c.pdf_url)}#toolbar=0" title="PDF"></iframe><p class="small muted" style="text-align:center"><a href="${esc(c.pdf_url)}" target="_blank" rel="noopener">Abrir o PDF em outra aba</a></p>`);
      if (c.texto && c.texto.trim() && !(cap.tipo === 'resumo' && c.pdf_url)) parts.push(`<div class="prose">${esc(c.texto)}</div>`);
      if (c.video_url) parts.push(playerHtml(c.video_url));
      if (!parts.length) parts.push(`<p class="muted">O conteúdo deste capítulo ainda não foi cadastrado.</p>`);
      body = `<div class="card stack">${parts.join('')}</div>`;
    }
    const jaVisto = capConcluido(cap.id);
    $app.innerHTML = pageHead(cap.titulo || TIPO_NOME[cap.tipo], crumbDe(area, bloco), '#/map') + `
      ${body}
      <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>${cap.tipo === 'resumo' && !jaVisto ? 'ENTENDIDO' : 'CONTINUAR'}</button></div>`;
    bindBack();
    if (cap.tipo === 'simulacao' && tutorialDe(c.simulacao_url)) ligarTutorial(cap, tutorialDe(c.simulacao_url));
    $app.querySelector('[data-ok]').onclick = () => { concluirCap(cap.id); go('#/map'); };
  }

  // ---------- Tutorial da simulação (desafios em checklist) ----------
  // Os desafios ficam em js/demo-tutoriais.js, pelo nome do arquivo da
  // simulação. A simulação é do mesmo domínio, então a demo lê os
  // controles dela por dentro do iframe e marca cada desafio sozinha.
  function tutorialDe(url) {
    const nome = String(url || '').split(/[?#]/)[0].split('/').pop().replace(/\.html?$/i, '');
    const t = (window.LUP_TUTORIAIS || {})[nome];
    return t && t.length ? t : null;
  }
  function tutorialHtml(cap, tut) {
    const feitos = prog().t[cap.id] || {};
    const n = tut.filter((_, i) => feitos[i]).length;
    return `
      <aside class="card sim-tut">
        <div class="sim-tut-head"><b>Desafios</b><span class="small muted" data-tut-cont>${n}/${tut.length}</span></div>
        <p class="small muted" style="margin:0 0 8px">Faça na simulação: cada desafio se marca sozinho.</p>
        <ul>${tut.map((d, i) => `
          <li class="sim-tut-item ${feitos[i] ? 'done' : ''}" data-tut="${i}">
            <span class="box">${ICON.check}</span><span class="t">${esc(d.titulo)}</span>
            ${d.info ? `<button type="button" class="sim-tut-i" data-tut-info="${i}" aria-label="O que isso muda?">i</button>` : ''}
          </li>`).join('')}
        </ul>
      </aside>`;
  }
  // A mesma checklist, enxuta, à direita da simulação em tela cheia (sem o
  // "i": o popup ficaria por trás da tela cheia).
  function tutorialFsHtml(cap, tut) {
    const feitos = prog().t[cap.id] || {};
    const n = tut.filter((_, i) => feitos[i]).length;
    return `
      <div class="sim-fs-tut">
        <button type="button" class="sim-fs-tut-head" data-fs-tut-toggle><b>Desafios</b><span data-tut-cont>${n}/${tut.length}</span></button>
        <ul>${tut.map((d, i) => `
          <li class="sim-tut-item ${feitos[i] ? 'done' : ''}" data-tut="${i}"><span class="box">${ICON.check}</span><span class="t">${esc(d.titulo)}</span></li>`).join('')}
        </ul>
      </div>`;
  }
  let tutTimer = null;
  function ligarTutorial(cap, tut) {
    const feitos = Object.assign({}, prog().t[cap.id]);
    $app.querySelectorAll('[data-tut-info]').forEach((b) => {
      b.onclick = () => {
        const inf = tut[+b.dataset.tutInfo].info;
        modal({
          title: inf.titulo,
          html: `<div class="tut-info">
            <p>${esc(inf.texto)}</p>
            ${inf.min ? `<div class="ext"><span class="k">NO MÍNIMO</span>${esc(inf.min)}</div>` : ''}
            ${inf.max ? `<div class="ext"><span class="k">NO MÁXIMO</span>${esc(inf.max)}</div>` : ''}
          </div>`,
        });
      };
    });
    const concluir = (i) => {
      feitos[i] = true;
      const p = prog(); p.t[cap.id] = Object.assign({}, p.t[cap.id], { [i]: true }); salvarProg(p);
      $app.querySelectorAll(`[data-tut="${i}"]`).forEach((li) => li.classList.add('done', 'pop'));
      const n = tut.filter((_, k) => feitos[k]).length;
      $app.querySelectorAll('[data-tut-cont]').forEach((el) => { el.textContent = `${n}/${tut.length}`; });
      toast(n === tut.length ? 'Você completou todos os desafios! 🎉' : `✓ ${tut[i].titulo}`);
    };
    const fsTog = $app.querySelector('[data-fs-tut-toggle]');
    if (fsTog) fsTog.onclick = () => fsTog.parentElement.classList.toggle('min');
    const fr = $app.querySelector('.sim-frame iframe');
    if (!fr) return;
    const ligar = () => {
      let doc;
      try { doc = fr.contentDocument; } catch { return; }
      if (!doc || !doc.body) return;
      const leitor = (clique) => ({
        num: (id) => { const el = doc.getElementById(id); return el ? parseFloat(el.value) : NaN; },
        marcado: (id) => !!(doc.getElementById(id) || {}).checked,
        ativo: (sel) => !!doc.querySelector(sel + '.active'),
        clicou: (sel) => !!(clique && clique.closest && clique.closest(sel)),
      });
      const checar = (clique) => {
        if (!document.body.contains(fr)) return clearInterval(tutTimer);
        tut.forEach((d, i) => {
          if (feitos[i]) return;
          let ok = false;
          try { ok = !!d.ok(leitor(clique)); } catch { /* controle não existe nesta versão da simulação */ }
          if (ok) concluir(i);
        });
      };
      doc.addEventListener('input', () => checar(null));
      doc.addEventListener('change', () => checar(null));
      // Depois do clique, para a simulação já ter atualizado os botões (.active).
      doc.addEventListener('click', (e) => { const alvo = e.target; setTimeout(() => checar(alvo), 40); }, true);
      clearInterval(tutTimer);
      tutTimer = setInterval(() => checar(null), 800);
    };
    fr.addEventListener('load', ligar);
  }

  // ---------- Fixação / Exercícios: trilha de fases ----------
  async function viewTrilha({ area, bloco, cap }) {
    let qs;
    try { qs = await getQuestions(cap); } catch {
      $app.innerHTML = pageHead(cap.titulo, '', '#/map') + errorBox('Erro ao carregar os exercícios.');
      bindBack(); return bindRetry();
    }
    let html = pageHead(cap.titulo || TIPO_NOME[cap.tipo], crumbDe(area, bloco), '#/map');
    if (!qs.length) {
      html += `<div class="card muted" style="margin-top:20px">Nenhum exercício cadastrado ainda.</div>`;
      $app.innerHTML = html; return bindBack();
    }
    const p = prog();
    const feitas = qs.filter((q) => p.q[q.id]).length;
    html += `<div class="card row" style="margin:8px 0 4px"><span style="color:var(--acc)">${ICON.edit.replace('<svg', '<svg width="22" height="22"')}</span>
      <span style="font-weight:800">${cap.tipo === 'extra' ? 'EXERCÍCIOS' : 'FIXAÇÃO'}</span><span class="spacer"></span>
      <span class="muted" style="font-weight:800">${feitas}/${qs.length}</span></div>`;
    if (cap.conteudo && cap.conteudo.simulacao_url) {
      html += `<div class="card row small" style="margin:8px 0 4px"><span style="color:var(--acc);width:22px;height:22px;flex:0 0 22px">${ICON.atom}</span>
        <span class="muted">Estas questões usam a simulação: ela aparece junto de cada fase.</span></div>`;
    }
    const nodes = qs.map((q, i) => ({
      titulo: `Fase ${i + 1}`, icon: 'play',
      concluido: !!p.q[q.id],
      desbloqueado: i === 0 || !!p.q[qs[i - 1].id] || !!p.q[q.id],
    }));
    html += trailHtml(nodes);
    $app.innerHTML = html;
    bindBack();
    drawTrails();
    $app.querySelectorAll('[data-node]').forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.node;
        if (!nodes[i].desbloqueado) return toast('Conclua a fase anterior para desbloquear.');
        go(`#/q/${cap.id}/${i}`);
      };
    });
    const atual = nodes.findIndex((n) => !n.concluido);
    if (atual > 1) $app.querySelectorAll('[data-node]')[atual]?.scrollIntoView({ block: 'center' });
  }

  // Simulação embutida no topo de uma questão (Fixação/Exercícios com
  // capitulo_conteudo.simulacao_url — painel → aba Demo → botão 🧪).
  // Tela cheia da simulação: o botão ⛶ de dentro dela pede por mensagem
  // (simulacoes/assets/js/simulation-shell.js) e a demo põe o quadro todo
  // em tela cheia — barra da pergunta + simulação. Sem a API de tela cheia
  // (iPhone), a classe .fs sozinha cobre a janela.
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  // deitar: botão "Deitar e tela cheia" da simulação no celular — trava a
  // tela deitada (só Android; no iPhone a simulação pede para girar).
  function simFs(wrap, on, deitar) {
    if (!wrap) return;
    wrap.classList.toggle('fs', on);
    document.body.classList.toggle('sim-fs-on', on);
    if (on) {
      const travar = () => {
        if (!deitar) return;
        try { const p = screen.orientation.lock('landscape'); if (p && p.catch) p.catch(() => {}); } catch { /* sem suporte */ }
      };
      const req = fsElement() ? null : (wrap.requestFullscreen || wrap.webkitRequestFullscreen);
      if (req) {
        try { const p = req.call(wrap); if (p && p.then) p.then(travar, () => {}); else setTimeout(travar, 300); } catch { /* fica só a classe */ }
      } else travar();
    } else {
      try { screen.orientation.unlock(); } catch { /* ignore */ }
      if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
    const fr = wrap.querySelector('iframe');
    try { fr.contentWindow.postMessage({ luf: 'fs-state', on }, location.origin); } catch { /* ignore */ }
  }
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || e.data.luf !== 'fullscreen-toggle') return;
    const fr = [...document.querySelectorAll('.sim-frame iframe')].find((f) => f.contentWindow === e.source);
    if (!fr) return;
    const wrap = fr.closest('.sim-frame');
    simFs(wrap, e.data.on === true || !wrap.classList.contains('fs'), !!e.data.landscape);
  });
  // Esc / botão voltar do celular saem da tela cheia do navegador: desfaz a classe também.
  ['fullscreenchange', 'webkitfullscreenchange'].forEach((ev) => document.addEventListener(ev, () => {
    if (!fsElement()) document.querySelectorAll('.sim-frame.fs').forEach((w) => simFs(w, false));
  }));

  // Em tela cheia, a pergunta e as alternativas ficam numa barra discreta
  // no topo; dá para já marcar a alternativa ali (sincroniza com a tela).
  function simNaQuestaoHtml(url, dica, titulo, q) {
    if (!url) return '';
    const isMC = q && q.tipo === 'multipla_escolha' && Array.isArray(q.opcoes);
    const topo = q ? `<div class="sim-q">
        <button type="button" class="sim-q-enun" data-fsenun title="Toque para ver a pergunta inteira">${esc(q.enunciado)}</button>
        ${isMC ? `<div class="sim-q-opts">${q.opcoes.map((o, i) => `
          <button type="button" class="sim-q-opt" data-fsopt="${i}"><b>${LETRAS[i] || i + 1}</b>${esc(o)}</button>`).join('')}</div>` : ''}
      </div>` : '';
    return simFrameHtml(url, titulo, 'sim-ex', topo)
      + `<p class="small muted" style="margin:6px 0 14px">${esc(dica || 'Use a simulação para responder.')}</p>`;
  }

  // Tela de uma pergunta (igual ao viewExercicio de js/app.js, sem Cargas).
  // aoResponder(resposta) faz o resto: corrige e mostra o resultado.
  function telaPergunta({ area, bloco, q, titulo, sair, botao = 'RESPONDER', sim = null, aoResponder }) {
    let selecionada = null;
    const isMC = q.tipo === 'multipla_escolha' && Array.isArray(q.opcoes);
    $app.innerHTML = `
      <div class="ex-top">
        <button class="back" data-back="${esc(sair)}" aria-label="Sair">${ICON.close}</button>
        <div class="title"><div class="k">${esc(area?.icone || '')} ${esc(area?.titulo || '')}</div>${esc(bloco?.titulo || '')} · ${esc(titulo)}</div>
        <span class="timer" data-timer>00:00</span>
      </div>
      ${sim ? simNaQuestaoHtml(sim.url, sim.dica, titulo, q) : ''}
      <div class="enunciado">${esc(q.enunciado)}</div>
      ${isMC
        ? `<div class="opts">${q.opcoes.map((o, i) => `
            <button class="opt" data-opt="${i}"><span class="letter">${LETRAS[i] || i + 1}</span><span class="txt">${esc(o)}</span></button>`).join('')}</div>`
        : `<label class="field"><span>Sua resposta</span><input type="text" data-text autocomplete="off"></label>`}
      <div class="bottom-cta"><button class="btn btn-primary btn-block" data-send>${esc(botao)}</button></div>`;
    bindBack();
    let seg = 0;
    clearInterval(exTimer);
    const tEl = $app.querySelector('[data-timer]');
    exTimer = setInterval(() => {
      if (!document.body.contains(tEl)) return clearInterval(exTimer);
      seg++;
      tEl.textContent = `${String(Math.floor(seg / 60) % 60).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
    }, 1000);
    // Alternativas da tela e da barra da tela cheia andam juntas.
    const marcar = (i) => {
      $app.querySelectorAll('[data-opt],[data-fsopt]').forEach((x) => {
        x.classList.toggle('sel', +(x.dataset.opt ?? x.dataset.fsopt) === i);
      });
      selecionada = q.opcoes[i];
    };
    $app.querySelectorAll('[data-opt]').forEach((b) => { b.onclick = () => marcar(+b.dataset.opt); });
    $app.querySelectorAll('[data-fsopt]').forEach((b) => { b.onclick = () => marcar(+b.dataset.fsopt); });
    const enun = $app.querySelector('[data-fsenun]');
    if (enun) enun.onclick = () => enun.classList.toggle('open');
    const txt = $app.querySelector('[data-text]');
    const send = $app.querySelector('[data-send]');
    if (txt) { txt.focus(); txt.onkeydown = (e) => { if (e.key === 'Enter') send.click(); }; }
    send.onclick = () => {
      const resposta = isMC ? selecionada : (txt.value || '').trim();
      if (!resposta) return toast('Escolha ou digite uma resposta');
      clearInterval(exTimer);
      aoResponder(resposta);
    };
  }
  let exTimer = null;

  async function viewExercicio(capId, idx) {
    idx = +idx;
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    let ctx, qs;
    try {
      await loadCurriculo();
      ctx = findCap(capId);
      if (!ctx.cap || ctx.cap.trancado) return go('#/map');
      qs = await getQuestions(ctx.cap);
    } catch {
      $app.innerHTML = errorBox('Erro ao carregar a questão.'); return bindRetry();
    }
    $app.style.cssText = temaVars(corTema(ctx.area, ctx.bloco));
    const trilhaHash = `#/c/${ctx.cap.id}`;
    const q = qs[idx];
    const p = prog();
    if (!q || (idx > 0 && !p.q[qs[idx - 1].id] && !p.q[q.id])) return go(trilhaHash);

    const cc = ctx.cap.conteudo || {};
    telaPergunta({
      area: ctx.area, bloco: ctx.bloco, q, titulo: `Fase ${idx + 1}`, sair: trilhaHash,
      sim: cc.simulacao_url ? { url: cc.simulacao_url, dica: cc.texto } : null,
      aoResponder(resposta) {
        const acertou = corrigir(q, resposta);
        let concluiuAgora = false;
        if (acertou) {
          acertarPergunta(q.id);
          const pp = prog();
          if (!pp.c[ctx.cap.id] && qs.every((x) => pp.q[x.id])) { concluirCap(ctx.cap.id); concluiuAgora = true; }
        }
        viewResultado({ acertou, q, concluiuAgora, backHash: trilhaHash });
      },
    });
  }

  // Resultado (igual ao viewResultado de js/app.js, sem Joules/Cargas).
  function viewResultado({ acertou, q, concluiuAgora, backHash }) {
    const cor = acertou ? 'var(--success)' : 'var(--error)';
    $app.innerHTML = `
      <div class="result">
        <div class="badge" style="background:${acertou ? 'rgba(76,217,123,.15)' : 'rgba(255,92,122,.15)'};color:${cor}">${acertou ? ICON.check : ICON.close}</div>
        <h2 style="color:${cor}">${acertou ? 'Mandou bem!' : 'Quase lá!'}</h2>
        <div class="answer-box" style="margin-bottom:16px"><div class="k">RESPOSTA CORRETA</div><div style="font-weight:800;margin-top:4px">${esc(q.resposta_correta)}</div></div>
        ${concluiuAgora ? `<div class="unlock"><div class="k">CAPÍTULO CONCLUÍDO!</div>
          <div class="small">Próximo capítulo liberado na trilha.</div></div>` : ''}
        ${q.explicacao ? `<div class="card explain"><div class="k">EXPLICAÇÃO</div><div class="prose">${esc(q.explicacao)}</div></div>` : ''}
        <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>CONTINUAR</button></div>
      </div>`;
    $app.querySelector('[data-ok]').onclick = () => go(backHash);
    window.scrollTo(0, 0);
  }

  // ---------- Prova (versão simples: todas as perguntas, nota no fim) ----------
  async function viewProva(ctx) {
    const { area, bloco, cap } = ctx;
    let qs;
    try { qs = await getQuestions(cap); } catch {
      $app.innerHTML = pageHead(cap.titulo, '', '#/map') + errorBox('Erro ao carregar a prova.');
      bindBack(); return bindRetry();
    }
    $app.innerHTML = pageHead(cap.titulo || 'Prova', crumbDe(area, bloco), '#/map') + (qs.length ? `
      <div class="card stack" style="margin-top:12px;text-align:center">
        <div style="color:var(--acc);width:44px;height:44px;margin:0 auto">${ICON.trophy}</div>
        <b style="font-size:19px">${qs.length} ${qs.length === 1 ? 'questão' : 'questões'}</b>
        <span class="small muted">Responda todas e veja sua nota no final. Na versão completa a prova tem modo fácil e difícil, histórico de tentativas e recompensas.</span>
      </div>
      <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>COMEÇAR PROVA</button></div>`
      : `<div class="card muted" style="margin-top:20px">Nenhuma questão cadastrada nesta prova ainda.</div>`);
    bindBack();
    const ok = $app.querySelector('[data-ok]');
    if (!ok) return;
    ok.onclick = () => {
      const respostas = [];
      const proxima = (i) => {
        if (i >= qs.length) return viewProvaResultado(ctx, qs, respostas);
        window.scrollTo(0, 0);
        telaPergunta({
          area, bloco, q: qs[i], titulo: `Questão ${i + 1}/${qs.length}`, sair: '#/map',
          botao: i === qs.length - 1 ? 'FINALIZAR' : 'PRÓXIMA',
          aoResponder(resposta) { respostas[i] = resposta; proxima(i + 1); },
        });
      };
      proxima(0);
    };
  }

  function viewProvaResultado({ cap }, qs, respostas) {
    concluirCap(cap.id);
    const certas = qs.filter((q, i) => corrigir(q, respostas[i])).length;
    const pct = Math.round((certas / qs.length) * 100);
    const cor = pct >= 60 ? 'var(--success)' : 'var(--error)';
    $app.innerHTML = `
      <div class="result">
        <div class="badge" style="background:${pct >= 60 ? 'rgba(76,217,123,.15)' : 'rgba(255,92,122,.15)'};color:${cor}">${pct >= 60 ? ICON.trophy : ICON.close}</div>
        <h2 style="color:${cor}">${certas}/${qs.length} acertos</h2>
        <p class="muted" style="margin:-6px 0 18px">${pct >= 60 ? 'Mandou bem na prova!' : 'Revise o conteúdo e tente de novo.'}</p>
        <div class="stack" style="text-align:left">${qs.map((q, i) => {
          const ok = corrigir(q, respostas[i]);
          return `<div class="card">
            <div class="row" style="align-items:flex-start"><span style="color:${ok ? 'var(--success)' : 'var(--error)'};width:22px;height:22px;flex:0 0 22px">${ok ? ICON.check : ICON.close}</span>
            <div style="flex:1;min-width:0"><div class="small muted">Questão ${i + 1}</div><div style="white-space:pre-wrap">${esc(q.enunciado)}</div>
            ${ok ? '' : `<div class="small" style="margin-top:6px">Sua resposta: <b>${esc(respostas[i])}</b></div>`}
            <div class="small" style="margin-top:4px">Correta: <b>${esc(q.resposta_correta)}</b></div>
            ${q.explicacao ? `<div class="small muted" style="margin-top:6px;white-space:pre-wrap">${esc(q.explicacao)}</div>` : ''}</div></div>
          </div>`;
        }).join('')}</div>
        <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>CONTINUAR</button></div>
      </div>`;
    $app.querySelector('[data-ok]').onclick = () => go('#/map');
    window.scrollTo(0, 0);
  }

  // ---------- Plus (vitrine) ----------
  function viewPlus() {
    const PC = CFG.PLUS || {};
    const pct = Math.round((PC.AULA_DESCONTO_PLUS || 0) * 100);
    // Mesmos benefícios da página de venda em js/app.js (viewPlus).
    const beneficios = [
      ['phone', 'App com conteúdo e simulações', 'Tudo do LevelUp Fís: trilhas, resumos, exercícios e simulações físicas.'],
      ['chat', 'Comunidade de alunos', 'Grupo exclusivo no WhatsApp para trocar ideias, resoluções e se ajudar.'],
      ['question', `Dúvidas respondidas em até ${PC.PRAZO_RESPOSTA_HORAS || 24}h`, 'Mande sua dúvida pelo site e receba a explicação do professor.'],
      ['live', '1 plantão ao vivo por mês', 'Encontro em grupo, ao vivo, para tirar dúvidas coletivas antes das provas.'],
      ['flag', 'Desafios mensais', 'Um problema novo todo mês para manter o ritmo e testar o que você aprendeu.'],
      ['tag', `${pct}% de desconto em aulas particulares`, 'Desconto de assinante em todas as aulas individuais com o professor.'],
    ];
    $app.innerHTML = topBar() + `
      <div class="plus-layout">
        <div class="plus-main">
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
          <div class="card checkout-card">
            <div class="section-title" style="margin-top:0">Planos</div>
            <div class="demo-embreve">
              <span class="demo-pill">Em breve</span>
              <p class="small muted">Os planos do LevelUp Plus abrem em breve. Fique de olho!</p>
            </div>
          </div>
        </aside>
      </div>
      ${bottomNav('plus')}`;
  }

  // ---------- Perfil ----------
  function viewProfile() {
    const l = lead() || {};
    const caps = (S.areas || []).flatMap((a) => (a.blocos || []).flatMap((b) => b.capitulos || [])).filter((c) => !c.trancado);
    const feitos = caps.filter((c) => capConcluido(c.id)).length;
    $app.innerHTML = `
      <div class="pagehead"><h2>Perfil</h2></div>
      <div class="profile-grid"><div class="pcol">
      <div class="profile-hero">
        <div class="avatar"><span class="lvl-badge">DEMO</span></div>
        <div class="name">${esc(l.nome || 'Visitante')}</div>
        <div class="small muted">${esc(l.email || '')}${l.telefone ? ` · ${esc(l.telefone)}` : ''}</div>
      </div>
      </div><div class="pcol">
      <div class="card demo-aviso">
        <b>Você está na versão demonstração</b>
        <span class="small muted">Aqui não tem Joules, Cargas nem Fótons, e o seu progresso fica salvo só neste navegador.${S.areas ? ` Capítulos concluídos: ${feitos} de ${caps.length}.` : ''}</span>
      </div>
      <a class="btn btn-primary btn-block btn-lg" style="margin-top:14px" href="${WHATSAPP}" target="_blank" rel="noopener">${ICON.chat} Falar no WhatsApp</a>
      <button class="btn btn-ghost btn-block" style="margin-top:10px" data-sair>Sair da demonstração</button>
      </div></div>
      ${bottomNav('perfil')}`;
    $app.querySelector('[data-sair]').onclick = async () => {
      const ok = await modal({
        title: 'Sair da demonstração?', text: 'Seus dados e o progresso são apagados deste navegador.',
        buttons: [{ label: 'Cancelar', value: false }, { label: 'Sair', value: true, cls: 'btn-primary' }],
      });
      if (!ok) return;
      apagar(LEAD_KEY); apagar(PROG_KEY);
      go('#/');
    };
  }

  // ================================================================
  // Roteador
  // ================================================================
  function render() {
    clearInterval(exTimer);
    clearInterval(tutTimer);
    document.body.classList.remove('sim-fs-on');
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    document.getElementById('modal-root').innerHTML = '';
    $app.className = 'app';
    $app.removeAttribute('style');
    window.scrollTo(0, 0);

    const parts = (location.hash || '#/').split('?')[0].replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    if (!lead()) return parts[0] ? go('#/') : viewEntrada();
    switch (parts[0]) {
      case 'map': return viewMap();
      case 'plus': return viewPlus();
      case 'profile': return viewProfile();
      case 'c': return viewCapitulo(parts[1]);
      case 'q': return viewExercicio(parts[1], parts[2]);
      default: return go('#/map');
    }
  }

  // ================================================================
  // Fundo estrelado — versão enxuta de starfield() em js/app.js
  // (meteoros só na tela de entrada)
  // ================================================================
  function starfield() {
    const c = document.getElementById('starfield');
    const ctx = c.getContext('2d');
    let stars = [];
    const meteors = [];
    let nextMeteor = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((innerWidth * innerHeight) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.3, a: Math.random() * 0.5 + 0.15, p: Math.random() * Math.PI * 2,
        v: 1 / (500 + Math.random() * 700),
      }));
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const s of stars) {
        const w = 0.5 + 0.5 * Math.sin(t * s.v + s.p);
        ctx.fillStyle = `rgba(${150 + 70 * w | 0},${158 + 66 * w | 0},${210 + 35 * w | 0},${Math.min(1, s.a * 1.8) * (0.08 + 0.92 * w)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (0.85 + 0.35 * w), 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) {
        if (!nextMeteor) nextMeteor = t + 1000;
        if (t >= nextMeteor) {
          if (document.querySelector('.demo-gate') && !document.hidden) {
            const ang = Math.PI / 5 + Math.random() * 0.25;
            meteors.push({
              x: innerWidth * (0.35 + Math.random() * 0.75), y: -20 + Math.random() * innerHeight * 0.35,
              dx: -Math.cos(ang), dy: Math.sin(ang), speed: 0.45 + Math.random() * 0.35,
              len: 90 + Math.random() * 90, born: t, life: 1100 + Math.random() * 700,
            });
          }
          nextMeteor = t + 1800 + Math.random() * 3000;
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          const k = (t - m.born) / m.life;
          if (k >= 1) { meteors.splice(i, 1); continue; }
          const d = (t - m.born) * m.speed;
          const hx = m.x + m.dx * d, hy = m.y + m.dy * d;
          const g = ctx.createLinearGradient(hx, hy, hx - m.dx * m.len, hy - m.dy * m.len);
          g.addColorStop(0, `rgba(230,234,255,${Math.sin(Math.PI * k) * 0.55})`);
          g.addColorStop(1, 'rgba(160,170,230,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - m.dx * m.len, hy - m.dy * m.len); ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    };
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  starfield();
  window.addEventListener('hashchange', render);
  render();
})();
