import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, useWindowDimensions } from 'react-native';
import { useAuthContext } from '@contexts/AuthContext';
import { getAllPlacesToEat } from '@services/placesToEat/getAllPlacesToEat';
import { getAllPlacesToFun } from '@services/placesToFun/getAllPlacesToFun';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import PlaceCard from './PlaceCard';
import { ActivityIndicator } from 'react-native-paper';
import { useAuthState } from "@hooks/useAuth";

interface UnifiedViewProps {
  onShowOnMap?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
  refreshControl?: React.ReactElement<any>;
}

export default function UnifiedView({ onShowOnMap, refreshControl }: UnifiedViewProps) {
  const { session, isAuthenticated } = useAuthState();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [places, setPlaces] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadPlaces();
    }
  }, [isAuthenticated]);

  const loadPlaces = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Cargando lugares para vista unificada...');
      const [placesToEatResponse, placesToFunResponse] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      
      const placesToEat = placesToEatResponse.data || [];
      const placesToFun = placesToFunResponse.data || [];
      
      // Filtrar lugares que tengan la estructura correcta
      const validPlacesToEat = placesToEat.filter(place => place && place.id && place.name);
      const validPlacesToFun = placesToFun.filter(place => place && place.id && place.name);
      
      const allPlaces = [...validPlacesToEat, ...validPlacesToFun];
      
      console.log(`Lugares cargados para vista unificada: ${allPlaces.length} (${validPlacesToEat.length} comida, ${validPlacesToFun.length} diversión)`);
      setPlaces(allPlaces);
    } catch (error) {
      console.error('Error al cargar lugares para vista unificada:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los lugares.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredPlaces = () => {
    if (selectedCategory === 'all') {
      return places;
    }
    return places.filter(place => {
      if (selectedCategory === 'eat') {
        return 'placeCategoryToEat' in place;
      } else if (selectedCategory === 'fun') {
        return 'placeCategoryToFun' in place;
      }
      return true;
    });
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') {
      return places.length;
    }
    return places.filter(place => {
      if (category === 'eat') {
        return 'placeCategoryToEat' in place;
      } else if (category === 'fun') {
        return 'placeCategoryToFun' in place;
      }
      return false;
    }).length;
  };

  const categories = [
    { key: 'all', label: 'Todos', emoji: '🏠' },
    { key: 'eat', label: 'Comida', emoji: '🍽️' },
    { key: 'fun', label: 'Diversión', emoji: '🎮' },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>
          Cargando lugares...
        </Text>
      </View>
    );
  }

  const filteredPlaces = getFilteredPlaces();

  return (
    <View style={styles.container}>
      {/* Filtros de categoría */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.filterButton,
                selectedCategory === category.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text style={styles.filterEmoji}>{category.emoji}</Text>
              <Text style={[
                styles.filterText,
                selectedCategory === category.key && styles.filterTextActive
              ]}>
                {category.label}
              </Text>
              <Text style={[
                styles.filterCount,
                selectedCategory === category.key && styles.filterCountActive
              ]}>
                {getCategoryCount(category.key)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de lugares */}
      <ScrollView 
        style={styles.placesContainer}
        contentContainerStyle={[
          styles.placesContent,
          isMobile && styles.placesContentMobile
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {filteredPlaces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se encontraron lugares en esta categoría
            </Text>
          </View>
        ) : (
          <View style={styles.placesGrid}>
            {filteredPlaces
              .filter(place => place && place.id && place.name) // Validación adicional
              .map((place) => (
                <View key={place.id} style={styles.cardWrapper}>
                  <PlaceCard 
                    place={place} 
                    onShowOnMap={onShowOnMap}
                  />
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: '#64748b',
  },
  filtersContainer: {
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 6,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  filterCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterCountActive: {
    color: '#1e40af',
    backgroundColor: '#ffffff',
  },
  placesContainer: {
    flex: 1,
  },
  placesContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para el FAB
  },
  placesContentMobile: {
    padding: 16,
    paddingBottom: 100,
  },
  placesGrid: {
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
}); 