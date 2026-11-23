import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius, typography } from '@/src/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
};

const AView = Animated.createAnimatedComponent(View);

export function InputField({ label, error, icon, right, onFocus, onBlur, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);
  const wrapStyle = useAnimatedStyle(() => ({
    borderColor: error ? colors.danger : focus.value ? colors.primary : colors.borderStrong,
    backgroundColor: withTiming(focus.value ? '#FBFDFF' : colors.surface),
  }));

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AView style={[styles.wrap, wrapStyle]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel ?? label}
          style={[styles.input, style]}
          placeholderTextColor={colors.textSoft}
          onFocus={(e) => { setFocused(true); focus.value = withTiming(1, { duration: 180 }); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); focus.value = withTiming(0, { duration: 180 }); onBlur?.(e); }}
        />
        {right}
      </AView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { ...typography.small, color: colors.text, marginBottom: 8, fontWeight: '600' },
  wrap: { minHeight: 54, borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 12 },
  error: { marginTop: 6, color: colors.dangerText, fontSize: 12, fontWeight: '500' },
});
