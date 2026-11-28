import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const mapStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: { paddingTop: 14 },
  stage: { flex: 1, minHeight: 90, backgroundColor: colors.input },
  pin: { position: 'absolute', left: '50%', top: '50%', marginLeft: -22, marginTop: -44 },
  locate: { position: 'absolute', right: 18, bottom: 14 },
  address: { color: colors.text, fontWeight: '800', fontSize: 14, marginVertical: 6 },
});
