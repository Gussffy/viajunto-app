import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { EmptyState, IconButton, PageHeading } from '../../components/journey-ui';
import { PrimaryButton } from '../../components/primary-button';
import { TripCard } from '../../components/trip-card';
import type { TripSearch } from '../../services/ride-api';
import { colors } from '../../theme/colors';
import type { Trip } from '../../types';
import { searchStyles as search } from './style';

type SearchResultsProps = {
  submitted: TripSearch;
  trips: Trip[];
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onRetry: () => void;
  onSelect: (trip: Trip) => void;
};

export const dateLabel = (date: Date | null) => date?.toLocaleDateString('pt-BR') ?? 'Qualquer data';

export function SearchResults({ submitted, trips, loading, error, onEdit, onRetry, onSelect }: SearchResultsProps) {
  return (
    <>
      <PageHeading title="Caronas disponíveis" action={<IconButton icon="options-outline" label="Editar busca" onPress={onEdit} />} />
      <View style={search.summary}>
        <Text style={search.summaryRoute}>{[submitted.origin.trim(), submitted.destination.trim()].filter(Boolean).join(' → ') || 'Todas as cidades'}</Text>
        <Text style={search.summaryMeta}>{dateLabel(submitted.date)} · {submitted.passengers} {submitted.passengers === 1 ? 'passageiro' : 'passageiros'}{submitted.womenOnly ? ' · Só para mulheres' : ''}</Text>
      </View>
      {loading ? (
        <View style={search.loading} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.blue} /><Text style={search.summaryMeta}>Buscando caronas…</Text>
        </View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Busca indisponível" description={error}
          action={<PrimaryButton label="Tentar novamente" onPress={onRetry} />} />
      ) : trips.length === 0 ? (
        <EmptyState icon="search-outline" title="Nenhuma carona encontrada"
          description="Experimente outra data, outro destino ou menos filtros."
          action={<PrimaryButton label="Editar busca" onPress={onEdit} />} />
      ) : (
        <>
          <Text accessibilityLiveRegion="polite" style={search.count}>{trips.length} {trips.length === 1 ? 'carona encontrada' : 'caronas encontradas'}</Text>
          {trips.map((trip) => <TripCard key={trip.id} trip={trip} onPress={() => onSelect(trip)} />)}
        </>
      )}
    </>
  );
}
