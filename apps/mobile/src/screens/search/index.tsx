import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockDestinations, mockPlaces, UNEX } from '../../../data/mock-places';
import { ChoiceRow, PageHeading, Stepper, ui } from '../../components/journey-ui';
import { PrimaryButton } from '../../components/primary-button';
import { SearchBar } from '../../components/search-bar';
import { DatePicker } from '../../components/date-picker';
import { TripDetail } from '../../components/trip-detail';
import { LocationSearchSheet } from '../../components/location-search';
import { Reveal, useReduceMotion } from '../../components/motion';
import { requestSeats, updateRequest as changeRequest } from '../../services/ride-api';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/styles';
import { dateLabel, SearchResults } from './search-results';
import { searchStyles as search } from './style';
import { useRideSearch, type RideSearchOptions } from './use-ride-search';

type SearchScreenProps = RideSearchOptions & { onShowTrips: () => void };

export function SearchScreen({ onShowTrips, ...options }: SearchScreenProps) {
  const { active, token } = options;
  const reducedMotion = useReduceMotion();
  const {
    filters, setFilters, submitted, clearResults, trips, loading, error, selected, setSelected, currentRequest,
    requestBusy, requestError, updateRequest, closeDetail, locationSheetVisible, setLocationSheetVisible,
    datePickerVisible, setDatePickerVisible, canSeeExclusiveTrips, findRides,
  } = useRideSearch(options);
  const findPlace = (value: string) => mockPlaces.find((place) => place.city === value || place.fullAddress === value);
  const showResults = submitted !== null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView key={showResults ? 'results' : 'form'} contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
        <Reveal changeKey={showResults ? 'results' : 'form'}>
          {submitted ? (
            <SearchResults submitted={submitted} trips={trips} loading={loading} error={error}
              onEdit={clearResults} onRetry={() => void findRides(submitted)} onSelect={setSelected} />
          ) : (
            <>
              <PageHeading title="Buscar carona" description="Escolha a partida, o destino e quando quer viajar." />
              <View style={search.card}>
                <SearchBar origin={filters.origin} destination={filters.destination}
                  onOriginChange={(origin) => setFilters((current) => ({ ...current, origin }))}
                  onDestinationChange={(destination) => setFilters((current) => ({ ...current, destination }))}
                  onSwap={() => setFilters((current) => ({ ...current, origin: current.destination, destination: current.origin }))} />
                <Pressable accessibilityRole="button" accessibilityLabel="Escolher locais sugeridos" onPress={() => setLocationSheetVisible(true)} style={({ pressed }) => [search.link, pressed && ui.pressed]}>
                  <Ionicons name="map-outline" size={18} color={colors.blue} />
                  <Text style={search.linkText}>Escolher locais sugeridos</Text>
                </Pressable>
                <View style={search.filters}>
                  <View style={search.filter}>
                    <ChoiceRow icon="calendar-outline" label="Data" value={dateLabel(filters.date)} onPress={() => setDatePickerVisible(true)} />
                  </View>
                  <View style={search.filter}>
                    <Stepper label="Passageiros" value={filters.passengers} maximum={8} onChange={(passengers) => setFilters({ ...filters, passengers })} />
                  </View>
                </View>
                {datePickerVisible && (
                  <DatePicker value={filters.date ?? new Date()} mode="date" minimumDate={new Date()}
                    onSelect={(date) => setFilters((current) => ({ ...current, date }))}
                    onClose={() => setDatePickerVisible(false)} />
                )}
                {filters.date && <Pressable accessibilityRole="button" onPress={() => setFilters({ ...filters, date: null })} style={search.link}><Text style={search.linkText}>Buscar em qualquer data</Text></Pressable>}
                {canSeeExclusiveTrips && (
                  <View style={styles.switchRow}>
                    <View style={ui.grow}><Text style={styles.switchTitle}>Somente caronas exclusivas</Text><Text style={styles.switchCaption}>Filtrar viagens para mulheres</Text></View>
                    <Switch accessibilityLabel="Mostrar apenas caronas exclusivas para mulheres" value={filters.womenOnly}
                      onValueChange={(womenOnly) => setFilters({ ...filters, womenOnly })} trackColor={{ true: colors.blue, false: colors.line }} />
                  </View>
                )}
                <PrimaryButton label="Buscar caronas" icon="search" loading={loading} onPress={() => void findRides(filters)} />
              </View>
              <Text style={search.section}>Rotas sugeridas</Text>
              <View style={search.suggestions}>
                {mockDestinations.map((place) => (
                  <Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`Buscar caronas de ${UNEX.city} para ${place.city}`}
                    disabled={loading} onPress={() => void findRides({ ...filters, origin: UNEX.city, destination: place.city })}
                    style={({ pressed }) => [search.suggestion, pressed && ui.pressed]}>
                    <Ionicons name="location-outline" size={16} color={colors.blue} />
                    <Text style={search.suggestionText}>{place.city}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </Reveal>
      </ScrollView>
      <Modal visible={active && selected !== null} animationType={reducedMotion ? 'none' : 'slide'} onRequestClose={closeDetail}>
        {selected && submitted && (
          <TripDetail trip={selected} onClose={closeDetail} requestStatus={currentRequest?.status}
            requestedSeats={submitted.passengers} requestBusy={requestBusy} requestError={requestError}
            onRequest={() => void updateRequest(() => requestSeats(token, selected.id, submitted.passengers))}
            onCancelRequest={currentRequest ? () => void updateRequest(() => changeRequest(token, currentRequest.id, 'cancel')) : undefined}
            onShowTrips={() => { closeDetail(); onShowTrips(); }}
          />
        )}
      </Modal>
      <LocationSearchSheet visible={active && locationSheetVisible} mode="passenger"
        initialOrigin={findPlace(filters.origin) ?? null} initialDestination={findPlace(filters.destination) ?? null}
        onClose={() => setLocationSheetVisible(false)}
        onConfirm={({ origin, destination }) => {
          setLocationSheetVisible(false);
          setFilters({ ...filters, origin: origin.city || origin.fullAddress, destination: destination.city || destination.fullAddress });
        }}
      />
    </KeyboardAvoidingView>
  );
}
