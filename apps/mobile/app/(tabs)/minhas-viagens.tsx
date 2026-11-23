import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppMode } from '@/src/context/ModeContext';
import { Clock3, CheckCircle2, XCircle, MessageCircle, MapPin } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { MOCK_RIDES, MOCK_REQUESTS, RideRequest } from '@/src/data/mock';
import { AnimatedButton, EmptyIllustration, FadeIn } from '@/src/components';

type Tab = 'ativas' | 'historico';

export default function MinhasViagensScreen() {
  const { mode } = useAppMode();
  const isDriver = mode === 'dar';
  const [tab, setTab] = useState<Tab>('ativas');
  const [requests, setRequests] = useState<RideRequest[]>(MOCK_REQUESTS);

  const activeRides = useMemo(() => MOCK_RIDES.slice(0, 2).map((r, i) => ({ ...r, status: i === 0 ? 'confirmada' : 'pendente' as const })), []);
  const historyRides = useMemo(() => MOCK_RIDES.slice(2, 4).map((r) => ({ ...r, status: 'concluida' as const })), []);
  const rides = tab === 'ativas' ? activeRides : historyRides;

  const updateReq = (id: string, status: 'aceita' | 'recusada') => setRequests((rs) => rs.map((r) => r.id === id ? { ...r, status } : r));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Minhas viagens</Text>
          <View style={{ width: 40 }} />
        </FadeIn>

        <View style={styles.tabs}>
          {(['ativas', 'historico'] as Tab[]).map((t) => {
            const active = t === tab;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, active && styles.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: active }}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t === 'ativas' ? 'Ativas / Próximas' : 'Histórico'}</Text>
              </Pressable>
            );
          })}
        </View>

        {rides.length === 0 ? (
          <View style={styles.emptyCard}><EmptyIllustration title="Nenhuma viagem" text="Quando houver viagens, elas aparecerão aqui." /></View>
        ) : (
          <View style={{ gap: 12 }}>
            {rides.map((ride, i) => (
              <FadeIn key={ride.id} delay={i * 50} duration={300} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.routeRow}><MapPin size={14} color={colors.primary} strokeWidth={2.2} /><Text style={styles.routeText} numberOfLines={1}>{ride.origin} → {ride.destination}</Text></View>
                    <Text style={styles.meta}>{ride.date} · {ride.time} · R$ {ride.price}</Text>
                  </View>
                  <StatusBadge status={ride.status ?? 'pendente'} />
                </View>

                {isDriver && tab === 'ativas' ? (
                  <View style={styles.requests}>
                    <Text style={styles.reqTitle}>Solicitações</Text>
                    {requests.map((r) => (
                      <View key={r.id} style={styles.reqRow}>
                        <View style={{ flex: 1 }}><Text style={styles.reqName}>{r.passenger}</Text><Text style={styles.reqMeta}>{r.seats} {r.seats === 1 ? 'assento' : 'assentos'} · {r.status}</Text></View>
                        {r.status === 'pendente' ? (
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Pressable style={[styles.actionBtn, styles.acceptBtn]} onPress={() => updateReq(r.id, 'aceita')} accessibilityRole="button" accessibilityLabel={`Aceitar solicitação de ${r.passenger}`}><CheckCircle2 size={16} color={colors.success} strokeWidth={2.2} /></Pressable>
                            <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => updateReq(r.id, 'recusada')} accessibilityRole="button" accessibilityLabel={`Recusar solicitação de ${r.passenger}`}><XCircle size={16} color={colors.danger} strokeWidth={2.2} /></Pressable>
                          </View>
                        ) : <StatusMini status={r.status} />}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.cardActions}>
                    <AnimatedButton label="Detalhes" variant="secondary" onPress={() => router.push({ pathname: '/carona/[id]', params: { id: ride.id } } as any)} style={{ flex: 1, minHeight: 44 }} />
                    {tab === 'ativas' ? <AnimatedButton label="Chat" variant="ghost" onPress={() => router.push({ pathname: '/chat/[rideId]', params: { rideId: ride.id } } as any)} icon={<MessageCircle size={16} color={colors.primaryDeep} strokeWidth={2.2} />} style={{ flex: 1, minHeight: 44 }} /> : null}
                  </View>
                )}
              </FadeIn>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = { pendente: { bg: colors.warningSoft, fg: colors.warning, text: colors.warningText, label: 'Pendente' }, confirmada: { bg: colors.successSoft, fg: colors.success, text: colors.successText, label: 'Confirmada' }, andamento: { bg: colors.primarySoft, fg: colors.primaryDeep, text: colors.primaryDeep, label: 'Em andamento' }, concluida: { bg: colors.surfaceAlt, fg: colors.textMuted, text: colors.textMuted, label: 'Concluída' } };
  const s = map[status] ?? map.pendente;
  return <View style={[styles.badge, { backgroundColor: s.bg }]}><Clock3 size={12} color={s.fg} strokeWidth={2.2} /><Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text></View>;
}
function StatusMini({ status }: { status: string }) {
  const ok = status === 'aceita';
  return <Text style={{ ...typography.caption, fontWeight: '700', color: ok ? colors.successText : colors.dangerText }}>{ok ? 'Aceita' : 'Recusada'}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 16 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.primaryDeep },
  tabText: { ...typography.small, color: colors.textMuted, fontWeight: '700' },
  tabTextActive: { color: colors.white },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { ...typography.bodyStrong, color: colors.text, flex: 1 },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: '700' },
  requests: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 },
  reqTitle: { ...typography.small, fontWeight: '700', color: colors.text },
  reqRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, padding: 12, borderRadius: radius.md },
  reqName: { ...typography.small, fontWeight: '700', color: colors.text },
  reqMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  actionBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  acceptBtn: { backgroundColor: colors.successSoft },
  rejectBtn: { backgroundColor: colors.dangerSoft },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
});
