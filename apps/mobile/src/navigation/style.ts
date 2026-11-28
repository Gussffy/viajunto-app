import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const shell = StyleSheet.create({
  boot: {flex: 1, gap: 12, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center'},
  brand: {color: colors.white, fontSize: 29, fontWeight: '900', letterSpacing: -1},
  root: { flex: 1, backgroundColor: colors.white },
  bar: { borderBottomWidth: 1, borderBottomColor: colors.line },
  barContent: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  body: { flex: 1, backgroundColor: colors.canvas },
  fill: { flex: 1 },
  hidden: { display: 'none' },
});
