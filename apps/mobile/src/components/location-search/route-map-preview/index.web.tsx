import React from 'react';
import { Text, View } from 'react-native';
import { RouteStops } from '../../journey-ui';
import type { RouteMapPreviewProps } from './index';
import { styles } from './style';

export function RouteMapPreview({ origin, destination }: RouteMapPreviewProps) {
  return (
    <View style={styles.preview}>
      <View style={styles.info}>
        <Text style={styles.label}>Prévia do trajeto</Text>
        <RouteStops origin={origin.title} destination={destination.title} />
      </View>
    </View>
  );
}
