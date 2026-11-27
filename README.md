# ViaJunto

ViaJunto é um aplicativo de caronas intermunicipais. O monorepo reúne a API em Express,
o aplicativo em React Native com Expo e os contratos de entrada compartilhados em Zod.

## Estrutura

- [Backend](apps/backend/src) — rotas e middleware recebem a requisição, controllers
  adaptam HTTP, services aplicam regras de negócio e repositories acessam o banco.
  O bootstrap monta essas dependências. A criação do cliente, os tipos de persistência
  e a tradução de erros do Prisma ficam na camada de repositórios.
- [Mobile](apps/mobile/src) — `navigation` coordena sessão e abas, `screens` compõe
  telas e mantém componentes e hooks próprios de cada fluxo, `components` reúne
  elementos reutilizáveis e `services` concentra HTTP, armazenamento e serviços
  de rota. Os estilos específicos ficam com seus componentes. `theme` contém a
  paleta e estilos compartilhados.
- [Contratos](packages/shared-types/src) — schemas e tipos de autenticação e caronas,
  importados pelo ponto de entrada de `@viajunto/shared-types`.
- [Especificações](specs/features) — regras e critérios de aceite das funcionalidades.

## Desenvolvimento

Instale as dependências na raiz com `npm install`. Compile os pacotes com
`npm run build` e siga o [guia do aplicativo](apps/mobile/README.md) para iniciar
o banco, a API e o Expo.

```sh
npm run test
npm run lint
npm run typecheck --workspace apps/mobile
```
