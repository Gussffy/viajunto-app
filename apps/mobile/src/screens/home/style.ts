import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const homeStyles = StyleSheet.create({
  content: { gap: 14 },
  greeting: { color: colors.navy, fontSize: 21, fontWeight: '900' },
  action: { marginTop: -5 },
  section: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 9 },
  sectionTitle: { color: colors.navy, fontSize: 18, fontWeight: '900' },
  destinations: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  destination: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.input },
  city: { color: colors.navy, fontSize: 13, fontWeight: '800', flexShrink: 1 },
});
