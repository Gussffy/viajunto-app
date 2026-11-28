import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native';

const ReduceMotion = createContext(true);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduceMotion(preference.matches);
      update();
      preference.addEventListener('change', update);
      return () => preference.removeEventListener('change', update);
    }
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  return <ReduceMotion.Provider value={reduceMotion}>{children}</ReduceMotion.Provider>;
}

export function useReduceMotion() {
  return useContext(ReduceMotion);
}

export function Reveal({ children, changeKey, active = true, style }: {
  children: ReactNode;
  changeKey?: string | number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReduceMotion();
  const motion = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active || reduced) {
      motion.setValue(1);
      return;
    }

    motion.setValue(0);
    const transition = Animated.timing(motion, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    transition.start();
    return () => transition.stop();
  }, [active, changeKey, motion, reduced]);

  return (
    <Animated.View style={[style, {
      opacity: motion.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] }),
      transform: [{ translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
    }]}>
      {children}
    </Animated.View>
  );
}
