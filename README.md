# LevelUp Fís — Site

Versão web do app **LevelUp Fís** (`DevAndroid/levelup-fis`). É um site 100% estático
(HTML + CSS + JavaScript puro, sem build), então roda de graça no **GitHub Pages** ou no
**Render (Static Site)**.

## Como o progresso fica conectado ao app

O site usa **a mesma API** do app Android (`https://levelup-fis.onrender.com`, definida em
`js/config.js`), que grava tudo no mesmo Supabase. O aluno entra com **a mesma conta**
(e-mail e senha), e XP (Joules), Fótons, Cargas, Resumos lidos, Fixação, Curiosidades,
Provas e vídeos assistidos são os mesmos nos dois lados. Nenhuma regra de pontuação roda
no navegador: o backend corrige as respostas e aplica as recompensas.

## O que tem no site

| Tela | Equivalente no app |
|---|---|
| Login / Cadastro / Esqueci a senha | `login_screen`, `register_screen` |
| Mapa (módulos, tópicos, trilha de capítulos) | `map_screen` |
| Resumo (texto ou PDF) | `resumo_screen` |
| Curiosidade (texto, imagem, PDF, vídeo) | `curiosidade_screen` |
| Fixação / Exercícios extra (trilha de fases) | `topic_exercises_screen` |
| Exercício + Resultado | `exercise_screen`, `result_screen` |
| Prova (modo fácil e difícil) + histórico | `exam_screen`, `exam_stats_screen` |
| Vídeos | `videos_screen` |
| Perfil (nome, nível, comprar Carga) | `profile_screen` |
| **LevelUp Plus** (venda, área do assinante, dúvidas, agendamento) | *só no site, por enquanto* |

## LevelUp Plus

Aba **Plus** na barra inferior (`#/plus`). Arquivos: `js/plus.js` (dados), views em `js/app.js`
(seção "LevelUp Plus"), estilos em `css/style.css`. **Tudo que você ajusta fica em
`js/config.js → PLUS`**: planos (`PLANOS`: 1 mês R$ 49 e 6 meses R$ 340, cada um com seu
link de checkout), aula avulsa (`AULA_VALOR`: R$ 80) e desconto de assinante
(`AULA_DESCONTO_PLUS`: 15%), links da Hotmart, convite do WhatsApp, horário de suporte, agenda
semanal, bloqueios, plantão do mês e desafio do mês.

| Rota | Quem vê | O quê |
|---|---|---|
| `#/plus` | todos | Não assinante: página de venda (benefícios, escolha do plano, CTA Hotmart). Assinante: área com Comunidade / Dúvidas / Agendar aula, próxima aula, plantão e desafio do mês |
| `#/plus/duvidas`, `/nova`, `/:id` | assinante | Lista de dúvidas, enviar nova, conversa com a resposta e o prazo de 24h |
| `#/plus/agendar` | todos | Dia → horário → resumo → reserva → checkout Hotmart (assinante com desconto) |
| `#/plus/aulas`, `/:id` | todos | Minhas aulas e o status de cada uma (reservado → pagamento → confirmada + Google Agenda) |

### Fluxo do agendamento
1. O aluno escolhe um horário livre (vindo de `AGENDA_SEMANAL` + `AGENDA_EXTRAS`, sem
   `AGENDA_BLOQUEIOS`, com pelo menos `AULA_ANTECEDENCIA_HORAS` de antecedência).
2. O horário fica **reservado por `AULA_RESERVA_HORAS`** e o site abre o checkout da Hotmart
   com o e-mail do aluno e `sck=aula-<id da reserva>` — esse código aparece na venda da
   Hotmart, pra você saber qual horário foi pago.
3. Você confere o pagamento na Hotmart e confirma a aula → o aluno vê "Aula confirmada!".
   Se ninguém pagar no prazo, a reserva expira e o horário volta a ficar livre.

