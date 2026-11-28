import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const searchStyles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.line, padding: 15, marginTop: 13, gap: 8 },
  link: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7 },
  linkText: { color: colors.blue, fontSize: 13, fontWeight: '800', flexShrink: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { flexGrow: 1, flexBasis: 170, minWidth: 0 },
  section: { color: colors.navy, fontWeight: '900', fontSize: 19, marginTop: 20, marginBottom: 10 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestion: { minHeight: 44, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7 },
  suggestionText: { color: colors.navy, fontSize: 13, fontWeight: '700' },
  summary: { backgroundColor: colors.pale, borderRadius: 16, padding: 14, marginBottom: 15, gap: 4 },
  summaryRoute: { color: colors.navy, fontSize: 16, fontWeight: '800' },
  summaryMeta: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  count: { color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 10 },
  loading: { padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
