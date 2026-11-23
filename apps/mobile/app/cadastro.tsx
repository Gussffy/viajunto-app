import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/src/components/BrandLogo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Hand, CarFront, Check } from 'lucide-react-native';
import { colors, radius, typography } from '@/src/theme';
import { InputField } from '@/src/components/InputField';
import { AnimatedButton } from '@/src/components/AnimatedButton';
import { RoleSwitcher } from '@/src/components/RoleSwitcher';

type Role = 'motorista' | 'passageiro';
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isStrong = (v: string) => v.length >= 8 && /[A-Za-z]/.test(v) && /[0-9]/.test(v);

export default function CadastroScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [role, setRole] = useState<Role>(mode === 'dar' ? 'motorista' : 'passageiro');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.nome) { if (!nome.trim()) e.nome = 'Informe seu nome.'; else if (nome.trim().length < 2) e.nome = 'O nome deve ter pelo menos 2 caracteres.'; }
    if (touched.email) { if (!email.trim()) e.email = 'Informe seu e-mail.'; else if (!isValidEmail(email)) e.email = 'Digite um e-mail válido.'; }
    if (touched.senha) { if (!senha) e.senha = 'Informe uma senha.'; else if (!isStrong(senha)) e.senha = 'Use ao menos 8 caracteres, com letra e número.'; }
    if (touched.confirmar) { if (!confirmar) e.confirmar = 'Confirme sua senha.'; else if (confirmar !== senha) e.confirmar = 'As senhas não coincidem.'; }
    if (touched.terms && !terms) e.terms = 'Você precisa aceitar os termos para continuar.';
    return e;
  }, [nome, email, senha, confirmar, terms, touched]);

  const submit = async () => {
    setTouched({ nome: true, email: true, senha: true, confirmar: true, terms: true });
    if (!(nome.trim().length >= 2 && isValidEmail(email) && isStrong(senha) && confirmar === senha && terms)) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      setCreated(true);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
          <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.back}><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
            <BrandLogo width={100} height={40} /><View style={{ width: 40 }} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(420).delay(60)}>
            <Text style={styles.subtitle}>Comece sua jornada no ViaJunto com um perfil seguro.</Text>
            {created ? (
              <View style={styles.successCard}>
                <View style={styles.successIcon}><Check size={24} color={colors.white} strokeWidth={3} /></View>
                <Text style={styles.successTitle}>Conta criada</Text>
                <Text style={styles.successText}>Cadastro de {role === 'motorista' ? 'motorista' : 'passageiro'} realizado com sucesso. Agora você já pode usar o ViaJunto.</Text>
                <AnimatedButton label="Ir para o início" onPress={() => router.replace({ pathname: '/(tabs)/home', params: { mode: role === 'motorista' ? 'dar' : 'pedir' } } as any)} style={{ marginTop: 20, alignSelf: 'stretch' }} />
              </View>
            ) : (
              <>
                <View style={{ marginBottom: 20 }}>
                  <RoleSwitcher<Role> value={role} onChange={setRole} options={[
                    { value: 'passageiro', label: 'Pedir carona', icon: <Hand size={16} color={role === 'passageiro' ? colors.white : colors.primaryDeep} strokeWidth={2.2} /> },
                    { value: 'motorista', label: 'Dar carona', icon: <CarFront size={16} color={role === 'motorista' ? colors.white : colors.primaryDeep} strokeWidth={2.2} /> },
                  ]} />
                </View>
                <InputField label="Nome completo" value={nome} onChangeText={setNome} onBlur={() => setTouched(t => ({ ...t, nome: true }))} placeholder="Seu nome" autoCapitalize="words" error={errors.nome} icon={<User size={18} color={colors.textSoft} strokeWidth={2} />} />
                <InputField label="E-mail" value={email} onChangeText={setEmail} onBlur={() => setTouched(t => ({ ...t, email: true }))} placeholder="nome@email.com" autoCapitalize="none" keyboardType="email-address" error={errors.email} icon={<Mail size={18} color={colors.textSoft} strokeWidth={2} />} />
                <InputField label="Senha" value={senha} onChangeText={setSenha} onBlur={() => setTouched(t => ({ ...t, senha: true }))} placeholder="Crie uma senha" secureTextEntry={secure} error={errors.senha} icon={<Lock size={18} color={colors.textSoft} strokeWidth={2} />} right={<Pressable onPress={() => setSecure(s => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}>{secure ? <EyeOff size={18} color={colors.textSoft} strokeWidth={2} /> : <Eye size={18} color={colors.textSoft} strokeWidth={2} />}</Pressable>} />
                <InputField label="Confirmar senha" value={confirmar} onChangeText={setConfirmar} onBlur={() => setTouched(t => ({ ...t, confirmar: true }))} placeholder="Repita a senha" secureTextEntry={secure2} returnKeyType="done" onSubmitEditing={submit} error={errors.confirmar} icon={<Lock size={18} color={colors.textSoft} strokeWidth={2} />} right={<Pressable onPress={() => setSecure2(s => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={secure2 ? 'Mostrar confirmação de senha' : 'Ocultar confirmação de senha'}>{secure2 ? <EyeOff size={18} color={colors.textSoft} strokeWidth={2} /> : <Eye size={18} color={colors.textSoft} strokeWidth={2} />}</Pressable>} />

                <Pressable style={styles.terms} onPress={() => { setTerms(v => !v); setTouched(t => ({ ...t, terms: true })); }} accessibilityRole="checkbox" accessibilityState={{ checked: terms }} accessibilityLabel="Aceitar termos de uso e política de privacidade">
                  <View style={[styles.checkbox, terms && styles.checkboxChecked]}>{terms ? <Check size={13} color={colors.white} strokeWidth={3} /> : null}</View>
                  <Text style={styles.termsText}>Li e aceito os <Text style={styles.link}>Termos de uso</Text> e a <Text style={styles.link}>Política de privacidade</Text>.</Text>
                </Pressable>
                {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}

                <AnimatedButton label="Criar conta" onPress={submit} loading={loading} style={{ marginTop: 8 }} />
                <View style={styles.loginRow}><Text style={styles.loginText}>Já tem conta? </Text><Pressable onPress={() => router.replace({ pathname: '/login', params: { mode: role === 'motorista' ? 'dar' : 'pedir' } })} accessibilityRole="button" accessibilityLabel="Entrar"><Text style={styles.link}>Entrar</Text></Pressable></View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 20 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: 20 },
  terms: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 2, marginBottom: 6 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  termsText: { flex: 1, ...typography.small, color: colors.textMuted, lineHeight: 20 },
  link: { color: colors.primaryDeep, fontWeight: '700' },
  error: { color: colors.dangerText, fontSize: 12, marginBottom: 10 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  loginText: { ...typography.body, color: colors.textMuted },
  successCard: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center' },
  successIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { ...typography.h3, color: colors.text, marginBottom: 8 },
  successText: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
});