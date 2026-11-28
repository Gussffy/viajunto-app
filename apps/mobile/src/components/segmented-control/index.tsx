import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './style';

type SegmentedControlProps<T extends string> = {
  options: readonly (readonly [T, string])[];
  selected: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function SegmentedControl<T extends string>({ options, selected, onChange, disabled }: SegmentedControlProps<T>) {
  return (
    <View style={styles.segment}>
      {options.map(([key, label]) => (
        <Pressable key={key} accessibilityRole="tab" accessibilityState={{ selected: selected === key }}
          disabled={disabled} onPress={() => onChange(key)} style={[styles.segmentItem, selected === key && styles.segmentActive]}>
          <Text style={[styles.segmentText, selected === key && styles.segmentTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
