import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme';

const LOGO = require('@/assets/images/logo.png');

type AccessMode = 'pedir' | 'dar';

export default function AcessoScreen() {
  const handleSelect = (mode: AccessMode) => {
    router.push({ pathname: '/login', params: { mode } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(550).delay(60)} style={styles.hero}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="ViaJunto" />
          <Text style={styles.title}>Como você quer usar o ViaJunto?</Text>
          <Text style={styles.subtitle}>Escolha se você quer pedir uma carona ou oferecer carona.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(550).delay(140)} style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pedir carona"
            onPress={() => handleSelect('pedir')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <View style={styles.iconBadge}>
              <Ionicons name="hand-left-outline" size={22} color={colors.primaryDeep} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.primaryButtonText}>Pedir carona</Text>
              <Text style={styles.primaryButtonHint}>Encontre uma carona disponível</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dar carona"
            onPress={() => handleSelect('dar')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressedSecondary]}
          >
            <View style={[styles.iconBadge, styles.iconBadgeSecondary]}>
              <Ionicons name="car-sport-outline" size={22} color={colors.primaryDeep} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.secondaryButtonText}>Dar carona</Text>
              <Text style={styles.secondaryButtonHint}>Ofereça assentos na sua viagem</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primaryDeep} />
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  logo: {
    width: '72%',
    maxWidth: 280,
    aspectRatio: 1,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
  actions: {
    gap: 14,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  primaryButton: {
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: colors.primaryDeep,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondaryButton: {
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primaryDeep,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBadgeSecondary: {
    backgroundColor: '#F0F5FF',
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  primaryButtonHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  secondaryButtonText: {
    color: colors.primaryDeep,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButtonHint: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  pressedSecondary: {
    backgroundColor: '#F5F8FF',
  },
});
