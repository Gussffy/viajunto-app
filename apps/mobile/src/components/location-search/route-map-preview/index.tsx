import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Place } from '../../../types/place';
import { getRoute, type RouteResult } from '../../../services/route-service';
import { colors } from '../../../theme/colors';
import { useReduceMotion } from '../../motion';
import { PrimaryButton } from '../../primary-button';
import { styles } from './style';

export type RouteMapPreviewProps = { origin: Place; destination: Place };

export function RouteMapPreview({ origin, destination }: RouteMapPreviewProps) {
  const mapRef = useRef<MapView>(null);
  const [ready, setReady] = useState(false);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const reduced = useReduceMotion();

  const start = { latitude: origin.latitude, longitude: origin.longitude };
  const end = { latitude: destination.latitude, longitude: destination.longitude };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setRoute(null);
    setError(null);
    void getRoute(start, end).then((result) => {
      if (active) setRoute(result);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Não foi possível traçar a rota.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [start.latitude, start.longitude, end.latitude, end.longitude, attempt]);

  useEffect(() => {
    if (!ready) return;
    mapRef.current?.fitToCoordinates(route?.coordinates.length ? route.coordinates : [start, end], {
      edgePadding: { top: 35, right: 35, bottom: 35, left: 35 }, animated: !reduced,
    });
  }, [ready, route, start.latitude, start.longitude, end.latitude, end.longitude, reduced]);

  return (
    <View style={styles.preview}>
      <MapView ref={mapRef} style={styles.map} provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{ ...start, latitudeDelta: 0.28, longitudeDelta: 0.28 }} onMapReady={() => setReady(true)}>
        <Marker coordinate={start} title={origin.title} pinColor={colors.blue} />
        <Marker coordinate={end} title={destination.title} pinColor={colors.navy} />
        {route && <Polyline coordinates={route.coordinates} strokeColor={colors.blue} strokeWidth={4} />}
      </MapView>
      <View style={styles.info}>
        {loading ? <ActivityIndicator color={colors.blue} accessibilityLabel="Traçando rota" /> : error ? (
          <>
            <Text style={styles.label}>{error}</Text>
            <PrimaryButton label="Tentar novamente" onPress={() => setAttempt((value) => value + 1)} />
          </>
        ) : route && (
          <Text style={styles.label}>{route.distanceKm.toFixed(1).replace('.', ',')} km · {Math.round(route.durationMin)} min estimados</Text>
        )}
      </View>
    </View>
  );
}
