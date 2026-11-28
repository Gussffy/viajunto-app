import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  route: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 10 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 58, gap: 9, paddingHorizontal: 3, paddingVertical: 6 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  input: { color: colors.text, fontSize: 15, fontWeight: '700', minHeight: 30, padding: 0 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 21 },
});
