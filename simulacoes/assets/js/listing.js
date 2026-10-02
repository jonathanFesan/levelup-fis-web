/* ============================================================
   LISTING.JS — LevelUpFís Simulations
   ------------------------------------------------------------
   Lê window.LUF.simulations / window.LUF.featured (definidos em
   data/simulations.js) e renderiza:
     - o carrossel de destaques da home (#luf-track)
     - o grid "Todos os simuladores" da home (#luf-grid)
     - o grid filtrado por categoria (fisica.html / matematica.html)
   incluindo os estados vazios exigidos pelo site (que nasce sem
   nenhuma simulação cadastrada).

   Depende de: data/simulations.js (antes) e layout.js (antes).
   Script clássico — sem fetch, sem ES modules.
   ============================================================ */
(function () {
  "use strict";

  var CATEGORY_LABELS = { fisica: "Física", matematica: "Matemática" };
  var MIN_CARDS_FOR_MARQUEE = 4;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ------------------------------------------------------------
  // Validação do registro (data/simulations.js)
  // Retorna apenas as entradas válidas; avisa no console sobre
  // qualquer problema encontrado, sem quebrar a página.
  // ------------------------------------------------------------
  function validateSimulations(raw) {
    var valid = [];
    var seenIds = Object.create(null);

    if (!Array.isArray(raw)) {
      console.warn("[LUF] window.LUF.simulations não é uma lista. Nenhuma simulação será exibida.");
      return valid;
    }

    raw.forEach(function (sim, index) {
      var label = "entrada #" + (index + 1) + (sim && sim.id ? ' ("' + sim.id + '")' : "");

      if (!sim || typeof sim !== "object") {
        console.warn("[LUF] " + label + " inválida: não é um objeto.");
        return;
      }
      if (!sim.id) {
        console.warn("[LUF] " + label + " ignorada: falta o campo \"id\".");
        return;
      }
      if (!sim.title) {
        console.warn("[LUF] " + label + " ignorada: falta o campo \"title\".");
        return;
      }
      if (!sim.category || (sim.category !== "fisica" && sim.category !== "matematica")) {
        console.warn("[LUF] " + label + " ignorada: \"category\" deve ser \"fisica\" ou \"matematica\" (valor atual: " + sim.category + ").");
        return;
      }
      if (!sim.path) {
        console.warn("[LUF] " + label + " ignorada: falta o campo \"path\".");
        return;
      }
      if (seenIds[sim.id]) {
        console.warn("[LUF] id duplicado \"" + sim.id + "\" em data/simulations.js — a entrada repetida foi ignorada.");
        return;
      }

      seenIds[sim.id] = true;
      valid.push(sim);
    });

    return valid;
  }

  function categoryLabel(cat) {
    return CATEGORY_LABELS[cat] || cat;
  }

  // Ícone SVG de reserva para quando a simulação não tem "thumbnail".
  function fallbackIconSvg(category) {
    if (category === "matematica") {
      return (
        '<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<line x1="8" y1="32" x2="56" y2="32"/>' +
        '<line x1="32" y1="8" x2="32" y2="56"/>' +
        '<path d="M14 48 Q32 4 50 48" stroke-width="2.5"/>' +
        "</svg>"
      );
    }
    // física (padrão): átomo simplificado
    return (
      '<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" ' +
      'stroke-width="2" aria-hidden="true">' +
      '<ellipse cx="32" cy="32" rx="26" ry="10"/>' +
      '<ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)"/>' +
      '<ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)"/>' +
      '<circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/>' +
      "</svg>"
    );
  }

  // Ícone do bloco de estado vazio ("Novas simulações em breve")
  function emptyStateIconSvg() {
    return (
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 8" opacity=".6"/>' +
      '<circle cx="60" cy="60" r="9" fill="currentColor"/>' +
      '<circle cx="94" cy="38" r="5" fill="currentColor" opacity=".7"/>' +
      "</svg>"
    );
  }

  function buildCardHtml(sim, root) {
    var href = root + sim.path;
    var thumbHtml;
    if (sim.thumbnail) {
      thumbHtml =
        '<img class="luf-card-thumb" src="' + escapeHtml(root + sim.thumbnail) + '" alt="" loading="lazy">';
    } else {
      thumbHtml =
        '<div class="luf-card-thumb luf-card-thumb-fallback" style="color:var(--accent)">' +
        fallbackIconSvg(sim.category) +
        "</div>";
    }

    return (
      '<a class="luf-card" href="' + escapeHtml(href) + '">' +
      thumbHtml +
      '<div class="luf-card-body">' +
      '<span class="luf-card-title">' + escapeHtml(sim.title) + "</span>" +
      (sim.summary ? '<span class="luf-card-summary">' + escapeHtml(sim.summary) + "</span>" : "") +
      '<span class="luf-card-tag">' + escapeHtml(categoryLabel(sim.category)) + "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function buildEmptyBlockHtml(message) {
    return (
      '<div class="luf-empty" style="color:var(--muted)" role="status">' +
      '<span style="display:block;color:var(--accent)">' + emptyStateIconSvg() + "</span>" +
      "<strong>Novas simulações em breve</strong>" +
      "<span>" + escapeHtml(message) + "</span>" +
      "</div>"
    );
  }

  function sortByTitlePtBr(list) {
    return list.slice().sort(function (a, b) {
      return a.title.localeCompare(b.title, "pt-BR");
    });
  }

  function computeFeatured(all) {
    var featuredIds = Array.isArray(window.LUF.featured) ? window.LUF.featured : [];
    var byId = {};
    all.forEach(function (sim) { byId[sim.id] = sim; });

    var result = [];
    featuredIds.forEach(function (id) {
      var sim = byId[id];
      if (!sim) {
        console.warn('[LUF] id "' + id + '" listado em window.LUF.featured não existe em window.LUF.simulations e foi ignorado.');
        return;
      }
      result.push(sim);
    });

    if (result.length === 0 && all.length > 0 && window.LUF.featuredFallback !== false) {
      result = all
        .slice()
        .sort(function (a, b) {
          if (a.addedAt && b.addedAt) return b.addedAt.localeCompare(a.addedAt);
          if (a.addedAt) return -1;
          if (b.addedAt) return 1;
          return 0;
        })
        .slice(0, 6);
    }

    return result;
  }

  // ------------------------------------------------------------
  // Renderização do carrossel (marquee) de destaques
  // ------------------------------------------------------------
  function renderMarquee(root, list) {
    var wrap = document.getElementById("luf-marquee");
    var track = document.getElementById("luf-track");
    var emptyEl = document.getElementById("luf-featured-empty");
    if (!wrap || !track) return;

    if (list.length === 0) {
      wrap.hidden = true;
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.innerHTML = buildEmptyBlockHtml(
          "Em breve novas simulações de física e matemática vão aparecer aqui em destaque."
        );
      }
      return;
    }

    wrap.hidden = false;
    if (emptyEl) emptyEl.hidden = true;

    var cardsHtml = list.map(function (sim) { return buildCardHtml(sim, root); }).join("");
    var enoughForLoop = list.length >= MIN_CARDS_FOR_MARQUEE;

    track.innerHTML = enoughForLoop ? cardsHtml + cardsHtml : cardsHtml;
    track.classList.toggle("luf-static", !enoughForLoop);
  }

  // ------------------------------------------------------------
  // Renderização de um grid (home completo ou categoria)
  // ------------------------------------------------------------
  function renderGrid(root, list, gridId, emptyId, emptyMessage) {
    var grid = document.getElementById(gridId);
    var emptyEl = document.getElementById(emptyId);
    if (!grid) return;

    if (list.length === 0) {
      grid.hidden = true;
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.innerHTML = buildEmptyBlockHtml(emptyMessage);
      }
      return;
    }

    grid.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = sortByTitlePtBr(list)
      .map(function (sim) { return buildCardHtml(sim, root); })
      .join("");
  }

  function updateCategoryCount(count) {
    var countEl = document.getElementById("luf-category-count");
    if (!countEl) return;
    var word = count === 1 ? "simulação" : "simulações";
    countEl.textContent = count + " " + word;
  }

  // ------------------------------------------------------------
  // Ponto de entrada
  // ------------------------------------------------------------
  function init() {
    var body = document.body;
    if (!body) return;

    var root = body.getAttribute("data-root") || "";
    var page = body.getAttribute("data-page") || "home";
    var category = body.getAttribute("data-category") || "";

    var all = validateSimulations(window.LUF.simulations);

    if (page === "home") {
      var featured = computeFeatured(all);
      renderMarquee(root, featured);
      renderGrid(
        root,
        all,
        "luf-grid",
        "luf-grid-empty",
        "Em breve novas simulações de física e matemática vão aparecer aqui."
      );
    } else if (page === "category") {
      var filtered = all.filter(function (sim) { return sim.category === category; });
      updateCategoryCount(filtered.length);
      var label = categoryLabel(category);
      renderGrid(
        root,
        filtered,
        "luf-grid",
        "luf-grid-empty",
        "Ainda não há simulações de " + label + ". Volte em breve!"
      );
    }
  }

  // Carregado via <script src> no fim do <body>: os elementos-alvo
  // (#luf-grid, #luf-track etc.) já estão no DOM neste ponto do parsing,
  // então chamamos init() direto em vez de esperar DOMContentLoaded.
  init();

  window.LUF.listing = { init: init };
})();
