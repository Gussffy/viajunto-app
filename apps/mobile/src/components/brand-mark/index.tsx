import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './style';

export function BrandMark() {
  return (
    <>
      <View style={styles.topLogo}><Ionicons name="car-sport" size={21} color={colors.white} /></View>
      <Text style={styles.topBrand}>ViaJunto</Text>
    </>
  );
}
