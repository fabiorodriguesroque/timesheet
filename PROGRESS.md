# Progresso — Timesheet

_Última atualização: 2026-11-08_

## Onde estou

A configurar a **autenticação (Better Auth)** entre a API (Hono + Bun) e a web (TanStack Start + Vite).

### Feito

- [x] Better Auth instalado na API, com schema Drizzle e migrations (`36ba0e4`)
- [x] Removido o `tsx`: a API corre em Bun, que lê TypeScript nativamente (`0fb4ad4`)
- [x] Handler do auth montado em `apps/api/src/index.ts` → `/api/auth/*`
- [x] `trustedOrigins` configurado (aceita várias origens separadas por `,`)
- [x] Estrutura de config ao estilo do Laravel:
  - `apps/api/src/helpers/env.ts` → `env(key, fallback?)` e `envList(key, fallback?)`
  - `apps/api/src/config/` → `app.ts` (port), `auth.ts` (trustedOrigins), `index.ts`
  - `index.ts` usa `config.app.port`; `lib/auth.ts` usa `config.auth.trustedOrigins`
- [x] Client do auth criado na web: `apps/web/src/lib/auth-client.ts`

## CORS ✅

A web (`localhost:3000`) e a API (`localhost:3001`) são origens diferentes, por isso o browser
faz um pedido `OPTIONS` (preflight) antes de cada `POST`.

- [x] Adicionar o middleware `cors()` do Hono em `/api/auth/*`, **antes** do handler
- [x] `origin` → reutilizar `config.auth.trustedOrigins`
- [x] `credentials: true` (para enviar os cookies de sessão)
- [x] Testar o preflight: `OPTIONS` com `Origin: http://localhost:3000` devolve os cabeçalhos CORS
- [x] `TRUSTED_ORIGINS` obrigatório (a API não arranca sem ele) e sem `/` final

## Depois do CORS

### Web
- [ ] `auth-client.ts`: trocar o URL fixo `'http://localhost:3001'` por `import.meta.env.VITE_API_URL`
- [ ] Criar `apps/web/.env.example` com `VITE_API_URL=`
- [ ] Implementar o sign-up / sign-in na web

### Config da API (migrar o que falta)
- [ ] `config/database.ts` → `url` (obrigatório, sem default)
  - usar em `db/index.ts` e `db/reset.ts` (e remover o `!`)
- [ ] `config/auth.ts` → `secret` (obrigatório) e `url`, passados ao `betterAuth()` como `secret` e `baseURL`
- [ ] Remover o `import 'dotenv/config'` de `db/index.ts` e `db/reset.ts` (o Bun já carrega o `.env`)
  - manter **só** no `drizzle.config.ts` (o `drizzle-kit` corre em Node)

### Limpeza
- [ ] `apps/api/.env.example`: acrescentar `PORT=` e `BETTER_AUTH_URL=`
- [ ] `apps/api/.env`: apagar o `WEB_URL=` (vazio e sem uso)

## Lembretes

- Antes de testar o login: `bun docker:up` (sem Postgres, o sign-in dá **500**)
- Trabalhar só no branch `development`
- Ver as rotas do Hono: `showRoutes(app)` de `hono/dev`
- Ver os endpoints do Better Auth: plugin `openAPI()` → `/api/auth/reference`

## Conceitos aprendidos

- **Bun** é um runtime (como o Node) que também é gestor de pacotes, bundler e test runner.
  Faz transpile do TS mas **não verifica tipos**; para isso usa-se o `tsc --noEmit`.
- **`app.fetch`** é o handler da Fetch API: `(Request) => Response`. O Bun usa o
  `export default { port, fetch }` para arrancar o servidor.
- **Vite** é a ferramenta de frontend da web (dev server, HMR, SSR, build).
  O TanStack Start é construído em cima dele.
- **Named vs default export:** `import { auth }` vs `import auth`.
- **Variáveis na web:** só as que têm prefixo `VITE_` chegam ao browser, via `import.meta.env`.
- **Server vs client auth:** o `auth.ts` fica só na API (DB, segredos);
  o `auth-client.ts` fica só na web.
