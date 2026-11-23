import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '@/src/theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const APressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedButton({ label, onPress, variant = 'primary', icon, loading, disabled, style, accessibilityLabel }: Props) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = disabled || loading;

  return (
    <APressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.975, { damping: 18, stiffness: 260 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 18, stiffness: 260 }); }}
      style={[styles.base, styles[variant], isDisabled && styles.disabled, aStyle, style]}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primaryDeep} /> : (
        <View style={styles.row}>
          {icon}
          <Text style={[styles.label, styles[`${variant}Label` as const]]}>{label}</Text>
        </View>
      )}
    </APressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 54, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { ...typography.button },
  primary: { backgroundColor: colors.primaryDeep, ...shadows.card },
  secondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderStrong },
  ghost: { backgroundColor: colors.surfaceAlt, minHeight: 44 },
  danger: { backgroundColor: colors.danger },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.primaryDeep },
  ghostLabel: { color: colors.primaryDeep },
  dangerLabel: { color: colors.white },
  disabled: { opacity: 0.55 },
});
