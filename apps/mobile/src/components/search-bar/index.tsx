import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { IconButton, ui } from '../journey-ui';
import { styles } from './style';

type SearchBarProps = {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSwap: () => void;
};

export function SearchBar({ origin, destination, onOriginChange, onDestinationChange, onSwap }: SearchBarProps) {
  return (
    <View style={styles.route}>
      <View style={ui.grow}>
        <RouteField label="Partida" value={origin} placeholder="Digite a cidade de partida" onChange={onOriginChange} />
        <View style={styles.divider} />
        <RouteField label="Destino" value={destination} placeholder="Digite a cidade de destino" onChange={onDestinationChange} destination />
      </View>
      <IconButton icon="swap-vertical" label="Inverter partida e destino" onPress={onSwap} />
    </View>
  );
}

function RouteField({ label, value, placeholder, onChange, destination }: {
  label: string; value: string; placeholder: string; onChange: (value: string) => void; destination?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={destination ? ui.destinationDot : ui.originDot} />
      <View style={ui.grow}>
        <Text style={styles.label}>{label}</Text>
        <TextInput accessibilityLabel={destination ? 'Cidade de destino' : 'Cidade de partida'} value={value} placeholder={placeholder}
          onChangeText={onChange} placeholderTextColor={colors.muted} style={styles.input} />
      </View>
    </View>
  );
}
