import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChoiceRow, PageHeading, ui } from '../../components/journey-ui';
import type { User, Vehicle } from '../../types';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/styles';
import { profileStyles as profile } from './style';

type ProfileScreenProps = {
  user: User;
  vehicle?: Vehicle | null;
  vehicleAvailable: boolean;
  onEditVehicle: () => void;
  onLogout: () => Promise<void>;
};

export function ProfileScreen({ user, vehicle, vehicleAvailable, onEditVehicle, onLogout }: ProfileScreenProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState(false);
  const driver = user.role === 'motorista';
  const initials = user.nome.trim().split(/\s+/).slice(0, 2).map((name) => name.charAt(0).toUpperCase()).join('');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pageContent}>
      <PageHeading title="Meu perfil" />
      <View style={profile.identity}>
        <View style={profile.avatar}><Text style={profile.initials}>{initials}</Text></View>
        <View style={ui.grow}>
          <Text style={profile.name}>{user.nome}</Text>
          <Text style={profile.email}>{user.email}</Text>
          <Text style={profile.role}>{driver ? 'Motorista' : 'Passageiro'}</Text>
        </View>
      </View>
      {driver && vehicleAvailable && (
        <View style={styles.formCard}>
          <ChoiceRow icon="car-outline" label="Meu veículo"
            value={vehicle ? `${vehicle.modelo} · ${vehicle.placa}` : 'Cadastrar veículo'} onPress={onEditVehicle} />
        </View>
      )}
      {confirmLogout && <Text style={ui.description}>Você precisará entrar novamente para usar o aplicativo.</Text>}
      {error && <Text accessibilityLiveRegion="polite" style={ui.error}>Não foi possível sair da conta. Tente novamente.</Text>}
      <Pressable accessibilityRole="button" disabled={loggingOut} style={({ pressed }) => [profile.logout, pressed && ui.pressed]}
        onPress={async () => {
          if (!confirmLogout) {
            setConfirmLogout(true);
            return;
          }
          setLoggingOut(true);
          try {
            await onLogout();
          } catch {
            setError(true);
          } finally {
            setLoggingOut(false);
          }
        }}>
        <Ionicons name="log-out-outline" size={21} color={colors.danger} />
        <Text style={profile.logoutText}>{loggingOut ? 'Saindo…' : confirmLogout ? 'Confirmar saída' : 'Sair da conta'}</Text>
      </Pressable>
      {confirmLogout && <Pressable accessibilityRole="button" disabled={loggingOut} onPress={() => setConfirmLogout(false)} style={profile.cancel}><Text style={profile.role}>Continuar conectado</Text></Pressable>}
    </ScrollView>
  );
}
