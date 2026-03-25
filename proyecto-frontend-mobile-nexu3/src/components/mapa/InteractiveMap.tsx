import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { Surface, Button } from 'react-native-paper';
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { getAllPlacesToEat } from "@services/placesToEat/getAllPlacesToEat";
import { getAllPlacesToFun } from "@services/placesToFun/getAllPlacesToFun";
import GoogleMap from './GoogleMap';
import MapMarkers from './MapMarkers';
import { useNavigation } from '@react-navigation/native';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';
import { useAuthState } from "@hooks/useAuth";

interface InteractiveMapProps {
  style?: any;
  onPlacesLoaded?: (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => void;
  center?: { latitude: number; longitude: number } | null;
  zoom?: number | null;
  onPlaceCreated?: () => void;
}

function isPlaceToEat(place: any): place is PlacesToEatResponseDto {
  return 'placeCategoryToEat' in place;
}
function isPlaceToFun(place: any): place is PlacesToFunResponseDto {
  return 'placeCategoryToFun' in place;
}

export default function InteractiveMap({ style, onPlacesLoaded, center, zoom, onPlaceCreated }: InteractiveMapProps) {
  const { session, isAuthenticated } = useAuthState();
  const navigation = useNavigation();
  
  // Estado del mapa
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({ latitude: -12.139066, longitude: -77.015552 }); // UTEC por defecto
  const [mapZoom, setMapZoom] = useState(16.8);
  const [shouldForceCenter, setShouldForceCenter] = useState(false);
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  
  // Estado de lugares
  const [loadedPlaces, setLoadedPlaces] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto) | null>(null);
  
