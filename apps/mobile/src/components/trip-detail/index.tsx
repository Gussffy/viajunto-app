import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockPlaces } from '../../../data/mock-places';
import type { Place } from '../../types/place';
import type { RideRequest, Trip } from '../../types';
import { colors } from '../../theme/colors';
import { normalizeText } from '../../utils/places';
import { ChatButton } from '../chat-button';
import { ChatPlaceholderScreen } from '../chat-placeholder';
import { IconButton, PageHeading, RouteStops, ui } from '../journey-ui';
import { RouteMapPreview } from '../location-search/route-map-preview';
import { Reveal } from '../motion';
import { PrimaryButton } from '../primary-button';
import { styles } from '../../theme/styles';
import { detailStyles as detail } from './style';

type TripDetailProps = {
  trip: Trip;
  onClose: () => void;
  onRequest?: () => void;
  onCancelRequest?: () => void;
  requestStatus?: RideRequest['status'];
  requestedSeats?: number;
  requestBusy?: boolean;
  requestError?: string | null;
  onRate?: (stars: number) => Promise<boolean>;
  onShowTrips?: () => void;
};

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function mapPlace(id: string, address: string, latitude?: number | null, longitude?: number | null): Place | null {
  const known = mockPlaces.find((place) => normalizeText(place.fullAddress) === normalizeText(address));
  if (latitude == null || longitude == null) return known ?? null;
  return { id, title: known?.title ?? address, subtitle: known?.subtitle ?? '', fullAddress: address, city: known?.city ?? '', latitude, longitude };
}

