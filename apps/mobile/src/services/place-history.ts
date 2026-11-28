import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Place } from '../types/place';

const HISTORY_KEY = '@viajunto:place-history';
const SHORTCUTS_KEY = '@viajunto:place-shortcuts';

export async function getPlaceHistory(): Promise<Place[]> {
  const value = await AsyncStorage.getItem(HISTORY_KEY);
  return value ? JSON.parse(value) as Place[] : [];
}

export async function addPlaceToHistory(place: Place): Promise<void> {
  const history = await getPlaceHistory();
  const next = [place, ...history.filter((item) => item.id !== place.id)].slice(0, 8);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export async function getPlaceShortcuts(): Promise<Record<'home' | 'work', Place | null>> {
  const value = await AsyncStorage.getItem(SHORTCUTS_KEY);
  return value
    ? JSON.parse(value) as Record<'home' | 'work', Place | null>
    : { home: null, work: null };
}

export async function savePlaceShortcut(kind: 'home' | 'work', place: Place): Promise<void> {
  const shortcuts = await getPlaceShortcuts();
  await AsyncStorage.setItem(SHORTCUTS_KEY, JSON.stringify({ ...shortcuts, [kind]: place }));
}
