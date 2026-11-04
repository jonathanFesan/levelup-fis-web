// Tutoriais das simulações (capítulo "Simulação", no site e na demo).
//
// REGRA: toda simulação que entra na trilha como Capítulo 🧪 Simulação
// ganha desafios aqui, cobrindo TODOS os controles dela (cada slider,
// botão, modo e opção de exibição), para o aluno sair sabendo usar tudo.
// Simulação usada só dentro de um exercício não precisa: o aluno já
// aprendeu no Capítulo Simulação. O painel avisa quando falta tutorial.
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
//   s.valor(sel)    value (texto) do elemento sel — select, input de texto
//   s.existe(sel)   existe algum elemento sel? (ex.: '.uc-cell.is-origin')
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

  'polias-engrenagens-eixos': [
    {
      titulo: 'No modo ⚙️ Livre, com Engrenagens, deixe os dois discos com 20 cm de raio',
      ok: (s) => s.ativo('[data-mode="livre"]') && s.ativo('[data-coupling="gear"]') && s.num('in-r1') === 20 && s.num('in-r2') === 20,
      info: {
        titulo: 'Engrenagens',
        texto: 'Os dentes de uma empurram os da outra, então a borda das duas anda com a mesma velocidade v (v₁ = v₂ → f₁·R₁ = f₂·R₂). A menor gira mais rápido, e os sentidos de rotação se invertem. Use os ponteiros para contar as voltas.',
        min: 'R₁ = 10 e R₂ = 30: enquanto o disco 1 dá 3 voltas, o disco 2 dá só 1.',
        max: 'Raios iguais: os dois giram na mesma frequência, em sentidos opostos.',
      },
    },
    {
      titulo: 'Troque para Correia cruzada e compare com a Correia direta',
      ok: (s) => s.ativo('[data-coupling="cross"]'),
      info: {
        titulo: 'Correia direta × cruzada',
        texto: 'Toda a correia anda com a mesma velocidade, então as bordas dos discos também (f₁·R₁ = f₂·R₂, igual às engrenagens). A diferença está no sentido: correia direta mantém o sentido de rotação, correia cruzada inverte.',
        min: 'Correia direta: os dois discos giram no mesmo sentido.',
        max: 'Correia cruzada: sentidos opostos, como nas engrenagens.',
      },
    },
    {
      titulo: 'Escolha Eixo comum e compare a velocidade v dos dois discos',
      ok: (s) => s.ativo('[data-coupling="axle"]'),
      info: {
        titulo: 'Eixo comum',
        texto: 'Discos presos no mesmo eixo dão o mesmo número de voltas: mesma ω e mesma frequência. Mas a borda do disco maior percorre um caminho maior em cada volta, então anda mais rápido (v = ω·R).',
        min: 'Raios iguais: mesma ω e mesma v.',
        max: 'R₃ = 30 e R₁ = 5: a borda do disco 3 anda 6 vezes mais rápido que a do 1.',
      },
    },
    {
      titulo: 'Volte para Engrenagens e ligue "Disco 3 no eixo do disco 1"',
      ok: (s) => s.marcado('chk-d3'),
      info: {
        titulo: 'Sistema misto',
        texto: 'O disco 3 está no mesmo eixo do disco 1 (mesma ω), enquanto o disco 2 está ligado ao 1 pela borda (mesma v). É assim que as provas montam problemas com vários discos: resolva um acoplamento por vez.',
        min: 'R₃ pequeno: o disco 3 gira junto do 1, mas com v de borda pequena.',
        max: 'R₃ grande: mesma ω do disco 1 e v de borda bem maior.',
      },
    },
    {
      titulo: 'Leve a frequência do motor f₁ ao máximo (3 Hz)',
      ok: (s) => s.num('in-f1') >= 3,
      info: {
        titulo: 'Frequência do motor (f₁)',
        texto: 'É quantas voltas por segundo o disco 1 dá. Todo o resto do sistema é proporcional a ela: dobrar f₁ dobra a frequência, a ω e a v de todos os discos. A ω vale 2π·f.',
        min: '0 Hz: motor desligado, nada gira.',
        max: '3 Hz: 3 voltas por segundo, ω₁ ≈ 18,8 rad/s.',
      },
    },
    {
      titulo: 'Inverta o sentido do motor (↺) e ligue a câmera 🐢 Lenta',
      ok: (s) => s.ativo('#btn-slow'),
      info: {
        titulo: 'Sentido e câmera lenta',
        texto: 'Inverter o motor inverte o sentido de todos os discos, mas não muda nenhum valor de f, ω ou v. A câmera lenta só deixa a animação mais devagar para você contar as voltas; as leituras continuam as mesmas.',
        min: 'Câmera normal: o movimento real.',
        max: 'Câmera lenta: boa para conferir os sentidos de rotação e contar voltas.',
      },
    },
    {
      titulo: 'Desligue os vetores velocidade e mude a câmera para 3D',
      ok: (s) => !s.marcado('chk-vec') && s.clicou('#btn-3d'),
      info: {
        titulo: 'Exibir',
        texto: 'Os vetores mostram a velocidade v na borda de cada disco (sempre tangente). Os ponteiros ajudam a contar voltas, e o botão "voltas" zera a contagem. Os rótulos mostram os valores de cada disco. A vista 3D mostra o eixo comum de lado; arraste para girar a câmera.',
        min: 'Tudo desligado: só os discos girando.',
        max: 'Tudo ligado: vetores, ponteiros e rótulos ajudam a conferir as contas.',
      },
    },
    {
      titulo: 'No modo 🚲 Bicicleta, use a coroa de 12 cm e a marcha 6 (catraca de 4 cm)',
      ok: (s) => s.ativo('[data-mode="bike"]') && s.ativo('[data-catraca="4"]') && s.ativo('[data-coroa="12"]'),
      info: {
        titulo: 'Marchas da bicicleta',
        texto: 'Coroa e catraca são ligadas pela corrente (mesma v), e catraca e roda estão no mesmo eixo (mesma ω). Por isso, a cada pedalada a roda dá R_coroa/R_catraca voltas.',
        min: 'Coroa de 8 cm e catraca de 9 cm (marcha 1): a roda dá menos de 1 volta por pedalada. É lenta, mas leve, boa para subida.',
        max: 'Coroa de 12 cm e catraca de 4 cm (marcha 6): 3 voltas da roda por pedalada. É rápida, mas pesada.',
      },
    },
    {
      titulo: 'No modo 🏭 Redutor, aumente a potência do motor para 200 W',
      ok: (s) => s.ativo('[data-mode="red"]') && s.num('in-pow') >= 200,
      info: {
        titulo: 'Redutor: potência e torque',
        texto: 'Num redutor, um pinhão pequeno move uma coroa grande: a saída gira mais devagar e com mais torque. A potência é a mesma dos dois lados (P = τ·ω, sem contar as perdas). Mais potência aumenta o torque nos dois eixos.',
        min: 'Pinhão de 5 cm e coroa de 30 cm: redução de 6 vezes. A saída gira 6 vezes mais devagar, com 6 vezes mais torque.',
        max: 'Coroa menor que o pinhão: vira um multiplicador, com mais rotação e menos torque.',
      },
    },
  ],

  'coordenadas-esfericas': [
    {
      titulo: 'Aumente o raio r para 10',
      ok: (s) => s.num('r') >= 10,
      info: {
        titulo: 'Raio (r)',
        texto: 'É a distância do ponto até a origem. Mudar só o r leva o ponto para longe ou para perto da origem, sempre na mesma direção.',
        min: 'r = 1: o ponto fica bem perto da origem.',
        max: 'r = 10: o ponto fica 10 vezes mais longe, na mesma direção.',
      },
    },
    {
      titulo: 'Coloque o ângulo zenital φ em 0° e mexa no θ',
      ok: (s) => s.num('phi') === 0,
      info: {
        titulo: 'Ângulo zenital (φ)',
        texto: 'É o ângulo medido a partir do eixo Z (azul, para cima). Ele diz se o ponto está "no alto", "no meio" ou "embaixo": z = r·cos φ.',
        min: 'φ = 0°: o ponto fica no eixo Z (polo norte), e o θ não muda nada.',
        max: 'φ = 180°: o ponto fica embaixo, no polo sul.',
      },
    },
    {
      titulo: 'Coloque φ em 90° para o ponto ir para o plano XY',
      ok: (s) => s.num('phi') === 90,
      info: {
        titulo: 'φ = 90°: o "equador"',
        texto: 'Com φ = 90°, cos φ = 0, então z = 0: o ponto fica no plano XY, a uma distância r da origem. Nesse caso as coordenadas esféricas viram coordenadas polares (r, θ).',
        min: 'φ um pouco menor que 90°: o ponto sobe acima do plano XY.',
        max: 'φ um pouco maior que 90°: o ponto desce abaixo do plano XY.',
      },
    },
    {
      titulo: 'Com φ = 90°, coloque o ângulo azimutal θ em 90° (o ponto vai para o eixo Y)',
      ok: (s) => s.num('phi') === 90 && s.num('theta') === 90,
      info: {
        titulo: 'Ângulo azimutal (θ)',
        texto: 'É o giro em volta do eixo Z, medido a partir do eixo X (vermelho). Com x = r·sen φ·cos θ e y = r·sen φ·sen θ, ele diz para que lado o ponto aponta no "chão".',
        min: 'θ = 0°: o ponto fica sobre o eixo X.',
        max: 'θ = 360°: uma volta completa, o ponto volta ao eixo X.',
      },
    },
    {
      titulo: 'Leve φ até 180° (polo sul)',
      ok: (s) => s.num('phi') === 180,
      info: {
        titulo: 'Polo sul',
        texto: 'Com φ = 180°, cos φ = −1: z = −r, e o ponto fica embaixo da origem, no eixo Z. Como sen φ = 0, x e y valem zero para qualquer θ.',
        min: 'φ = 0°: z = +r (polo norte).',
        max: 'φ = 180°: z = −r (polo sul).',
      },
    },
    {
      titulo: 'Clique em ▶ Rotacionar e Formar Esfera',
      ok: (s) => s.clicou('#btn-playpause'),
      info: {
        titulo: 'Formar a esfera',
        texto: 'A animação mantém o r fixo e varre todos os θ (de 0° a 360°) para cada φ (de 0° a 180°). Juntando todos esses pontos com o mesmo r, aparece uma esfera de raio r. Por isso a equação r = constante descreve uma esfera.',
        min: 'Raio pequeno: esfera pequena.',
        max: 'Raio grande: esfera grande. Mude o r antes de começar.',
      },
    },
    {
      titulo: 'Use ↺ Recomeçar para formar a esfera de novo',
      ok: (s) => s.clicou('#btn-restart'),
      info: {
        titulo: 'Pausar e recomeçar',
        texto: 'Durante a animação, o mesmo botão pausa e continua, e os sliders ficam travados. "Recomeçar" apaga a esfera e começa de novo pelo polo norte. Arraste a tela para girar a câmera e use o scroll para dar zoom.',
        min: 'Pausado: dá para girar a câmera e ver um anel de cada vez.',
        max: 'Até o fim: a esfera completa.',
      },
    },
  ],

  'unidades-de-medida': [
    {
      titulo: 'Clique em km (origem) e depois em m (destino)',
      ok: (s) => s.existe('.uc-cell.is-origin[data-key="e3"]') && s.existe('.uc-cell.is-target[data-key="e0"]'),
      info: {
        titulo: 'Origem e destino',
        texto: 'O primeiro clique escolhe a unidade de origem, e o segundo, a de destino. As setas mostram os degraus da tabela: cada degrau para a direita multiplica por 10, e cada degrau para a esquerda divide por 10.',
        min: 'Clicar de novo na origem desmarca a seleção.',
        max: 'Depois de escolher as duas, um novo clique começa outra conversão.',
      },
    },
    {
      titulo: 'Digite 2,5 no valor',
      ok: (s) => s.valor('#uc-val').replace(',', '.') === '2.5',
      info: {
        titulo: 'Valor',
        texto: 'Aceita vírgula ou ponto. O resultado aparece na hora, junto com a explicação de quantas casas a vírgula andou e para que lado.',
        min: '2,5 km → m: são 3 degraus para a direita, então a vírgula anda 3 casas: 2 500 m.',
        max: 'Valor inválido: a caixa fica vermelha.',
      },
    },
    {
      titulo: 'Inverta a conversão com ⇄',
      ok: (s) => s.clicou('#uc-swap'),
      info: {
        titulo: 'Inverter',
        texto: 'Troca origem e destino e usa o resultado como novo valor. Serve para conferir a conta: ir e voltar tem que dar o número do começo.',
        min: 'km → m: multiplica por 1 000.',
        max: 'm → km: divide por 1 000.',
      },
    },
    {
      titulo: 'Troque a unidade base para m² (em "trocar ▾", no meio da tabela)',
      ok: (s) => s.valor('.uc-base-pick select') === '1',
      info: {
        titulo: 'Área e volume',
        texto: 'Em área, cada degrau vale 2 casas (×100), porque as duas dimensões mudam. Em volume, vale 3 casas (×1 000). É o erro mais comum de conversão nas provas.',
        min: 'm: 1 km = 1 000 m (3 casas).',
        max: 'm³: 1 km³ = 1 000 000 000 m³ (9 casas). E 1 m³ = 1 000 L.',
      },
    },
    {
      titulo: 'Em "Unidades", escolha Todos para ver todos os prefixos do SI',
      ok: (s) => s.valor('#uc-mode') === 'todos',
      info: {
        titulo: 'Prefixos do SI',
        texto: '"Comum" mostra só de quilo até mili (k, h, da, base, d, c, m). "Todos" mostra todos os prefixos, de quecto (10⁻³⁰) a quetta (10³⁰), incluindo micro (µ), nano (n), mega (M) e giga (G).',
        min: 'Nano (n) = 10⁻⁹, micro (µ) = 10⁻⁶, mili (m) = 10⁻³.',
        max: 'Quilo (k) = 10³, mega (M) = 10⁶, giga (G) = 10⁹.',
      },
    },
    {
      titulo: 'Em "Conversão", escolha Velocidade e converta 72 km/h para m/s',
      ok: (s) => s.valor('#uc-cat') === 'velocidade' && s.existe('.uc-cell.is-origin[data-key="km/h"]') && s.existe('.uc-cell.is-target[data-key="m/s"]') && s.valor('#uc-val').replace(',', '.') === '72',
      info: {
        titulo: 'km/h ↔ m/s',
        texto: 'Unidades que não são só um prefixo usam um fator de conversão. De km/h para m/s, divida por 3,6; de m/s para km/h, multiplique por 3,6.',
        min: '72 km/h = 20 m/s.',
        max: '20 m/s = 72 km/h.',
      },
    },
    {
      titulo: 'Escolha Temperatura e converta 100 °C para °F',
      ok: (s) => s.valor('#uc-cat') === 'temperatura' && s.existe('.uc-cell.is-origin[data-key="°C"]') && s.existe('.uc-cell.is-target[data-key="°F"]') && s.valor('#uc-val').replace(',', '.') === '100',
      info: {
        titulo: 'Escalas de temperatura',
        texto: 'Temperatura não muda só por um fator, porque o zero de cada escala fica num lugar diferente. Por isso usamos a relação °C/5 = (°F − 32)/9 = (K − 273)/5.',
        min: 'A água congela a 0 °C = 32 °F = 273,15 K.',
        max: 'A água ferve a 100 °C = 212 °F = 373,15 K.',
      },
    },
  ],
};