  // Estado de selección de lugar
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSelectingPlace, setIsSelectingPlace] = useState(false);
  
  // Referencias
  const mapRef = useRef<any>(null);
  const isSelectingPlaceRef = useRef(isSelectingPlace);

  // Actualizar ref cuando cambie el estado
  useEffect(() => {
    isSelectingPlaceRef.current = isSelectingPlace;
  }, [isSelectingPlace]);

  // Manejar props center y zoom
  useEffect(() => {
    if (center) {
      setMapCenter(center);
      setShouldForceCenter(true);
    }
  }, [center]);
  
  useEffect(() => {
    if (zoom) {
      setMapZoom(zoom);
      setShouldForceCenter(true);
    }
  }, [zoom]);

  // Cargar lugares cuando hay sesión
  useEffect(() => {
    if (isAuthenticated) {
      loadPlaces();
    }
  }, [isAuthenticated]);

  // Listener para detectar cuando se regresa de AddPlace
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Si estamos en modo selección, resetear y actualizar
      if (isSelectingPlace || selectedCoords) {
        refreshPlacesAndResetSelection();
      }
    });

    return unsubscribe;
  }, [navigation, isSelectingPlace, selectedCoords]);

  // Cargar lugares del backend
  const loadPlaces = async () => {
    if (isLoadingPlaces) return;
    
    setIsLoadingPlaces(true);
    try {
      console.log('Cargando lugares para el mapa...');
      const [placesToEatResponse, placesToFunResponse] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      
      const placesToEat = placesToEatResponse.data || [];
      const placesToFun = placesToFunResponse.data || [];
      const allPlaces = [...placesToEat, ...placesToFun];
      
      console.log(`Lugares cargados para el mapa: ${allPlaces.length}`);
      setLoadedPlaces(allPlaces);
      
      if (onPlacesLoaded) {
        onPlacesLoaded(allPlaces);
      }
    } catch (error) {
      console.error('Error al cargar lugares para el mapa:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los lugares en el mapa.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Función para actualizar lugares y resetear estado de selección
  const refreshPlacesAndResetSelection = async () => {
    console.log('Actualizando lugares y reseteando selección...');
    
    // Resetear estado de selección
    setIsSelectingPlace(false);
    setSelectedCoords(null);
    
    // Recargar lugares
    await loadPlaces();
    
    // Notificar al componente padre si es necesario
    if (onPlaceCreated) {
      onPlaceCreated();
    }
  };

  // Buscar ubicación
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const coords = data.results[0].geometry.location;
        const newCenter = { latitude: coords.lat, longitude: coords.lng };
        setMapCenter(newCenter);
        setMapZoom(15);
        setShouldForceCenter(true);
      } else {
        Alert.alert("Error", "No se encontró el lugar especificado");
      }
    } catch (error) {
      console.error("Error al buscar el lugar:", error);
      Alert.alert("Error", "Error al buscar el lugar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cuando el mapa está listo
  const handleMapReady = () => {
    console.log('Mapa listo');
  };

  // Manejar cambios en la región del mapa
  const handleRegionChange = (region: any) => {
    if (shouldForceCenter) {
      setShouldForceCenter(false);
    } else {
      setMapCenter(region);
      setMapZoom(region.longitudeDelta ? Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2) : 12);
    }
  };

  // Manejar clic en marcador
  const handleMarkerPress = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    console.log('Marcador presionado:', place.name);
    setSelectedPlace(place);
    
    // Centrar mapa en el lugar seleccionado
    setMapCenter({ latitude: place.latitude, longitude: place.longitude });
    setMapZoom(17);
    setShouldForceCenter(true);
    
    // Navegar a los detalles del lugar
    const placeType = 'placeCategoryToEat' in place ? 'eat' : 'fun';
    // @ts-ignore
    navigation.navigate('PlaceDetails', { placeType, placeId: place.id });
  };

  // Manejar clic en el mapa
  const handleMapClick = (coords: { latitude: number; longitude: number }) => {
    console.log('Mapa presionado en:', coords, 'isSelectingPlace:', isSelectingPlaceRef.current);
    
    if (isSelectingPlaceRef.current) {
      setSelectedCoords(coords);
      console.log('Coordenadas seleccionadas:', coords);
    }
  };

  // Manejar clic en botón de agregar lugar
  const handleAddPlaceClick = async () => {
    try {
      // Verificar permisos
      const userRole = await getRoleBasedOnToken();
      
      if (userRole !== 'USER' && userRole !== 'ADMIN') {
        Alert.alert('Error', 'No tienes permisos para agregar lugares.');
        return;
      }
      
      // Navegar a la pantalla AddPlace con las coordenadas seleccionadas
      if (selectedCoords) {
        // @ts-ignore
        navigation.navigate('AddPlace', {
          lat: selectedCoords.latitude,
          lng: selectedCoords.longitude
        });
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      Alert.alert('Error', 'No se pudieron verificar los permisos.');
    }
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      {/* Header con barra de búsqueda y acciones */}
      <Surface style={styles.header}>
        <View style={styles.headerRow}>
          <TextInput
            style={styles.input}
            placeholder="Buscar lugar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            editable={!isLoading}
            placeholderTextColor="#9ca3af"
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            style={[styles.actionBtn, { backgroundColor: '#7c3aed', marginLeft: 8, opacity: isLoading || !searchQuery.trim() ? 0.5 : 1 }]}
            compact
          >
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionBtnText}>🔍</Text>}
          </Button>
        </View>
        {isSelectingPlace && (
          <Text style={styles.selectionModeText}>
            🎯 Toca en el mapa para seleccionar la ubicación del lugar
          </Text>
        )}
      </Surface>

      {/* Contenido principal del mapa */}
      <GoogleMap
        ref={mapRef}
        style={styles.map}
        places={loadedPlaces}
        onMarkerClick={handleMarkerPress}
        onMapClick={handleMapClick}
        initialRegion={{
          latitude: mapCenter.latitude,
          longitude: mapCenter.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        center={shouldForceCenter ? mapCenter : undefined}
        zoom={shouldForceCenter ? mapZoom : undefined}
        onMapReady={handleMapReady}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={true}
        showsIndoorLevelPicker={true}
        showsPointsOfInterest={true}
        showsUserLocationButton={true}
        showsZoomControls={Platform.OS === 'android'}
        zoomEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={Platform.OS === 'android'}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        loadingEnabled={true}
        loadingIndicatorColor="#1e40af"
        loadingBackgroundColor="#f8fafc"
        minZoomLevel={10}
        maxZoomLevel={20}
        liteMode={false}
        moveOnMarkerPress={true}
        selectPlaceMode={isSelectingPlace}
        onSelectPlaceModeChange={(active: boolean) => {
          console.log('Modo selección de lugar cambiado:', active);
          setIsSelectingPlace(active);
        }}
        onPress={(event: any) => {
          console.log('Mapa presionado en:', event.nativeEvent.coordinate);
        }}
      />

      {/* Botón flotante para agregar lugar en la posición seleccionada */}
      {selectedCoords && isSelectingPlace && (
        <View style={styles.floatingAddButton}>
          <TouchableOpacity
            style={styles.addPlaceButton}
            onPress={handleAddPlaceClick}
            activeOpacity={0.8}
          >
            <Text style={styles.addPlaceButtonText}>
              Agregar lugar aquí
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  actionBtn: {
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    color: '#fff',
  },
  selectionModeText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  map: {
    flex: 1,
  },
  floatingAddButton: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 1000,
  },
  addPlaceButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addPlaceButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 