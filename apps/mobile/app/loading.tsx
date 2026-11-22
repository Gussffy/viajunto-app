import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/src/theme';

const DOTS = [0, 1, 2, 3, 4, 5, 6, 7];

function Dot({ index }: { index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 110,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }),
          withTiming(0.25, { duration: 520, easing: Easing.in(Easing.cubic) })
        ),
        -1,
        false
      )
    );
    return () => cancelAnimation(progress);
  }, [index, progress]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    return {
      opacity: 0.35 + t * 0.65,
      transform: [{ scale: 0.75 + t * 0.45 }, { translateY: -t * 4 }],
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

export default function LoadingScreen() {
  const screenOpacity = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) });
    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) });
      setTimeout(() => router.replace('/acesso'), 280);
    }, 2300);
    return () => clearTimeout(timer);
  }, [screenOpacity]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.loaderWrap} accessibilityRole="progressbar" accessibilityLabel="Carregando">
        <View style={styles.dotsRow}>
          {DOTS.map((i) => (
            <Dot key={i} index={i} />
          ))}
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderWrap: {
    alignItems: 'center',
    gap: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B8BFC9',
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
  },
});
