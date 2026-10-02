// Conteúdo em cartões (Resumo e Curiosidade) — visual "B · Cartões".
//
// Este arquivo é a ÚNICA fonte do visual: o site usa para mostrar o
// conteúdo ao aluno, e o painel do professor (backend/painel-perguntas.html)
// carrega este mesmo arquivo de levelupfis.com.br para a pré-visualização
// do editor — o que o professor vê é exatamente o que o aluno vê.
//
// Formato salvo no banco (topic_content.resumo_blocos e
// capitulo_conteudo.blocos):
// {
//   v: 1,
//   capa: { icone: '⚡', etiqueta: 'Conceito-chave', titulo: 'Velocidade média' },
//   blocos: [
//     { tipo: 'cartao', etiqueta: 'O QUE É', cor: 'ciano', titulo: '...', html: '<p>...</p>' },
//     { tipo: 'formula', texto: 'v_m = Δs / Δt', legenda: '...' },
//     { tipo: 'destaque', variante: 'dica' | 'atencao' | 'exemplo', html: '...' },
//     { tipo: 'valores', itens: ['Δs = 120 km', 'Δt = 2 h'] },
//     { tipo: 'imagem', url: 'https://...', legenda: '...' },
//     { tipo: 'video', url: 'https://youtube.com/...', legenda: '...' },
//   ],
// }
// Fórmulas e valores aceitam índice e expoente: v_0, v_{m}, t^2, 10^{-3}.

