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

  function setupFullscreenButton() {
    if (!fsBtn || !stageEl) return;

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

  function init() {
    if (!stageEl) return; // Página sem palco de simulação; nada a fazer.

    setupFullscreenButton();
    setupResizeObserver();
    setupVisibilityEvent();

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
