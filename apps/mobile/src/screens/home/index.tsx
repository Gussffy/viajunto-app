import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { mockDestinations } from '../../../data/mock-places';
import { ChoiceRow, RoadBanner, ui } from '../../components/journey-ui';
import { PrimaryButton } from '../../components/primary-button';
import { colors } from '../../theme/colors';
import type { User, Vehicle } from '../../types';
import { styles } from '../../theme/styles';
import { homeStyles as home } from './style';

type HomeScreenProps = {
  user: User;
  vehicle: Vehicle | null;
  loadingVehicle: boolean;
  vehicleError: string | null;
  activityCount: number;
  onSearch: (destination?: string) => void;
  onPublish: () => void;
  onShowTrips: () => void;
  onOpenVehicle: () => void;
};

export function HomeScreen({
  user, vehicle, loadingVehicle, vehicleError, activityCount, onSearch, onPublish, onShowTrips, onOpenVehicle,
}: HomeScreenProps) {
  const driver = user.role === 'motorista';
  const needsVehicle = driver && !vehicle && !vehicleError;
  const showVehicleAction = needsVehicle && !loadingVehicle;
  const mainAction = driver
    ? showVehicleAction
      ? { label: 'Cadastrar veículo', icon: 'car-outline', onPress: onOpenVehicle } as const
      : { label: 'Publicar carona', icon: 'add-circle-outline', onPress: onPublish } as const
    : { label: 'Buscar caronas', icon: 'search', onPress: () => onSearch() } as const;
  const firstName = user.nome.trim().split(/\s+/)[0];
  const tripSummary = activityCount > 0
    ? driver
      ? activityCount === 1 ? '1 pedido aguardando sua resposta' : `${activityCount} pedidos aguardando sua resposta`
      : activityCount === 1 ? '1 atualização de viagem' : `${activityCount} atualizações de viagens`
    : driver ? 'Acompanhe suas caronas e pedidos de vaga' : 'Acompanhe suas solicitações e reservas';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pageContent}>
      <View style={home.content}>
        <Text style={home.greeting}>{firstName ? `Olá, ${firstName}!` : 'Olá!'}</Text>
        <RoadBanner
          title={driver ? 'Vai pegar a estrada?' : 'Para onde vamos?'}
          description={driver ? 'Ofereça os lugares livres do seu carro e divida o custo da viagem.' : 'Encontre uma carona entre cidades e divida o custo da viagem.'}
        />
        <View style={home.action}>
          <PrimaryButton {...mainAction} loading={driver && loadingVehicle} />
        </View>
        <View style={home.section}>
          <Text accessibilityRole="header" style={home.sectionTitle}>{driver ? 'Gerencie suas caronas' : 'Acompanhe suas viagens'}</Text>
          <ChoiceRow icon="calendar-outline" label="Minhas viagens" value={tripSummary} onPress={onShowTrips} />
          {driver && vehicle && (
            <ChoiceRow icon="car-outline" label="Meu veículo" value={`${vehicle.modelo} · ${vehicle.placa}`} onPress={onOpenVehicle} />
          )}
          {showVehicleAction && (
            <Text style={ui.description}>Cadastre seu carro e a quantidade de vagas para publicar sua primeira carona.</Text>
          )}
        </View>
        {!driver && (
          <View style={home.section}>
            <Text accessibilityRole="header" style={home.sectionTitle}>Destinos sugeridos</Text>
            <View style={home.destinations}>
              {mockDestinations.map((place) => (
                <Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`Buscar caronas para ${place.city}`}
                  onPress={() => onSearch(place.city)} style={({ pressed }) => [home.destination, pressed && ui.pressed]}>
                  <Ionicons aria-hidden name="location-outline" size={18} color={colors.blue} />
                  <Text style={home.city}>{place.city}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
