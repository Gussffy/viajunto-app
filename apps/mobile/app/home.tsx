import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Clock3,
  LogOut,
  MapPin,
  PlusCircle,
  Search,
  UserRound,
  Users,
} from 'lucide-react-native';
import { colors } from '@/src/theme';

type Ride = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  seats: number;
  driver: string;
};

const MOCK_RIDES: Ride[] = [
  { id: '1', origin: 'Vitória da Conquista', destination: 'Brumado', date: 'Hoje', time: '07:30', price: 'R$ 35', seats: 3, driver: 'Mariana S.' },
  { id: '2', origin: 'Vitória da Conquista', destination: 'Brumado', date: 'Hoje', time: '14:00', price: 'R$ 32', seats: 2, driver: 'Carlos A.' },
  { id: '3', origin: 'Brumado', destination: 'Vitória da Conquista', date: 'Amanhã', time: '06:15', price: 'R$ 38', seats: 1, driver: 'Ana P.' },
];

export default function HomeScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isDriver = mode === 'dar';
  const [hasRides, setHasRides] = useState(false);

  const rides = useMemo(() => (hasRides ? MOCK_RIDES : []), [hasRides]);
  const title = isDriver ? 'Painel do motorista' : 'Encontrar carona';
  const subtitle = isDriver
    ? 'Acompanhe suas ofertas e publique novos trajetos.'
    : 'Escolha um trajeto seguro com horários e vagas claras.';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(380)} style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{isDriver ? 'MODO MOTORISTA' : 'MODO PASSAGEIRO'}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sair"
            onPress={() => router.replace('/acesso')}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <LogOut size={20} color={colors.text} strokeWidth={2} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(380).delay(60)} style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              {isDriver ? <CarFront size={20} color="#FFFFFF" strokeWidth={2.2} /> : <Search size={20} color="#FFFFFF" strokeWidth={2.2} />}
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>{isDriver ? 'Ofereça sua próxima carona' : 'Busque sua próxima viagem'}</Text>
              <Text style={styles.summaryText}>
                {isDriver
                  ? 'Publique horários, vagas e valor por assento.'
                  : 'Veja opções disponíveis com informações essenciais.'}
              </Text>
            </View>
          </View>
          <View style={styles.summaryActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isDriver ? 'Publicar carona' : 'Buscar carona'}
              onPress={() => {}}
              style={({ pressed }) => [styles.primaryCta, pressed && styles.pressed]}
            >
              {isDriver ? <PlusCircle size={18} color="#FFF" strokeWidth={2.2} /> : <Search size={18} color="#FFF" strokeWidth={2.2} />}
              <Text style={styles.primaryCtaText}>{isDriver ? 'Publicar carona' : 'Buscar carona'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hasRides ? 'Mostrar estado vazio' : 'Mostrar caronas de exemplo'}
              onPress={() => setHasRides((v) => !v)}
              style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
            >
              <Text style={styles.ghostBtnText}>{hasRides ? 'Ver vazio' : 'Ver exemplos'}</Text>
            </Pressable>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{hasRides ? 'Próximas caronas' : 'Estado atual'}</Text>
          <Text style={styles.sectionMeta}>{hasRides ? `${rides.length} opções` : 'Atualizado agora'}</Text>
        </View>

        {rides.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(380).delay(120)} style={styles.emptyWrap}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                {isDriver ? <CarFront size={34} color={colors.primaryDeep} strokeWidth={1.8} /> : <MapPin size={34} color={colors.primaryDeep} strokeWidth={1.8} />}
              </View>
              <Text style={styles.emptyTitle}>{isDriver ? 'Nenhuma carona publicada' : 'Nenhuma carona por aqui'}</Text>
              <Text style={styles.emptyText}>
                {isDriver
                  ? 'Suas caronas publicadas vão aparecer aqui com reservas, horários e vagas disponíveis.'
                  : 'Ainda não encontramos caronas para este momento. Tente buscar novamente ou volte mais tarde.'}
              </Text>
              <View style={styles.emptyHints}>
                <Hint text={isDriver ? 'Defina origem e destino' : 'Confira horários disponíveis'} />
                <Hint text={isDriver ? 'Informe vagas e valor' : 'Compare vagas e preço'} />
              </View>
            </View>
          </Animated.View>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <RideCard ride={item} index={index} isDriver={isDriver} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <View style={styles.hint}>
      <View style={styles.hintDot} />
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
}

