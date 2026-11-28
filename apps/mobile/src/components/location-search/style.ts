import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  searchSheetRoot: {flex: 1, backgroundColor: colors.white},
  locationItem: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.line
  },
  locationItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
  },
  locationItemText: {flex: 1, minWidth: 0},
  locationItemTitle: {color: colors.text, fontSize: 15, fontWeight: '800'},
  locationItemSubtitle: {color: colors.muted, fontSize: 12, marginTop: 3},
});
