import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const profileStyles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 20, backgroundColor: colors.navy, padding: 17, marginBottom: 14 },
  avatar: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.blue, fontSize: 21, fontWeight: '900' },
  name: { color: colors.white, fontSize: 21, fontWeight: '900' },
  email: { color: '#E3EDFF', fontSize: 13, marginTop: 3 },
  role: { color: colors.blue, backgroundColor: colors.pale, alignSelf: 'flex-start', fontSize: 12, fontWeight: '800', borderRadius: 9, padding: 6, marginTop: 9 },
  logout: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  logoutText: { color: colors.danger, fontWeight: '800' },
  cancel: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
