import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppMode } from '@/src/context/ModeContext';
import { Car, Check, ChevronRight, LogOut, ShieldCheck, Star, UserRound } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { AnimatedButton, FadeIn, InputField, RoleSwitcher } from '@/src/components';

const MENU = [
  { key: 'dados', label: 'Dados pessoais', description: 'Nome, e-mail e telefone ficam vinculados à sua conta verificada.' },
  { key: 'seguranca', label: 'Segurança', description: 'Senha, sessões ativas e verificação em duas etapas.' },
  { key: 'ajuda', label: 'Ajuda', description: 'Central de suporte do ViaJunto para dúvidas sobre viagens.' },
];

export default function PerfilScreen() {
  const { mode, setMode } = useAppMode();
  const role = mode === 'dar' ? 'motorista' : 'passageiro';
  const setRole = (r: 'passageiro' | 'motorista') => setMode(r === 'motorista' ? 'dar' : 'pedir');
  const [vehicle, setVehicle] = useState('Honda Civic');
  const [color, setColor] = useState('Prata');
  const [plate, setPlate] = useState('PKJ-4B21');
  const [saved, setSaved] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={{ width: 40 }} />
        </FadeIn>

        <FadeIn delay={40} style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>PS</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Patrick Silva</Text>
            <Text style={styles.email}>patrick@viajunto.app</Text>
            <View style={styles.badges}>
              <View style={styles.badge}><ShieldCheck size={13} color={colors.success} strokeWidth={2.2} /><Text style={styles.badgeText}>Verificado</Text></View>
              <View style={styles.badge}><Star size={13} color="#E0A100" fill="#E0A100" strokeWidth={0} /><Text style={styles.badgeText}>4.9</Text></View>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={80} style={styles.card}>
          <Text style={styles.cardTitle}>Modo de uso</Text>
          <Text style={styles.cardSub}>Alterne rapidamente entre passageiro e motorista.</Text>
          <RoleSwitcher value={role} onChange={setRole} options={[
            { value: 'passageiro', label: 'Passageiro', icon: <UserRound size={16} color={role === 'passageiro' ? colors.white : colors.primaryDeep} strokeWidth={2.2} /> },
            { value: 'motorista', label: 'Motorista', icon: <Car size={16} color={role === 'motorista' ? colors.white : colors.primaryDeep} strokeWidth={2.2} /> },
          ]} />
        </FadeIn>

        {role === 'motorista' ? (
          <FadeIn delay={40} style={styles.card}>
            <Text style={styles.cardTitle}>Meu veículo</Text>
            <Text style={styles.cardSub}>Essas informações aparecem para passageiros.</Text>
            <InputField label="Modelo" value={vehicle} onChangeText={(v) => { setVehicle(v); setSaved(false); }} placeholder="Ex: Honda Civic" icon={<Car size={18} color={colors.textSoft} strokeWidth={2} />} />
            <InputField label="Cor" value={color} onChangeText={(v) => { setColor(v); setSaved(false); }} placeholder="Ex: Prata" />
            <InputField label="Placa" value={plate} onChangeText={(v) => { setPlate(v); setSaved(false); }} placeholder="Ex: ABC-1D23" autoCapitalize="characters" />
            <AnimatedButton label="Salvar veículo" variant="secondary" onPress={() => setSaved(true)} />
            {saved ? (
              <View style={styles.savedRow} accessibilityLiveRegion="polite">
                <Check size={15} color={colors.success} strokeWidth={2.5} />
                <Text style={styles.savedText}>Dados do veículo salvos.</Text>
              </View>
            ) : null}
          </FadeIn>
        ) : null}

        <FadeIn delay={120} style={styles.card}>
          <Text style={styles.cardTitle}>Conta</Text>
          {MENU.map((item, i) => {
            const open = openMenu === item.key;
            return (
              <View key={item.key}>
                <Pressable
                  onPress={() => setOpenMenu(open ? null : item.key)}
                  style={[styles.menuRow, i === MENU.length - 1 && !open && { borderBottomWidth: 0, paddingBottom: 0 }]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ expanded: open }}
                >
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={18} color={colors.textSoft} strokeWidth={2} style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }} />
                </Pressable>
                {open ? <Text style={styles.menuDescription}>{item.description}</Text> : null}
              </View>
            );
          })}
        </FadeIn>

        <FadeIn delay={160}>
          <AnimatedButton label="Sair da conta" variant="danger" onPress={() => router.replace('/acesso')} icon={<LogOut size={18} color={colors.white} strokeWidth={2.2} />} />
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 16 },
  headerTitle: { ...typography.h3, color: colors.text },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.primaryDeep, borderRadius: radius.xl, padding: 18, marginBottom: 14, ...shadows.float },
  avatar: { width: 60, height: 60, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  name: { ...typography.h3, color: colors.white },
  email: { ...typography.small, color: 'rgba(255,255,255,0.78)', marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14, ...shadows.card },
  cardTitle: { ...typography.h3, color: colors.text },
  cardSub: { ...typography.small, color: colors.textMuted, marginTop: 4, marginBottom: 14 },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { ...typography.body, color: colors.text, fontWeight: '500' },
  menuDescription: { ...typography.small, color: colors.textMuted, paddingBottom: 14, lineHeight: 19 },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  savedText: { ...typography.small, color: colors.successText, fontWeight: '600' },
});
