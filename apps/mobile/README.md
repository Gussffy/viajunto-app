# ViaJunto Mobile

App mobile (Expo + React Native) com as telas iniciais do fluxo de acesso.

## Telas implementadas

- `app/index.tsx` - Splash com animação de entrada da logo
- `app/loading.tsx` - Loading com indicador animado
- `app/acesso.tsx` - Tela de acesso com CTAs
- `app/login.tsx` - Login com validação, feedback e estados de teclado/SafeArea

## Rodando

Na raiz do monorepo:

```bash
npm install
npm run start --workspace apps/mobile
```

Ou dentro de `apps/mobile`:

```bash
npm install
npx expo start
```

## Notas

- Fluxo: `Splash -> Loading -> Acesso -> Login`
- Animações com `react-native-reanimated` (UI thread quando possível)
- Layout responsivo com `SafeAreaView`, `KeyboardAvoidingView` e `ScrollView`
- Referências visuais do Figma usadas para orientar a implementação; alguns assets/ícones foram adaptados para componentes nativos por performance e manutenibilidade.
