import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type ChatPlaceholderScreenProps = { tripId: string; otherUserId: string; onBack: () => void };

export function ChatPlaceholderScreen({ tripId, otherUserId, onBack }: ChatPlaceholderScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onBack} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </Pressable>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginLeft: 8 }}>Conversa</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="chatbubbles-outline" size={46} color={colors.blue} />
        </View>
        <Text style={{ color: colors.text, fontSize: 21, fontWeight: '900' }}>Em desenvolvimento</Text>
        <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10 }}>
          O chat entre motorista e passageiro estará disponível em breve.
        </Text>
        <Pressable accessibilityRole="button" onPress={onBack} style={{ minHeight: 48, minWidth: 140, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue, marginTop: 24 }}>
          <Text style={{ color: colors.white, fontWeight: '800' }}>Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
