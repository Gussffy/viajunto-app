import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppMode } from '@/src/context/ModeContext';
import { Search, MapPin, CalendarDays, ArrowRightLeft, CarFront, Wallet, Users, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { MOCK_RIDES } from '@/src/data/mock';
import { RideTicketCard } from '@/src/components/RideTicketCard';
import { EmptyIllustration } from '@/src/components/EmptyIllustration';
import { FadeIn } from '@/src/components/FadeIn';

export default function HomeScreen() {
  const { mode: paramMode } = useLocalSearchParams<{ mode?: string }>();
  const { mode: ctxMode, setMode } = useAppMode();
  const appliedParam = useRef<string | null>(null);
  useEffect(() => {
    if ((paramMode === 'dar' || paramMode === 'pedir') && appliedParam.current !== paramMode) {
      appliedParam.current = paramMode;
      setMode(paramMode);
    }
  }, [paramMode, setMode]);
  const mode = ctxMode;
  const isDriver = mode === 'dar';
  const [showEmpty, setShowEmpty] = useState(false);
  const rides = useMemo(() => (showEmpty ? [] : MOCK_RIDES), [showEmpty]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{isDriver ? 'MODO MOTORISTA' : 'MODO PASSAGEIRO'}</Text>
            <Text style={styles.title}>{isDriver ? 'Suas rotas, sob controle' : 'Para onde vamos?'}</Text>
          </View>
          <Pressable onPress={() => setShowEmpty(v => !v)} style={styles.toggle} accessibilityRole="button" accessibilityLabel="Alternar estado vazio"><SlidersHorizontal size={18} color={colors.primaryDeep} strokeWidth={2.2} /></Pressable>
        </FadeIn>

        <FadeIn delay={60} style={styles.heroCard}>
          {isDriver ? (
            <>
              <View style={styles.heroTop}><View style={styles.heroIcon}><CarFront size={20} color={colors.white} strokeWidth={2.2} /></View><Text style={styles.heroTitle}>Publique uma carona</Text></View>
              <Text style={styles.heroText}>Defina trajeto, horário, vagas e valor. Acompanhe solicitações em tempo real.</Text>
              <View style={styles.statsRow}>
                <Stat icon={Wallet} label="Ganhos mock" value="R$ 124" />
                <Stat icon={Users} label="Vagas abertas" value="5" />
              </View>
              <Pressable style={styles.heroCta} onPress={() => router.push('/publicar-carona' as any)} accessibilityRole="button">
                <Text style={styles.heroCtaText}>Publicar carona</Text><ChevronRight size={18} color={colors.primaryDeep} strokeWidth={2.3} />
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.heroTop}><View style={styles.heroIcon}><Search size={20} color={colors.white} strokeWidth={2.2} /></View><Text style={styles.heroTitle}>Busca rápida</Text></View>
              <Text style={styles.heroText}>Escolha origem, destino e data para ver caronas disponíveis.</Text>
              <Pressable style={styles.searchCard} onPress={() => router.push('/buscar-carona' as any)} accessibilityRole="button" accessibilityLabel="Buscar carona">
                <View style={styles.searchRow}><MapPin size={16} color={colors.primary} strokeWidth={2.2} /><Text style={styles.searchText}>Vitória da Conquista</Text></View>
                <View style={styles.searchDivider}><View style={styles.searchLine} /><View style={styles.swap}><ArrowRightLeft size={14} color={colors.primaryDeep} strokeWidth={2.2} /></View><View style={styles.searchLine} /></View>
                <View style={styles.searchRow}><MapPin size={16} color={colors.primaryDeep} strokeWidth={2.2} /><Text style={styles.searchText}>Brumado</Text></View>
                <View style={styles.dateRow}><CalendarDays size={15} color={colors.textMuted} strokeWidth={2} /><Text style={styles.dateText}>Hoje</Text><View style={{ flex: 1 }} /><View style={styles.searchBtn}><Text style={styles.searchBtnText}>Buscar</Text></View></View>
              </Pressable>
            </>
          )}
        </FadeIn>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{isDriver ? 'Suas próximas caronas' : 'Caronas disponíveis'}</Text>
          <Pressable onPress={() => router.push((isDriver ? '/publicar-carona' : '/buscar-carona') as any)} accessibilityRole="button"><Text style={styles.sectionLink}>{isDriver ? 'Nova' : 'Ver todas'}</Text></Pressable>
        </View>

        {rides.length === 0 ? (
          <View style={styles.emptyCard}>
            <EmptyIllustration title={isDriver ? 'Nenhuma carona publicada' : 'Nenhuma carona por aqui'} text={isDriver ? 'Publique seu primeiro trajeto e acompanhe reservas aqui.' : 'Tente ajustar origem, destino ou data para encontrar opções.'} />
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {rides.slice(0, 3).map((ride, i) => (
              <RideTicketCard key={ride.id} ride={ride} index={i} cta={isDriver ? 'Gerenciar' : 'Detalhes'} onPress={() => router.push((isDriver ? '/(tabs)/minhas-viagens' : { pathname: '/carona/[id]', params: { id: ride.id } }) as any)} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return <View style={styles.stat}><Icon size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  eyebrow: { ...typography.eyebrow, color: colors.primaryDeep, marginBottom: 6 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700', color: colors.text, letterSpacing: -0.5, maxWidth: 280 },
  toggle: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: colors.primaryDeep, borderRadius: 28, padding: 20, marginBottom: 22, ...shadows.float },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { ...typography.h3, color: colors.white },
  heroText: { ...typography.small, color: 'rgba(255,255,255,0.84)', marginTop: 10, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 12 },
  statValue: { color: colors.white, fontSize: 20, fontWeight: '700', marginTop: 8 },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  heroCta: { marginTop: 18, backgroundColor: colors.white, borderRadius: 14, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  heroCtaText: { ...typography.button, color: colors.primaryDeep },
  searchCard: { marginTop: 18, backgroundColor: colors.surface, borderRadius: 20, padding: 14 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  searchText: { ...typography.bodyStrong, color: colors.text },
  searchDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 },
  searchLine: { flex: 1, height: 1, backgroundColor: colors.border },
  swap: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  dateText: { ...typography.small, color: colors.text },
  searchBtn: { backgroundColor: colors.primaryDeep, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  searchBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...typography.h3, color: colors.text },
  sectionLink: { ...typography.small, color: colors.primaryDeep, fontWeight: '700' },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
});
