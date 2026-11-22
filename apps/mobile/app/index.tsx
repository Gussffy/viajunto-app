import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/src/theme';

const LOGO = require('@/assets/images/logo.png');

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.84);
  const translateY = useSharedValue(18);

  const navigate = () => {
    router.replace('/loading');
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.04, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 280, easing: Easing.inOut(Easing.quad) })
    );
    translateY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 320, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(navigate)();
      });
    }, 1700);

    return () => clearTimeout(timer);
  }, [opacity, scale, translateY]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="Logo ViaJunto" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    width: '78%',
    maxWidth: 360,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
