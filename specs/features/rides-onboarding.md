# Navegação, onboarding e veículo

## Objetivo

Separar claramente os fluxos de motorista e passageiro e exigir o cadastro de veículo
antes da publicação de viagens.

## Perfil

- Passageiro: abas Início, Buscar, Minhas viagens e Perfil.
- Motorista: abas Início, Publicar, Minhas viagens e Perfil.
- Início abre após entrar ou restaurar uma sessão.
- O Início do passageiro oferece busca, destinos sugeridos e acesso a Minhas viagens.
  A escolha de destino sugerido preenche a rota na busca.
- O Início do motorista oferece publicação, Minhas viagens e cadastro ou edição
  de carro, conforme o veículo associado ao perfil.
- Nenhum perfil pode renderizar telas exclusivas do outro.

## Veículo

Motoristas podem cadastrar ou editar exatamente um veículo com:

- placa no formato antigo ou Mercosul;
- modelo;
- cor;
- lugares entre 1 e 8.

Motoristas podem cadastrar o veículo imediatamente após o cadastro ou editar em
"Meu veículo" no perfil.

Motoristas sem veículo não podem criar viagens e recebem `VEHICLE_REQUIRED`.

## Critérios de aceite

- Os dois perfis começam em Início, com ações adequadas ao seu papel.
- Os atalhos levam a telas existentes. A busca e a publicação preservam seus
  formulários ao alternar entre Início e as outras abas.
- Passageiro não possui Publicar.
- Motorista não possui Buscar.
- Motorista sem veículo pode iniciar o cadastro pelo Início ou pela aba Publicar.
- Veículo do motorista é único e editável.
- Publicação respeita o número máximo de lugares do veículo.
