# Autenticação e perfil

## Objetivo

Disponibilizar cadastro de usuários, autenticação por access token e refresh token,
rotação de refresh tokens e consulta do perfil autenticado.

## Endpoints

### POST `/auth/register`

#### Requisição

```json
{
  "nome": "Maria da Silva",
  "email": "maria@example.com",
  "senha": "Senha123",
  "genero": "F",
  "role": "motorista"
}
```

#### Regras de validação

- `nome` é obrigatório e deve conter entre 2 e 100 caracteres.
- `email` é obrigatório, deve ter formato válido e ser único.
- `senha` é obrigatória, deve conter no mínimo 8 caracteres, pelo menos uma letra
  e pelo menos um número.
- `genero` deve ser `F`, `M` ou `OUTRO`.
- `role` deve ser `motorista` ou `passageiro`.

#### Respostas

- `201`

  ```json
  {
    "id": "clxxxxxxxxxxxxxxxxxxxxxxxx",
    "nome": "Maria da Silva",
    "email": "maria@example.com",
    "genero": "F",
    "role": "motorista",
    "createdAt": "2026-01-01T12:00:00.000Z"
  }
  ```

- `400`

  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Dados inválidos"
    }
  }
  ```

- `409`

  ```json
  {
    "error": {
      "code": "EMAIL_ALREADY_EXISTS",
      "message": "E-mail já cadastrado"
    }
  }
  ```

Senhas e `passwordHash` nunca aparecem na resposta.

### POST `/auth/login`

#### Requisição

```json
{
  "email": "maria@example.com",
  "senha": "Senha123"
}
```

#### Respostas

- `200`

  ```json
  {
    "accessToken": "<jwt>",
    "refreshToken": "<token>",
    "expiresIn": 900
  }
  ```

  O access token expira em 15 minutos e o refresh token expira em 7 dias.
- `400` para dados de entrada inválidos (`VALIDATION_ERROR`).
- `401`

  ```json
  {
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Credenciais inválidas"
    }
  }
  ```

  A mesma resposta deve ser usada para e-mail inexistente e senha incorreta.

### POST `/auth/refresh`

#### Requisição

```json
{
  "refreshToken": "<token>"
}
```

#### Respostas

- `200`

  ```json
  {
    "accessToken": "<jwt>",
    "refreshToken": "<token>",
    "expiresIn": 900
  }
  ```

  O refresh token anterior é revogado e um novo é emitido.
- `400` para dados de entrada inválidos (`VALIDATION_ERROR`).
- `401` para token inválido, expirado ou revogado:

  ```json
  {
    "error": {
      "code": "INVALID_REFRESH_TOKEN",
      "message": "Refresh token inválido"
    }
  }
  ```

### GET `/users/me`

#### Requisição

Exige o header:

```text
Authorization: Bearer <accessToken>
```

#### Respostas

- `200`

  ```json
  {
    "id": "clxxxxxxxxxxxxxxxxxxxxxxxx",
    "nome": "Maria da Silva",
    "email": "maria@example.com",
    "genero": "F",
    "role": "motorista",
    "createdAt": "2026-01-01T12:00:00.000Z"
  }
  ```

- `401` quando o token está ausente, inválido ou expirado:

  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Não autorizado"
    }
  }
  ```

## Persistência

O modelo `User` contém `id` (cuid), `nome`, `email` (unique), `passwordHash`,
`genero`, `role`, `createdAt` e `updatedAt`.

O modelo `RefreshToken` contém `id`, `tokenHash`, `userId` (FK para `User`),
`expiresAt`, `revokedAt` opcional e `createdAt`. Apenas o hash do refresh token
é persistido.

A migration inicial deve habilitar a extensão PostGIS, sem criar tabelas
geográficas.

## Critérios de aceite

- Cadastro válido retorna `201` sem senha ou `passwordHash`.
- Cadastro com senha fraca retorna `400` com `VALIDATION_ERROR`.
- Cadastro com e-mail duplicado retorna `409` com `EMAIL_ALREADY_EXISTS`.
- Login válido retorna access token, refresh token e `expiresIn: 900`.
- Login com senha incorreta ou e-mail inexistente retorna `401` com
  `INVALID_CREDENTIALS` e a mesma mensagem.
- Refresh válido revoga o token anterior e retorna um novo par de tokens.
- Refresh expirado, inválido ou revogado retorna `401` com
  `INVALID_REFRESH_TOKEN`.
- `/users/me` retorna o perfil com access token válido e `401` sem token, com token
  inválido ou expirado.
- Senhas são armazenadas com bcrypt e nenhum segredo é hardcoded.
- O auth service possui testes unitários com repository mockado para os cenários
  de registro, login, refresh e middleware descritos nesta spec.

## Fora de escopo

- Telas ou fluxos do aplicativo mobile.
- Deploy.
- Viagens, reservas, reviews, chat e busca geoespacial.
