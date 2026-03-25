import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InteractiveMap from '@components/mapa/InteractiveMap';
import PlaceCard from '@components/places/PlaceCard';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { Surface, Text as PaperText, ActivityIndicator } from 'react-native-paper';
import { useFavorites } from '@hooks/useFavorites';
import { useAuthState } from "@hooks/useAuth";
import { usePlaces } from "@hooks/usePlaces";

// HomeScreen: Pantalla principal que muestra el mapa interactivo y la lista de lugares
export default function HomeScreen() {
  // Contexto de autenticación y navegación
  const { session, isLoading, isAuthenticated } = useAuthState();
  const navigation = useNavigation();

  // Hook personalizado para cargar lugares
  const { places, isLoading: isLoadingPlaces, loadPlaces } = usePlaces();

  // Estados locales para controlar la UI
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null); // Centro del mapa
  const [mapZoom, setMapZoom] = useState<number | null>(null); // Zoom del mapa
  const [refreshing, setRefreshing] = useState(false); // Estado para Pull to Refresh

  // Redirigir si no hay sesión activa
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
    }
  }, [isAuthenticated, isLoading, navigation]);

  // Función para Pull to Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPlaces();
    } catch (error) {
      console.error('Error durante el refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Si está cargando o no hay sesión, no mostrar nada
  if (isLoading || !isAuthenticated) return null;

  // Callback cuando se cargan los lugares desde el mapa (como respaldo)
  const handlePlacesLoaded = (loadedPlaces: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => {
    // Solo actualizar si no tenemos lugares cargados o si el mapa tiene más lugares
    if (places.length === 0 || loadedPlaces.length > places.length) {
      console.log(`Actualizando lugares desde el mapa: ${loadedPlaces.length}`);
      // No necesitamos setPlaces aquí porque el hook usePlaces maneja el estado
    }
  };

  // Callback para centrar el mapa en un lugar seleccionado
  const handleShowOnMap = (place: any) => {
    setMapCenter({ latitude: place.latitude, longitude: place.longitude });
    setMapZoom(17);
  };

  // Callback cuando se crea un lugar exitosamente
  const handlePlaceCreated = () => {
    console.log('Lugar creado, actualizando lista de lugares...');
    // Recargar lugares en la lista
    loadPlaces();
  };

  return (
    <View style={styles.container}>
      {/* Mapa interactivo en la parte superior */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          style={styles.map}
          onPlacesLoaded={handlePlacesLoaded}
          onPlaceCreated={handlePlaceCreated}
          center={mapCenter}
          zoom={mapZoom}
        />
      </View>

      {/* Lista de lugares en la parte inferior */}
      <View style={styles.listSection}>
        {isLoadingPlaces ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e40af" />
            <PaperText style={styles.loadingText}>
              Cargando lugares...
            </PaperText>
          </View>
        ) : places.length > 0 ? (
          <ScrollView 
            style={styles.placesScroll}
            contentContainerStyle={styles.placesContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#1e40af"
                title="Actualizando lugares..."
                titleColor="#64748b"
              />
            }
          >
            <View style={styles.placesGrid}>
              {places.map((place) => (
                <View key={place.id} style={styles.cardWrapper}>
                  <PlaceCard place={place} onShowOnMap={handleShowOnMap} />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <PaperText style={styles.emptyText}>
              No se encontraron lugares
            </PaperText>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadPlaces}
            >
              <PaperText style={styles.retryButtonText}>
                Reintentar
              </PaperText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapContainer: {
    height: '50%',
    backgroundColor: '#f1f5f9',
  },
  map: {
    flex: 1,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  placesScroll: {
    flex: 1,
  },
  placesContent: {
    paddingBottom: 20,
  },
  placesGrid: {
    gap: 12,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#64748b',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
}); 