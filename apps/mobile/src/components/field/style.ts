import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  field: {marginBottom: 13},
  input: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 13,
      paddingHorizontal: 14,
      backgroundColor: colors.input,
      color: colors.text,
      fontSize: 15
  },
  inputFocused: {borderColor: colors.blue, backgroundColor: colors.white},
    passwordInput: { paddingRight: 54 },
    visibilityButton: {
        position: 'absolute',
        right: 4,
        top: 0,
        bottom: 0,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    visibilityButtonPressed: { opacity: 0.6 },
});
