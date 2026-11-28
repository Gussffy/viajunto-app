import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Place } from '../../../types/place';
import { colors } from '../../../theme/colors';
import { styles } from '../style';

type LocationResultItemProps = {
  place: Place;
  recent?: boolean;
  onPress: () => void;
};

export function LocationResultItem({ place, recent, onPress }: LocationResultItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Selecionar ${place.title}, ${place.fullAddress}`}
      onPress={onPress}
      style={({ pressed }) => [styles.locationItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.locationItemIcon}>
        <Ionicons name={recent ? 'time-outline' : 'location-outline'} size={20} color={colors.primary} />
      </View>
      <View style={styles.locationItemText}>
        <Text numberOfLines={1} style={styles.locationItemTitle}>{place.title}</Text>
        <Text numberOfLines={1} style={styles.locationItemSubtitle}>{place.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.muted} />
    </Pressable>
  );
}
