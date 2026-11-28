import React from 'react';
import { ActivityIndicator, Modal, RefreshControl, ScrollView, View } from 'react-native';
import { EmptyState, IconButton, PageHeading } from '../../components/journey-ui';
import { useReduceMotion } from '../../components/motion';
import { PrimaryButton } from '../../components/primary-button';
import { SegmentedControl } from '../../components/segmented-control';
import { TripCard } from '../../components/trip-card';
import { TripDetail } from '../../components/trip-detail';
import { rateParticipant, updateRequest, updateTrip } from '../../services/ride-api';
import type { RideRequest, Trip, User } from '../../types';
import { colors } from '../../theme/colors';
import { DriverTripDetail } from './driver-trip-detail';
import { styles } from '../../theme/styles';
import { NotificationsPanel } from './notifications-panel';
import { useTripActivity } from './use-trip-activity';

type MyTripsScreenProps = { token: string; user: User; onFindRide: () => void; onActivityChanged: () => void };
const filters = [['upcoming', 'Próximas'], ['finished', 'Concluídas'], ['cancelled', 'Canceladas']] as const;

const requestStatus: Record<RideRequest['status'], string> = {
  pending: 'Aguardando resposta', accepted: 'Vaga confirmada', refused: 'Pedido recusado', cancelled: 'Pedido cancelado',
};

const tripStatus: Record<Trip['status'], string> = {
  open: 'Aberta', full: 'Lotada', in_progress: 'Em andamento', finished: 'Concluída', cancelled: 'Cancelada',
};

export function MyTripsScreen({ token, user, onFindRide, onActivityChanged }: MyTripsScreenProps) {
  const reduced = useReduceMotion();
  const {
    driver, filter, setFilter, visibleTrips, requests, notifications, notificationLoading, notificationError,
    selectedRequest, selectedTrip, panel, loading, refreshing, error, actionBusy, actionError,
    refresh, loadNotifications, update, showDetails, closePanel,
  } = useTripActivity(token, user, onActivityChanged);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh('manual')} colors={[colors.blue]} tintColor={colors.blue} />}>
        <PageHeading title="Minhas viagens" description={driver ? 'Gerencie suas caronas e os pedidos de vaga.' : 'Acompanhe seus pedidos e viagens.'}
          action={<IconButton icon="notifications-outline" label="Ver notificações" onPress={() => void loadNotifications()} />} />
        {driver && (
          <SegmentedControl options={filters} selected={filter} onChange={setFilter} />
        )}
        {loading ? <ActivityIndicator color={colors.blue} accessibilityLabel="Carregando viagens" />
          : error ? (
            <EmptyState icon="cloud-offline-outline" title="Viagens indisponíveis" description={error}
              action={<PrimaryButton label="Tentar novamente" loading={refreshing} onPress={() => void refresh('manual')} />} />
          ) : driver ? (
            <>
              {visibleTrips.map((trip) => {
                const pending = trip.requests?.filter((request) => request.status === 'pending').length ?? 0;
                return <TripCard key={trip.id} trip={trip} status={tripStatus[trip.status]}
                  meta={pending > 0 ? `${pending} ${pending === 1 ? 'pedido pendente' : 'pedidos pendentes'}` : undefined}
                  onPress={() => showDetails(trip.id)} />;
              })}
              {visibleTrips.length === 0 && <EmptyState icon="calendar-outline" title="Nenhuma viagem nesta categoria"
                action={filter === 'upcoming' ? <PrimaryButton label="Publicar carona" onPress={onFindRide} /> : undefined} />}
            </>
          ) : (
            <>
              {requests.map((request) => request.trip && (
                <TripCard key={request.id} trip={request.trip} seats={request.seats}
                  status={['finished', 'cancelled', 'in_progress'].includes(request.trip.status) && request.status === 'accepted'
                    ? tripStatus[request.trip.status] : requestStatus[request.status]}
                  onPress={() => showDetails(request.id)} />
              ))}
              {requests.length === 0 && <EmptyState icon="calendar-outline" title="Você ainda não solicitou caronas"
                action={<PrimaryButton label="Buscar caronas" icon="search" onPress={onFindRide} />} />}
            </>
          )}
      </ScrollView>
      <Modal visible={panel !== 'trips'} animationType={reduced ? 'none' : 'slide'} onRequestClose={closePanel}>
        {panel === 'notifications' ? (
          <NotificationsPanel notices={notifications} loading={notificationLoading} error={notificationError}
            onRetry={() => void loadNotifications()} onClose={closePanel} />
        ) : selectedTrip && (
          driver ? <DriverTripDetail trip={selectedTrip} onClose={closePanel} busy={actionBusy} error={actionError}
            onAction={(action) => update(() => updateTrip(token, selectedTrip.id, action))}
            onRequestAction={(id, action) => update(() => updateRequest(token, id, action))}
            onRate={(subjectId, stars) => update(() => rateParticipant(token, selectedTrip.id, subjectId, stars))} />
            : <TripDetail trip={selectedTrip} requestStatus={selectedRequest?.status} onClose={closePanel} requestBusy={actionBusy} requestError={actionError}
              onCancelRequest={selectedRequest ? () => void update(() => updateRequest(token, selectedRequest.id, 'cancel')) : undefined}
              onRate={(stars) => update(() => rateParticipant(token, selectedTrip.id, selectedTrip.driverId, stars))} />
        )}
      </Modal>
    </View>
  );
}
