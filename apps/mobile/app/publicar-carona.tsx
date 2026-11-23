import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ArrowLeft, MapPin, CalendarDays, Clock3, Users, DollarSign, Snowflake, Briefcase, PawPrint, Check, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { AnimatedButton } from '@/src/components';

const PREFS = [
  { key: 'ac', label: 'Ar-condicionado', icon: Snowflake },
  { key: 'bag', label: 'Bagagem', icon: Briefcase },
  { key: 'pets', label: 'Pets', icon: PawPrint },
];

export default function PublicarCaronaScreen() {
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState('');
  const [prefs, setPrefs] = useState<string[]>(['ac']);
  const [publishing, setPublishing] = useState(false);

  const togglePref = (k: string) => setPrefs((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);
  const canNext = () => {
    if (step === 0) return origin.trim().length > 0 && destination.trim().length > 0;
    if (step === 1) return date.trim().length > 0 && time.trim().length > 0;
    if (step === 2) return seats >= 1 && Number(price) > 0;
    return true;
  };

  const [published, setPublished] = useState(false);
  const publish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 900));
    setPublishing(false);
    setPublished(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar"><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
          <Text style={styles.headerTitle}>Publicar carona</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <View style={styles.stepper}>
          {['Rota', 'Horário', 'Vagas', 'Revisão'].map((label, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepDot, active && styles.stepDotActive, done && styles.stepDotDone]}>
                  {done ? <Check size={12} color={colors.white} strokeWidth={3} /> : <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>{i + 1}</Text>}
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
            );
          })}
        </View>

        <Animated.View key={step} entering={FadeIn.duration(260)} style={styles.card}>
          {step === 0 ? (
            <>
              <Text style={styles.cardTitle}>Qual é o trajeto?</Text>
              <Text style={styles.cardSub}>Informe origem e destino da sua carona.</Text>
              <Field icon={MapPin} iconColor={colors.primary} placeholder="Cidade de origem" value={origin} onChangeText={setOrigin} />
              <View style={{ height: 12 }} />
              <Field icon={MapPin} iconColor={colors.primaryDeep} placeholder="Cidade de destino" value={destination} onChangeText={setDestination} />
            </>
          ) : null}
          {step === 1 ? (
            <>
              <Text style={styles.cardTitle}>Quando você sai?</Text>
              <Text style={styles.cardSub}>Defina data e horário de partida.</Text>
              <Field icon={CalendarDays} iconColor={colors.primary} placeholder="Data (ex: Hoje, 23/11)" value={date} onChangeText={setDate} />
              <View style={{ height: 12 }} />
              <Field icon={Clock3} iconColor={colors.primaryDeep} placeholder="Horário (ex: 07:30)" value={time} onChangeText={setTime} />
            </>
          ) : null}
          {step === 2 ? (
            <>
              <Text style={styles.cardTitle}>Vagas, valor e preferências</Text>
              <Text style={styles.cardSub}>Configure os detalhes para os passageiros.</Text>
              <Text style={styles.fieldLabel}>Assentos disponíveis</Text>
              <View style={styles.counter}>
                <Pressable style={styles.counterBtn} onPress={() => setSeats((s) => Math.max(1, s - 1))} accessibilityRole="button" accessibilityLabel="Diminuir assentos"><Text style={styles.counterBtnText}>-</Text></Pressable>
                <View style={styles.counterVal}><Users size={16} color={colors.primaryDeep} strokeWidth={2} /><Text style={styles.counterNum}>{seats}</Text></View>
                <Pressable style={styles.counterBtn} onPress={() => setSeats((s) => Math.min(6, s + 1))} accessibilityRole="button" accessibilityLabel="Aumentar assentos"><Text style={styles.counterBtnText}>+</Text></Pressable>
              </View>
              <Text style={styles.fieldLabel}>Valor por assento (R$)</Text>
              <Field icon={DollarSign} iconColor={colors.primaryDeep} placeholder="Ex: 35" value={price} onChangeText={setPrice} keyboardType="numeric" />
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Preferências</Text>
              <View style={styles.prefs}>
                {PREFS.map((p) => {
                  const active = prefs.includes(p.key);
                  const Icon = p.icon;
                  return (
                    <Pressable key={p.key} onPress={() => togglePref(p.key)} style={[styles.prefChip, active && styles.prefChipActive]} accessibilityRole="button" accessibilityState={{ selected: active }}>
                      <Icon size={15} color={active ? colors.white : colors.textMuted} strokeWidth={2} />
                      <Text style={[styles.prefText, active && styles.prefTextActive]}>{p.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}
          {step === 3 ? (
            <>
              <Text style={styles.cardTitle}>{published ? 'Carona publicada' : 'Revise sua carona'}</Text>
              <Text style={styles.cardSub}>{published ? 'Sua carona foi publicada com sucesso. Você pode acompanhar em Minhas viagens.' : 'Confirme os dados antes de publicar.'}</Text>
              <View style={styles.preview}>
                <PreviewRow label="Origem" value={origin || '-'} />
                <PreviewRow label="Destino" value={destination || '-'} />
                <PreviewRow label="Data" value={date || '-'} />
                <PreviewRow label="Horário" value={time || '-'} />
                <PreviewRow label="Vagas" value={`${seats}`} />
                <PreviewRow label="Valor" value={price ? `R$ ${price}` : '-'} />
                <PreviewRow label="Preferências" value={PREFS.filter((p) => prefs.includes(p.key)).map((p) => p.label).join(', ') || 'Nenhuma'} />
              </View>
            </>
          ) : null}
        </Animated.View>

        <View style={styles.nav}>
          {!published && step > 0 ? <AnimatedButton label="Voltar" variant="secondary" onPress={() => setStep((s) => s - 1)} icon={<ChevronLeft size={18} color={colors.primaryDeep} strokeWidth={2.2} />} style={{ flex: 1 }} /> : <View style={{ flex: 1 }} />}
          {published ? (
            <AnimatedButton label="Ver viagens" onPress={() => router.replace('/(tabs)/minhas-viagens' as any)} style={{ flex: 1 }} />
          ) : step < 3 ? (
            <AnimatedButton label="Continuar" onPress={() => { if (canNext()) setStep((s) => s + 1); }} disabled={!canNext()} icon={<ChevronRight size={18} color={colors.white} strokeWidth={2.2} />} style={{ flex: 1 }} />
          ) : (
            <AnimatedButton label="Publicar" onPress={publish} loading={publishing} style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ icon: Icon, iconColor, ...props }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Icon size={18} color={iconColor} strokeWidth={2} />
      <TextInput {...props} accessibilityLabel={props.accessibilityLabel ?? props.placeholder} style={styles.fieldInput} placeholderTextColor={colors.textSoft} />
    </View>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.previewRow}><Text style={styles.previewLabel}>{label}</Text><Text style={styles.previewValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 16 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stepItem: { alignItems: 'center', flex: 1, gap: 6 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  stepDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  stepNumActive: { color: colors.white },
  stepLabel: { fontSize: 11, color: colors.textSoft, fontWeight: '600' },
  stepLabelActive: { color: colors.primaryDeep },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cardTitle: { ...typography.h3, color: colors.text },
  cardSub: { ...typography.body, color: colors.textMuted, marginTop: 4, marginBottom: 20 },
  fieldWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, minHeight: 52 },
  fieldInput: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 12 },
  fieldLabel: { ...typography.small, color: colors.text, fontWeight: '700', marginBottom: 10 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  counterBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  counterBtnText: { fontSize: 22, color: colors.primaryDeep, fontWeight: '600', lineHeight: 24 },
  counterVal: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.bg, borderRadius: radius.md },
  counterNum: { fontSize: 20, fontWeight: '700', color: colors.text },
  prefs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prefChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  prefChipActive: { backgroundColor: colors.primaryDeep, borderColor: colors.primaryDeep },
  prefText: { ...typography.small, color: colors.textMuted, fontWeight: '600' },
  prefTextActive: { color: colors.white },
  preview: { gap: 0 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  previewLabel: { ...typography.small, color: colors.textMuted },
  previewValue: { ...typography.small, color: colors.text, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  nav: { flexDirection: 'row', gap: 12, marginTop: 20 },
});