# ViaJunto Mobile

Aplicativo Expo do ViaJunto.

## Rodar localmente

1. Inicie o backend:

   ```powershell
   docker compose up -d
   npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma
   npm run dev --workspace apps/backend
   ```

2. Configure o endereço do backend em `apps/mobile/.env`:

   ```text
   EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
   ```

   Em emulador Android use normalmente `http://10.0.2.2:3000`.

3. Inicie o Expo:

   ```bash
   npm run start --workspace apps/mobile
   ```

## Dados de demonstração

O script reinicia somente as três viagens com IDs de demonstração e as contas de demonstração; ele não apaga contas nem viagens de usuários. O script recusa bancos que não estejam em `localhost`.

```powershell
$env:DEMO_PASSWORD = "EscolhaUmaSenhaLocal2026"
npm run reset:demo --workspace apps/backend
```

Contas: `motorista.demo@viajunto.local` e `passageira.demo@viajunto.local`; ambas usam a senha definida em `DEMO_PASSWORD`.

## Roteiro de teste ponta a ponta

1. Entre como a motorista de demonstração, publique uma carona com menos vagas que o limite do veículo e confira a revisão, rota, data e preço.
2. Entre como a passageira de demonstração, pesquise origem/destino, data e quantidade de passageiros; confira que a lista só aparece após pesquisar.
3. Abra uma carona e solicite vaga. O pedido fica pendente, não deve ser duplicado e pode ser cancelado pela passageira.
4. Volte à conta motorista: o badge de Minhas viagens deve indicar pedidos pendentes. Aceite um pedido e confirme que as vagas diminuíram; repita com outro pedido e recuse.
5. Teste aprovação automática em uma nova viagem e confirme que só viagens abertas com vagas aparecem nos resultados.
6. Inicie e finalize uma viagem com passageiro aceito; faça a avaliação por ambas as contas. O botão Conversar deve aparecer somente para passageiros aceitos e abrir “Em desenvolvimento”.
7. Teste cancelar pedido aceito antes do início (a vaga retorna), cancelar a viagem inteira (passageiros recebem notificação) e as abas Próximas, Concluídas e Canceladas.
8. Desligue a API ou a internet para validar os estados de erro e o botão de tentar novamente no mapa de rotas.
