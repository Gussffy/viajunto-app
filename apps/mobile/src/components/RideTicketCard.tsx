import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock3, Users, ArrowRight, MapPin } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import type { Ride } from '@/src/data/mock';
import { FadeIn } from './FadeIn';

type Props = { ride: Ride; index?: number; onPress?: () => void; cta?: string };

export function RideTicketCard({ ride, index = 0, onPress, cta = 'Detalhes' }: Props) {
  return (
    <FadeIn delay={60 + index * 50} duration={320}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`${cta}: ${ride.origin} para ${ride.destination}`}>
        <View style={styles.top}>
          <View style={styles.route}>
            <View style={styles.routeRow}><View style={styles.originDot}><MapPin size={12} color={colors.primary} strokeWidth={2.4} /></View><Text style={styles.place} numberOfLines={1}>{ride.origin}</Text></View>
            <View style={styles.connector} />
            <View style={styles.routeRow}><View style={styles.destDot} /><Text style={styles.place} numberOfLines={1}>{ride.destination}</Text></View>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.price}>R$ {ride.price}</Text>
            <Text style={styles.perSeat}>por vaga</Text>
          </View>
        </View>
        <View style={styles.meta}>
          <Meta icon={CalendarDays} text={ride.date} />
          <Meta icon={Clock3} text={ride.time} />
          <Meta icon={Users} text={`${ride.seatsAvailable} vagas`} />
        </View>
        <View style={styles.bottom}>
          <View>
            <Text style={styles.driverLabel}>Motorista</Text>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
          </View>
          <View style={styles.cta}><Text style={styles.ctaText}>{cta}</Text><ArrowRight size={14} color={colors.primaryDeep} strokeWidth={2.2} /></View>
        </View>
      </Pressable>
    </FadeIn>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return <View style={styles.metaItem}><Icon size={14} color={colors.textMuted} strokeWidth={2} /><Text style={styles.metaText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  route: { flex: 1, marginRight: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  originDot: { width: 24, height: 24, borderRadius: 8, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  destDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.primaryDeep, marginHorizontal: 7 },
  connector: { width: 1, height: 14, backgroundColor: colors.borderStrong, marginLeft: 11, marginVertical: 4 },
  place: { ...typography.bodyStrong, color: colors.text, flex: 1 },
  priceBox: { alignItems: 'flex-end' },
  price: { fontSize: 22, lineHeight: 26, fontWeight: '700', color: colors.primaryDeep, letterSpacing: -0.3 },
  perSeat: { ...typography.caption, color: colors.textMuted },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { ...typography.small, color: colors.textMuted },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  driverLabel: { ...typography.caption, color: colors.textSoft },
  driverName: { ...typography.bodyStrong, color: colors.text, marginTop: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.sm },
  ctaText: { ...typography.small, fontWeight: '700', color: colors.primaryDeep },
});
