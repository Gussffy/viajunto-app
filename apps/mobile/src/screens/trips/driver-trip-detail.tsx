import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatButton } from '../../components/chat-button';
import { ChatPlaceholderScreen } from '../../components/chat-placeholder';
import { IconButton, PageHeading, RouteStops, ui } from '../../components/journey-ui';
import { PrimaryButton } from '../../components/primary-button';
import { colors } from '../../theme/colors';
import type { Trip } from '../../types';
import { styles } from '../../theme/styles';
import { tripsStyles as journey } from './style';

type DriverTripDetailProps = {
  trip: Trip;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onAction: (action: 'start' | 'finish' | 'cancel') => Promise<boolean>;
  onRequestAction: (id: string, action: 'accept' | 'refuse') => Promise<boolean>;
  onRate: (subjectId: string, stars: number) => Promise<boolean>;
};

export function DriverTripDetail({ trip, busy, error, onClose, onAction, onRequestAction, onRate }: DriverTripDetailProps) {
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'cancel' | { refuse: string } | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const pending = trip.requests?.filter((request) => request.status === 'pending') ?? [];
  const accepted = trip.requests?.filter((request) => request.status === 'accepted') ?? [];
  const canStart = trip.status === 'open' || trip.status === 'full';

  if (chatUser) {
    return <SafeAreaView style={styles.screen}><ChatPlaceholderScreen tripId={trip.id} otherUserId={chatUser} onBack={() => setChatUser(null)} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <PageHeading title="Gerenciar carona" action={<IconButton icon="close" label="Fechar detalhes" onPress={onClose} />} />
        <View style={styles.formCard}>
          <RouteStops origin={trip.origem} destination={trip.destino} />
          <Text style={styles.switchCaption}>{new Date(trip.departureAt).toLocaleString('pt-BR')} · {trip.seatsAvailable}/{trip.seatsTotal} vagas livres</Text>
        </View>
        {error && <Text accessibilityLiveRegion="polite" style={ui.error}>{error}</Text>}
        {(pending.length > 0 || canStart) && (
          <Text style={journey.section}>Pedidos pendentes ({pending.length})</Text>
        )}
        {pending.map((request) => {
          const confirming = confirm !== null && typeof confirm === 'object' && confirm.refuse === request.id;
          return (
            <View key={request.id} style={styles.formCard}>
              <Text style={styles.detailValue}>{request.passenger?.nome ?? 'Passageiro'}</Text>
              <Text style={styles.switchCaption}>{request.seats} {request.seats === 1 ? 'vaga solicitada' : 'vagas solicitadas'}
                {request.passenger?.ratingAverage != null ? ` · ★ ${request.passenger.ratingAverage.toFixed(1)}` : ''}</Text>
              {confirming ? (
                <>
                  <Text style={ui.description}>O passageiro será avisado da recusa.</Text>
                  <PrimaryButton label="Confirmar recusa" loading={busy} onPress={async () => {
                    if (await onRequestAction(request.id, 'refuse')) setConfirm(null);
                  }} />
                  <Pressable accessibilityRole="button" onPress={() => setConfirm(null)} style={journey.link}><Text style={journey.linkText}>Manter pedido</Text></Pressable>
                </>
              ) : (
                <>
                  <PrimaryButton label="Aceitar pedido" disabled={busy} onPress={() => void onRequestAction(request.id, 'accept')} />
                  <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirm({ refuse: request.id })} style={journey.link}><Text style={journey.linkDanger}>Recusar pedido</Text></Pressable>
                </>
              )}
            </View>
          );
        })}
        <Text style={journey.section}>Passageiros confirmados ({accepted.length})</Text>
        {accepted.map((request) => {
          const rating = ratings[request.id] ?? 0;
          return (
            <View key={request.id} style={styles.formCard}>
              <Text style={styles.detailValue}>{request.passenger?.nome ?? 'Passageiro'}</Text>
              <Text style={styles.switchCaption}>{request.seats} {request.seats === 1 ? 'vaga reservada' : 'vagas reservadas'}</Text>
              <View style={journey.action}><ChatButton onPress={() => setChatUser(request.passengerId)} /></View>
              {trip.status === 'finished' && (
                <View style={journey.action}>
                  <Text style={styles.detailValue}>Avaliar passageiro</Text>
                  <View style={ui.horizontalWrap}>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <Pressable key={stars} accessibilityRole="button" accessibilityLabel={`Avaliar com ${stars} estrelas`}
                        accessibilityState={{ selected: rating === stars }} disabled={busy || rating > 0}
                        onPress={async () => {
                          if (await onRate(request.passengerId, stars)) setRatings((current) => ({ ...current, [request.id]: stars }));
                        }} style={journey.star}>
                        <Ionicons name={stars <= rating ? 'star' : 'star-outline'} size={24} color={colors.blue} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      {(canStart || trip.status === 'in_progress') && (
        <View style={ui.footer}>
          <View style={ui.container}>
            {confirm === 'cancel' ? (
              <>
                <Text style={ui.description}>Os pedidos ativos serão cancelados e os passageiros serão avisados.</Text>
                <PrimaryButton label="Confirmar cancelamento" loading={busy} onPress={async () => { if (await onAction('cancel')) setConfirm(null); }} />
                <Pressable accessibilityRole="button" onPress={() => setConfirm(null)} style={journey.link}><Text style={journey.linkText}>Manter viagem</Text></Pressable>
              </>
            ) : (
              <>
                <PrimaryButton label={canStart ? 'Iniciar viagem' : 'Finalizar viagem'} loading={busy} onPress={() => void onAction(canStart ? 'start' : 'finish')} />
                {canStart && <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirm('cancel')} style={journey.link}><Text style={journey.linkDanger}>Cancelar viagem</Text></Pressable>}
              </>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
