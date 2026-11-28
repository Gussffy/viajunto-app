import React from 'react';
import { TextInput, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { styles } from './style';

type RouteInputCardProps = {
  origin: string;
  destination: string;
  activeField: 'origin' | 'destination';
  onActiveFieldChange: (field: 'origin' | 'destination') => void;
  onOriginChange: (text: string) => void;
  onDestinationChange: (text: string) => void;
};

export function RouteInputCard({ origin, destination, activeField, onActiveFieldChange, onOriginChange, onDestinationChange }: RouteInputCardProps) {
  return (
    <View style={styles.routeInputCard}>
      <View style={styles.routeInputCardRow}>
        <View style={styles.routeInputRail}><View style={styles.routeOriginDot} /></View>
        <TextInput value={origin} onChangeText={onOriginChange} onFocus={() => onActiveFieldChange('origin')}
          style={[styles.routeInputText, activeField === 'origin' && styles.routeInputActive]}
          placeholder="Digite o local de partida" placeholderTextColor={colors.muted} accessibilityLabel="Local de partida" />
      </View>
      <View style={styles.routeInputCardRow}>
        <View style={styles.routeInputRail}><View style={styles.routeDestinationSquare} /></View>
        <TextInput value={destination} onChangeText={onDestinationChange} onFocus={() => onActiveFieldChange('destination')}
          style={[styles.routeInputText, activeField === 'destination' && styles.routeInputActive]}
          placeholder="Digite o destino" placeholderTextColor={colors.muted} accessibilityLabel="Local de destino" />
      </View>
    </View>
  );
}
