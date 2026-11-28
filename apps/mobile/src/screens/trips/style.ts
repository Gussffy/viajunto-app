import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const tripsStyles = StyleSheet.create({
  unread: { backgroundColor: colors.pale },
  section: { color: colors.navy, fontSize: 17, fontWeight: '800', marginVertical: 10 },
  link: { minHeight: 44, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: colors.blue, fontWeight: '800' },
  linkDanger: { color: colors.danger, fontWeight: '800' },
  action: { marginTop: 10 },
  star: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
