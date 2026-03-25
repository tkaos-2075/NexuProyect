import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';

interface PlanCardProps {
  plan: PlansResponseDto;
  onPress?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress }) => {
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para obtener el emoji de visibilidad
  const getVisibilityEmoji = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return '🌍';
      case 'PRIVATE':
        return '🔒';
      case 'FRIENDS':
        return '👥';
      default:
        return '📋';
    }
  };

  // Función para obtener el color de visibilidad
  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return '#10b981';
      case 'PRIVATE':
        return '#ef4444';
      case 'FRIENDS':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header con título y visibilidad */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plan.name}</Text>
          <View style={[
            styles.visibilityBadge,
            { backgroundColor: getVisibilityColor(plan.visibility) + '20' }
          ]}>
            <Text style={[
              styles.visibilityText,
              { color: getVisibilityColor(plan.visibility) }
            ]}>
              {getVisibilityEmoji(plan.visibility)} {plan.visibility}
            </Text>
          </View>
        </View>
      </View>

      {/* Descripción */}
      {plan.description && (
        <Text style={styles.description} numberOfLines={2}>
          {plan.description}
        </Text>
      )}

      {/* Fechas */}
      <View style={styles.datesContainer}>
        {plan.startDate && (
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>📅 Inicio</Text>
            <Text style={styles.dateValue}>{formatDate(plan.startDate)}</Text>
          </View>
        )}
        {plan.endDate && (
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>🏁 Fin</Text>
            <Text style={styles.dateValue}>{formatDate(plan.endDate)}</Text>
          </View>
        )}
      </View>

      {/* Información adicional */}
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          {plan.placesId && plan.placesId.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📍</Text>
              <Text style={styles.statText}>{plan.placesId.length} lugar{plan.placesId.length !== 1 ? 'es' : ''}</Text>
            </View>
          )}
          {plan.usersId && plan.usersId.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👤</Text>
              <Text style={styles.statText}>{plan.usersId.length} participante{plan.usersId.length !== 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
        
        {/* Fecha de creación */}
        {plan.createdDate && (
          <Text style={styles.createdDate}>
            Creado: {formatDate(plan.createdDate)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  visibilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visibilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  datesContainer: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  createdDate: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default PlanCard; 