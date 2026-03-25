import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '@hooks/useFavorites';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getCategoryEmoji, getCategoryName } from '@utils/mapIcons';

interface PlaceMainCardProps {
  place: PlacesToEatResponseDto | PlacesToFunResponseDto;
  onShowOnMap?: () => void;
}

export default function PlaceMainCard({ place, onShowOnMap }: PlaceMainCardProps) {
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();

  const handleFavoriteClick = async () => {
    await toggleFavorite(place);
  };

  const getCategoryDisplayName = () => {
    if ('placeCategoryToEat' in place && place.placeCategoryToEat) {
      return getCategoryName(place.placeCategoryToEat);
    } else if ('placeCategoryToFun' in place && place.placeCategoryToFun) {
      return getCategoryName(place.placeCategoryToFun);
    }
    return 'Sin categoría';
  };

  const getCategoryDisplayEmoji = () => {
    if ('placeCategoryToEat' in place && place.placeCategoryToEat) {
      return getCategoryEmoji(place.placeCategoryToEat);
    } else if ('placeCategoryToFun' in place && place.placeCategoryToFun) {
      return getCategoryEmoji(place.placeCategoryToFun);
    }
    return '📍';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'abierto':
        return { color: '#15803d', backgroundColor: '#dcfce7' };
      case 'closed':
      case 'cerrado':
        return { color: '#dc2626', backgroundColor: '#fee2e2' };
      case 'maintenance':
      case 'mantenimiento':
        return { color: '#a16207', backgroundColor: '#fef3c7' };
      default:
        return { color: '#374151', backgroundColor: '#f3f4f6' };
    }
  };

  const favorite = isFavorite(place);

  return (
    <View style={styles.container}>
      {/* Header con nombre y botón de favorito */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.categoryEmoji}>{getCategoryDisplayEmoji()}</Text>
          <Text style={styles.title}>{place.name}</Text>
        </View>
      </View>

      {/* Información del lugar */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Categoría:</Text>
          <Text style={styles.infoValue}>{getCategoryDisplayName()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <Text style={[
            styles.statusBadge,
            getStatusColor(place.status)
          ]}>
            {place.status}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dirección:</Text>
          <Text style={styles.infoValue}>{place.address}</Text>
        </View>

        {place.qualification && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Calificación:</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{place.qualification}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Botón para mostrar en mapa */}
      {onShowOnMap && (
        <TouchableOpacity
          style={styles.mapButton}
          onPress={onShowOnMap}
        >
          <Text style={styles.mapButtonText}>🗺️ Ver en mapa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    minWidth: 80,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#fbbf24',
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#1e293b',
  },
  mapButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 