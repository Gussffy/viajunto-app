import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Field } from '../../components/field';
import { IconButton, PageHeading, Stepper, ui } from '../../components/journey-ui';
import { Reveal } from '../../components/motion';
import { PrimaryButton } from '../../components/primary-button';
import { saveVehicle } from '../../services/vehicle-api';
import type { Vehicle } from '../../types';
import { styles } from '../../theme/styles';

type VehicleScreenProps = {
  token: string;
  vehicle: Vehicle | null;
  editing: boolean;
  onSaved: (vehicle: Vehicle) => void;
  onBack: () => void;
};

export function VehicleScreen({ token, vehicle, editing, onSaved, onBack }: VehicleScreenProps) {
  const [placa, setPlaca] = useState(vehicle?.placa ?? '');
  const [modelo, setModelo] = useState(vehicle?.modelo ?? '');
  const [cor, setCor] = useState(vehicle?.cor ?? '');
  const [lugares, setLugares] = useState(vehicle?.lugares ?? 4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (loading) return;
    const plate = placa.trim().toUpperCase().replace(/-/g, '');
    if (!/^[A-Z]{3}(?:[0-9]{4}|[0-9][A-Z][0-9]{2})$/.test(plate)) {
      setError('Informe uma placa do formato antigo (ABC1234) ou Mercosul (ABC1D23).');
      return;
    }
    if (modelo.trim().length < 2 || cor.trim().length < 2) {
      setError('Informe o modelo e a cor do veículo.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const saved = await saveVehicle(token, editing, { placa: plate, modelo: modelo.trim(), cor: cor.trim(), lugares });
      onSaved(saved);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar o veículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
        <Reveal>
          <PageHeading title={editing ? 'Meu veículo' : 'Cadastre seu veículo'}
            description="Esses dados ajudam os passageiros a identificar seu carro."
            action={loading ? undefined : <IconButton icon="arrow-back" label="Voltar" onPress={onBack} />} />
          <View style={styles.formCard}>
            <Field label="Placa" value={placa} onChangeText={(value) => setPlaca(value.toUpperCase())} placeholder="Digite a placa do veículo" autoCapitalize="characters" maxLength={8} />
            <Field label="Modelo" value={modelo} onChangeText={setModelo} placeholder="Digite o modelo do veículo" autoCapitalize="words" maxLength={80} />
            <Field label="Cor" value={cor} onChangeText={setCor} placeholder="Digite a cor do veículo" autoCapitalize="words" maxLength={40} />
            <Stepper label="Lugares disponíveis" value={lugares} maximum={8} onChange={setLugares} />
          </View>
          {error && <Text accessibilityLiveRegion="polite" style={ui.error}>{error}</Text>}
          <PrimaryButton label={editing ? 'Salvar alterações' : 'Cadastrar veículo'} icon="checkmark" onPress={() => void save()} loading={loading} />
        </Reveal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
