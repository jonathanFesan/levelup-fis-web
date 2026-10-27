/* ============================================================
   SIMULATION-SHELL.JS — LevelUpFís Simulations
   ------------------------------------------------------------
   Comportamento comum a toda página de simulação: tela cheia do
   palco (#sim-stage) e uma API mínima (window.LUF.stage) para que
   cada simulação se ajuste ao tamanho do palco sem repetir código.

   API exposta:
     LUF.stage.el                 // elemento #sim-stage
     LUF.stage.content            // elemento #sim-content
     LUF.stage.onResize(cb)       // cb({width, height, dpr})
     LUF.stage.fitCanvas(canvas)  // ajusta um <canvas> ao palco
     LUF.stage.isFullscreen()

   Evento global disparado quando a aba fica oculta/visível, para a
   simulação pausar sua própria animação:
     document.addEventListener('luf:visibilitychange', function (e) {
       // e.detail.hidden === true|false
     });

   Script clássico — sem fetch, sem ES modules.
   ============================================================ */
(function () {
  "use strict";

  window.LUF = window.LUF || {};

  var stageEl = document.getElementById("sim-stage");
  var contentEl = document.getElementById("sim-content");
  var fsBtn = document.getElementById("sim-fullscreen-btn");

  var resizeCallbacks = [];

  // Modo embutido (?embed=1, ver layout.js) dentro de uma página do
  // LevelUp Fís: a tela cheia é da página de fora (que coloca, por
  // exemplo, a pergunta do exercício em cima da simulação). O botão só
  // pede à página de fora e recebe de volta o estado.
  var EMBED = /(?:^|[?&])embed=1(?:&|$)/.test(location.search.slice(1)) && window.parent !== window;
  var embedFs = false;

  function supportsFullscreen() {
    return !!(
      stageEl &&
      (stageEl.requestFullscreen ||
        stageEl.webkitRequestFullscreen ||
        stageEl.mozRequestFullScreen ||
        stageEl.msRequestFullscreen)
    );
  }

  function isFullscreen() {
    if (EMBED) return embedFs;
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function requestFullscreen(el) {
    var fn =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (fn) fn.call(el);
  }

  function exitFullscreen() {
    var fn =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (fn) fn.call(document);
  }

  function updateFsButton() {
    if (!fsBtn) return;
    var fs = isFullscreen();
    fsBtn.textContent = fs ? "✕" : "⛶";
    fsBtn.setAttribute("aria-label", fs ? "Sair da tela cheia" : "Tela cheia");
    fsBtn.setAttribute("title", fs ? "Sair da tela cheia" : "Tela cheia");
  }

  // Celular deitado: só funciona com a página em tela cheia (Android);
  // no iPhone não existe, e o aviso "gire o celular" cobre esse caso.
  function lockLandscape() {
    try {
      var p = screen.orientation.lock("landscape");
      if (p && p.catch) p.catch(function () {});
    } catch (err) { /* sem suporte */ }
  }

  // Tela cheia já deitada (botão do aviso de girar o celular).
  function fullscreenLandscape() {
    if (EMBED) {
      window.parent.postMessage({ luf: "fullscreen-toggle", on: true, landscape: true }, location.origin);
      return;
    }
    if (!supportsFullscreen()) return;
    if (isFullscreen()) { lockLandscape(); return; }
    var fn = stageEl.requestFullscreen || stageEl.webkitRequestFullscreen || stageEl.mozRequestFullScreen || stageEl.msRequestFullscreen;
    try {
      var p = fn.call(stageEl);
      if (p && p.then) p.then(lockLandscape, function () {});
      else setTimeout(lockLandscape, 300);
    } catch (err) { /* ignore */ }
  }

  function setupFullscreenButton() {
    if (!fsBtn || !stageEl) return;

    if (EMBED) {
      fsBtn.addEventListener("click", function () {
        window.parent.postMessage({ luf: "fullscreen-toggle" }, location.origin);
      });
      window.addEventListener("message", function (e) {
        if (e.origin !== location.origin || !e.data || e.data.luf !== "fs-state") return;
        embedFs = !!e.data.on;
        updateFsButton();
        setTimeout(notifyResize, 50);
      });
      updateFsButton();
      return;
    }

    if (!supportsFullscreen()) {
      // API indisponível (ex.: Safari no iPhone): esconde graciosamente.
      fsBtn.hidden = true;
      return;
    }

    fsBtn.addEventListener("click", function () {
      if (isFullscreen()) {
        exitFullscreen();
      } else {
        requestFullscreen(stageEl);
      }
    });

    ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach(
      function (evt) {
        document.addEventListener(evt, function () {
          updateFsButton();
          // Dá um instante para o layout assentar antes de recalcular.
          setTimeout(notifyResize, 50);
        });
      }
    );

    updateFsButton();
  }

  function currentSize() {
    if (!stageEl) return { width: 0, height: 0, dpr: 1 };
    var rect = stageEl.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      dpr: window.devicePixelRatio || 1,
    };
  }

  function notifyResize() {
    var size = currentSize();
    resizeCallbacks.forEach(function (cb) {
      try {
        cb(size);
      } catch (err) {
        console.error("[LUF] Erro em callback de LUF.stage.onResize:", err);
      }
    });
  }

  function setupResizeObserver() {
    if (!stageEl) return;
    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        notifyResize();
      });
      ro.observe(stageEl);
    } else {
      // Fallback simples para navegadores muito antigos.
      window.addEventListener("resize", notifyResize);
    }
  }

  function fitCanvas(canvas) {
    var size = currentSize();
    var dpr = size.dpr || 1;
    canvas.width = Math.max(1, Math.round(size.width * dpr));
    canvas.height = Math.max(1, Math.round(size.height * dpr));
    // Propositalmente NÃO define canvas.style.width/height aqui: o CSS
    // (assets/css/simulation.css) já posiciona o canvas como
    // position:absolute; inset:0; width:100%; height:100% dentro de
    // #sim-content. Se este código também definisse um style inline em
    // pixels, ele teria prioridade sobre o CSS e poderia (dependendo da
    // simulação) causar um laço de realimentação com o ResizeObserver:
    // o canvas muda de tamanho -> o observer detecta -> redimensiona de
    // novo -> cresce indefinidamente. Deixar o tamanho de exibição 100%
    // por CSS e usar aqui só a resolução interna (width/height, escalada
    // por devicePixelRatio) evita esse problema por completo.
    var ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, width: size.width, height: size.height };
  }

  function setupVisibilityEvent() {
    document.addEventListener("visibilitychange", function () {
      var evt;
      var hidden = document.hidden;
      try {
        evt = new CustomEvent("luf:visibilitychange", { detail: { hidden: hidden } });
      } catch (err) {
        // Fallback para navegadores muito antigos sem suporte a CustomEvent.
        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("luf:visibilitychange", true, true, { hidden: hidden });
      }
      document.dispatchEvent(evt);
    });
  }

  // ------------------------------------------------------------
  // Painéis (#ui-panel, #info-panel, #data-panel com botão de recolher).
  // Toda simulação abre com eles recolhidos, para a cena aparecer
  // inteira. O título do painel também abre/fecha. No celular em pé, os
  // painéis abertos viram uma gaveta embaixo (simulation.css) e só um
  // fica aberto por vez.
  // ------------------------------------------------------------
  var PANELS = "#ui-panel, #info-panel, #data-panel";
  var COLLAPSE_BTN = ".collapse-btn, #btn-collapse";
  var mqPortrait = window.matchMedia ? window.matchMedia("(max-width: 760px) and (orientation: portrait)") : null;

  function panelButton(panel) {
    return panel.querySelector(".panel-head " + COLLAPSE_BTN.split(", ").join(", .panel-head "));
  }

  function setupPanels() {
    // Os handlers de cada simulação são ligados no <script> dela, que roda
    // depois deste arquivo: recolhe só quando a página terminou de montar.
    document.addEventListener("DOMContentLoaded", function () {
      stageEl.querySelectorAll(PANELS).forEach(function (panel) {
        var btn = panelButton(panel);
        if (btn && !panel.classList.contains("collapsed")) btn.click();
      });
    });

    stageEl.addEventListener("click", function (e) {
      var panel = e.target.closest && e.target.closest(PANELS);
      if (!panel) return;
      var btn = panelButton(panel);
      if (!btn) return;
      if (!e.target.closest(COLLAPSE_BTN)) {
        if (e.target.closest(".panel-head")) btn.click();
        return;
      }
      // Clique no botão (o handler da simulação já rodou): no celular em
      // pé, abrir um painel fecha os outros.
      if (mqPortrait && mqPortrait.matches && !panel.classList.contains("collapsed")) {
        stageEl.querySelectorAll(PANELS).forEach(function (p) {
          var b = p !== panel && !p.classList.contains("collapsed") && panelButton(p);
          if (b) b.click();
        });
      }
    });
  }

  // ------------------------------------------------------------
  // Celular em pé: sugere deitar, com um botão que põe a simulação em
  // tela cheia e deitada. Some ao girar o celular ou em "Continuar assim"
  // (lembrado até fechar a aba).
  // ------------------------------------------------------------
  function setupRotateHint() {
    var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!touch || !mqPortrait) return;
    try { if (sessionStorage.getItem("luf.deitar") === "off") return; } catch (err) { /* ignore */ }

    var podeFs = EMBED || supportsFullscreen();
    var box = document.createElement("div");
    box.className = "luf-rotate";
    box.innerHTML =
      '<div class="luf-rotate-card" role="dialog" aria-label="Deitar o celular">' +
        '<div class="luf-rotate-phone" aria-hidden="true"></div>' +
        "<b>Fica melhor com o celular deitado</b>" +
        "<p>A simulação ocupa a tela inteira e sobra espaço para os controles.</p>" +
        (podeFs ? '<button type="button" class="luf-rotate-go">⟳ Deitar e tela cheia</button>' : "") +
        '<button type="button" class="luf-rotate-skip">' + (podeFs ? "Continuar assim" : "Entendi") + "</button>" +
      "</div>" +
      '<div class="luf-rotate-tip" aria-live="polite">⟳ Gire o celular</div>';
    stageEl.appendChild(box);

    function fechar() {
      try { sessionStorage.setItem("luf.deitar", "off"); } catch (err) { /* ignore */ }
      if (box.parentNode) box.parentNode.removeChild(box);
    }
    function sync() {
      if (!mqPortrait.matches) { fechar(); return; }
      box.hidden = false;
    }
    var go = box.querySelector(".luf-rotate-go");
    if (go) go.addEventListener("click", function () {
      fullscreenLandscape();
      // Sem como travar deitado (iPhone), fica só a dica até girar.
      box.classList.add("tip");
    });
    box.querySelector(".luf-rotate-skip").addEventListener("click", fechar);
    box.querySelector(".luf-rotate-tip").addEventListener("click", fechar);
    if (mqPortrait.addEventListener) mqPortrait.addEventListener("change", sync);
    else if (mqPortrait.addListener) mqPortrait.addListener(sync);
    sync();
  }

  function init() {
    if (!stageEl) return; // Página sem palco de simulação; nada a fazer.

    setupFullscreenButton();
    setupResizeObserver();
    setupVisibilityEvent();
    setupPanels();
    setupRotateHint();

    window.LUF.stage = {
      el: stageEl,
      content: contentEl,
      onResize: function (cb) {
        if (typeof cb === "function") resizeCallbacks.push(cb);
      },
      fitCanvas: fitCanvas,
      isFullscreen: isFullscreen,
    };

    // Primeira medição, para simulações que chamam onResize logo no início.
    notifyResize();
  }

  // Carregado via <script src> no fim do <body>, antes do <script> inline
  // da própria simulação. #sim-stage já existe no DOM neste ponto do
  // parsing, então chamamos init() direto: assim window.LUF.stage já está
  // disponível de forma síncrona para o código da simulação logo abaixo
  // (esperar DOMContentLoaded atrasaria isso para depois desse código).
  init();
})();
