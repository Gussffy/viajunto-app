import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandMark } from '../../components/brand-mark';
import { Field } from '../../components/field';
import { PageHeading, RoadBanner, ui } from '../../components/journey-ui';
import { Reveal } from '../../components/motion';
import { PrimaryButton } from '../../components/primary-button';
import { SegmentedControl } from '../../components/segmented-control';
import { getCurrentUser, login, register } from '../../services/auth-api';
import { saveSession } from '../../services/session-storage';
import type { User } from '../../types';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/styles';
import { authStyles as auth } from './style';

type AuthScreenProps = { onAuthenticated: (user: User, accessToken: string) => void };

const modes = [['login', 'Entrar'], ['register', 'Criar conta']] as const;

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [genero, setGenero] = useState<User['genero'] | null>(null);
  const [role, setRole] = useState<User['role']>('passageiro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollView = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const scrollHeight = useRef(0);
  const insets = useSafeAreaInsets();
  const registering = mode === 'register';
  const isAndroid = Platform.OS === 'android';

  const revealFocusedField = () => {
    const input = TextInput.State.currentlyFocusedInput();
    if (input) {
      scrollView.current?.scrollResponderScrollNativeHandleToKeyboard(input, insets.top + 16, true);
    }
  };

  const onScrollLayout = ({ nativeEvent: { layout: { height } } }: LayoutChangeEvent) => {
    const resized = height < scrollHeight.current;
    scrollHeight.current = height;
    if (resized) revealFocusedField();
  };

  const submit = async () => {
    if (loading) return;
    if (!email.trim() || !senha || (registering && (!nome.trim() || !genero))) {
      setError('Preencha os campos para continuar.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (registering) {
        await register({ nome, email, senha, genero, role });
        setMode('login');
      }
      const session = await login({ email, senha });
      const user = await getCurrentUser(session.accessToken);
      await saveSession(session);
      onAuthenticated(user, session.accessToken);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={auth.root} behavior={isAndroid ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <SafeAreaView style={auth.root}>
        <ScrollView ref={scrollView} keyboardShouldPersistTaps="handled" contentContainerStyle={auth.viewport}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          onKeyboardDidShow={isAndroid ? revealFocusedField : undefined}
          onLayout={isAndroid ? onScrollLayout : undefined}>
          <View style={[ui.container, auth.layout]}>
            <View style={auth.identity}>
              <View style={auth.brand}>
                <BrandMark />
              </View>
              <RoadBanner title="Sua próxima carona" description="Conecte-se a quem vai para a mesma cidade." compact />
            </View>
            <View style={auth.card}>
              <SegmentedControl options={modes} selected={mode} disabled={loading} onChange={(next) => { setMode(next); setError(null); }} />
              <Reveal changeKey={mode}>
                <PageHeading title={registering ? 'Crie sua conta' : 'Acesse sua conta'} />
                {registering && <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Digite seu nome" autoCapitalize="words" autoComplete="name" />}
                <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="Digite seu e-mail" keyboardType="email-address" autoComplete="email" />
                <Field key={mode} label="Senha" value={senha} onChangeText={setSenha} placeholder="Digite sua senha" secureTextEntry
                  autoComplete={registering ? 'new-password' : 'current-password'} onSubmitEditing={registering ? undefined : () => void submit()} />
                {registering && (
                  <>
                    <Text style={auth.hint}>Use 8 ou mais caracteres, com pelo menos uma letra e um número.</Text>
                    <Text style={styles.fieldLabel}>Como você quer usar o ViaJunto?</Text>
                    <View style={auth.roleRow}>
                      {(['passageiro', 'motorista'] as const).map((item) => (
                        <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: role === item }}
                          onPress={() => setRole(item)} style={[auth.roleCard, role === item && auth.roleCardActive]}>
                          <Ionicons name={item === 'motorista' ? 'car-outline' : 'person-outline'} size={22} color={colors.blue} />
                          <Text style={[auth.roleText, role === item && auth.roleTextActive]}>{item === 'motorista' ? 'Oferecer carona' : 'Buscar carona'}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <Text style={styles.fieldLabel}>Gênero</Text>
                    <View style={auth.genderRow}>
                      {([['F', 'Mulher'], ['M', 'Homem'], ['OUTRO', 'Outro']] as const).map(([item, label]) => (
                        <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: genero === item }}
                          onPress={() => setGenero(item)} style={[auth.genderChip, genero === item && auth.genderChipActive]}>
                          <Text style={[auth.genderText, genero === item && auth.genderTextActive]}>{label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}
                {error && <Text accessibilityLiveRegion="polite" style={ui.error}>{error}</Text>}
                <PrimaryButton label={registering ? 'Criar conta' : 'Entrar'} icon="arrow-forward" onPress={() => void submit()} loading={loading} />
              </Reveal>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
