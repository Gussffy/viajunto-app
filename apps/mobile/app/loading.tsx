import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors, typography } from '@/src/theme';
import { BrandLogo } from '@/src/components/BrandLogo';

function Bar({ index }: { index: number }) {
  const p = useSharedValue(0.35);
  useEffect(() => {
    p.value = withDelay(index * 90, withRepeat(withSequence(withTiming(1, { duration: 420 }), withTiming(0.35, { duration: 420 })), -1, false));
    return () => cancelAnimation(p);
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ scaleY: p.value }], opacity: 0.5 + p.value * 0.5 }));
  return <Animated.View style={[styles.bar, a]} />;
}

export default function LoadingScreen() {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    const t = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 260 });
      setTimeout(() => router.replace('/acesso'), 260);
    }, 2100);
    return () => clearTimeout(t);
  }, []);
  const a = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[styles.container, a]}>
      <View style={styles.card}>
        <BrandLogo width={200} height={80} />
        <View style={styles.bars}>{[0,1,2,3,4].map(i => <Bar key={i} index={i} />)}</View>
        <Text style={styles.text}>Preparando sua rota</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  card: { alignItems: 'center', gap: 18, backgroundColor: colors.surface, paddingHorizontal: 34, paddingVertical: 28, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  bars: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 36 },
  bar: { width: 8, height: 36, borderRadius: 4, backgroundColor: colors.primaryDeep },
  text: { ...typography.bodyStrong, color: colors.textMuted },
});
