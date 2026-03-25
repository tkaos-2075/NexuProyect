import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '@hooks/useFavorites';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getCategoryEmoji, getCategoryName } from '@utils/mapIcons';

interface PlaceCardProps {
  place: PlacesToEatResponseDto | PlacesToFunResponseDto;
  compact?: boolean;
  onShowOnMap?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function PlaceCard({ place, compact = false, onShowOnMap }: PlaceCardProps) {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();

  // Validación para asegurar que place existe y tiene las propiedades necesarias
  if (!place || !place.id) {
    console.warn('PlaceCard: place es undefined o no tiene id:', place);
    return null;
  }

  const handleFavoriteClick = async () => {
    try {
      await toggleFavorite(place);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  const handleCardClick = () => {
    const placeType = 'placeCategoryToEat' in place ? 'eat' : 'fun';
    // @ts-ignore
    navigation.navigate('PlaceDetails', { placeType, placeId: place.id });
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
    if (!status) return { color: '#374151', backgroundColor: '#f3f4f6' };
    
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

  // Obtener hasta 2 etiquetas y preparar el string
  const labelNames = (place.labelNames || []) as string[];
  let labelsDisplay = '';
  if (labelNames.length > 0) {
    labelsDisplay = labelNames.slice(0, 2).join(', ');
    if (labelNames.length > 2) {
      labelsDisplay += ',...';
    }
  }

  // Vista compacta
  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactCard}
        onPress={handleCardClick}
        activeOpacity={0.8}
      >
        <View style={styles.compactHeader}>
          <View style={styles.compactTitleContainer}>
            <Text style={styles.compactEmoji}>{getCategoryDisplayEmoji()}</Text>
            <Text 
              style={styles.compactTitle}
              numberOfLines={1}
            >
              {place.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFavoriteClick}
            disabled={favoritesLoading}
            style={styles.favoriteButton}
          >
            <Text style={[
              styles.favoriteIcon,
              { 
                color: favorite ? '#fbbf24' : '#e5e7eb',
                opacity: favoritesLoading ? 0.5 : 1
              }
            ]}>
              {favoritesLoading ? '⏳' : (favorite ? '★' : '☆')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text 
          style={styles.compactAddress}
          numberOfLines={1}
        >
          {place.address || 'Sin dirección'}
        </Text>
        
        <View style={styles.compactFooter}>
          <Text style={[
            styles.statusBadge,
            getStatusColor(place.status || 'Desconocido')
          ]}>
            {place.status || 'Desconocido'}
          </Text>
          {place.qualification && (
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>
                {place.qualification}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Vista normal
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handleCardClick}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text 
          style={styles.title}
          numberOfLines={1}
        >
          {place.name}
        </Text>
        <TouchableOpacity
          onPress={handleFavoriteClick}
          disabled={favoritesLoading}
          style={styles.favoriteButton}
        >
          <Text style={[
            styles.favoriteIconLarge,
            { 
              color: favorite ? '#fbbf24' : '#e5e7eb',
              opacity: favoritesLoading ? 0.5 : 1
            }
          ]}>
            {favoritesLoading ? '⏳' : (favorite ? '★' : '☆')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoGrid}>
        {/* Estado */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Estado:
          </Text>
          <Text style={[
            styles.statusBadge,
            getStatusColor(place.status || 'Desconocido')
          ]}>
            {place.status || 'Desconocido'}
          </Text>
        </View>
        
        {/* Categoría */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Categoría:
          </Text>
          <Text style={styles.infoValue}>
            {getCategoryDisplayName()}
          </Text>
        </View>
        
        {/* Etiquetas */}
        {labelsDisplay && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Etiquetas:
            </Text>
            <Text style={styles.labelsText}>
              {labelsDisplay}
            </Text>
          </View>
        )}
        
        {/* Dirección */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Dirección:
          </Text>
          <Text 
            style={styles.infoValue}
            numberOfLines={2}
          >
            {place.address || 'Sin dirección'}
          </Text>
        </View>
      </View>

      {/* Botón Ver en mapa */}
      {onShowOnMap && (
        <TouchableOpacity
          onPress={() => onShowOnMap(place)}
          style={styles.mapButton}
        >
          <Text style={styles.mapButtonText}>🗺️ Ver en mapa</Text>
        </TouchableOpacity>
      )}

      {/* Indicador de clic */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Haz clic para ver más detalles
        </Text>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos para vista compacta
  compactCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compactTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  compactEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  compactTitle: {
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
    color: '#232946',
  },
  compactAddress: {
    fontSize: 12,
    marginBottom: 4,
    color: '#374151',
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  
  // Estilos para vista normal
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 150,
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    flex: 1,
    marginRight: 8,
    color: '#232946',
  },
  favoriteButton: {
    paddingHorizontal: 4,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  favoriteIconLarge: {
    fontSize: 20,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
    minWidth: 60,
    color: '#374151',
  },
  infoValue: {
    fontSize: 12,
    flex: 1,
    color: '#232946',
  },
  labelsText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    color: '#2563eb',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
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
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#374151',
  },
  mapButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#06b6d4',
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 10,
    color: '#64748b',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#3b82f6',
  },
}); 