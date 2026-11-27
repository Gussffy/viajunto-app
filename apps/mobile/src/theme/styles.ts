import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  fieldLabel: {color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 7},
  screen: {flex: 1, backgroundColor: colors.canvas},
  pageContent: {
      width: '100%',
      maxWidth: 720,
      alignSelf: 'center',
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 28
  },
  switchRow: {
      minHeight: 55,
      paddingVertical: 6,
      gap: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.line,
      marginBottom: 8
  },
  switchTitle: {color: colors.text, fontWeight: '700', fontSize: 13},
  switchCaption: {color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 2},
  sectionTitle: {color: colors.text, fontWeight: '800', fontSize: 16},
  detailLabel: {color: colors.muted, fontSize: 11, marginBottom: 4},
  detailValue: {color: colors.text, fontWeight: '800', fontSize: 13},
  formCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.line,
      padding: 15,
      marginBottom: 12,
      gap: 5
  },
});
