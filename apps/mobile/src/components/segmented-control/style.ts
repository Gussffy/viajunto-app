import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  segment: {
      minHeight: 49,
      borderRadius: 14,
      backgroundColor: colors.input,
      flexDirection: 'row',
      padding: 4,
      marginBottom: 16
  },
  segmentItem: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 7,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10
  },
  segmentActive: {
      backgroundColor: colors.white,
      shadowColor: '#0B1F3A',
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 2
  },
  segmentText: {color: colors.muted, fontSize: 13, textAlign: 'center', fontWeight: '700'},
  segmentTextActive: {color: colors.blue},
});
