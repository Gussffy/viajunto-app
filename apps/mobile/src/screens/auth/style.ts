import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const authStyles = StyleSheet.create({
  roleRow: {flexDirection: 'row', gap: 10, marginBottom: 14},
  roleCard: {
      flex: 1,
      minHeight: 68,
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.line,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 7
  },
  roleCardActive: {borderColor: colors.blue, backgroundColor: colors.pale},
  roleText: {color: colors.muted, fontWeight: '700', fontSize: 13, textAlign: 'center'},
  roleTextActive: {color: colors.blue},
  genderRow: {flexDirection: 'row', gap: 8, marginTop: 7, marginBottom: 16},
  genderChip: {
      flex: 1,
      minHeight: 44,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.line,
      alignItems: 'center',
      justifyContent: 'center'
  },
  genderChipActive: {backgroundColor: colors.pale, borderColor: colors.blue},
  genderText: {color: colors.muted, fontWeight: '700', fontSize: 12},
  genderTextActive: {color: colors.blue},
  root: { flex: 1, backgroundColor: colors.canvas },
  viewport: { flexGrow: 1, justifyContent: 'center', paddingVertical: 18 },
  layout: { maxWidth: 520, gap: 12 },
  identity: { gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  card: { backgroundColor: colors.white, borderRadius: 23, padding: 16, borderWidth: 1, borderColor: colors.line },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: -5, marginBottom: 14 },
});
