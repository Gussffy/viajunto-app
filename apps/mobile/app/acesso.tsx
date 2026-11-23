import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/src/components/BrandLogo';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Hand, CarFront, ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';

const LOGO = require('@/assets/images/logo-oficial.jpg');
type Mode = 'pedir' | 'dar';

function Choice({ title, text, icon: Icon, primary, onPress }: { title: string; text: string; icon: typeof Hand; primary?: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={a}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.985, { damping: 18 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 18 }); }}
        style={[styles.choice, primary ? styles.choicePrimary : styles.choiceSecondary]}
      >
        <View style={[styles.iconWrap, primary ? styles.iconWrapPrimary : styles.iconWrapSecondary]}>
          <Icon size={22} color={primary ? colors.white : colors.primaryDeep} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.choiceTitle, primary ? styles.choiceTitlePrimary : styles.choiceTitleSecondary]}>{title}</Text>
          <Text style={[styles.choiceText, primary ? styles.choiceTextPrimary : styles.choiceTextSecondary]}>{text}</Text>
        </View>
        <ChevronRight size={20} color={primary ? colors.white : colors.primaryDeep} strokeWidth={2.2} />
      </Pressable>
    </Animated.View>
  );
}

export default function AcessoScreen() {
  const go = (mode: Mode) => router.push({ pathname: '/login', params: { mode } });
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.hero}>
          <View style={styles.topRow}>
            <Pressable onPress={handleBack} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.backBtn}>
              <ArrowLeft size={22} color={colors.text} strokeWidth={2.2} />
            </Pressable>
            <BrandLogo width={180} height={72} />
            <View style={{ width: 40 }} />
          </View>
          <Text style={styles.title}>Escolha seu caminho na viagem</Text>
          <Text style={styles.subtitle}>Peça uma carona ou ofereça assentos com segurança e clareza desde o primeiro toque.</Text>
          <View style={styles.trust}><ShieldCheck size={14} color={colors.primaryDeep} strokeWidth={2.2} /><Text style={styles.trustText}>Perfis verificados e trajetos claros</Text></View>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.actions}>
          <Choice title="Pedir carona" text="Encontre trajetos disponíveis e reserve seu assento." icon={Hand} primary onPress={() => go('pedir')} />
          <Choice title="Dar carona" text="Publique seu trajeto, defina vagas e valor." icon={CarFront} onPress={() => go('dar')} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 28, justifyContent: 'space-between' },
  hero: { flex: 1, justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700', color: colors.text, letterSpacing: -0.6, marginTop: 8 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 10, maxWidth: 340 },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  trustText: { ...typography.caption, color: colors.primaryDeep, fontWeight: '700' },
  actions: { gap: 12 },
  choice: { minHeight: 78, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadows.card },
  choicePrimary: { backgroundColor: colors.primaryDeep },
  choiceSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconWrapPrimary: { backgroundColor: 'rgba(255,255,255,0.14)' },
  iconWrapSecondary: { backgroundColor: colors.surfaceAlt },
  choiceTitle: { fontSize: 17, fontWeight: '700' },
  choiceTitlePrimary: { color: colors.white },
  choiceTitleSecondary: { color: colors.text },
  choiceText: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  choiceTextPrimary: { color: 'rgba(255,255,255,0.82)' },
  choiceTextSecondary: { color: colors.textMuted },
});
