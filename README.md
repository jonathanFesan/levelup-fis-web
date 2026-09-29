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
