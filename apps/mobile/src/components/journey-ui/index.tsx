import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { ui } from './style';

export { ui } from './style';

type Icon = keyof typeof Ionicons.glyphMap;

export function RoadBanner({ title, description, compact }: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <ImageBackground source={require('../../../assets/bahia-road.jpg')} style={[ui.banner, compact && ui.bannerCompact]} imageStyle={ui.bannerImage}>
      <View pointerEvents="none" style={ui.bannerShade} />
      <Text accessibilityRole="header" style={ui.bannerTitle}>{title}</Text>
      <Text style={ui.bannerText}>{description}</Text>
    </ImageBackground>
  );
}

export function IconButton({ icon, label, onPress }: { icon: Icon; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => [ui.iconButton, pressed && ui.pressed]}>
      <Ionicons name={icon} size={21} color={colors.blue} />
    </Pressable>
  );
}

export function PageHeading({ title, description, action }: { title: string; description?: string; action?: React.JSX.Element }) {
  return (
    <View style={ui.heading}>
      <View style={ui.grow}>
        <Text accessibilityRole="header" style={ui.title}>{title}</Text>
        {description && <Text style={ui.description}>{description}</Text>}
      </View>
      {action}
    </View>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: Icon;
  title: string;
  description?: string;
  action?: React.JSX.Element;
}) {
  return (
    <View style={ui.empty} accessibilityLiveRegion="polite">
      <View style={ui.emptyIcon}><Ionicons name={icon} size={26} color={colors.blue} /></View>
      <Text style={ui.emptyTitle}>{title}</Text>
      {description && <Text style={ui.emptyText}>{description}</Text>}
      {action}
    </View>
  );
}

export function RouteStops({ origin, destination }: { origin: string; destination: string }) {
  return (
    <View style={ui.route}>
      <View style={ui.stop}>
        <View style={ui.originDot} />
        <Text style={ui.stopText}>{origin}</Text>
      </View>
      <View style={ui.connector} />
      <View style={ui.stop}>
        <View style={ui.destinationDot} />
        <Text style={ui.stopText}>{destination}</Text>
      </View>
    </View>
  );
}

export function ChoiceRow({ icon, label, value, onPress }: { icon: Icon; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label + ', ' + value} onPress={onPress}
      style={({ pressed }) => [ui.choice, pressed && ui.pressed]}>
      <Ionicons name={icon} size={20} color={colors.blue} />
      <View style={ui.grow}>
        <Text style={ui.choiceLabel}>{label}</Text>
        <Text style={ui.choiceValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.muted} />
    </Pressable>
  );
}

export function Stepper({ label, value, maximum, onChange }: {
  label: string;
  value: number;
  maximum: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={ui.stepper}>
      <Text style={[ui.choiceValue, ui.grow]}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={'Diminuir ' + label.toLocaleLowerCase('pt-BR')} disabled={value <= 1}
        onPress={() => onChange(value - 1)} style={({ pressed }) => [ui.iconButton, (value <= 1 || pressed) && ui.pressed]}>
        <Ionicons name="remove" size={20} color={colors.blue} />
      </Pressable>
      <Text accessibilityLiveRegion="polite" style={ui.stepperValue}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={'Aumentar ' + label.toLocaleLowerCase('pt-BR')} disabled={value >= maximum}
        onPress={() => onChange(value + 1)} style={({ pressed }) => [ui.iconButton, (value >= maximum || pressed) && ui.pressed]}>
        <Ionicons name="add" size={20} color={colors.blue} />
      </Pressable>
    </View>
  );
}
