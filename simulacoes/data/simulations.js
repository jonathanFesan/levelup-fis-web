/* ============================================================
   REGISTRO DE SIMULAÇÕES — LevelUpFís Simulations
   ------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para adicionar,
   remover ou reordenar simulações no site.

   Para adicionar uma simulação:
     1. Copie simulations/_template.html para
        simulations/<categoria>/<slug>.html
     2. Preencha o título, descrição e o código da simulação.
     3. Acrescente um objeto na lista window.LUF.simulations abaixo.
     4. (Opcional) Inclua o "id" da simulação em window.LUF.featured
        para ela aparecer em destaque na home, na ordem escolhida.

   Veja o README.md para o passo a passo completo (manual e via
   script tools/new-simulation.mjs).
   ============================================================ */
window.LUF = window.LUF || {};

// Lista de todas as simulações do site.
// Campos obrigatórios: id, title, category ("fisica" | "matematica"), path.
// Campos opcionais: summary, thumbnail, tags, addedAt ("AAAA-MM-DD").
window.LUF.simulations = [
  // Exemplo de referência — mantenha COMENTADO. Não é uma simulação real.
  // {
  //   id: "pendulo-simples",
  //   title: "Pêndulo Simples",
  //   summary: "Oscilações e energia",
  //   category: "fisica",
  //   path: "simulations/fisica/pendulo-simples.html",
  //   thumbnail: "assets/img/thumbs/pendulo-simples.svg",
  //   tags: ["mecânica", "oscilações"],
  //   addedAt: "2026-01-15"
  // },
  {
    id: "coordenadas-esfericas",
    title: "Coordenadas Esféricas",
    summary: "Relação entre coordenadas esféricas e cartesianas em 3D",
    category: "matematica",
    path: "simulations/matematica/coordenadas-esfericas.html",
    tags: ["geometria", "vetores", "3D"],
    addedAt: "2026-09-28",
  },
];

// DESTAQUES DA HOME: ids na ORDEM em que devem aparecer no carrossel.
// Edite livremente esta lista para escolher e ordenar os destaques.
window.LUF.featured = [
  "coordenadas-esfericas",
];

// Se "featured" estiver vazio (mas houver simulações cadastradas), o
// carrossel usa como alternativa as 6 mais recentes (por "addedAt",
// desc; sem addedAt, usa a ordem do array). Defina como false para
// desativar esse comportamento automático.
window.LUF.featuredFallback = true;
