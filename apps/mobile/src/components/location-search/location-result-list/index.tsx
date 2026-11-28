import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Place } from '../../../types/place';
import { colors } from '../../../theme/colors';
import { EmptyState, ui } from '../../journey-ui';
import { LocationResultItem } from '../location-result-item';
import { styles } from '../style';

type LocationResultListProps = {
  places: Place[];
  recentIds: string[];
  onSelect: (place: Place) => void;
  onDefineOnMap?: () => void;
};

export function LocationResultList({ places, recentIds, onSelect, onDefineOnMap }: LocationResultListProps) {
  return (
    <View>
      {places.length === 0 && <EmptyState icon="search-outline" title="Nenhum local encontrado" description="Tente buscar pela cidade ou pelo nome do local." />}
      {places.map((place) => (
        <LocationResultItem key={place.id} place={place} recent={recentIds.includes(place.id)} onPress={() => onSelect(place)} />
      ))}
      {onDefineOnMap && (
        <Pressable accessibilityRole="button" onPress={onDefineOnMap} style={({ pressed }) => [styles.locationItem, pressed && ui.pressed]}>
          <View style={styles.locationItemIcon}><Ionicons name="map-outline" size={20} color={colors.blue} /></View>
          <View style={ui.grow}>
            <Text style={styles.locationItemTitle}>Definir no mapa</Text>
            <Text style={styles.locationItemSubtitle}>Arraste o mapa para escolher o ponto</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.blue} />
        </Pressable>
      )}
    </View>
  );
}
