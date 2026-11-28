import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  preview: { borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, overflow: 'hidden', marginBottom: 12 },
  map: { height: 220, backgroundColor: colors.input },
  info: { padding: 12 },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700' },
});
