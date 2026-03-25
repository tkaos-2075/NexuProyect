import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import type { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import type { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import MapMarkers from '@components/mapa/MapMarkers';

interface GoogleMapProps {
  center?: { latitude: number; longitude: number };
  zoom?: number;
  onLocationRequest?: () => void;
  onMapCenterChange?: (center: { latitude: number; longitude: number }) => void;
  places?: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onMarkerClick?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  selectPlaceMode?: boolean;
  onSelectPlaceModeChange?: (active: boolean) => void;
  onMapReady?: (map: any) => void;
  children?: React.ReactNode;
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChangeComplete?: (region: any) => void;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  showsCompass?: boolean;
  showsScale?: boolean;
  showsTraffic?: boolean;
  showsBuildings?: boolean;
  showsIndoors?: boolean;
  showsIndoorLevelPicker?: boolean;
  showsPointsOfInterest?: boolean;
  showsZoomControls?: boolean;
  zoomEnabled?: boolean;
  rotateEnabled?: boolean;
  scrollEnabled?: boolean;
  pitchEnabled?: boolean;
  toolbarEnabled?: boolean;
  mapPadding?: { top: number; right: number; bottom: number; left: number };
  loadingEnabled?: boolean;
  loadingIndicatorColor?: string;
  loadingBackgroundColor?: string;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  liteMode?: boolean;
  moveOnMarkerPress?: boolean;
  onPress?: (event: any) => void;
  [key: string]: any;
}

const GoogleMap = forwardRef<MapView, GoogleMapProps>(({
  center,
  zoom,
  onLocationRequest,
  onMapCenterChange,
  places,
  onMarkerClick,
  onMapClick,
  selectPlaceMode,
  onSelectPlaceModeChange,
  onMapReady,
  children,
  style,
  initialRegion,
  onRegionChangeComplete,
  showsUserLocation = true,
  showsMyLocationButton = true,
  showsCompass = true,
  showsScale = true,
  showsTraffic = false,
  showsBuildings = true,
  showsIndoors = true,
  showsIndoorLevelPicker = true,
  showsPointsOfInterest = true,
  showsZoomControls = Platform.OS === 'android',
  zoomEnabled = true,
  rotateEnabled = true,
  scrollEnabled = true,
  pitchEnabled = true,
  toolbarEnabled = Platform.OS === 'android',
  mapPadding = { top: 0, right: 0, bottom: 0, left: 0 },
  loadingEnabled = true,
  loadingIndicatorColor = '#1e40af',
  loadingBackgroundColor = '#f8fafc',
  minZoomLevel = 10,
  maxZoomLevel = 20,
  liteMode = false,
  moveOnMarkerPress = true,
  onPress,
  ...props
}, ref) => {
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(ref, () => mapRef.current!, []);

  useEffect(() => {
    if (mapRef.current && onMapReady) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady]);

  const handleMapPress = (event: any) => {
    if (onMapClick) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      onMapClick({ latitude, longitude });
      if (selectPlaceMode) {
        setSelectedCoords({ latitude, longitude });
      }
    }
  };

  const handleRegionChange = (region: any) => {
    if (onMapCenterChange) {
      onMapCenterChange({
        latitude: region.latitude,
        longitude: region.longitude
      });
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Error", "Se requieren permisos de ubicación para esta función.");
        setIsLocating(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });
      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      onLocationRequest?.();
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener tu ubicación actual. Verifica que tengas GPS activado.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectPlaceModeToggle = () => {
    if (onSelectPlaceModeChange) {
      onSelectPlaceModeChange(!selectPlaceMode);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={[styles.map, style]}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        region={center ? {
          ...center,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
        showsCompass={showsCompass}
        showsScale={showsScale}
        showsTraffic={showsTraffic}
        showsBuildings={showsBuildings}
        showsIndoors={showsIndoors}
        showsIndoorLevelPicker={showsIndoorLevelPicker}
        showsPointsOfInterest={showsPointsOfInterest}
        showsZoomControls={showsZoomControls}
        zoomEnabled={zoomEnabled}
        rotateEnabled={rotateEnabled}
        scrollEnabled={scrollEnabled}
        pitchEnabled={pitchEnabled}
        toolbarEnabled={toolbarEnabled}
        mapPadding={mapPadding}
        loadingEnabled={loadingEnabled}
        loadingIndicatorColor={loadingIndicatorColor}
        loadingBackgroundColor={loadingBackgroundColor}
        minZoomLevel={minZoomLevel}
        maxZoomLevel={maxZoomLevel}
        liteMode={liteMode}
        moveOnMarkerPress={moveOnMarkerPress}
        mapType="standard"
        onMapReady={() => {
          onMapReady?.(mapRef.current!);
        }}
        {...props}
      >
        {/* Marcadores del mapa */}
        {places && places.length > 0 && (
          <MapMarkers
            places={places}
            onMarkerClick={onMarkerClick}
          />
        )}
        {/* Marcador temporal para selección de lugar */}
        {selectedCoords && selectPlaceMode && (
          <Marker
            coordinate={selectedCoords}
            pinColor="#22c55e"
            title="Ubicación seleccionada"
            description="Toca aquí para agregar un lugar"
          />
        )}
        {children}
      </MapView>
      {/* Controles en la esquina superior derecha */}
      <View style={styles.controlsContainer}>
        {/* Botón de ubicación actual */}
        <TouchableOpacity
          onPress={handleGetCurrentLocation}
          disabled={isLocating}
          style={[styles.controlButton, { opacity: isLocating ? 0.5 : 1 }]}
          activeOpacity={0.8}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color="#374151" />
          ) : (
            <Text style={styles.controlIcon}>📍</Text>
          )}
        </TouchableOpacity>
        {/* Botón para activar/desactivar modo selección de lugar */}
        <TouchableOpacity
          onPress={handleSelectPlaceModeToggle}
          style={[styles.controlButton, { backgroundColor: selectPlaceMode ? '#22c55e' : '#eab308' }]}
          activeOpacity={0.8}
        >
          <Text style={styles.controlIcon}>{selectPlaceMode ? "✔️" : "➕"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default GoogleMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    flexDirection: 'row' as const,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    marginLeft: 4,
  },
  controlIcon: {
    fontSize: 18,
  },
}); 