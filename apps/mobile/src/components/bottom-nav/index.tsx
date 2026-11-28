import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Tab, User } from '../../types';
import { colors } from '../../theme/colors';
import { ui } from '../journey-ui';
import { nav } from './style';

type BottomNavProps = { tab: Tab; user: User; badgeCount?: number; onChange: (tab: Tab) => void };

export function BottomNav({ tab, user, badgeCount = 0, onChange }: BottomNavProps) {
  const roleAction = user.role === 'passageiro'
    ? { key: 'buscar' as const, label: 'Buscar', icon: 'search' as const }
    : { key: 'publicar' as const, label: 'Publicar', icon: 'add-circle' as const };
  const items = [
    { key: 'inicio', label: 'Início', icon: 'home' },
    roleAction,
    { key: 'minhas', label: 'Minhas viagens', icon: 'calendar' },
    { key: 'perfil', label: 'Perfil', icon: 'person' },
  ] as const;

  return (
    <View style={nav.bar}>
      <View style={[ui.container, nav.inner]}>
        {items.map((item) => {
          const active = tab === item.key;
          const count = item.key === 'minhas' ? badgeCount : 0;
          const updates = user.role === 'motorista'
            ? count === 1 ? 'pedido pendente' : 'pedidos pendentes'
            : count === 1 ? 'notificação' : 'notificações';
          return (
            <Pressable key={item.key} accessibilityRole="tab" accessibilityState={{ selected: active }}
              accessibilityLabel={count ? `${item.label}, ${count} ${updates}` : item.label}
              onPress={() => onChange(item.key)} style={({ pressed }) => [nav.item, pressed && ui.pressed]}>
              <View style={[nav.icon, active && nav.active]}>
                <Ionicons name={active ? item.icon : `${item.icon}-outline`} size={22} color={active ? colors.blue : colors.muted} />
                {count > 0 && <View style={nav.badge}><Text style={nav.badgeText}>{count > 99 ? '99+' : count}</Text></View>}
              </View>
              <Text style={[nav.label, active && nav.activeText]}>{item.key === 'minhas' ? 'Viagens' : item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
