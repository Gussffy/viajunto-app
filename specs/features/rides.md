# Veículos e viagens

## Objetivo

Permitir que motoristas cadastrem um veículo e publiquem viagens, e que passageiros
pesquisem viagens por origem e destino.

## Regras

- Apenas usuários com `role: "motorista"` podem cadastrar veículos ou criar viagens.
- Motoristas podem cadastrar um veículo por perfil.
- Placa deve conter de 5 a 10 caracteres, modelo e cor são obrigatórios.
- A opção `apenasMulheres` na publicação fica disponível para motoristas mulheres
  (`genero: "F"`). A API rejeita `apenasMulheres: true` de outros perfis.
- Uma viagem exige origem, destino, data/hora de partida e pelo menos um assento.
- Uma viagem exige um valor positivo de ajuda de custo em reais.
- O valor é acordado diretamente entre passageiro e motorista; o app não processa pagamento.
- Passageiros podem pesquisar e visualizar detalhes de viagens.
- Motoristas não podem pesquisar viagens de terceiros e só podem visualizar suas próprias viagens.
- Pesquisa aceita origem e destino como filtros opcionais.
- A viagem deve incluir coordenadas opcionais de origem e destino para exibição no mapa.
- Passageiras (`genero: "F"`) podem pesquisar, filtrar, visualizar e solicitar
  viagens exclusivas para mulheres. As demais pessoas com perfil de passageiro
  não recebem essas viagens em buscas, detalhes, pedidos ou notificações.
  A motorista que publicou a viagem mantém acesso pelo seu perfil.

## Endpoints

### POST `/vehicles`

Requer autenticação.

```json
{
  "placa": "ABC1D23",
  "modelo": "Onix",
  "cor": "Branco"
}
```

Respostas: `201`, `400`, `401`, `403`, `409`.

### GET `/vehicles/me`

Retorna o veículo do motorista autenticado.

Resposta `404` quando não houver veículo cadastrado.

### POST `/trips`

Requer autenticação e veículo cadastrado.

```json
{
  "origem": "Vitória da Conquista",
  "origemLat": -14.8661,
  "origemLng": -40.8391,
  "destino": "Brumado",
  "destinoLat": -14.2039,
  "destinoLng": -41.6652,
  "departureAt": "2026-12-01T08:00:00.000Z",
  "assentos": 3,
  "ajudaCusto": 25,
  "apenasMulheres": false
}
```

Respostas: `201`, `400`, `401`, `403`, `404`.

### GET `/trips`

Filtros opcionais:

- `origem`
- `destino`
- `apenasMulheres=true`

Requer autenticação. Retorna viagens futuras ordenadas pela data de partida.
Para passageiras, `apenasMulheres=true` retorna somente viagens exclusivas.
Para os demais passageiros, a busca sempre retorna apenas viagens abertas a
qualquer passageiro, independentemente desse parâmetro.

### GET `/trips/:id`

Retorna uma viagem com dados do motorista e veículo. Para um passageiro
sem acesso à viagem exclusiva, retorna `404` com `TRIP_NOT_FOUND`.

### GET `/trips/mine`

Requer autenticação de motorista e lista suas viagens.

## Critérios de aceite

- Motorista pode cadastrar exatamente um veículo.
- Passageiro não pode cadastrar veículo nem criar viagem.
- Mulher motorista pode criar viagem exclusiva para mulheres.
- Homem ou motorista não mulher não pode criar viagem exclusiva.
- Pesquisa por origem/destino funciona por coincidência textual.
- Viagens futuras aparecem aos passageiros autorizados e exibem partida e destino.
- Passageiros com gênero `M` ou `OUTRO` não recebem viagens exclusivas em buscas,
  detalhes por ID, pedidos ou notificações, mesmo com o filtro enviado diretamente.
- Passageiras podem ver viagens exclusivas e usar o filtro. A motorista autora
  continua podendo visualizar e gerenciar sua viagem.
- Cada critério possui teste unitário no service com repository mockado.

## Fora de escopo

- Reserva, pagamento, chat, avaliação e geocodificação externa.
- Navegação turn-by-turn no mapa.
