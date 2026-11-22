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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isDriver = mode === 'dar';
  const modeTitle = isDriver ? 'Quero dar carona' : 'Quero pedir carona';
  const modeSubtitle = isDriver
    ? 'Entre para oferecer assentos na sua viagem'
    : 'Faça login para acessar sua conta e pedir carona';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const errors = useMemo(() => {
    const next: { email?: string; password?: string } = {};
    if (touched.email) {
      if (!email.trim()) next.email = 'Informe seu e-mail.';
      else if (!isValidEmail(email)) next.email = 'Digite um e-mail válido.';
    }
    if (touched.password) {
      if (!password) next.password = 'Informe sua senha.';
      else if (password.length < 8) next.password = 'A senha deve ter pelo menos 8 caracteres.';
    }
    return next;
  }, [email, password, touched]);

  const canSubmit = isValidEmail(email) && password.length >= 8 && !loading;

  const onSubmit = async () => {
    setTouched({ email: true, password: true });
    if (!isValidEmail(email) || password.length < 8) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      router.replace({ pathname: '/home' as never, params: { mode: isDriver ? 'dar' : 'pedir' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => router.back()}
              hitSlop={10}
              style={({ pressed }) => [styles.backBtn, pressed && styles.pressedIcon]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="ViaJunto" />
            <View style={styles.backBtn} />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(60)} style={styles.body}>
            <View style={styles.modeBadge}>
              <Ionicons name={isDriver ? 'car-sport-outline' : 'hand-left-outline'} size={16} color={colors.primaryDeep} />
              <Text style={styles.modeBadgeText}>{modeTitle}</Text>
            </View>
            <Text style={styles.subtitle}>{modeSubtitle}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrap, errors.email && styles.inputWrapError]}>
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
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputWrap, errors.password && styles.inputWrapError]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Insira sua senha"
                  placeholderTextColor={colors.textSoft}
                  secureTextEntry={secure}
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  style={styles.input}
                  accessibilityLabel="Senha"
                />
                <Pressable
                  onPress={() => setSecure((s) => !s)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}
                >
                  <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSoft} />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Esqueceu a senha"
              onPress={() => Alert.alert('Recuperação', 'Fluxo de recuperação de senha em breve.')}
              style={({ pressed }) => [styles.forgotWrap, pressed && styles.pressedText]}
            >
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fazer login"
              disabled={loading}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.loginButton,
                !canSubmit && styles.loginButtonDisabled,
                pressed && !loading && styles.pressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/cadastro' as never, params: { mode: isDriver ? 'dar' : 'pedir' } })}
              >
                <Text style={styles.registerLink}>Criar conta</Text>
              </Pressable>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerLabelWrap}>
                <Text style={styles.dividerLabel}>ou continue com</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialButton icon="logo-google" color="#EA4335" label="Continuar com Google" onPress={() => {}} />
              <SocialButton icon="logo-facebook" color="#1877F2" label="Continuar com Facebook" onPress={() => {}} bg="#1877F2" iconColor="#FFFFFF" />
              <SocialButton icon="logo-apple" color="#000000" label="Continuar com Apple" onPress={() => {}} bg="#000000" iconColor="#FFFFFF" />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  color,
  label,
  onPress,
  bg = '#FFFFFF',
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  onPress: () => void;
  bg?: string;
  iconColor?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.socialBtn, { backgroundColor: bg }, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={iconColor ?? color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 160 },
  body: { flex: 1 },
  modeBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F0F5FF',
    marginBottom: 12,
  },
  modeBadgeText: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 28,
  },
  field: { marginBottom: 18 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  inputWrap: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.primaryDeep,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputWrapError: { borderColor: colors.danger },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingRight: 8,
  },
  errorText: { marginTop: 6, color: colors.danger, fontSize: 12 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 20, paddingVertical: 4 },
  forgotText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  loginButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  loginButtonDisabled: { opacity: 0.55 },
  loginButtonText: { color: '#FFFFFF', fontSize: 22, fontWeight: '500', lineHeight: 26 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, marginBottom: 24 },
  registerText: { color: colors.text, fontSize: 14 },
  registerLink: { color: colors.primaryDeep, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 2, backgroundColor: colors.primaryDeep },
  dividerLabelWrap: { paddingHorizontal: 12, backgroundColor: colors.background },
  dividerLabel: { color: colors.text, fontSize: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  pressedIcon: { opacity: 0.6 },
  pressedText: { opacity: 0.7 },
});