export function TripDetail({
  trip, onClose, onRequest, onCancelRequest, requestStatus, requestedSeats = 1, requestBusy, requestError, onRate, onShowTrips,
}: TripDetailProps) {
  const [chatVisible, setChatVisible] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingBusy, setRatingBusy] = useState(false);
  const date = new Date(trip.departureAt);
  const origin = mapPlace(`trip-origin-${trip.id}`, trip.origem, trip.origemLat, trip.origemLng);
  const destination = mapPlace(`trip-destination-${trip.id}`, trip.destino, trip.destinoLat, trip.destinoLng);
  const tripOpen = trip.status === 'open' || trip.status === 'full';
  const canRequest = Boolean(onRequest && !requestStatus && trip.status === 'open' && trip.seatsAvailable >= requestedSeats && date.getTime() > Date.now());
  const canCancel = Boolean(onCancelRequest && tripOpen && (requestStatus === 'pending' || requestStatus === 'accepted'));
  const status = trip.status === 'cancelled' ? 'Viagem cancelada'
    : trip.status === 'finished' ? 'Viagem concluída'
      : trip.status === 'in_progress' && requestStatus === 'accepted' ? 'Viagem em andamento'
        : requestStatus === 'pending' ? 'Aguardando resposta do motorista'
        : requestStatus === 'accepted' ? 'Vaga confirmada'
          : requestStatus === 'refused' ? 'Pedido recusado'
            : requestStatus === 'cancelled' ? 'Pedido cancelado'
              : !canRequest ? 'Carona indisponível para pedidos' : null;
  const driver = trip.driver?.nome ?? 'Motorista ViaJunto';
  const driverRating = trip.driver?.ratingAverage;

  if (chatVisible) {
    return <SafeAreaView style={detail.root}><ChatPlaceholderScreen tripId={trip.id} otherUserId={trip.driverId} onBack={() => setChatVisible(false)} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={detail.root}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <PageHeading title="Detalhes da carona" action={<IconButton icon="close" label="Fechar detalhes" onPress={onClose} />} />
        {status && <Reveal changeKey={status}>
          <View style={[detail.status, requestStatus === 'accepted' && tripOpen && detail.confirmed]}>
            <Ionicons name={requestStatus === 'accepted' && tripOpen ? 'checkmark-circle-outline' : 'information-circle-outline'} size={21} color={colors.blue} />
            <Text accessibilityLiveRegion="polite" style={[detail.statusText, ui.grow]}>{status}</Text>
          </View>
        </Reveal>}
        <View style={styles.formCard}>
          <View style={detail.top}>
            <View style={ui.grow}>
              <Text style={styles.detailLabel}>Partida</Text>
              <Text style={styles.detailValue}>{date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View>
              <Text style={detail.price}>{money.format(trip.ajudaCusto)}</Text>
              <Text style={styles.detailLabel}>Por pessoa</Text>
            </View>
          </View>
          <RouteStops origin={trip.origem} destination={trip.destino} />
          <Text style={detail.availability}>{trip.seatsAvailable} {trip.seatsAvailable === 1 ? 'vaga livre' : 'vagas livres'}</Text>
          {trip.apenasMulheres && <Text style={detail.exclusive}>Exclusiva para mulheres</Text>}
        </View>
        <View style={styles.formCard}>
          <View style={detail.driver}>
            <View style={detail.driverAvatar}><Text style={detail.driverInitial}>{driver.charAt(0).toUpperCase()}</Text></View>
            <View style={ui.grow}>
              <Text style={styles.detailLabel}>Motorista</Text>
              <Text style={styles.detailValue}>{driver}{driverRating != null ? ` · ★ ${driverRating.toFixed(1)} (${trip.driver?.ratingCount ?? 0})` : ''}</Text>
              {trip.vehicle && <Text style={styles.switchCaption}>{trip.vehicle.modelo} · {trip.vehicle.cor}{requestStatus === 'accepted' && trip.vehicle.placa ? ` · ${trip.vehicle.placa}` : ''}</Text>}
            </View>
          </View>
          {trip.notes && <Text style={detail.notes}>{trip.notes}</Text>}
        </View>
        {origin && destination && <RouteMapPreview origin={origin} destination={destination} />}
        {requestStatus === 'accepted' && trip.status !== 'cancelled' && (
          <View style={detail.chat}><ChatButton onPress={() => setChatVisible(true)} /></View>
        )}
        {trip.status === 'finished' && requestStatus === 'accepted' && onRate && (
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Avalie o motorista</Text>
            <View style={ui.horizontalWrap}>
              {[1, 2, 3, 4, 5].map((stars) => (
                <Pressable key={stars} accessibilityRole="button" accessibilityLabel={`Avaliar com ${stars} ${stars === 1 ? 'estrela' : 'estrelas'}`}
                  accessibilityState={{ selected: stars === rating }} disabled={ratingBusy || rating > 0}
                  style={detail.star} onPress={async () => {
                    setRatingBusy(true);
                    try {
                      if (await onRate(stars)) setRating(stars);
                    } finally {
                      setRatingBusy(false);
                    }
                  }}>
                  <Ionicons name={stars <= rating ? 'star' : 'star-outline'} size={25} color={colors.blue} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      {(canRequest || canCancel || (requestStatus && onShowTrips) || requestError) && (
        <View style={ui.footer}>
          <View style={[ui.container, detail.actions]}>
            {requestError && <Text accessibilityLiveRegion="polite" style={ui.error}>{requestError}</Text>}
            {canRequest && <PrimaryButton label={`${trip.manualApproval ? 'Solicitar' : 'Reservar'} ${requestedSeats} ${requestedSeats === 1 ? 'vaga' : 'vagas'}`}
              icon="arrow-forward" loading={requestBusy} onPress={() => onRequest?.()} />}
            {requestStatus && onShowTrips && <PrimaryButton label="Ver minhas viagens" icon="calendar-outline" onPress={onShowTrips} />}
            {canCancel && (
              <>
                {confirmCancel && <Text style={styles.detailLabel}>Deseja liberar as vagas deste pedido?</Text>}
                <Pressable accessibilityRole="button" disabled={requestBusy} onPress={() => {
                  if (confirmCancel) {
                    setConfirmCancel(false);
                    onCancelRequest?.();
                  } else setConfirmCancel(true);
                }} style={detail.cancel}><Text style={detail.cancelText}>{requestBusy ? 'Atualizando pedido…' : confirmCancel ? 'Confirmar cancelamento' : 'Cancelar pedido'}</Text></Pressable>
                {confirmCancel && <Pressable accessibilityRole="button" onPress={() => setConfirmCancel(false)} style={detail.cancel}><Text style={detail.statusText}>Manter pedido</Text></Pressable>}
              </>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
