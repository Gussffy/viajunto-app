import React, { useRef } from 'react';
import { View } from 'react-native';
import { colors } from '../../theme/colors';
import { PrimaryButton } from '../primary-button';
import type { DatePickerProps } from './index';

function formatLocalDate(value: Date) {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

export function DatePicker({ value, mode, minimumDate, onSelect, onClose }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValue = mode === 'date'
    ? formatLocalDate(value)
    : `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;

  const confirm = () => {
    const input = inputRef.current;
    if (!input?.reportValidity()) return;
    const next = new Date(value);
    if (mode === 'date') {
      const [year, month, day] = input.value.split('-').map(Number);
      if (year === undefined || month === undefined || day === undefined) return;
      next.setFullYear(year, month - 1, day);
    } else {
      const [hour, minute] = input.value.split(':').map(Number);
      if (hour === undefined || minute === undefined) return;
      next.setHours(hour, minute, 0, 0);
    }
    onSelect(next);
    onClose();
  };

  return (
    <View>
      <input key={mode} ref={inputRef} type={mode} aria-label={mode === 'date' ? 'Data da partida' : 'Horário da partida'}
        defaultValue={initialValue} required min={mode === 'date' && minimumDate ? formatLocalDate(minimumDate) : undefined}
        style={{ minHeight: 44, padding: '0 12px', borderRadius: 12, border: `1px solid ${colors.line}`, color: colors.text, font: 'inherit' }} />
      <PrimaryButton label="Concluir seleção" onPress={confirm} />
    </View>
  );
}
