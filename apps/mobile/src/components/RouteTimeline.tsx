import { StyleSheet, Text, View } from 'react-native';
import { MapPin, Flag } from 'lucide-react-native';
import { colors, radius, typography } from '@/src/theme';

type Props = { origin: string; destination: string; stops?: string[] };

export function RouteTimeline({ origin, destination, stops = [] }: Props) {
  const points = [origin, ...stops, destination];
  return (
    <View style={styles.wrap}>
      {points.map((p, i) => {
        const isFirst = i === 0;
        const isLast = i === points.length - 1;
        return (
          <View key={`${p}-${i}`} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.node, isFirst && styles.nodeFirst, isLast && styles.nodeLast]}>
                {isFirst ? <MapPin size={12} color={colors.white} strokeWidth={2.4} /> : isLast ? <Flag size={11} color={colors.white} strokeWidth={2.4} /> : <View style={styles.midDot} />}
              </View>
              {!isLast ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>{isFirst ? 'Embarque' : isLast ? 'Destino' : 'Parada'}</Text>
              <Text style={styles.place}>{p}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 4 },
  row: { flexDirection: 'row', minHeight: 56 },
  rail: { width: 34, alignItems: 'center' },
  node: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.surfaceAlt, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  nodeFirst: { backgroundColor: colors.primary, borderColor: colors.primary },
  nodeLast: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  midDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primaryDeep },
  line: { width: 2, flex: 1, backgroundColor: colors.borderStrong, marginVertical: 4, borderRadius: 1 },
  content: { flex: 1, paddingBottom: 14, paddingLeft: 8 },
  label: { ...typography.caption, color: colors.textSoft, textTransform: 'uppercase', letterSpacing: 0.6 },
  place: { ...typography.bodyStrong, color: colors.text, marginTop: 2 },
});
