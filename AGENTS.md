# AGENTS.md — ViaJunto

Guia de contexto para agentes de IA (e desenvolvedores) que trabalham neste repositório.
Leia este arquivo inteiro antes de escrever qualquer código.

---

## 1. Sobre o projeto

**ViaJunto** é uma plataforma de caronas intermunicipais de média distância. Motoristas com
assentos ociosos publicam viagens; passageiros as encontram e dividem as despesas.

**Diferencial:** caronas exclusivas para mulheres. Motoristas mulheres aceitam apenas
passageiras mulheres (flag `apenas_mulheres` na viagem).

**Estudo de caso inicial:** Vitória da Conquista ↔ Brumado (BA).

Escopo completo: `specs/prd/` (relatório de escopo do projeto).

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Backend | Node.js + Express.js + TypeScript |
| ORM | Prisma |
| Banco de dados | PostgreSQL + PostGIS (via Docker) |
| Auth | JWT (access token 15 min) + refresh token (7 dias) + bcrypt |
| Testes | Vitest |
| Mobile | React Native + Expo (`apps/mobile`) |
| Compartilhamento de tipos | `packages/shared-types` (TypeScript + Zod) |
| Monorepo | npm workspaces |
| CI/CD | GitHub Actions |

---

## 3. Estrutura do repositório

```
viajunto/
├── apps/
│   ├── backend/              # Express.js + TypeScript (foco atual)
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── routes/       # Definição de rotas (Express Router)
│   │   │   ├── controllers/  # Recebe req/res, valida entrada, chama service
│   │   │   ├── services/     # Regras de negócio
│   │   │   ├── models/       # Tipos e entidades de domínio
│   │   │   ├── middleware/   # Auth JWT, tratamento de erros, validação
│   │   │   ├── repositories/ # Acesso ao banco via Prisma
│   │   │   ├── config/       # Variáveis de ambiente tipadas
│   │   │   ├── utils/
│   │   │   └── index.ts      # Entrada da aplicação
│   │   ├── tests/
│   │   │   └── unit/
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── mobile/               # React Native (Expo) — fora do escopo da Sprint 1
├── packages/
│   └── shared-types/         # Schemas Zod e tipos compartilhados
├── specs/
│   ├── prd/                  # Escopo do produto
│   ├── adr/                  # Architecture Decision Records
│   ├── api/                  # Contratos OpenAPI
│   └── features/             # Uma spec por funcionalidade
├── docker-compose.yml
├── package.json              # Workspaces
└── README.md
```

### Arquitetura em camadas (backend)

```
Request → Routes → Middleware → Controller → Service → Repository → Prisma → PostgreSQL
```

Regras de dependência (não violar):
- **Controller** não acessa Prisma diretamente.
- **Service** não conhece `req`/`res` do Express.
- **Repository** é o único lugar que importa o `PrismaClient`.
- **Models** não dependem de nenhuma outra camada.

---

## 4. Regras de desenvolvimento (SDD)

Este projeto segue **Spec-Driven Development**:

1. Nenhuma feature é implementada sem spec aprovada em `specs/features/<feature>.md`.
2. A spec define: contrato do endpoint (método, payload, resposta, erros), critérios de aceite
   e o que está fora de escopo.
3. Se a implementação precisar divergir da spec, **pare e atualize a spec primeiro**.
4. Decisões técnicas relevantes viram ADR em `specs/adr/`.

---

## 5. Convenções de código

- TypeScript em modo `strict`. Proibido uso de `any` (use `unknown` + validação).
- Validação de entrada com **Zod**, usando schemas de `packages/shared-types`.
- Erros de domínio via classes próprias (ex.: `ConflictError`, `UnauthorizedError`),
  convertidos em respostas HTTP por um middleware central de erro.
- Formato de erro padrão da API:
  ```json
  { "error": { "code": "EMAIL_ALREADY_EXISTS", "message": "E-mail já cadastrado" } }
  ```
- Nomes de arquivos em `kebab-case`; classes em `PascalCase`; funções e variáveis em `camelCase`.
- Comentários e mensagens de erro voltados ao usuário final: em português.
  Nomes de código (variáveis, funções, rotas): em inglês.
- Commits no formato Conventional Commits: `feat(auth): ...`, `test(auth): ...`, `chore: ...`.

---

## 6. Segurança (obrigatório)

- Senhas: hash com **bcrypt** (custo mínimo 10). Nunca armazenar ou logar senha em texto puro.
- Nunca retornar `passwordHash` em nenhuma resposta.
- Segredos (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`) apenas via variáveis de ambiente.
  Nunca commitar `.env`. Manter `.env.example` atualizado.
- Refresh tokens são armazenados **hasheados** no banco, permitindo revogação.
- Mensagens de erro de login não devem revelar se o e-mail existe
  (usar mensagem genérica "credenciais inválidas").
- Política de senha: mínimo 8 caracteres, com ao menos uma letra e um número.

---

## 7. Testes

- Framework: **Vitest**.
- Testes unitários ficam em `apps/backend/tests/unit/` e focam em **services**,
  com o repository mockado.
- Todo critério de aceite da spec deve ter ao menos um teste correspondente.
- Os testes não devem depender de banco de dados real nem de rede.
- Rodar antes de qualquer PR: `npm run test` e `npm run lint` dentro de `apps/backend`.

---

## 8. Ambiente local

```bash
# Subir PostgreSQL + PostGIS
docker compose up -d

# Instalar dependências (na raiz do monorepo)
npm install

# Migrations e client Prisma
cd apps/backend
npx prisma migrate dev
npx prisma generate

# Rodar a API em desenvolvimento
npm run dev

# Testes
npm run test
```

---

## 9. Escopo atual (Sprint 1)

**Dentro do escopo:**
- Monorepo com workspaces, Docker com PostgreSQL + PostGIS
- Express + TypeScript configurados
- Cadastro, login (JWT + refresh), `GET /users/me` e middleware de autenticação
- Testes unitários do auth service

**Fora do escopo (não implementar agora):**
- Qualquer tela do app mobile
- Deploy em staging
- Endpoints de viagens, reservas, reviews ou chat
- Busca geoespacial (a extensão PostGIS é apenas habilitada e validada)

---

## 10. Para agentes de IA

- Antes de codificar, leia a spec da feature em `specs/features/`.
- Trabalhe em passos pequenos e verificáveis; rode testes após cada passo.
- Não invente endpoints, campos ou regras que não estejam na spec. Pergunte ou registre a dúvida.
- Não altere arquivos fora de `apps/backend` e `packages/shared-types` sem necessidade explícita.
- Ao terminar, liste o que foi feito, o que foi testado e o que ficou pendente.