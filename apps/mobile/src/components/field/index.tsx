import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';
import { styles as theme } from '../../theme/styles';
import { styles } from './style';

type FieldProps = Pick<TextInputProps, 'placeholder' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'maxLength' | 'onSubmitEditing'> & {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
};

export function Field({ label, autoCapitalize = 'none', secureTextEntry, ...props }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={theme.fieldLabel}>{label}</Text>
      <View>
        <TextInput {...props}
          accessibilityLabel={label} autoCapitalize={autoCapitalize} placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry && !passwordVisible}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={[styles.input, focused && styles.inputFocused, secureTextEntry && styles.passwordInput]} />
        {secureTextEntry && (
          <Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={({ pressed }) => [styles.visibilityButton, pressed && styles.visibilityButtonPressed]}>
            <Ionicons aria-hidden name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={21} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
