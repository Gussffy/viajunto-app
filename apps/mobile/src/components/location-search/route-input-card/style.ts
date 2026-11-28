import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  routeInputCard: {backgroundColor: colors.input, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4},
  routeInputCardRow: {height: 56, flexDirection: 'row', alignItems: 'center'},
  routeInputRail: {width: 26, height: 56, alignItems: 'center', justifyContent: 'center'},
  routeOriginDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  routeDestinationSquare: {width: 10, height: 10, borderRadius: 2, backgroundColor: colors.blue},
  routeInputText: {
      flex: 1,
      height: 48,
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 12,
      paddingHorizontal: 8
  },
  routeInputActive: {borderColor: colors.primary, backgroundColor: colors.white},
});
