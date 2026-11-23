import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, MapPin, CalendarDays, ArrowUpDown, SlidersHorizontal, Search } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { MOCK_RIDES } from '@/src/data/mock';
import { RideTicketCard } from '@/src/components';

const DATES = ['Hoje', 'Amanhã', 'Sáb, 23', 'Dom, 24', 'Seg, 25'];

export default function BuscarCaronaScreen() {
  const [origin, setOrigin] = useState('Vitória da Conquista');
  const [destination, setDestination] = useState('Brumado');
  const [selectedDate, setSelectedDate] = useState('Hoje');
  const [minSeats, setMinSeats] = useState(1);

  const results = useMemo(() => {
    return MOCK_RIDES.filter((r) => {
      const o = origin.trim().toLowerCase();
      const d = destination.trim().toLowerCase();
      const matchO = !o || r.origin.toLowerCase().includes(o);
      const matchD = !d || r.destination.toLowerCase().includes(d);
      const matchDate = selectedDate === 'Hoje' ? r.date === 'Hoje' : selectedDate === 'Amanhã' ? r.date === 'Amanhã' : true;
      return matchO && matchD && matchDate && r.seatsAvailable >= minSeats;
    });
  }, [origin, destination, selectedDate, minSeats]);

  const swap = () => { setOrigin(destination); setDestination(origin); };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(360)} style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar"><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
          <Text style={styles.headerTitle}>Buscar carona</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(50)} style={styles.searchBox}>
          <View style={styles.inputRow}>
            <MapPin size={17} color={colors.primary} strokeWidth={2.2} />
            <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="Origem" placeholderTextColor={colors.textSoft} accessibilityLabel="Origem" />
          </View>
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Pressable onPress={swap} style={styles.swapBtn} accessibilityRole="button" accessibilityLabel="Inverter rota"><ArrowUpDown size={16} color={colors.primaryDeep} strokeWidth={2.2} /></Pressable>
            <View style={styles.line} />
          </View>
          <View style={styles.inputRow}>
            <MapPin size={17} color={colors.primaryDeep} strokeWidth={2.2} />
            <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destino" placeholderTextColor={colors.textSoft} accessibilityLabel="Destino" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(90)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dates}>
            {DATES.map((d) => {
              const active = d === selectedDate;
              return (
                <Pressable key={d} onPress={() => setSelectedDate(d)} style={[styles.dateChip, active && styles.dateChipActive]} accessibilityRole="button" accessibilityLabel={`Data ${d}`} accessibilityState={{ selected: active }}>
                  <CalendarDays size={14} color={active ? colors.white : colors.textMuted} strokeWidth={2} />
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{d}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(360).delay(120)} style={styles.filters}>
          <View style={styles.filterLabel}><SlidersHorizontal size={15} color={colors.textMuted} strokeWidth={2} /><Text style={styles.filterText}>Vagas mínimas</Text></View>
          <View style={styles.seatsRow}>
            {[1, 2, 3, 4].map((n) => (
              <Pressable key={n} onPress={() => setMinSeats(n)} style={[styles.seatChip, minSeats === n && styles.seatChipActive]} accessibilityRole="button" accessibilityLabel={`${n} ${n === 1 ? 'vaga mínima' : 'vagas mínimas'}`} accessibilityState={{ selected: minSeats === n }}>
                <Text style={[styles.seatChipText, minSeats === n && styles.seatChipTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <View style={styles.resultsHead}>
          <Text style={styles.resultsTitle}>{results.length} {results.length === 1 ? 'carona encontrada' : 'caronas encontradas'}</Text>
        </View>

        <View style={{ gap: 12 }}>
          {results.map((ride, i) => (
            <RideTicketCard key={ride.id} ride={ride} index={i} cta="Ver detalhes" onPress={() => router.push({ pathname: '/carona/[id]', params: { id: ride.id } } as any)} />
          ))}
          {results.length === 0 ? (
            <View style={styles.empty}><Search size={28} color={colors.textSoft} strokeWidth={1.8} /><Text style={styles.emptyTitle}>Sem resultados</Text><Text style={styles.emptyText}>Ajuste origem, destino, data ou vagas para encontrar caronas.</Text></View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 16 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  searchBox: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  swapBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  dates: { gap: 8, paddingVertical: 16 },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dateChipActive: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  dateChipText: { ...typography.small, color: colors.textMuted, fontWeight: '600' },
  dateChipTextActive: { color: colors.white },
  filters: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  filterLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterText: { ...typography.small, color: colors.textMuted },
  seatsRow: { flexDirection: 'row', gap: 8 },
  seatChip: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  seatChipActive: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  seatChipText: { ...typography.small, color: colors.text, fontWeight: '700' },
  seatChipTextActive: { color: colors.white },
  resultsHead: { marginBottom: 12 },
  resultsTitle: { ...typography.bodyStrong, color: colors.text },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 280 },
});