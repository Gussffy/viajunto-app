import { useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Send, MapPin } from 'lucide-react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { MOCK_RIDES } from '@/src/data/mock';

type Msg = { id: string; text: string; mine: boolean; time: string };
const QUICK = ['Estou no ponto de encontro', 'Chego em 5 min', 'Pode me ligar?', 'Já estou a caminho'];

export default function ChatScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = useMemo(() => MOCK_RIDES.find((r) => r.id === rideId) ?? MOCK_RIDES[0], [rideId]);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: '1', text: 'Olá! Reserva confirmada para hoje.', mine: false, time: '07:10' },
    { id: '2', text: 'Combinado, obrigado!', mine: true, time: '07:12' },
  ]);
  const listRef = useRef<FlatList>(null);

  const send = (value?: string) => {
    const t = (value ?? text).trim();
    if (!t) return;
    const msg: Msg = { id: String(Date.now()), text: t, mine: true, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMsgs((m) => [...m, msg]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar"><ArrowLeft size={22} color={colors.text} strokeWidth={2.2} /></Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{ride.driver.name}</Text>
            <View style={styles.routeRow}><MapPin size={12} color={colors.textMuted} strokeWidth={2} /><Text style={styles.route} numberOfLines={1}>{ride.origin} → {ride.destination}</Text></View>
          </View>
        </Animated.View>

        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, item.mine && styles.bubbleTextMine]}>{item.text}</Text>
              <Text style={[styles.time, item.mine && styles.timeMine]}>{item.time}</Text>
            </View>
          )}
        />

        <View style={styles.quickWrap}>
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={QUICK} keyExtractor={(q) => q} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
            renderItem={({ item }) => <Pressable onPress={() => send(item)} style={styles.quickChip} accessibilityRole="button"><Text style={styles.quickText}>{item}</Text></Pressable>} />
        </View>

        <View style={styles.composer}>
          <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Escreva uma mensagem..." placeholderTextColor={colors.textSoft} multiline accessibilityLabel="Mensagem" />
          <Pressable onPress={() => send()} style={[styles.sendBtn, !text.trim() && { opacity: 0.5 }]} accessibilityRole="button" accessibilityLabel="Enviar">
            <Send size={18} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.bodyStrong, color: colors.text },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  route: { ...typography.caption, color: colors.textMuted, flex: 1 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: colors.primaryDeep, borderBottomRightRadius: 6 },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 6 },
  bubbleText: { ...typography.body, color: colors.text },
  bubbleTextMine: { color: colors.white },
  time: { fontSize: 11, color: colors.textSoft, marginTop: 4, alignSelf: 'flex-end' },
  timeMine: { color: 'rgba(255,255,255,0.7)' },
  quickWrap: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  quickChip: { backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  quickText: { ...typography.caption, color: colors.primaryDeep, fontWeight: '600' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, paddingTop: 8, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, minHeight: 44, maxHeight: 110, backgroundColor: colors.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: colors.text, borderWidth: 1, borderColor: colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryDeep, alignItems: 'center', justifyContent: 'center', ...shadows.card },
});