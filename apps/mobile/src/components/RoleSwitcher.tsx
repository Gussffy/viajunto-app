import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/src/theme';

type Option<T extends string> = { value: T; label: string; icon?: React.ReactNode };
type Props<T extends string> = { value: T; options: Option<T>[]; onChange: (v: T) => void };

export function RoleSwitcher<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} style={[styles.item, active && styles.itemActive]} accessibilityRole="button" accessibilityState={{ selected: active }}>
            {opt.icon}
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 4, gap: 4 },
  item: { flex: 1, minHeight: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  itemActive: { backgroundColor: colors.primaryDeep },
  label: { ...typography.small, color: colors.primaryDeep, fontWeight: '700' },
  labelActive: { color: colors.white },
});
