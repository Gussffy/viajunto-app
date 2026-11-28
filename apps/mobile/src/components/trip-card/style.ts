import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const card = StyleSheet.create({
  root: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 15, gap: 12, marginBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  date: { color: colors.muted, fontSize: 13, fontWeight: '700', flexShrink: 1 },
  price: { color: colors.navy, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  footer: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 11, flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: { color: colors.blue, fontSize: 11, fontWeight: '800', backgroundColor: colors.pale, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  meta: { color: colors.muted, fontSize: 12, fontWeight: '700' },
});