function RideCard({ ride, index, isDriver }: { ride: Ride; index: number; isDriver: boolean }) {
  return (
    <Animated.View entering={FadeInDown.duration(340).delay(80 + index * 55)} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.route}>
          <View style={styles.routeRow}>
            <View style={styles.originMark}><MapPin size={14} color={colors.primary} strokeWidth={2.2} /></View>
            <Text style={styles.routeText} numberOfLines={1}>{ride.origin}</Text>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.destMark} />
            <Text style={styles.routeText} numberOfLines={1}>{ride.destination}</Text>
          </View>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>{ride.price}</Text>
          <Text style={styles.perSeat}>por vaga</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Meta icon={CalendarDays} text={ride.date} />
        <Meta icon={Clock3} text={ride.time} />
        <Meta icon={Users} text={`${ride.seats} vagas`} />
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.driverWrap}>
          <View style={styles.avatar}><UserRound size={16} color={colors.primaryDeep} strokeWidth={2} /></View>
          <View>
            <Text style={styles.driverLabel}>{isDriver ? 'Publicada por você' : 'Motorista'}</Text>
            <Text style={styles.driverName}>{isDriver ? 'Você' : ride.driver}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.cardAction, pressed && styles.pressed]}>
          <Text style={styles.cardActionText}>{isDriver ? 'Gerenciar' : 'Detalhes'}</Text>
          <ArrowRight size={14} color={colors.primaryDeep} strokeWidth={2.2} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Icon size={15} color={colors.textMuted} strokeWidth={2} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F6FB' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 18 },
  headerCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.1, color: colors.primaryDeep, marginBottom: 8 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700', color: '#162033', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#5E6B7E', marginTop: 6, maxWidth: 320 },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5EBF3',
  },
  summaryCard: {
    backgroundColor: '#1B4FA3', borderRadius: 24, padding: 18, marginBottom: 22,
    shadowColor: '#1B4FA3', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 5,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start' },
  summaryIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  summaryCopy: { flex: 1 },
  summaryTitle: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: '#FFFFFF' },
  summaryText: { fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.84)', marginTop: 4 },
  summaryActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  primaryCta: {
    flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: '#FFFFFF', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  primaryCtaText: { color: '#1B4FA3', fontSize: 15, fontWeight: '700' },
  ghostBtn: {
    minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)',
  },
  ghostBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  sectionMeta: { fontSize: 12, color: '#6B778C', fontWeight: '500' },
  emptyWrap: { flex: 1, paddingBottom: 24 },
  emptyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E7EDF5',
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  emptyTitle: { fontSize: 22, lineHeight: 28, fontWeight: '700', color: '#162033', textAlign: 'center' },
  emptyText: { fontSize: 14, lineHeight: 22, color: '#5E6B7E', textAlign: 'center', marginTop: 10, maxWidth: 320 },
  emptyHints: { width: '100%', marginTop: 20, gap: 10 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#F7FAFF', borderRadius: 12 },
  hintDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primaryDeep },
  hintText: { fontSize: 13, color: '#445066', fontWeight: '500' },
  list: { paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E7EDF5',
    shadowColor: '#102A56', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  route: { flex: 1, marginRight: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  originMark: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' },
  destMark: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.primaryDeep, marginLeft: 7, marginRight: 7 },
  routeConnector: { width: 1, height: 16, backgroundColor: '#D6E2F3', marginLeft: 11, marginVertical: 4 },
  routeText: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: '#18243A', flex: 1 },
  priceWrap: { alignItems: 'flex-end', paddingLeft: 8 },
  price: { fontSize: 22, lineHeight: 26, fontWeight: '700', color: colors.primaryDeep, letterSpacing: -0.3 },
  perSeat: { fontSize: 12, color: '#6B778C', marginTop: 2 },
  metaRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#EDF2F8',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: '#5E6B7E', fontWeight: '500' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  driverWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' },
  driverLabel: { fontSize: 11, color: '#7B8798', fontWeight: '500' },
  driverName: { fontSize: 14, color: '#18243A', fontWeight: '600', marginTop: 1 },
  cardAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 10, backgroundColor: '#F0F5FF',
  },
  cardActionText: { fontSize: 13, fontWeight: '700', color: colors.primaryDeep },
  pressed: { opacity: 0.88 },
});