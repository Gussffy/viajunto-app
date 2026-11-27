import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  primaryButton: {
      minHeight: 53,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'row',
      gap: 8,
      backgroundColor: colors.blue,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6
  },
  buttonPressed: {opacity: 0.82},
  primaryButtonText: {color: colors.white, fontSize: 15, fontWeight: '800', textAlign: 'center', flexShrink: 1},
});
