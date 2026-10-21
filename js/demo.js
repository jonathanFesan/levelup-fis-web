// LevelUp Fís — versão demonstração (levelupfis.com.br/demo).
//
// A pessoa deixa nome, e-mail e telefone (tabela demo_leads) e testa um
// Mapa reduzido, montado no painel → aba Demo (demo_modulos / demo_itens).
// Sem conta e sem backend: lê e grava direto no Supabase com a anon key
// (policies em backend/sql/023_versao_demo.sql). Não existe Joule, Carga
// nem Fóton aqui; o "visto" de cada etapa fica só neste navegador.
//
// Abas: Mapa, Plus (vitrine) e Perfil. Visual e classes de css/style.css,
// os mesmos de js/app.js — os trechos copiados de lá estão marcados.

(function demo() {
  const CFG = window.LUP_CONFIG;
  const $app = document.getElementById('app');
  const SITE = '../'; // raiz do site (login, cadastro, simulações)
  const LEAD_KEY = 'lup.demo.lead';
  const VISTOS_KEY = 'lup.demo.vistos';

  // ================================================================
  // Utilidades (iguais às de js/app.js)
  // ================================================================
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICON = {
    user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 14a8 8 0 0 1-6.2-3c.9-1.7 3.6-2.8 6.2-2.8s5.3 1.1 6.2 2.8A8 8 0 0 1 12 20z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 5.1 9 3 3 5.3V21l6-2.3 6 2.1 6-2.3V2.8zM10 5.4l4 1.4v11.8l-4-1.4z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-5 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM14 9h-4V7a2 2 0 0 1 4 0z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4.5c-1.1-.4-2.4-.5-3.5-.5-1.9 0-4 .4-5.5 1.5C10.5 4.4 8.4 4 6.5 4S2.5 4.4 1 5.5v14.6c0 .3.3.5.5.5h.3C3.1 19.9 4.9 19.5 6.5 19.5c1.9 0 4 .4 5.5 1.5 1.3-.8 3.8-1.5 5.5-1.5s3.4.3 4.7 1.1c.1.1.2.1.3.1.3 0 .5-.3.5-.5V5.5c-.6-.4-1.3-.8-2-1zM21 18c-1.1-.3-2.3-.5-3.5-.5-1.7 0-4.2.7-5.5 1.5V7.5c1.3-.8 3.8-1.5 5.5-1.5 1.2 0 2.4.2 3.5.5z"/></svg>',
    playCircle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 14.5v-9l6 4.5z"/></svg>',
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
  const TIPO_ICON = { resumo: 'book', video: 'playCircle', simulacao: 'atom' };
  const TIPO_NOME = { resumo: 'Resumo', video: 'Vídeo', simulacao: 'Simulação' };

  function toast(msg, ms = 2800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // Modal simples (versão enxuta do modal() de js/app.js).
  function modal({ title, text = '', icon = '', buttons = [{ label: 'Entendi', value: true, cls: 'btn-primary' }] }) {
    return new Promise((resolve) => {
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          ${icon ? `<div style="color:var(--gold);width:34px;height:34px;margin:0 auto">${icon}</div>` : ''}
          <h3>${esc(title)}</h3>
          ${text ? `<p>${esc(text)}</p>` : ''}
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
  // Simulação: caminho do próprio site (/simulacoes/...) ou link completo.
  const simUrl = (url) => (/^https?:\/\//i.test(url) ? url : SITE + String(url || '').replace(/^\/+/, ''));

  // Cor tema do Módulo — mesma conta de temaVars() em js/app.js.
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
  // Dados: Supabase direto (anon key) + o que fica no navegador
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
  const vistos = () => new Set(ler(VISTOS_KEY, []));
  const marcarVisto = (id) => { const v = vistos(); v.add(id); gravar(VISTOS_KEY, [...v]); };

  let MODULOS = null; // [{id,titulo,subtitulo,cor,demo_itens:[...]}]
  async function loadModulos(force = false) {
    if (MODULOS && !force) return MODULOS;
    MODULOS = await sb('demo_modulos?select=id,titulo,subtitulo,cor,ordem,demo_itens(id,tipo,titulo,descricao,url,texto,blocos,ordem,bloqueado)'
      + '&order=ordem.asc,id.asc&demo_itens.order=ordem.asc,id.asc');
    return MODULOS;
  }
  function findItem(id) {
    for (const m of MODULOS || []) {
      const it = (m.demo_itens || []).find((i) => String(i.id) === String(id));
      if (it) return { modulo: m, item: it };
    }
    return { modulo: null, item: null };
  }

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
  // Etapa trancada pelo painel: convite para a versão completa.
  async function avisoCompleta(titulo) {
    const r = await modal({
      title: titulo ? `"${titulo}" está na versão completa` : 'Disponível na versão completa',
      text: 'Crie sua conta grátis para liberar a trilha inteira, com exercícios, provas e recompensas.',
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
      const iconSvg = n.desbloqueado ? ICON[n.icon] : ICON.lock;
      return `
        <button class="tnode ${cls}" style="left:${x}%;top:${top}px" data-node="${i}">
          <span style="width:96px;height:96px;display:flex;align-items:center;justify-content:center">
            <span class="circle">${iconSvg}${n.concluido ? `<span class="check">${ICON.check}</span>` : ''}</span>
          </span>
          <span class="label">${esc(n.titulo)}</span>
        </button>`;
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
          <a class="btn btn-text btn-block" href="${SITE}#/login">Já tem conta? Entrar</a>
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
  async function viewMap() {
    $app.innerHTML = topBar() + loading() + bottomNav('mapa');
    let modulos;
    try { modulos = await loadModulos(true); } catch {
      $app.innerHTML = topBar() + errorBox('Erro ao carregar o mapa.') + bottomNav('mapa');
      return bindRetry();
    }
    const v = vistos();
    let html = topBar();
    html += `<div class="card demo-aviso"><b>Bem-vindo à versão demonstração!</b>
      <span class="small muted">Explore as etapas abaixo. Aqui você não ganha Joules, Cargas nem Fótons — isso fica para a versão completa.</span></div>`;

    if (!modulos.length) {
      html += `<div class="card muted" style="margin-top:24px">O conteúdo da demonstração está sendo preparado. Volte em breve!</div>`;
    }
    const trilhas = [];
    html += `<div class="topics">${modulos.map((m) => {
      const itens = m.demo_itens || [];
      let b = `<div class="topic-banner">${m.subtitulo ? `<div class="k">${esc(m.subtitulo)}</div>` : ''}<div class="t">${esc(m.titulo)}</div></div>`;
      if (!itens.length) {
        b += `<div class="card muted" style="margin:8px 0 20px">O conteúdo deste módulo ainda está sendo preparado.</div>`;
      } else {
        const nodes = itens.map((it) => ({
          titulo: it.titulo, icon: TIPO_ICON[it.tipo] || 'book',
          desbloqueado: !it.bloqueado, concluido: !it.bloqueado && v.has(it.id),
        }));
        trilhas.push(itens);
        b += `<div data-trilha="${trilhas.length - 1}">${trailHtml(nodes)}</div>`;
      }
      return `<section class="topic-block" style="${temaVars(m.cor)}">${b}</section>`;
    }).join('')}</div>`;
    html += bottomNav('mapa');
    $app.innerHTML = html;
    drawTrails();

    $app.querySelectorAll('[data-trilha]').forEach((wrap) => {
      const itens = trilhas[+wrap.dataset.trilha];
      wrap.querySelectorAll('[data-node]').forEach((b) => {
        b.onclick = () => {
          const it = itens[+b.dataset.node];
          if (it.bloqueado) return avisoCompleta(it.titulo);
          go(`#/i/${it.id}`);
        };
      });
    });
  }

  // ---------- Etapa (Resumo / Vídeo / Simulação) ----------
  async function viewItem(id) {
    $app.className = 'app no-nav';
    $app.innerHTML = loading();
    try { await loadModulos(); } catch {
      $app.innerHTML = pageHead('Demo', '', '#/map') + errorBox('Erro ao carregar o conteúdo.');
      bindBack(); return bindRetry();
    }
    const { modulo, item } = findItem(id);
    if (!item) return go('#/map');
    if (item.bloqueado) { go('#/map'); return avisoCompleta(item.titulo); }
    $app.style.cssText = temaVars(modulo.cor);

    let body;
    if (item.tipo === 'resumo') {
      const cartoes = window.Cartoes && Cartoes.temConteudo(item.blocos) ? Cartoes.render(item.blocos) : '';
      body = cartoes || `<div class="card">${item.texto && item.texto.trim()
        ? `<div class="prose">${esc(item.texto)}</div>`
        : '<p class="muted">O conteúdo deste resumo ainda não foi cadastrado.</p>'}</div>`;
    } else if (item.tipo === 'video') {
      const em = embedUrl(item.url);
      let player;
      if (em && em.startsWith('video:')) player = `<div class="video-embed"><video src="${esc(em.slice(6))}" controls></video></div>`;
      else if (em) player = `<div class="video-embed"><iframe src="${esc(em)}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe></div>`;
      else if (item.url) player = `<a class="btn btn-ghost btn-block" href="${esc(item.url)}" target="_blank" rel="noopener">${ICON.playCircle} Assistir vídeo</a>`;
      else player = '<p class="muted">O vídeo desta etapa ainda não foi cadastrado.</p>';
      body = `<div class="card stack">${player}${item.descricao ? `<div class="prose" style="font-size:15px">${esc(item.descricao)}</div>` : ''}</div>`;
    } else {
      body = item.url
        ? `<div class="sim-frame"><iframe src="${esc(simUrl(item.url))}" title="${esc(item.titulo)}" allow="fullscreen" allowfullscreen></iframe></div>
           <div class="row" style="margin-top:10px">${item.descricao ? `<span class="small muted" style="flex:1">${esc(item.descricao)}</span>` : '<span class="spacer"></span>'}
           <a class="btn btn-text" href="${esc(simUrl(item.url))}" target="_blank" rel="noopener">${ICON.expand} Tela cheia</a></div>`
        : '<div class="card"><p class="muted">A simulação desta etapa ainda não foi cadastrada.</p></div>';
    }

    const jaVisto = vistos().has(item.id);
    $app.innerHTML = pageHead(item.titulo || TIPO_NOME[item.tipo], [modulo.subtitulo, modulo.titulo].filter(Boolean).join(' · '), '#/map') + `
      ${body}
      <div class="bottom-cta"><button class="btn btn-primary btn-block" data-ok>${item.tipo === 'resumo' && !jaVisto ? 'ENTENDIDO' : 'CONTINUAR'}</button></div>`;
    bindBack();
    $app.querySelector('[data-ok]').onclick = () => { marcarVisto(item.id); go('#/map'); };
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
            <div class="prices">${(PC.PLANOS || []).map((p) => `
              <div class="price-card">
                <div class="k">${esc(p.nome)}</div>
                <div class="v">${esc(p.preco)}<small>${esc(p.sufixo || '')}</small></div>
                <div class="small muted">${esc(p.obs || '')}</div>
              </div>`).join('')}
            </div>
            <a class="btn btn-primary btn-block btn-lg" href="${SITE}#/register">${ICON.crown} Criar conta para assinar</a>
            <p class="small muted" style="text-align:center;margin:8px 0 0">Na demonstração o Plus é só uma vitrine — a assinatura fica na versão completa.</p>
          </div>
        </aside>
      </div>
      ${bottomNav('plus')}`;
  }

  // ---------- Perfil ----------
  function viewProfile() {
    const l = lead() || {};
    const total = (MODULOS || []).reduce((s, m) => s + (m.demo_itens || []).filter((i) => !i.bloqueado).length, 0);
    const feitos = vistos().size;
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
        <span class="small muted">Aqui não tem Joules, Cargas nem Fótons, e o que você já viu fica salvo só neste navegador.${MODULOS ? ` Etapas vistas: ${Math.min(feitos, total)} de ${total}.` : ''}</span>
      </div>
      <a class="btn btn-primary btn-block btn-lg" style="margin-top:14px" href="${SITE}#/register">Criar minha conta completa</a>
      <button class="btn btn-ghost btn-block" style="margin-top:10px" data-sair>Sair da demonstração</button>
      </div></div>
      ${bottomNav('perfil')}`;
    $app.querySelector('[data-sair]').onclick = async () => {
      const ok = await modal({
        title: 'Sair da demonstração?', text: 'Seus dados e as etapas vistas são apagados deste navegador.',
        buttons: [{ label: 'Cancelar', value: false }, { label: 'Sair', value: true, cls: 'btn-primary' }],
      });
      if (!ok) return;
      apagar(LEAD_KEY); apagar(VISTOS_KEY);
      go('#/');
    };
  }

  // ================================================================
  // Roteador
  // ================================================================
  function render() {
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
      case 'i': return viewItem(parts[1]);
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
