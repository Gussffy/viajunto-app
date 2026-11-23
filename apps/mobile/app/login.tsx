import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/src/components/BrandLogo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Hand, CarFront } from 'lucide-react-native';
import { colors, radius, typography } from '@/src/theme';
import { InputField } from '@/src/components/InputField';
import { AnimatedButton } from '@/src/components/AnimatedButton';

function isValidEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isDriver = mode === 'dar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const errors = useMemo(() => {
    const e: { email?: string; password?: string } = {};
    if (touched.email) { if (!email.trim()) e.email = 'Informe seu e-mail.'; else if (!isValidEmail(email)) e.email = 'Digite um e-mail válido.'; }
    if (touched.password) { if (!password) e.password = 'Informe sua senha.'; else if (password.length < 8) e.password = 'A senha deve ter pelo menos 8 caracteres.'; }
    return e;
  }, [email, password, touched]);

  const submit = async () => {
    setTouched({ email: true, password: true });
    if (!isValidEmail(email) || password.length < 8) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      router.replace({ pathname: '/(tabs)/home', params: { mode: isDriver ? 'dar' : 'pedir' } } as any);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
          <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.back}><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
            <View style={styles.modePill}>
              {isDriver ? <CarFront size={14} color={colors.primaryDeep} strokeWidth={2.2} /> : <Hand size={14} color={colors.primaryDeep} strokeWidth={2.2} />}
              <Text style={styles.modePillText}>{isDriver ? 'Modo motorista' : 'Modo passageiro'}</Text>
            </View>
            <BrandLogo width={100} height={40} />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(420).delay(60)}>
            <Text style={styles.title}>Entrar na sua conta</Text>
            <Text style={styles.subtitle}>{isDriver ? 'Acesse para publicar trajetos e gerenciar reservas.' : 'Acesse para encontrar caronas com segurança.'}</Text>

            <InputField label="E-mail" value={email} onChangeText={setEmail} onBlur={() => setTouched(t => ({ ...t, email: true }))} placeholder="nome@email.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" error={errors.email} icon={<Mail size={18} color={colors.textSoft} strokeWidth={2} />} />

            <InputField label="Senha" value={password} onChangeText={setPassword} onBlur={() => setTouched(t => ({ ...t, password: true }))} placeholder="Sua senha" secureTextEntry={secure} autoComplete="password" textContentType="password" returnKeyType="done" onSubmitEditing={submit} error={errors.password} icon={<Lock size={18} color={colors.textSoft} strokeWidth={2} />} right={<Pressable onPress={() => setSecure(s => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}>{secure ? <EyeOff size={18} color={colors.textSoft} strokeWidth={2} /> : <Eye size={18} color={colors.textSoft} strokeWidth={2} />}</Pressable>} />

            <Pressable onPress={() => setRecovery(v => !v)} style={styles.forgot} accessibilityRole="button" accessibilityLabel="Recuperar senha"><Text style={styles.forgotText}>Esqueceu a senha?</Text></Pressable>
            {recovery ? (
              <View style={styles.recoveryBox} accessibilityLiveRegion="polite">
                <Text style={styles.recoveryText}>A recuperação de senha será conectada ao backend em breve.</Text>
              </View>
            ) : null}

            <AnimatedButton label="Entrar" onPress={submit} loading={loading} />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Não tem conta? </Text>
              <Pressable onPress={() => router.push({ pathname: '/cadastro', params: { mode: isDriver ? 'dar' : 'pedir' } })}><Text style={styles.registerLink}>Criar conta</Text></Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 28 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  modePillText: { ...typography.caption, color: colors.primaryDeep, fontWeight: '700' },
  title: { ...typography.title, color: colors.text, marginBottom: 8 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: 28, maxWidth: 320 },
  forgot: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { ...typography.small, color: colors.primaryDeep, fontWeight: '700' },
  recoveryBox: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 12, marginBottom: 16, marginTop: -8 },
  recoveryText: { ...typography.small, color: colors.primaryDeep },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { ...typography.body, color: colors.textMuted },
  registerLink: { ...typography.bodyStrong, color: colors.primaryDeep },
});