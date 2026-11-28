import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Trip } from '../../types';
import { colors } from '../../theme/colors';
import { RouteStops, ui } from '../journey-ui';
import { card } from './style';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function TripCard({ trip, onPress, status, seats = trip.seatsAvailable, meta }: {
  trip: Trip; onPress: () => void; status?: string; seats?: number; meta?: string;
}) {
  const departure = new Date(trip.departureAt);
  const date = departure.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const time = departure.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [card.root, pressed && ui.pressed]}>
      <View style={card.top}>
        <View style={[ui.horizontalWrap, ui.grow]}>
          <Ionicons aria-hidden name="calendar-outline" size={17} color={colors.blue} />
          <Text style={card.date}>{date} · {time}</Text>
        </View>
        <Text style={card.price}>{money.format(trip.ajudaCusto)}</Text>
      </View>
      <RouteStops origin={trip.origem} destination={trip.destino} />
      <View style={card.footer}>
        <View style={[ui.horizontalWrap, ui.grow]}>
          {status && <Text style={card.pill}>{status}</Text>}
          <Text style={card.meta}>{seats} {seats === 1 ? 'vaga' : 'vagas'}</Text>
          {trip.apenasMulheres && <Text style={card.pill}>Só para mulheres</Text>}
          {meta && <Text style={card.meta}>{meta}</Text>}
        </View>
        <Ionicons aria-hidden name="chevron-forward" size={18} color={colors.blue} />
      </View>
    </Pressable>
  );
}
