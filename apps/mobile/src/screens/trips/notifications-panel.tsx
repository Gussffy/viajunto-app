import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, IconButton, PageHeading } from '../../components/journey-ui';
import { PrimaryButton } from '../../components/primary-button';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/styles';
import type { AppNotification } from '../../types';
import { tripsStyles as journey } from './style';

type NotificationsPanelProps = {
  notices: AppNotification[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
};

const notificationText: Record<string, string> = {
  new_request: 'Novo pedido de vaga', request_accepted: 'Seu pedido foi aceito',
  request_refused: 'Seu pedido foi recusado', request_cancelled: 'Um pedido foi cancelado',
  trip_cancelled: 'A viagem foi cancelada', trip_started: 'A viagem foi iniciada',
  trip_finished: 'A viagem foi finalizada', new_rating: 'Você recebeu uma nova avaliação',
};

export function NotificationsPanel({ notices, loading, error, onRetry, onClose }: NotificationsPanelProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <PageHeading title="Notificações" action={<IconButton icon="close" label="Fechar notificações" onPress={onClose} />} />
        {loading ? <ActivityIndicator color={colors.blue} accessibilityLabel="Carregando notificações" /> : (
          <>
            {error && <EmptyState icon="cloud-offline-outline" title="Notificações indisponíveis" description={error}
              action={<PrimaryButton label="Tentar novamente" onPress={onRetry} />} />}
            {notices.map((notice) => (
              <View key={notice.id} style={[styles.formCard, !notice.read && journey.unread]}>
                <Text style={styles.detailValue}>{notificationText[notice.type] ?? 'Atualização da viagem'}</Text>
                {notice.trip && <Text style={styles.switchCaption}>{notice.trip.origem} → {notice.trip.destino}</Text>}
                <Text style={styles.switchCaption}>{new Date(notice.createdAt).toLocaleString('pt-BR')}</Text>
              </View>
            ))}
            {!error && notices.length === 0 && <EmptyState icon="notifications-outline" title="Nenhuma notificação" />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
