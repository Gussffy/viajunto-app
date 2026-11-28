import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const nav = StyleSheet.create({
  bar: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  inner: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 5 },
  item: { flex: 1, minHeight: 56, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 3 },
  icon: { minWidth: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.pale },
  label: { color: colors.muted, textAlign: 'center', fontSize: 11, fontWeight: '700' },
  activeText: { color: colors.blue },
  badge: { position: 'absolute', top: -3, right: 0, minWidth: 17, paddingHorizontal: 4, minHeight: 17, borderRadius: 9, backgroundColor: colors.blue, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '900' },
});
