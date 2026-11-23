import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, typography } from '@/src/theme';

type Props = { title: string; text: string };

export function EmptyIllustration({ title, text }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.art}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="52" fill={colors.surfaceAlt} />
          <Circle cx="60" cy="60" r="38" stroke="#C9D8EE" strokeWidth="2" fill="none" />
          <Path d="M38 68C38 58 46 50 56 50H64C74 50 82 58 82 68V74H38V68Z" fill="#DCEBFF" stroke={colors.primaryDeep} strokeWidth="2.5" />
          <Circle cx="60" cy="40" r="10" fill="#FFFFFF" stroke={colors.primaryDeep} strokeWidth="2.5" />
          <Path d="M46 74H74" stroke={colors.primaryDeep} strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M78 34L88 24M88 34L78 24" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 28 },
  art: { marginBottom: 18 },
  title: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: 8 },
  text: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});
