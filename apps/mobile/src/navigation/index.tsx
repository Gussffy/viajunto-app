import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '../components/brand-mark';
import { BottomNav } from '../components/bottom-nav';
import { ui } from '../components/journey-ui';
import { Reveal } from '../components/motion';
import { AuthScreen } from '../screens/auth';
import { HomeScreen } from '../screens/home';
import { SearchScreen } from '../screens/search';
import { PublishScreen } from '../screens/publish';
import { MyTripsScreen } from '../screens/trips';
import { ProfileScreen } from '../screens/profile';
import { VehicleScreen } from '../screens/vehicle';
import { colors } from '../theme/colors';
import { shell } from './style';
import { useApplication } from './use-application';

export function Application() {
  const {
    user, token, tab, booting, suggestedDestination, vehicle, loadingVehicle, vehicleError, vehicleScreen,
    unreadNotifications, openSession, logout, clearSuggestedDestination, refreshNotificationCount, navigate,
    openSearch, openVehicle, registerVehicle, closeVehicle, saveVehicle, retryVehicle, showPublishedTrips,
  } = useApplication();

  if (booting) {
    return (
      <View style={shell.boot}>
        <StatusBar style="light" />
        <Ionicons name="car-sport" size={38} color={colors.white} />
        <Text style={shell.brand}>ViaJunto</Text>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  if (!user || !token) return <AuthScreen onAuthenticated={openSession} />;

  const editingVehicle = vehicleScreen === 'edit' && vehicle !== null;

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={shell.root}>
      <StatusBar style="dark" />
      {vehicleScreen && (
        <View style={StyleSheet.absoluteFill}>
          <VehicleScreen
            token={token}
            vehicle={vehicle}
            editing={editingVehicle}
            onBack={closeVehicle}
            onSaved={saveVehicle}
          />
        </View>
      )}
      <View style={vehicleScreen ? shell.hidden : shell.fill}>
        <View style={shell.bar}>
          <View style={[ui.container, shell.barContent]}>
            <BrandMark />
          </View>
        </View>
        <View style={shell.body}>
          {tab === 'inicio' && (
            <Reveal style={shell.fill}>
              <HomeScreen user={user} vehicle={vehicle} loadingVehicle={loadingVehicle}
                vehicleError={vehicleError} activityCount={unreadNotifications}
                onSearch={openSearch}
                onPublish={() => navigate('publicar')} onShowTrips={() => navigate('minhas')}
                onOpenVehicle={openVehicle} />
            </Reveal>
          )}
          {user.role === 'passageiro' && (
            <Reveal active={tab === 'buscar'} style={tab === 'buscar' ? shell.fill : shell.hidden}>
              <SearchScreen token={token} user={user} active={tab === 'buscar' && !vehicleScreen}
                suggestedDestination={suggestedDestination} onUseSuggestedDestination={clearSuggestedDestination}
                onShowTrips={() => navigate('minhas')} />
            </Reveal>
          )}
          {user.role === 'motorista' && (
            <Reveal active={tab === 'publicar'} style={tab === 'publicar' ? shell.fill : shell.hidden}>
              <PublishScreen token={token} user={user} vehicle={vehicle} loadingVehicle={loadingVehicle}
                vehicleError={vehicleError} onRetryVehicle={retryVehicle}
                active={tab === 'publicar' && !vehicleScreen} onRegisterVehicle={registerVehicle}
                onPublished={showPublishedTrips} />
            </Reveal>
          )}
          {tab === 'minhas' && (
            <Reveal style={shell.fill}>
              <MyTripsScreen token={token} user={user} onFindRide={() => navigate(user.role === 'motorista' ? 'publicar' : 'buscar')}
                onActivityChanged={() => { void refreshNotificationCount(); }} />
            </Reveal>
          )}
          {tab === 'perfil' && (
            <Reveal style={shell.fill}>
              <ProfileScreen user={user} vehicle={vehicle}
                vehicleAvailable={!loadingVehicle && !vehicleError}
                onEditVehicle={openVehicle} onLogout={logout} />
            </Reveal>
          )}
        </View>
        <BottomNav tab={tab} user={user} badgeCount={unreadNotifications} onChange={navigate} />
      </View>
    </SafeAreaView>
  );
}
