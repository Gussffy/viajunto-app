import { Tabs } from 'expo-router';
import { View, Pressable, StyleSheet, Text, Platform } from 'react-native';
import { Home, Route, UserRound } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, shadows } from '@/src/theme';

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const icons = [Home, Route, UserRound];
  const labels = ['Início', 'Viagens', 'Perfil'];
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const Icon = icons[index] ?? Home;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} accessibilityLabel={labels[index]}>
              <View style={[styles.pill, isFocused && styles.pillActive]}>
                <Icon size={20} color={isFocused ? colors.white : colors.textMuted} strokeWidth={2.2} />
                {isFocused ? <Text style={styles.label}>{labels[index]}</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="minhas-viagens" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 8, backgroundColor: 'transparent' },
  bar: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 28, padding: 6, borderWidth: 1, borderColor: colors.border, ...shadows.float },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 22 },
  pillActive: { backgroundColor: colors.primaryDeep },
  label: { color: colors.white, fontSize: 13, fontWeight: '700' },
});
