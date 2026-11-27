import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './style';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function PrimaryButton({ label, onPress, loading, disabled, icon }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(loading || disabled) }}
      onPress={onPress} disabled={loading || disabled}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed, disabled && { opacity: 0.55 }]}>
      {loading ? <ActivityIndicator color={colors.white} /> : (
        <>
          {icon && <Ionicons name={icon} size={19} color={colors.white} />}
          <Text style={styles.primaryButtonText}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
