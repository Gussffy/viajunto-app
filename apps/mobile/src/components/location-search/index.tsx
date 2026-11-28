import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UNEX, mockDestinations, mockPlaces } from '../../../data/mock-places';
import type { Place } from '../../types/place';
import { addPlaceToHistory, getPlaceHistory, getPlaceShortcuts, savePlaceShortcut } from '../../services/place-history';
import { filterPlaces } from '../../utils/places';
import { IconButton, PageHeading, ui } from '../journey-ui';
import { useReduceMotion } from '../motion';
import { PrimaryButton } from '../primary-button';
import { LocationResultList } from './location-result-list';
import { MapPickerScreen } from './map-picker';
import { QuickShortcuts } from './quick-shortcuts';
import { RouteInputCard } from './route-input-card';
import { styles as theme } from '../../theme/styles';
import { styles } from './style';

export type LocationSelection = { origin: Place; destination: Place };
type Field = keyof LocationSelection;
type Shortcut = 'home' | 'work';

type LocationSearchSheetProps = {
  visible: boolean;
  mode: 'driver' | 'passenger';
  initialOrigin?: Place | null;
  initialDestination?: Place | null;
  onClose: () => void;
  onConfirm: (selection: LocationSelection) => void;
};

export function LocationSearchSheet({
  visible, mode, initialOrigin = UNEX, initialDestination = null, onClose, onConfirm,
}: LocationSearchSheetProps) {
  const [origin, setOrigin] = useState<Place | null>(initialOrigin);
  const [destination, setDestination] = useState<Place | null>(initialDestination);
  const [activeField, setActiveField] = useState<Field>('destination');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<Place[]>([]);
  const [shortcuts, setShortcuts] = useState<Record<Shortcut, Place | null>>({ home: null, work: null });
  const [shortcutTarget, setShortcutTarget] = useState<Shortcut | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const reducedMotion = useReduceMotion();

  useEffect(() => {
    if (!visible) return;
    let active = true;
    setOrigin(initialOrigin);
    setDestination(initialDestination);
    setActiveField(initialOrigin ? 'destination' : 'origin');
    setQuery('');
    setMapOpen(false);
    setShortcutTarget(null);
    void getPlaceHistory().then((value) => { if (active) setHistory(value); }).catch(() => undefined);
    void getPlaceShortcuts().then((value) => { if (active) setShortcuts(value); }).catch(() => undefined);
    return () => { active = false; };
  }, [visible, initialOrigin, initialDestination]);

  const selectPlace = (place: Place) => {
    if (activeField === 'origin') {
      setOrigin(place);
      setActiveField('destination');
    } else {
      setDestination(place);
    }
    if (shortcutTarget) {
      void savePlaceShortcut(shortcutTarget, place).then(() => {
        setShortcuts((current) => ({ ...current, [shortcutTarget]: place }));
      }).catch(() => undefined);
      setShortcutTarget(null);
    }
    setQuery('');
    setMapOpen(false);
    Keyboard.dismiss();
    void addPlaceToHistory(place).then(getPlaceHistory).then(setHistory).catch(() => undefined);
  };

  const focusField = (field: Field) => {
    if (field !== activeField) setQuery('');
    setActiveField(field);
  };

  const updateQuery = (field: Field, value: string) => {
    setActiveField(field);
    if (field === 'origin') setOrigin(null);
    else setDestination(null);
    setQuery(value);
  };

  const other = activeField === 'origin' ? destination : origin;
  const suggested = activeField === 'origin' ? mockPlaces : [...mockDestinations, UNEX];
  const unique = new Map([...history, ...suggested].map((place) => [place.id, place]));
  const results = filterPlaces([...unique.values()].filter((place) => place.id !== other?.id), query);
  const sameLocation = origin && destination
    && (origin.id === destination.id || (origin.latitude === destination.latitude && origin.longitude === destination.longitude));

  return (
    <Modal visible={visible} animationType={reducedMotion ? 'none' : 'slide'} presentationStyle="fullScreen"
      onRequestClose={mapOpen ? () => setMapOpen(false) : onClose}>
      <SafeAreaView style={styles.searchSheetRoot}>
        {mapOpen ? (
          <MapPickerScreen field={activeField} initialPlace={activeField === 'origin' ? origin : destination}
            onBack={() => setMapOpen(false)} onConfirm={selectPlace} />
        ) : (
          <KeyboardAvoidingView style={styles.searchSheetRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={theme.pageContent} keyboardShouldPersistTaps="handled">
              <PageHeading title="Partida e destino" description={activeField === 'origin' ? 'Escolha o ponto de partida.' : 'Escolha o destino da viagem.'}
                action={<IconButton icon="close" label="Fechar seleção de locais" onPress={onClose} />} />
              <RouteInputCard
                origin={origin?.title ?? (activeField === 'origin' ? query : '')}
                destination={destination?.title ?? (activeField === 'destination' ? query : '')}
                activeField={activeField} onActiveFieldChange={focusField}
                onOriginChange={(value) => updateQuery('origin', value)}
                onDestinationChange={(value) => updateQuery('destination', value)}
              />
              <QuickShortcuts home={shortcuts.home} work={shortcuts.work} onSelect={selectPlace}
                onAddHome={() => setShortcutTarget('home')} onAddWork={() => setShortcutTarget('work')} />
              {shortcutTarget && <Text style={ui.description}>Escolha um local para salvar como {shortcutTarget === 'home' ? 'Casa' : 'Trabalho'}.</Text>}
              <Text style={[theme.sectionTitle, { marginTop: 16 }]}>{query.trim() ? 'Resultados' : 'Locais sugeridos'}</Text>
              <LocationResultList places={results} recentIds={history.map((place) => place.id)}
                onSelect={selectPlace} onDefineOnMap={Platform.OS === 'web' ? undefined : () => { Keyboard.dismiss(); setMapOpen(true); }} />
              {sameLocation && <Text style={ui.error}>Escolha pontos diferentes para partida e destino.</Text>}
            </ScrollView>
            <View style={ui.footer}>
              <View style={ui.container}>
                <PrimaryButton label={mode === 'driver' ? 'Confirmar rota' : 'Usar estes locais'} disabled={!origin || !destination || Boolean(sameLocation)}
                  onPress={() => { if (origin && destination && !sameLocation) onConfirm({ origin, destination }); }} />
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </Modal>
  );
}
