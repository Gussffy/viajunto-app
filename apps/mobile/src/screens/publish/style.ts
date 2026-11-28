import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const wizardStyles = StyleSheet.create({
  header: { paddingTop: 16 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.blue },
  progressText: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 7 },
  stepTitle: { color: colors.navy, fontSize: 22, fontWeight: '900', marginBottom: 14 },
  stack: { gap: 9, marginBottom: 14 },
  inputBox: { padding: 12, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currency: { color: colors.blue, fontSize: 18, fontWeight: '800' },
  priceInput: { flex: 1, color: colors.text, minHeight: 45, padding: 0, fontSize: 21, fontWeight: '800' },
  notes: { minHeight: 90, borderRadius: 12, backgroundColor: colors.input, padding: 12, color: colors.text, textAlignVertical: 'top' },
  review: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 12 },
  reviewLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
