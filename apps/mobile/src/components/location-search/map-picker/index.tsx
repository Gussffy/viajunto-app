import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { UNEX, mockPlaces } from '../../../../data/mock-places';
import type { Place } from '../../../types/place';
import { colors } from '../../../theme/colors';
import { nearestMockPlace } from '../../../utils/places';
import { IconButton, PageHeading, ui } from '../../journey-ui';
import { useReduceMotion } from '../../motion';
import { PrimaryButton } from '../../primary-button';
import { mapStyles as map } from './style';

type MapPickerProps = {
  field: 'origin' | 'destination';
  initialPlace?: Place | null;
  onBack: () => void;
  onConfirm: (place: Place) => void;
};

function placeAt(latitude: number, longitude: number): Place {
  const nearest = nearestMockPlace({ latitude, longitude }, mockPlaces);
  if (nearest.place && nearest.distanceKm <= 2) return nearest.place;

  const coordinates = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  return {
    id: `map-${coordinates}`, title: 'Local selecionado no mapa', subtitle: coordinates,
    fullAddress: `Coordenadas ${coordinates}`, city: '', latitude, longitude,
  };
}

export function MapPickerScreen({ field, initialPlace, onBack, onConfirm }: MapPickerProps) {
  const mapRef = useRef<MapView>(null);
  const start = initialPlace ?? UNEX;
  const [selected, setSelected] = useState(start);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReduceMotion();
  const pointLabel = field === 'origin' ? 'partida' : 'destino';
  const initialRegion = useRef<Region>({ latitude: start.latitude, longitude: start.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });

  const goToUserLocation = async () => {
    setError(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError('Permita o acesso à localização para centralizar o mapa.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;
      mapRef.current?.animateToRegion({ ...initialRegion.current, latitude, longitude }, reduced ? 0 : 350);
      setSelected(placeAt(latitude, longitude));
    } catch {
      setError('Não foi possível obter sua localização.');
    }
  };

  return (
    <View style={map.root}>
      <View style={[ui.container, map.header]}>
        <PageHeading title={`Escolher ${pointLabel}`} action={<IconButton icon="arrow-back" label="Voltar para a busca de locais" onPress={onBack} />} />
      </View>
      <View style={map.stage}>
        <MapView ref={mapRef} style={map.root} initialRegion={initialRegion.current}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          onRegionChange={() => setMoving(true)}
          onRegionChangeComplete={({ latitude, longitude }) => {
            setSelected(placeAt(latitude, longitude));
            setMoving(false);
          }} />
        <View pointerEvents="none" style={map.pin}><Ionicons name="location" size={44} color={colors.blue} /></View>
        <View style={map.locate}><IconButton icon="navigate-outline" label="Usar minha localização" onPress={() => void goToUserLocation()} /></View>
      </View>
      <View style={ui.footer}>
        <View style={ui.container}>
          <Text style={ui.description}>Arraste o mapa para escolher o ponto.</Text>
          <Text style={map.address}>{selected.fullAddress}</Text>
          {error && <Text accessibilityLiveRegion="polite" style={ui.error}>{error}</Text>}
          <PrimaryButton label={`Confirmar ${pointLabel}`} disabled={moving} onPress={() => onConfirm(selected)} />
        </View>
      </View>
    </View>
  );
}
