import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { ApiError } from '../services/api';
import { getCurrentUser, refreshSession } from '../services/auth-api';
import { getDriverTrips, getNotificationCount } from '../services/ride-api';
import { clearSession, readAccessToken, readRefreshToken, saveSession } from '../services/session-storage';
import { getVehicle } from '../services/vehicle-api';
import type { Tab, User, Vehicle } from '../types';

export function useApplication() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('inicio');
  const [suggestedDestination, setSuggestedDestination] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [vehicleScreen, setVehicleScreen] = useState<'register' | 'edit' | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const clearSuggestedDestination = useCallback(() => setSuggestedDestination(null), []);

  const openSession = (me: User, accessToken: string) => {
    setLoadingVehicle(me.role === 'motorista');
    setTab('inicio');
    setUser(me);
    setToken(accessToken);
  };

  useEffect(() => {
    const restore = async () => {
      try {
        const storedToken = await readAccessToken();
        if (storedToken) openSession(await getCurrentUser(storedToken), storedToken);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          try {
            const refreshToken = await readRefreshToken();
            if (!refreshToken) return;
            const session = await refreshSession(refreshToken);
            await saveSession(session);
            openSession(await getCurrentUser(session.accessToken), session.accessToken);
          } catch (refreshError) {
            if (refreshError instanceof ApiError && refreshError.status === 401) {
              await clearSession();
            }
          }
        }
      } finally {
        setBooting(false);
      }
    };
    void restore().catch(() => undefined);
  }, []);

  const [vehicleAttempt, setVehicleAttempt] = useState(0);
  const role = user?.role;
  useEffect(() => {
    if (!token || role !== 'motorista') return;
    let active = true;
    setLoadingVehicle(true);
    setVehicleError(null);
    void getVehicle(token).then((result) => {
      if (active) setVehicle(result);
    }).catch((error: unknown) => {
      if (!active) return;
      if (error instanceof ApiError && error.status === 404) setVehicle(null);
      else setVehicleError('Não foi possível consultar seu veículo. Tente novamente.');
    }).finally(() => {
      if (active) setLoadingVehicle(false);
    });
    return () => { active = false; };
  }, [token, role, vehicleAttempt]);

  const refreshNotificationCount = useCallback(async (signal?: AbortSignal) => {
    if (!token || !role) return;
    try {
      const count = role === 'motorista'
        ? (await getDriverTrips(token, signal))
          .reduce((total, trip) => total + (trip.requests?.filter((request) => request.status === 'pending').length ?? 0), 0)
        : (await getNotificationCount(token, signal)).count;
      if (!signal?.aborted) setUnreadNotifications(count);
    } catch {
      // A aba de viagens possui seu próprio estado de erro e ação de recarregar.
    }
  }, [role, token]);

  useEffect(() => {
    const controller = new AbortController();
    void refreshNotificationCount(controller.signal);
    const timer = setInterval(() => { void refreshNotificationCount(controller.signal); }, 30000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [refreshNotificationCount, tab]);

  useEffect(() => {
    if (!user || !vehicleScreen) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setVehicleScreen(null);
      return true;
    });
    return () => subscription.remove();
  }, [user, vehicleScreen]);

  const logout = async () => {
    await clearSession();
    setUser(null);
    setToken(null);
    setVehicle(null);
    setVehicleScreen(null);
    setVehicleError(null);
    setSuggestedDestination(null);
    setUnreadNotifications(0);
  };

  return {
    user, token, tab, booting, suggestedDestination, vehicle, loadingVehicle, vehicleError,
    vehicleScreen, unreadNotifications, openSession, logout, clearSuggestedDestination, refreshNotificationCount,
    navigate: setTab,
    openSearch: (destination?: string) => {
      setSuggestedDestination(destination ?? null);
      setTab('buscar');
    },
    openVehicle: () => setVehicleScreen(vehicle ? 'edit' : 'register'),
    registerVehicle: () => setVehicleScreen('register'),
    closeVehicle: () => setVehicleScreen(null),
    saveVehicle: (savedVehicle: Vehicle) => {
      setVehicle(savedVehicle);
      setVehicleScreen(null);
    },
    retryVehicle: () => setVehicleAttempt((attempt) => attempt + 1),
    showPublishedTrips: () => setTab((current) => current === 'publicar' ? 'minhas' : current),
  };
}
