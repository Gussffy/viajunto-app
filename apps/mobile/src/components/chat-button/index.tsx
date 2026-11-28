import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { colors } from '../../theme/colors';

type ChatButtonProps = { onPress: () => void; accessibilityLabel?: string };

export function ChatButton({ onPress, accessibilityLabel = 'Conversar' }: ChatButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={{ minHeight: 48, borderRadius: 12, backgroundColor: colors.pale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 }}
    >
      <Ionicons name="chatbubble-ellipses-outline" size={19} color={colors.blue} />
      <Text style={{ color: colors.blue, fontWeight: '800', fontSize: 14 }}>Conversar</Text>
    </Pressable>
  );
}
