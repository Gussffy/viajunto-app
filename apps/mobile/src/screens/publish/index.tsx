import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { ChoiceRow, EmptyState, IconButton, PageHeading, RouteStops, Stepper, ui } from '../../components/journey-ui';
import { LocationSearchSheet } from '../../components/location-search';
import { DatePicker } from '../../components/date-picker';
import { RouteMapPreview } from '../../components/location-search/route-map-preview';
import { Reveal } from '../../components/motion';
import { PrimaryButton } from '../../components/primary-button';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/styles';
import { wizardStyles as wizard } from './style';
import { steps, useTripPublication, type PublishScreenProps } from './use-trip-publication';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function PublishScreen({ token, user, vehicle, active, loadingVehicle, vehicleError, onRetryVehicle, onRegisterVehicle, onPublished }: PublishScreenProps) {
  const {
    origin, setOrigin, destination, setDestination, departureAt, setDepartureAt, offeredSeats, maximumSeats, setSeats,
    price, setPrice, amount, timeText, dateText, womenOnly, canOfferExclusiveTrip, setExclusiveTrip,
    manualApproval, setManualApproval, notes, setNotes, step, setStep, picker, setPicker,
    locationSheetVisible, setLocationSheetVisible, loading, error, setError, scroll, progress, next,
  } = useTripPublication({ token, user, vehicle, active, onPublished });

  if (!vehicle) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.pageContent}>
        <PageHeading title="Publicar carona" />
        {loadingVehicle ? <ActivityIndicator color={colors.blue} accessibilityLabel="Consultando veículo" /> : (
          <EmptyState icon="car-outline" title={vehicleError ? 'Veículo indisponível' : 'Cadastre seu veículo'}
            description={vehicleError ?? 'Cadastre o carro e a quantidade de vagas antes de oferecer uma carona.'}
            action={<PrimaryButton label={vehicleError ? 'Tentar novamente' : 'Cadastrar veículo'} onPress={vehicleError ? onRetryVehicle : onRegisterVehicle} />} />
        )}
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[ui.container, wizard.header]}>
        <PageHeading title="Publicar carona" action={step > 0 && !loading ? <IconButton icon="arrow-back" label="Voltar uma etapa" onPress={() => { setError(null); setPicker(null); setStep(step - 1); }} /> : undefined} />
        <View style={wizard.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: steps.length, now: step + 1 }}>
          <Animated.View style={[wizard.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <Text style={wizard.progressText}>Etapa {step + 1} de {steps.length}</Text>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
        <Reveal changeKey={step} active={active}>
          <Text accessibilityRole="header" style={wizard.stepTitle}>{steps[step]}</Text>
          {step === 0 && (
            <>
              <View style={styles.formCard}>
                <RouteStops origin={origin.title} destination={destination?.title ?? 'Escolha o destino'} />
                {destination && <ChoiceRow icon="options-outline" label="Trajeto" value="Alterar partida e destino" onPress={() => setLocationSheetVisible(true)} />}
              </View>
              {destination && <RouteMapPreview origin={origin} destination={destination} />}
            </>
          )}
          {step === 1 && (
            <>
              <View style={wizard.stack}>
                <ChoiceRow icon="calendar-outline" label="Data da partida" value={dateText} onPress={() => setPicker('date')} />
                <ChoiceRow icon="time-outline" label="Horário" value={timeText} onPress={() => setPicker('time')} />
                {picker && (
                  <DatePicker value={departureAt} mode={picker} minimumDate={picker === 'date' ? new Date() : undefined}
                    onClose={() => setPicker(null)}
                    onSelect={(value) => setDepartureAt((current) => {
                      const next = new Date(current);
                      if (picker === 'date') next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
                      else next.setHours(value.getHours(), value.getMinutes(), 0, 0);
                      return next;
                    })} />
                )}
                <Stepper label="Vagas" value={offeredSeats} maximum={maximumSeats} onChange={setSeats} />
                <View style={wizard.inputBox}>
                  <Text style={styles.fieldLabel}>Ajuda de custo por pessoa</Text>
                  <View style={wizard.priceRow}>
                    <Text style={wizard.currency}>R$</Text>
                    <TextInput accessibilityLabel="Ajuda de custo por pessoa" keyboardType="decimal-pad" value={price}
                      onChangeText={setPrice} placeholder="Digite o valor por pessoa" placeholderTextColor={colors.muted} style={wizard.priceInput} />
                  </View>
                  <Text style={styles.switchCaption}>Pagamento combinado com o passageiro.</Text>
                </View>
              </View>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Preferências da carona</Text>
                <View style={styles.switchRow}>
                  <View style={ui.grow}><Text style={styles.switchTitle}>Aprovação manual</Text><Text style={styles.switchCaption}>Revise os pedidos antes de confirmar as vagas.</Text></View>
                  <Switch accessibilityLabel="Aprovação manual de pedidos" value={manualApproval} onValueChange={setManualApproval} trackColor={{ true: colors.blue, false: colors.line }} />
                </View>
                {canOfferExclusiveTrip && (
                  <View style={styles.switchRow}>
                    <View style={ui.grow}><Text style={styles.switchTitle}>Só para mulheres</Text><Text style={styles.switchCaption}>Aceite pedidos apenas de passageiras.</Text></View>
                    <Switch accessibilityLabel="Carona exclusiva para mulheres" value={womenOnly} onValueChange={setExclusiveTrip} trackColor={{ true: colors.blue, false: colors.line }} />
                  </View>
                )}
                <Text style={styles.fieldLabel}>Observações opcionais</Text>
                <TextInput accessibilityLabel="Observações para passageiros" value={notes} onChangeText={setNotes} maxLength={500} multiline
                  placeholder="Digite orientações para os passageiros" placeholderTextColor={colors.muted} style={wizard.notes} />
              </View>
            </>
          )}
          {step === 2 && destination && (
            <View style={styles.formCard}>
              <RouteStops origin={origin.fullAddress} destination={destination.fullAddress} />
              <View style={wizard.review}>
                <ReviewLine icon="calendar-outline" value={`${dateText} às ${timeText}`} />
                <ReviewLine icon="people-outline" value={`${offeredSeats} ${offeredSeats === 1 ? 'vaga' : 'vagas'} · ${currency.format(amount)} por pessoa`} />
                <ReviewLine icon="car-outline" value={`${vehicle.modelo}, ${vehicle.cor} · ${vehicle.placa}`} />
                <ReviewLine icon="checkmark-circle-outline" value={manualApproval ? 'Pedidos com aprovação manual' : 'Vagas confirmadas automaticamente'} />
                {womenOnly && <ReviewLine icon="female" value="Exclusiva para mulheres" />}
                {notes.trim() && <ReviewLine icon="document-text-outline" value={notes.trim()} />}
              </View>
            </View>
          )}
          {error && <Text accessibilityLiveRegion="polite" style={ui.error}>{error}</Text>}
        </Reveal>
      </ScrollView>
      <View style={ui.footer}>
        <View style={ui.container}>
          <PrimaryButton label={step === 0 && !destination ? 'Escolher partida e destino' : step === 2 ? 'Publicar carona' : 'Continuar'}
            icon={step === 2 ? 'checkmark' : 'arrow-forward'} loading={loading} onPress={next} />
        </View>
      </View>
      <LocationSearchSheet visible={active && locationSheetVisible} mode="driver" initialOrigin={origin} initialDestination={destination}
        onClose={() => setLocationSheetVisible(false)}
        onConfirm={(selection) => {
          setOrigin(selection.origin);
          setDestination(selection.destination);
          setLocationSheetVisible(false);
        }} />
    </KeyboardAvoidingView>
  );
}

function ReviewLine({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View style={wizard.reviewLine}>
      <Ionicons name={icon} size={19} color={colors.blue} />
      <Text style={[styles.detailValue, ui.grow]}>{value}</Text>
    </View>
  );
}
