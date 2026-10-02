/* ============================================================
   LAYOUT.JS — LevelUpFís Simulations
   ------------------------------------------------------------
   Injeta o header e o footer em toda página do site, lendo a
   configuração declarada no <body>:

     <body data-root="../../" data-page="simulation" data-category="fisica">

   - data-root: caminho relativo até a raiz do site
                ("" na home/categorias, "../../" nas simulações).
   - data-page: "home" | "category" | "simulation".
   - data-category: "fisica" | "matematica" (opcional).

   Este script é idempotente: pode ser incluído/executado mais de
   uma vez sem duplicar header/footer.

   Script clássico (sem ES modules) — expõe tudo em window.LUF.
   ============================================================ */
(function () {
  "use strict";

  window.LUF = window.LUF || {};

  // ------------------------------------------------------------
  // PONTO ÚNICO PARA TROCAR A LOGO
  // Quando o arquivo existir em assets/img/, basta ajustar o nome
  // aqui (ex.: "logo.png"). Enquanto não existir, o <img> falha
  // silenciosamente e o fallback tracejado "LOGO" é exibido.
  // ------------------------------------------------------------
  var LOGO_FILENAME = "logo.svg";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildHeader(root, page, category) {
    var isSim = page === "simulation";
    var fisicaHref = root + "fisica.html";
    var matematicaHref = root + "matematica.html";
    var homeHref = root + "index.html";
    var logoSrc = root + "assets/img/" + LOGO_FILENAME;

    var fisicaActive = category === "fisica" ? " is-active" : "";
    var matematicaActive = category === "matematica" ? " is-active" : "";

    var backBtn = isSim
      ? '<button type="button" class="luf-btn" id="luf-back-btn">← <span class="luf-btn-label">Voltar</span></button>'
      : "";

    return (
      '<div class="luf-side">' +
        backBtn +
        '<a class="luf-btn' + fisicaActive + '" href="' + escapeHtml(fisicaHref) + '">Física</a>' +
      "</div>" +
      '<a class="luf-brand" href="' + escapeHtml(homeHref) + '" aria-label="Página inicial — LevelUpFís Simulations">' +
        '<img class="luf-logo" src="' + escapeHtml(logoSrc) + '" alt="LevelUpFís" ' +
          "onerror=\"this.replaceWith(Object.assign(document.createElement('div'),{className:'luf-logo-fallback',textContent:'LOGO'}))\">" +
        "<small>Simulations</small>" +
      "</a>" +
      '<div class="luf-side r">' +
        '<a class="luf-btn' + matematicaActive + '" href="' + escapeHtml(matematicaHref) + '">Matemática</a>' +
      "</div>"
    );
  }

  function buildFooter() {
    return "Desenvolvido por Professor Jonathan · Todos os direitos reservados © 2026";
  }

  function setupBackButton(root, category) {
    var btn = document.getElementById("luf-back-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var sameSiteReferrer =
        document.referrer && document.referrer.indexOf(location.origin) === 0;
      if (sameSiteReferrer || history.length > 1) {
        history.back();
      } else if (category === "fisica" || category === "matematica") {
        location.href = root + category + ".html";
      } else {
        location.href = root + "index.html";
      }
    });
  }

  function init() {
    var body = document.body;
    if (!body) return;

    // Idempotência: se já existe um header injetado, não faz nada de novo.
    if (document.querySelector("header.luf-header")) return;

    var root = body.getAttribute("data-root") || "";
    var page = body.getAttribute("data-page") || "home";
    var category = body.getAttribute("data-category") || "";

    var header = document.createElement("header");
    header.className = "luf-header";
    header.innerHTML = buildHeader(root, page, category);
    body.insertBefore(header, body.firstChild);

    var footer = document.createElement("footer");
    footer.className = "luf-footer";
    footer.textContent = buildFooter();
    body.appendChild(footer);

    setupBackButton(root, category);
  }

  // Este script é sempre carregado via <script src> no fim do <body>,
  // depois do conteúdo da página — ou seja, o <body> e seus elementos já
  // existem no DOM no momento em que este código roda. Não é preciso (nem
  // correto) esperar DOMContentLoaded aqui: como o navegador executa
  // scripts síncronos durante o parsing, esperar o evento adiaria a
  // injeção do header/footer para depois de scripts inline que já
  // presumem sua existência (ex.: código de uma simulação lendo LUF.stage).
  init();

  window.LUF.layout = { init: init };
})();