### Como os pagamentos são ligados (Hotmart → backend → site)
O site abre o checkout da Hotmart com `sck` = `plus-<plano>-<user_id>` (assinatura) ou
`aula-<id da reserva>` (aula). A Hotmart devolve esse código no **webhook**
(`POST /plus/hotmart/webhook` do backend, em `backend/app/routes/plus.py`), que ativa o Plus
(mensal: +1 mês a cada cobrança; 6 meses: pagamento único, sem renovação), confirma a aula,
e desfaz tudo em reembolso/chargeback. Dúvidas, aulas e assinantes ficam no Supabase
(`backend/sql/014_levelup_plus.sql`) e você gerencia em **`/painel` → aba Plus** (responder
dúvidas, colocar o link da aula, confirmar/cancelar manualmente, liberar acesso por fora).

Rotas usadas pelo site (`js/plus.js`, todas com o token do aluno): `GET /plus/status`,
`GET|POST /plus/duvidas`, `GET /plus/agenda`, `GET|POST /plus/aulas`,
`POST /plus/aulas/:id/cancelar`. Os horários livres continuam vindo de `AGENDA_SEMANAL`
(config do site); o backend só guarda quais já estão ocupados e recusa conflitos.

### Modo demonstração (`PLUS.DEMO = true`)
Para testar o visual sem banco: os dados ficam só no navegador do aluno e aparecem botões
**DEMO** para simular pagamento e resposta do professor. Em produção deixe `false`.

## Layout no computador

A partir de 1024 px de largura (`css/style.css`, seção "Layout de PC"), a barra inferior vira
**menu lateral** e o conteúdo usa a largura da tela: Mapa com a trilha em coluna única, Perfil em duas colunas, login com painel de apresentação, Plus com benefícios à esquerda e
planos à direita (alinhados com o fim dos benefícios), agenda com resumo fixo ao lado. Telas de foco (exercício, resumo, prova e
as internas do Plus) ficam numa coluna central mais larga, sem menu. No celular nada muda.

## Publicar de graça

### Opção A — GitHub Pages (recomendado)
1. Crie um repositório no GitHub (ex.: `levelup-fis-web`) e envie o conteúdo desta pasta:
   ```bash
   cd "LUP APP"
   git init
   git add .
   git commit -m "Site LevelUp Fís"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/levelup-fis-web.git
   git push -u origin main
   ```
2. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, pasta `/ (root)` → **Save**.
3. Em 1–2 minutos o site fica em `https://SEU_USUARIO.github.io/levelup-fis-web/`.

### Opção B — Render (Static Site)
1. Envie a pasta para um repositório do GitHub (passo 1 acima).
2. No Render: **New + → Static Site**, escolha o repositório.
   - Build Command: *(deixe vazio)*
   - Publish Directory: `.`
3. Ou use **New + → Blueprint**, que já lê o `render.yaml` desta pasta.

Sites estáticos do Render são gratuitos e não "dormem" (só o backend no plano grátis dorme).

## Observações

- **Ao publicar uma versão nova, troque o `?v=` em `index.html`** (CSS e os 4 scripts). O GitHub
  Pages deixa o navegador guardar cada arquivo por 10 min; sem trocar a versão, o navegador
  pode juntar arquivos velhos e novos. Se mesmo assim faltar algo, o `app.js` busca de novo
  `config.js`/`api.js`/`plus.js` sozinho, e em último caso mostra um botão "Atualizar página".

- **Primeiro acesso lento:** o backend está no plano gratuito do Render e dorme depois de
  ~15 min parado. A primeira requisição pode levar até ~1 minuto; o site mostra um aviso
  "Acordando o servidor…" enquanto isso.
- **CORS:** o backend já aceita qualquer origem (`allow_origins=["*"]` em
  `backend/app/main.py`), então não precisa mudar nada no backend. Se um dia restringir,
  inclua o domínio do site (ex.: `https://SEU_USUARIO.github.io`).
- **Prova no modo difícil:** no navegador, o site pede tela cheia, bloqueia as respostas
  enquanto detectar internet ligada (mesmo fluxo do app: baixa online → responde offline →
  reconecta para enviar), avisa ao fechar/recarregar a página e conta quantas vezes o aluno
  saiu da aba.
- **Testar localmente:** abra um servidor na pasta, ex.: `python -m http.server 8080`, e
  acesse `http://localhost:8080`.
- Para apontar para outro backend, altere `API_BASE` em `js/config.js`.
