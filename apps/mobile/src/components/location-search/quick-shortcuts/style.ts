import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const style = StyleSheet.create({
  row: { gap: 8, paddingTop: 12 },
  chip: { minHeight: 44, borderRadius: 22, backgroundColor: colors.pale, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { color: colors.blue, fontSize: 13, fontWeight: '700' },
});
