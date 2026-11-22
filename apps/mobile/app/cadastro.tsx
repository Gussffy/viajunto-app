import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/src/theme';

const LOGO = require('@/assets/images/logo.png');

type Role = 'motorista' | 'passageiro';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isStrongPassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}

export default function CadastroScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const initialRole: Role = mode === 'dar' ? 'motorista' : 'passageiro';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [role, setRole] = useState<Role>(initialRole);
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (touched.nome) {
      if (!nome.trim()) next.nome = 'Informe seu nome.';
      else if (nome.trim().length < 2) next.nome = 'O nome deve ter pelo menos 2 caracteres.';
    }
    if (touched.email) {
      if (!email.trim()) next.email = 'Informe seu e-mail.';
      else if (!isValidEmail(email)) next.email = 'Digite um e-mail válido.';
    }
    if (touched.senha) {
      if (!senha) next.senha = 'Informe uma senha.';
      else if (!isStrongPassword(senha)) next.senha = 'Use ao menos 8 caracteres, com letra e número.';
    }
    if (touched.confirmarSenha) {
      if (!confirmarSenha) next.confirmarSenha = 'Confirme sua senha.';
      else if (confirmarSenha !== senha) next.confirmarSenha = 'As senhas não coincidem.';
    }
    if (touched.terms && !acceptTerms) next.terms = 'Você precisa aceitar os termos para continuar.';
    return next;
  }, [nome, email, senha, confirmarSenha, touched, acceptTerms]);

  const canSubmit =
    nome.trim().length >= 2 &&
    isValidEmail(email) &&
    isStrongPassword(senha) &&
    confirmarSenha === senha &&
    acceptTerms &&
    !loading;

  const onSubmit = async () => {
    setTouched({ nome: true, email: true, senha: true, confirmarSenha: true, terms: true });
    if (!(nome.trim().length >= 2 && isValidEmail(email) && isStrongPassword(senha) && confirmarSenha === senha && acceptTerms)) {
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      Alert.alert('Conta criada', `Cadastro ${role === 'motorista' ? 'de motorista' : 'de passageiro'} realizado com sucesso.`, [
        {
          text: 'Continuar',
          onPress: () =>
            router.replace({ pathname: '/home' as never, params: { mode: role === 'motorista' ? 'dar' : 'pedir' } }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.backBtn, pressed && styles.pressedIcon]}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="ViaJunto" />
            <View style={styles.backBtn} />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(60)} style={styles.body}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar a usar o ViaJunto com segurança.</Text>

            <View style={styles.roleRow}>
              <RoleChip label="Pedir carona" icon="hand-left-outline" active={role === 'passageiro'} onPress={() => setRole('passageiro')} />
              <RoleChip label="Dar carona" icon="car-sport-outline" active={role === 'motorista'} onPress={() => setRole('motorista')} />
            </View>

            <Field label="Nome completo" error={errors.nome}>
              <InputWrap error={!!errors.nome}>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
                  placeholder="Insira seu nome"
                  placeholderTextColor={colors.textSoft}
                  autoCapitalize="words"
                  textContentType="name"
                  autoComplete="name"
                  returnKeyType="next"
                  style={styles.input}
                  accessibilityLabel="Nome completo"
                />
                <Ionicons name="person-outline" size={20} color={colors.textSoft} />
              </InputWrap>
            </Field>

            <Field label="Email" error={errors.email}>
              <InputWrap error={!!errors.email}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="Insira seu e-mail"
                  placeholderTextColor={colors.textSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="next"
                  style={styles.input}
                  accessibilityLabel="E-mail"
                />
                <Ionicons name="mail-outline" size={20} color={colors.textSoft} />
              </InputWrap>
            </Field>

            <Field label="Senha" error={errors.senha}>
              <InputWrap error={!!errors.senha}>
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  onBlur={() => setTouched((t) => ({ ...t, senha: true }))}
                  placeholder="Crie uma senha"
                  placeholderTextColor={colors.textSoft}
                  secureTextEntry={secure}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  returnKeyType="next"
                  style={styles.input}
                  accessibilityLabel="Senha"
                />
                <Pressable onPress={() => setSecure((s) => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}>
                  <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSoft} />
                </Pressable>
              </InputWrap>
            </Field>

            <Field label="Confirmar senha" error={errors.confirmarSenha}>
              <InputWrap error={!!errors.confirmarSenha}>
                <TextInput
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  onBlur={() => setTouched((t) => ({ ...t, confirmarSenha: true }))}
                  placeholder="Repita sua senha"
                  placeholderTextColor={colors.textSoft}
                  secureTextEntry={secureConfirm}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  style={styles.input}
                  accessibilityLabel="Confirmar senha"
                />
                <Pressable onPress={() => setSecureConfirm((s) => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={secureConfirm ? 'Mostrar confirmação de senha' : 'Ocultar confirmação de senha'}>
                  <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSoft} />
                </Pressable>
              </InputWrap>
            </Field>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptTerms }}
              onPress={() => {
                setAcceptTerms((v) => !v);
                setTouched((t) => ({ ...t, terms: true }));
              }}
              style={styles.termsRow}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms ? <Ionicons name="checkmark" size={14} color="#FFF" /> : null}
              </View>
              <Text style={styles.termsText}>
                Li e aceito os <Text style={styles.termsLink}>Termos de uso</Text> e a <Text style={styles.termsLink}>Política de privacidade</Text>.
              </Text>
            </Pressable>
            {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
              disabled={loading}
              onPress={onSubmit}
              style={({ pressed }) => [styles.submitButton, !canSubmit && styles.submitButtonDisabled, pressed && !loading && styles.pressed]}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Criar conta</Text>}
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: '/login', params: { mode: role === 'motorista' ? 'dar' : 'pedir' } })}>
                <Text style={styles.loginLink}>Entrar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function InputWrap({ error, children }: { error: boolean; children: React.ReactNode }) {
  return <View style={[styles.inputWrap, error && styles.inputWrapError]}>{children}</View>;
}

function RoleChip({ label, icon, active, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.roleChip, active && styles.roleChipActive, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={16} color={active ? '#FFF' : colors.primaryDeep} />
      <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 4 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 132, height: 132 },
  body: { flex: 1 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 20 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primaryDeep,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  roleChipActive: { backgroundColor: colors.primaryDeep },
  roleChipText: { color: colors.primaryDeep, fontSize: 14, fontWeight: '600' },
  roleChipTextActive: { color: '#FFF' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  inputWrap: {
    minHeight: 54,
    borderWidth: 1.5,
    borderColor: colors.primaryDeep,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputWrapError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 12, paddingRight: 8 },
  errorText: { marginTop: 6, color: colors.danger, fontSize: 12 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4, marginBottom: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: '#FFF',
  },
  checkboxChecked: { backgroundColor: colors.primaryDeep },
  termsText: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  termsLink: { color: colors.primaryDeep, fontWeight: '600' },
  submitButton: {
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  submitButtonDisabled: { opacity: 0.55 },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  loginText: { color: colors.text, fontSize: 14 },
  loginLink: { color: colors.primaryDeep, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  pressed: { opacity: 0.9 },
  pressedIcon: { opacity: 0.6 },
});
