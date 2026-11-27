import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  topLogo: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: colors.blue,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 9
  },
  topBrand: {fontSize: 23, fontWeight: '800', color: colors.navy, letterSpacing: -0.4},
});
