import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, View } from 'react-native';
import { PrimaryButton } from '../primary-button';

export type DatePickerProps = {
  value: Date;
  mode: 'date' | 'time';
  minimumDate?: Date;
  onSelect: (value: Date) => void;
  onClose: () => void;
};

export function DatePicker({ value, mode, minimumDate, onSelect, onClose }: DatePickerProps) {
  return (
    <View>
      <DateTimePicker value={value} mode={mode} minimumDate={minimumDate} onChange={(event, next) => {
        if (event.type === 'set' && next) onSelect(next);
        if (Platform.OS !== 'ios' || event.type === 'dismissed') onClose();
      }} />
      {Platform.OS === 'ios' && <PrimaryButton label="Concluir seleção" onPress={onClose} />}
    </View>
  );
}
