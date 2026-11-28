import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text } from 'react-native';
import type { Place } from '../../../types/place';
import { colors } from '../../../theme/colors';
import { ui } from '../../journey-ui';
import { style } from './style';

type QuickShortcutsProps = {
  home: Place | null;
  work: Place | null;
  onSelect: (place: Place) => void;
  onAddHome: () => void;
  onAddWork: () => void;
};

export function QuickShortcuts({ home, work, onSelect, onAddHome, onAddWork }: QuickShortcutsProps) {
  const items = [
    { title: home ? 'Casa' : 'Adicionar casa', icon: 'home-outline' as const, action: () => home ? onSelect(home) : onAddHome() },
    { title: work ? 'Trabalho' : 'Adicionar trabalho', icon: 'briefcase-outline' as const, action: () => work ? onSelect(work) : onAddWork() },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={style.row}>
      {items.map((item) => (
        <Pressable key={item.icon} accessibilityRole="button" accessibilityLabel={item.title} onPress={item.action} style={({ pressed }) => [style.chip, pressed && ui.pressed]}>
          <Ionicons name={item.icon} size={17} color={colors.blue} /><Text style={style.label}>{item.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
