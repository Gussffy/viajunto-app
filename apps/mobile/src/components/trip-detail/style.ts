import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export { styles } from '../../theme/styles';
export const detailStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  status: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.pale, borderRadius: 14, padding: 13, marginBottom: 12 },
  confirmed: { backgroundColor: colors.successBackground },
  statusText: { color: colors.navy, fontSize: 14, fontWeight: '800' },
  top: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 9, marginBottom: 9, borderBottomWidth: 1, borderBottomColor: colors.line },
  price: { color: colors.blue, fontWeight: '900', fontSize: 23 },
  availability: { color: colors.muted, fontSize: 13, fontWeight: '700', marginTop: 9 },
  exclusive: { alignSelf: 'flex-start', color: colors.blue, fontSize: 12, fontWeight: '800', backgroundColor: colors.pale, padding: 7, borderRadius: 8, marginTop: 8 },
  driver: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  driverAvatar: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.pale, justifyContent: 'center', alignItems: 'center' },
  driverInitial: { color: colors.blue, fontSize: 21, fontWeight: '900' },
  notes: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 12 },
  chat: { marginVertical: 12 },
  star: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: 4 },
  cancel: { minHeight: 44, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: colors.danger, fontWeight: '800' },
});
