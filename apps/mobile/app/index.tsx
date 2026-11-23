import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '@/src/theme';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const ty = useSharedValue(12);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
    ty.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(withTiming(1.02, { duration: 650 }), withTiming(1, { duration: 260 }));
    const t = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 280 }, (f) => { if (f) runOnJS(router.replace)('/loading'); });
    }, 1700);
    return () => clearTimeout(t);
  }, []);

  const aLogo = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: ty.value }, { scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={aLogo}>
        <BrandLogo width={320} height={160} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
