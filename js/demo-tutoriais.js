// Tutoriais das simulações na versão demo (capítulo "Simulação").
//
// Chave = nome do arquivo da simulação, sem .html (o mesmo do link do
// Capítulo, ex.: /simulacoes/simulations/fisica/lancamento-obliquo.html).
// Cada desafio vira um item da checklist, que se marca sozinho quando
// ok(s) der true. O "i" ao lado abre o info: o que aquela variável muda
// e o que acontece nos extremos.
//
// s (montado em js/demo.js, lendo a simulação por dentro — mesmo domínio):
//   s.num(id)       valor numérico de um <input> da simulação
//   s.marcado(id)   checkbox marcado?
//   s.ativo(sel)    existe um elemento sel com a classe .active?
//   s.clicou(sel)   o clique que disparou esta checagem foi em sel?
window.LUP_TUTORIAIS = {
  'lancamento-obliquo': [
    {
      titulo: 'Aperte 🚀 Lançar para ver a primeira trajetória',
      ok: (s) => s.clicou('#btn-launch'),
      info: {
        titulo: 'O lançamento',
        texto: 'Cada lançamento desenha a parábola e mostra em "Dados do lançamento" o tempo de voo, a altura máxima e o alcance. Na horizontal o projétil anda sempre com a mesma velocidade; na vertical a gravidade freia a subida e acelera a descida.',
        min: 'Com velocidade 0 m/s o projétil nem sai do lançador.',
        max: 'Com tudo no máximo (50 m/s, 45°, do alto de 100 m) ele passa de 320 m de alcance.',
      },
    },
    {
      titulo: 'Aumente a velocidade inicial para 50 m/s',
      ok: (s) => s.num('v-range') >= 50,
      info: {
        titulo: 'Velocidade inicial (v₀)',
        texto: 'É a "força do disparo". O alcance e a altura máxima crescem com v₀ ao quadrado: dobrar a velocidade deixa o alcance 4 vezes maior.',
        min: '0 m/s: o projétil não se move. Com 10 m/s a 45° (g = 10), ele cai a só 10 m.',
        max: '50 m/s a 45°, saindo do chão: alcance de 250 m e altura máxima de 62,5 m.',
      },
    },
    {
      titulo: 'Coloque o ângulo em 30° e lance',
      ok: (s) => s.clicou('#btn-launch') && Math.abs(s.num('a-range') - 30) < 0.5,
      info: {
        titulo: 'Ângulo de lançamento (θ)',
        texto: 'Divide a velocidade entre a parte horizontal (v₀·cos θ, leva para frente) e a vertical (v₀·sen θ, leva para cima). Saindo do chão, o maior alcance é em 45°, e ângulos que somam 90° (30° e 60°) caem no mesmo lugar.',
        min: '0°: o disparo sai rasteiro. Do chão, cai na hora; do alto, vira um lançamento horizontal.',
        max: '90°: sobe reto e cai no mesmo ponto — alcance zero e a maior altura possível.',
      },
    },
    {
      titulo: 'Suba o lançador para 100 m de altura',
      ok: (s) => s.num('h-range') >= 100,
      info: {
        titulo: 'Altura do lançador',
        texto: 'Quanto mais alto o ponto de partida, mais tempo o projétil fica no ar antes de tocar o chão — e mais longe ele chega.',
        min: '0 m: lançamento do chão, a parábola é simétrica (sobe e desce no mesmo tempo).',
        max: '100 m: mesmo lançado na horizontal (0°), ele leva cerca de 4,5 s para cair.',
      },
    },
    {
      titulo: 'Troque a gravidade para g = 9,8 m/s²',
      ok: (s) => s.ativo('[data-g="9.8"]'),
      info: {
        titulo: 'Gravidade (g)',
        texto: 'É a aceleração que puxa o projétil para baixo. Menos gravidade = voo mais longo, mais alto e mais distante. O alcance é inversamente proporcional a g.',
        min: '9,8 m/s² (valor real na Terra): o projétil vai cerca de 2% mais longe do que com 10.',
        max: '10 m/s² (valor arredondado das provas): contas mais fáceis. Na Lua (1,6 m/s²) ele iria uns 6 vezes mais longe!',
      },
    },
    {
      titulo: 'Ligue "Salvar trajetórias" e compare dois lançamentos',
      ok: (s) => s.marcado('chk-save'),
      info: {
        titulo: 'Salvar trajetórias',
        texto: 'Deixa as parábolas anteriores desenhadas na tela. Assim dá para comparar, por exemplo, 30° com 60° ou 20 m/s com 40 m/s, lado a lado.',
        min: 'Desligado: só aparece o último lançamento.',
        max: 'Ligado: todas ficam na tela — use "Apagar trajetórias salvas" para limpar.',
      },
    },
    {
      titulo: 'Abra o 🎯 Minigame e tente acertar o alvo',
      ok: (s) => s.clicou('#btn-game'),
      info: {
        titulo: 'Minigame: acerte o alvo',
        texto: 'A simulação esconde um dado (velocidade, ângulo ou distância) e você calcula o valor que faz o projétil acertar o alvo. Depois, confere lançando.',
        min: 'Dica: comece pelos ângulos notáveis (30°, 45°, 60°), as contas ficam mais simples.',
        max: 'Use A = v₀²·sen(2θ)/g quando o lançamento sai do chão.',
      },
    },
  ],

  'teoria-cinetica-dos-gases': [
    {
      titulo: 'Escolha a transformação Isotérmica',
      ok: (s) => s.ativo('[data-mode="isot"]'),
      info: {
        titulo: 'Transformação isotérmica',
        texto: 'O cilindro fica num banho térmico, então a temperatura não muda. Mexendo no êmbolo, pressão e volume mudam juntos de um jeito que P·V fica constante (Lei de Boyle).',
        min: 'Volume pequeno → as partículas batem mais vezes nas paredes → pressão alta.',
        max: 'Volume grande → choques mais espaçados → pressão baixa.',
      },
    },
    {
      titulo: 'Diminua o volume do êmbolo para menos de 10 L',
      ok: (s) => s.num('in-vol') < 10,
      info: {
        titulo: 'Volume (êmbolo)',
        texto: 'É o espaço que o gás ocupa. Com menos espaço, as partículas chegam às paredes mais rápido e com mais frequência — a pressão sobe.',
        min: '4 L (mínimo): na isotérmica, a pressão fica 6 vezes maior do que em 24 L.',
        max: '30 L (máximo): a pressão cai; na isotérmica, fica 20% menor do que em 24 L.',
      },
    },
    {
      titulo: 'Escolha Isovolumétrica e aqueça o gás com a fonte de calor',
      ok: (s) => s.ativo('[data-mode="isov"]') && s.num('in-heat') > 0,
      info: {
        titulo: 'Fonte de calor',
        texto: 'Valor positivo é uma chama (entra calor), negativo é um resfriador (sai calor). Mais calor → partículas mais rápidas → temperatura e pressão sobem. Com o êmbolo travado, todo o calor vira energia interna (W = 0).',
        min: '−300 J/s: o gás esfria rápido, as partículas ficam lentas e a pressão despenca.',
        max: '+300 J/s: o gás esquenta rápido até o limite de temperatura da simulação.',
      },
    },
    {
      titulo: 'Escolha Adiabática e clique em ⬇ Empurrar rápido',
      ok: (s) => s.ativo('[data-mode="adia"]') && s.clicou('#btn-push'),
      info: {
        titulo: 'Transformação adiabática',
        texto: 'Paredes isolantes: não entra nem sai calor (Q = 0). Tudo o que muda a energia do gás é o trabalho: comprimir esquenta, expandir esfria (ΔU = −W).',
        min: '⬆ Puxar rápido: o gás se expande, gasta energia empurrando o êmbolo e a temperatura cai.',
        max: '⬇ Empurrar rápido: o êmbolo dá energia às partículas e a temperatura sobe sem nenhuma chama.',
      },
    },
    {
      titulo: 'Aumente a quantidade de gás para 4 mols',
      ok: (s) => s.num('in-n') >= 4,
      info: {
        titulo: 'Mols de gás (n)',
        texto: 'É a quantidade de partículas no cilindro. Com mais partículas no mesmo espaço e na mesma temperatura, há mais choques nas paredes: a pressão é proporcional a n (P·V = n·R·T).',
        min: '0,5 mol: poucas partículas, pressão baixa.',
        max: '4 mols: 8 vezes mais partículas que 0,5 mol — e 8 vezes mais pressão, no mesmo volume e temperatura.',
      },
    },
    {
      titulo: 'Ligue "Destacar uma partícula" e acompanhe o caminho dela',
      ok: (s) => s.marcado('chk-tracer'),
      info: {
        titulo: 'Uma partícula só',
        texto: 'Cada partícula anda em linha reta até bater em outra ou na parede, e então muda de direção. É desse movimento caótico de bilhões de partículas que nascem a pressão e a temperatura.',
        min: 'Gás frio: a partícula destacada anda devagar.',
        max: 'Gás quente: ela dispara pelo cilindro — temperatura é agitação.',
      },
    },
  ],

  'forca-magnetica': [
    {
      titulo: 'Coloque o ângulo entre v e B em 0°',
      ok: (s) => s.num('in-theta') === 0,
      info: {
        titulo: 'Ângulo entre v e B (θ)',
        texto: 'A força vale F = |q|·v·B·sen θ. Só a parte da velocidade perpendicular ao campo "sente" a força.',
        min: '0° (ou 180°): v paralela a B, sen θ = 0, força zero — a carga segue reto.',
        max: '90°: força máxima, sempre perpendicular à velocidade — a carga faz um círculo.',
      },
    },
    {
      titulo: 'Agora coloque o ângulo em 45° e veja a hélice',
      ok: (s) => s.num('in-theta') === 45,
      info: {
        titulo: 'Trajetória helicoidal',
        texto: 'Num ângulo intermediário, a velocidade tem uma parte perpendicular a B (que faz girar) e uma paralela (que faz avançar ao longo de B). Girar + avançar = hélice, como uma mola.',
        min: 'Perto de 0°: a hélice fica bem esticada, quase uma reta.',
        max: 'Perto de 90°: a hélice fica fechada, quase um círculo.',
      },
    },
    {
      titulo: 'Aumente o campo magnético para 3 T',
      ok: (s) => s.num('in-b') >= 3,
      info: {
        titulo: 'Campo magnético (B)',
        texto: 'Campo mais forte = força maior = curva mais fechada. O raio da trajetória é R = m·v/(|q|·B): inversamente proporcional a B.',
        min: '0,2 T: força fraca, a carga faz uma curva enorme (raio 15 vezes maior que em 3 T).',
        max: '3 T: força forte, círculo bem apertado e volta completa mais rápida.',
      },
    },
    {
      titulo: 'Deixe a carga negativa',
      ok: (s) => s.num('in-q') < 0,
      info: {
        titulo: 'Carga (q)',
        texto: 'O sinal da carga define o sentido da força: para carga negativa a força é o contrário do que a regra da mão direita indica, e a carga gira no sentido oposto. O tamanho da carga define a intensidade.',
        min: 'q = 0: nenhuma força, a carga segue reto em qualquer ângulo.',
        max: 'Carga grande (positiva ou negativa): força grande e raio pequeno.',
      },
    },
    {
      titulo: 'Diminua a velocidade para 200 m/s',
      ok: (s) => s.num('in-v') <= 200,
      info: {
        titulo: 'Velocidade (v)',
        texto: 'A força cresce com a velocidade, mas o raio também: R = m·v/(|q|·B). Carga mais rápida faz um círculo maior.',
        min: '200 m/s: círculo pequeno (raio 5 vezes menor que em 1000 m/s).',
        max: '2000 m/s: raio 2 vezes maior que em 1000 m/s, e força 2 vezes maior.',
      },
    },
    {
      titulo: 'Mude a câmera para a vista "Eixo B"',
      ok: (s) => s.ativo('[data-view="along"]'),
      info: {
        titulo: 'Vistas da câmera',
        texto: 'Olhando na direção do campo B, qualquer trajetória (círculo ou hélice) aparece como um círculo — é a parte que gira. Nas vistas de lado dá para ver o avanço ao longo de B.',
        min: 'Vista "Eixo B": só o giro aparece.',
        max: 'Vista "3D": gire a câmera com o mouse/dedo e veja a hélice completa.',
      },
    },
  ],
};