(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Cores e fontes que o editor oferece (combinam com o fundo escuro).
  const PALETA = [
    ['#FCF3C8', 'Creme'], ['#FAFAFC', 'Branco'], ['#FFC65C', 'Dourado'], ['#FF9D42', 'Laranja'],
    ['#7FD8E8', 'Ciano'], ['#4CD97B', 'Verde'], ['#FF5C7A', 'Rosa'], ['#B79EFF', 'Lilás'],
  ];
  const MARCA_TEXTO = [['#5c4a1f', 'Dourado'], ['#1f4a52', 'Ciano'], ['#1f4a33', 'Verde'], ['#552334', 'Rosa'], ['#3d3266', 'Lilás']];
  const CORES_ETIQUETA = { ciano: 'Ciano', dourado: 'Dourado', verde: 'Verde', rosa: 'Rosa', lilas: 'Lilás' };
  const DESTAQUES = {
    dica: { titulo: 'Dica', icone: 'i' },
    atencao: { titulo: 'Atenção', icone: '!' },
    exemplo: { titulo: 'Exemplo resolvido', icone: '✓' },
  };

  // v_0 → v<sub>0</sub> · t^{2} → t<sup>2</sup>
  function formula(texto) {
    return esc(texto)
      .replace(/([_^])\{([^}]*)\}/g, (m, t, x) => (t === '_' ? `<sub>${x}</sub>` : `<sup>${x}</sup>`))
      .replace(/([_^])([^\s{}_^]+?)(?=[\s,;.)=+\-*/×·÷]|$)/g, (m, t, x) => (t === '_' ? `<sub>${x}</sub>` : `<sup>${x}</sup>`));
  }

  // Texto rico do editor (Quill) passa por aqui antes de aparecer: só
  // ficam tags de formatação, links seguros e cores no atributo style.
  function limpar(html) {
    if (!html) return '';
    if (!window.DOMPurify) return esc(html.replace(/<[^>]*>/g, ' '));
    const out = window.DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span', 'a', 'ol', 'ul', 'li', 'sub', 'sup', 'h3', 'h4'],
      ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel', 'data-list'],
      ALLOWED_URI_REGEXP: /^(https?:|mailto:)/i,
    });
    const tmp = document.createElement('div');
    tmp.innerHTML = out;
    tmp.querySelectorAll('[style]').forEach((el) => {
      const ok = [];
      if (el.style.color) ok.push(`color:${el.style.color}`);
      if (el.style.backgroundColor) ok.push(`background-color:${el.style.backgroundColor}`);
      if (ok.length) el.setAttribute('style', ok.join(';')); else el.removeAttribute('style');
    });
    tmp.querySelectorAll('[class]').forEach((el) => {
      const cls = [...el.classList].filter((c) => /^ql-(font|size|align)-/.test(c));
      if (cls.length) el.className = cls.join(' '); else el.removeAttribute('class');
    });
    tmp.querySelectorAll('a').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
    return tmp.innerHTML;
  }

  function youtubeId(url) {
    try {
      const u = new URL(url);
      const h = u.hostname.replace(/^www\.|^m\./, '');
      if (h === 'youtu.be') return u.pathname.slice(1).split('/')[0];
      if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
        if (m) return m[2];
      }
    } catch { /* link inválido */ }
    return null;
  }
  const urlOk = (u) => /^https?:\/\//i.test(u || '');

  function bloco(b) {
    switch (b.tipo) {
      case 'cartao': {
        const cor = CORES_ETIQUETA[b.cor] ? b.cor : 'ciano';
        return `<section class="rc-bloco">
          ${b.etiqueta || b.titulo ? `<h3 class="rc-tit">${b.etiqueta ? `<i class="rc-tag rc-${cor}">${esc(b.etiqueta)}</i>` : ''}${esc(b.titulo || '')}</h3>` : ''}
          <div class="rc-texto">${limpar(b.html)}</div></section>`;
      }
      case 'formula':
        if (!b.texto) return '';
        return `<div class="rc-formula"><div class="rc-eq">${formula(b.texto)}</div>${b.legenda ? `<small>${formula(b.legenda)}</small>` : ''}</div>`;
      case 'destaque': {
        const d = DESTAQUES[b.variante] || DESTAQUES.dica;
        const v = DESTAQUES[b.variante] ? b.variante : 'dica';
        return `<div class="rc-destaque rc-${v}"><span class="rc-ic">${d.icone}</span><div><b>${esc(b.titulo || d.titulo)}</b><div class="rc-texto">${limpar(b.html)}</div></div></div>`;
      }
      case 'valores': {
        const itens = (b.itens || []).filter((x) => String(x).trim());
        return itens.length ? `<div class="rc-chips">${itens.map((x) => `<span class="rc-chip">${formula(x)}</span>`).join('')}</div>` : '';
      }
      case 'imagem':
        if (!urlOk(b.url)) return '';
        return `<figure class="rc-figura"><img src="${esc(b.url)}" alt="${esc(b.legenda || '')}" loading="lazy">${b.legenda ? `<figcaption>${esc(b.legenda)}</figcaption>` : ''}</figure>`;
      case 'video': {
        if (!urlOk(b.url)) return '';
        const id = youtubeId(b.url);
        const corpo = id
          ? `<div class="rc-video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}" title="${esc(b.legenda || 'Vídeo')}" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
          : `<a class="rc-video-link" href="${esc(b.url)}" target="_blank" rel="noopener">▶ Assistir vídeo</a>`;
        return `<figure class="rc-figura">${corpo}${b.legenda ? `<figcaption>${esc(b.legenda)}</figcaption>` : ''}</figure>`;
      }
      default: return '';
    }
  }

  function render(doc) {
    if (!doc || !Array.isArray(doc.blocos)) return '';
    const c = doc.capa || {};
    const capa = c.titulo ? `<header class="rc-capa">${c.icone ? `<span class="rc-n">${esc(c.icone)}</span>` : ''}<div>${c.etiqueta ? `<small>${esc(c.etiqueta)}</small>` : ''}<h2>${esc(c.titulo)}</h2></div></header>` : '';
    return `<div class="cartoes">${capa}${doc.blocos.map(bloco).join('')}</div>`;
  }

  const temConteudo = (doc) => !!(doc && Array.isArray(doc.blocos) && doc.blocos.length);

  // Versão só texto (o app Android, por enquanto, mostra só isto).
  function textoPlano(doc) {
    if (!temConteudo(doc)) return '';
    const semTags = (h) => {
      const t = document.createElement('div');
      t.innerHTML = String(h || '').replace(/<\/(p|li|h3|h4)>/g, '\n').replace(/<br\s*\/?>/g, '\n');
      return t.textContent.replace(/\n{3,}/g, '\n\n').trim();
    };
    const partes = [];
    if (doc.capa && doc.capa.titulo) partes.push(doc.capa.titulo.toUpperCase());
    doc.blocos.forEach((b) => {
      if (b.tipo === 'cartao') partes.push([[b.etiqueta, b.titulo].filter(Boolean).join(' — '), semTags(b.html)].filter(Boolean).join('\n'));
      if (b.tipo === 'formula' && b.texto) partes.push(b.texto + (b.legenda ? `\n(${b.legenda})` : ''));
      if (b.tipo === 'destaque') partes.push(`${(DESTAQUES[b.variante] || DESTAQUES.dica).titulo}: ${semTags(b.html)}`);
      if (b.tipo === 'valores') partes.push((b.itens || []).join(' · '));
      if ((b.tipo === 'imagem' || b.tipo === 'video') && b.legenda) partes.push(`[${b.tipo === 'video' ? 'Vídeo' : 'Imagem'}: ${b.legenda}]`);
    });
    return partes.filter(Boolean).join('\n\n');
  }

  window.Cartoes = { render, textoPlano, temConteudo, formula, limpar, youtubeId, PALETA, MARCA_TEXTO, CORES_ETIQUETA, DESTAQUES };
})();
