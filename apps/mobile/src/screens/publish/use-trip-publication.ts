import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Animated, BackHandler, Keyboard, ScrollView } from 'react-native';
import { UNEX } from '../../../data/mock-places';
import type { Place } from '../../types/place';
import { useReduceMotion } from '../../components/motion';
import { publishTrip } from '../../services/ride-api';
import type { User, Vehicle } from '../../types';

export type PublishScreenProps = {
  token: string;
  user: User;
  vehicle: Vehicle | null;
  active: boolean;
  loadingVehicle: boolean;
  vehicleError: string | null;
  onRetryVehicle: () => void;
  onRegisterVehicle: () => void;
  onPublished: () => void;
};


export const steps = ['Trajeto', 'Data, vagas e valor', 'Revisão'];

function defaultDeparture() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  return tomorrow;
}

export function useTripPublication({ token, user, vehicle, active, onPublished }: Pick<PublishScreenProps, 'token' | 'user' | 'vehicle' | 'active' | 'onPublished'>) {
  const [origin, setOrigin] = useState<Place>(UNEX);
  const [destination, setDestination] = useState<Place | null>(null);
  const [departureAt, setDepartureAt] = useState(defaultDeparture);
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState('');
  const [exclusiveTrip, setExclusiveTrip] = useState(false);
  const canOfferExclusiveTrip = user.role === 'motorista' && user.genero === 'F';
  const womenOnly = canOfferExclusiveTrip && exclusiveTrip;
  const [manualApproval, setManualApproval] = useState(true);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(0);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const progress = useRef(new Animated.Value(1 / steps.length)).current;
  const reduced = useReduceMotion();

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
    const fraction = (step + 1) / steps.length;
    if (reduced) {
      progress.setValue(fraction);
      return;
    }
    const transition = Animated.timing(progress, { toValue: fraction, duration: 240, useNativeDriver: false });
    transition.start();
    return () => transition.stop();
  }, [step, progress, reduced]);

  useEffect(() => {
    if (!active || step === 0 || loading) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setPicker(null);
      setError(null);
      setStep((current) => current - 1);
      return true;
    });
    return () => subscription.remove();
  }, [active, loading, step]);

  const maximumSeats = Math.max(1, vehicle?.lugares ?? 1);
  const offeredSeats = Math.min(seats, maximumSeats);
  const amount = Number(price.trim().replace(',', '.'));
  const dateText = departureAt.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' });
  const timeText = departureAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const validateDetails = () => {
    if (departureAt.getTime() <= Date.now()) return 'Escolha uma data e um horário de partida futuros.';
    if (!/^\d+(?:[,.]\d{1,2})?$/.test(price.trim()) || !Number.isFinite(amount) || amount <= 0 || amount > 100000) {
      return 'Informe uma ajuda de custo de R$ 0,01 a R$ 100.000,00.';
    }
    return null;
  };

  const publish = async () => {
    if (!vehicle || !destination || loading) return;
    const validation = validateDetails();
    if (validation) {
      setStep(1);
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await publishTrip(token, {
        origem: origin.fullAddress, origemLat: origin.latitude, origemLng: origin.longitude,
        destino: destination.fullAddress, destinoLat: destination.latitude, destinoLng: destination.longitude,
        departureAt: departureAt.toISOString(), assentos: offeredSeats, ajudaCusto: amount,
        apenasMulheres: womenOnly, manualApproval, notes: notes.trim() || undefined,
      });
      setStep(0);
      setOrigin(UNEX);
      setDestination(null);
      setDepartureAt(defaultDeparture());
      setSeats(1);
      setPrice('');
      setExclusiveTrip(false);
      setManualApproval(true);
      setNotes('');
      onPublished();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    Keyboard.dismiss();
    setPicker(null);
    setError(null);
    if (step === 0 && !destination) {
      setLocationSheetVisible(true);
      return;
    }
    if (step === 1) {
      const validation = validateDetails();
      if (validation) {
        setError(validation);
        scroll.current?.scrollToEnd({ animated: !reduced });
        return;
      }
    }
    if (step === steps.length - 1) void publish();
    else setStep(step + 1);
  };

  return {
    origin, setOrigin, destination, setDestination, departureAt, setDepartureAt, offeredSeats, maximumSeats, setSeats,
    price, setPrice, amount, timeText, dateText, womenOnly, canOfferExclusiveTrip, setExclusiveTrip,
    manualApproval, setManualApproval, notes, setNotes, step, setStep, picker, setPicker,
    locationSheetVisible, setLocationSheetVisible, loading, error, setError, scroll, progress, next,
  };
}
