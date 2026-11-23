import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { ArrowLeft, Star, ShieldCheck, Car, BadgeCheck, Users, Minus, Plus, X, MessageCircle } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { MOCK_RIDES } from '@/src/data/mock';
import { AnimatedButton, RouteTimeline } from '@/src/components';

export default function CaronaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const ride = useMemo(() => MOCK_RIDES.find((r) => r.id === id) ?? MOCK_RIDES[0], [id]);
  const [seats, setSeats] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const total = ride.price * seats;

  const openConfirm = () => { setRequested(false); setConfirmOpen(true); };

  const confirm = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 800));
    setRequesting(false);
    setRequested(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar"><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
          <Text style={styles.headerTitle}>Detalhes da carona</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(40)} style={styles.card}>
          <View style={styles.cardHead}><Text style={styles.cardTitle}>Trajeto</Text><Text style={styles.datePill}>{ride.date} · {ride.time}</Text></View>
          <RouteTimeline origin={ride.origin} destination={ride.destination} stops={ride.stops} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(80)} style={styles.card}>
          <Text style={styles.cardTitle}>Motorista e veículo</Text>
          <View style={styles.driverRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{ride.driver.name.split(' ').map(n => n[0]).slice(0,2).join('')}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.driverName}>{ride.driver.name}</Text>
                {ride.driver.verified ? <BadgeCheck size={16} color={colors.primary} strokeWidth={2.2} /> : null}
              </View>
              <View style={styles.ratingRow}><Star size={14} color="#E0A100" fill="#E0A100" strokeWidth={0} /><Text style={styles.ratingText}>{ride.driver.rating} · {ride.driver.trips} viagens</Text></View>
            </View>
          </View>
          <View style={styles.vehicleBox}>
            <Car size={18} color={colors.primaryDeep} strokeWidth={2} />
            <View style={{ flex: 1 }}><Text style={styles.vehicleText}>{ride.driver.vehicle} · {ride.driver.color}</Text><Text style={styles.plateText}>{ride.driver.plate}</Text></View>
            <View style={styles.verifiedPill}><ShieldCheck size={13} color={colors.success} strokeWidth={2.2} /><Text style={styles.verifiedText}>Verificado</Text></View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(120)} style={styles.card}>
          <Text style={styles.cardTitle}>Reservar assentos</Text>
          <View style={styles.seatRow}>
            <View><Text style={styles.seatLabel}>Quantidade</Text><Text style={styles.seatHint}>{ride.seatsAvailable} disponíveis</Text></View>
            <View style={styles.counter}>
              <Pressable style={styles.counterBtn} onPress={() => setSeats(s => Math.max(1, s - 1))} accessibilityRole="button" accessibilityLabel="Diminuir"><Minus size={18} color={colors.primaryDeep} strokeWidth={2.2} /></Pressable>
              <Text style={styles.counterNum}>{seats}</Text>
              <Pressable style={styles.counterBtn} onPress={() => setSeats(s => Math.min(ride.seatsAvailable, s + 1))} accessibilityRole="button" accessibilityLabel="Aumentar"><Plus size={18} color={colors.primaryDeep} strokeWidth={2.2} /></Pressable>
            </View>
          </View>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total estimado</Text><Text style={styles.totalValue}>R$ {total}</Text></View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(160)} style={styles.actions}>
          <AnimatedButton label="Solicitar reserva" onPress={openConfirm} icon={<Users size={18} color={colors.white} strokeWidth={2.2} />} />
          <AnimatedButton label="Mensagem ao motorista" variant="secondary" onPress={() => router.push({ pathname: '/chat/[rideId]', params: { rideId: ride.id } } as any)} icon={<MessageCircle size={18} color={colors.primaryDeep} strokeWidth={2.2} />} />
        </Animated.View>
      </ScrollView>

      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setConfirmOpen(false)} />
          <Animated.View entering={SlideInDown.duration(260)} style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.sheetHandle} />
            {requested ? (
              <>
                <View style={styles.successIcon}><BadgeCheck size={26} color={colors.white} strokeWidth={2.4} /></View>
                <Text style={[styles.sheetTitle, { textAlign: 'center' }]}>Reserva solicitada</Text>
                <Text style={[styles.sheetText, { textAlign: 'center' }]}>Sua solicitação foi enviada ao motorista. Você pode acompanhar a resposta em Minhas viagens.</Text>
                <AnimatedButton label="Ver viagens" onPress={() => { setConfirmOpen(false); router.replace('/(tabs)/minhas-viagens' as any); }} />
                <Pressable onPress={() => setConfirmOpen(false)} style={styles.sheetClose} accessibilityRole="button" accessibilityLabel="Continuar explorando">
                  <Text style={styles.sheetCloseText}>Continuar explorando</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.sheetHead}><Text style={styles.sheetTitle}>Confirmar solicitação</Text><Pressable onPress={() => setConfirmOpen(false)} accessibilityRole="button" accessibilityLabel="Fechar"><X size={20} color={colors.textMuted} strokeWidth={2} /></Pressable></View>
                <Text style={styles.sheetText}>{seats} {seats === 1 ? 'assento' : 'assentos'} de {ride.origin} para {ride.destination} em {ride.date} às {ride.time}.</Text>
                <View style={styles.sheetTotal}><Text style={styles.sheetTotalLabel}>Valor total</Text><Text style={styles.sheetTotalValue}>R$ {total}</Text></View>
                <AnimatedButton label="Confirmar solicitação" onPress={confirm} loading={requesting} />
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 16 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14, ...shadows.card },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: 12 },
  datePill: { ...typography.caption, color: colors.primaryDeep, backgroundColor: colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, fontWeight: '700', overflow: 'hidden' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.primaryDeep, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  driverName: { ...typography.bodyStrong, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { ...typography.small, color: colors.textMuted },
  vehicleBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, padding: 12, borderRadius: radius.md },
  vehicleText: { ...typography.small, color: colors.text, fontWeight: '600' },
  plateText: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successSoft, paddingHorizontal: 8, paddingVertical: 6, borderRadius: radius.pill },
  verifiedText: { fontSize: 11, fontWeight: '700', color: colors.successText },
  seatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seatLabel: { ...typography.bodyStrong, color: colors.text },
  seatHint: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg, borderRadius: radius.md, padding: 4 },
  counterBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  counterNum: { fontSize: 18, fontWeight: '700', color: colors.text, minWidth: 20, textAlign: 'center' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { ...typography.body, color: colors.textMuted },
  totalValue: { fontSize: 24, fontWeight: '700', color: colors.primaryDeep },
  actions: { gap: 12 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 16 },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sheetTitle: { ...typography.h3, color: colors.text },
  sheetText: { ...typography.body, color: colors.textMuted, marginBottom: 16 },
  sheetTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.bg, padding: 14, borderRadius: radius.md, marginBottom: 16 },
  sheetTotalLabel: { ...typography.bodyStrong, color: colors.text },
  sheetTotalValue: { fontSize: 22, fontWeight: '700', color: colors.primaryDeep },
  successIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 14 },
  sheetClose: { alignItems: 'center', paddingVertical: 14 },
  sheetCloseText: { ...typography.bodyStrong, color: colors.primaryDeep },
});