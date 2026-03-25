import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import type { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import type { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getCategoryEmoji, getTooltipColor, getCategoryName } from '@utils/mapIcons';

interface MapMarkersProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onMarkerClick?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function MapMarkers({ places, onMarkerClick }: MapMarkersProps) {
  console.log('MapMarkers renderizando:', places.length, 'lugares');
  
  const getCategoryEmojiForPlace = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    if ('placeCategoryToEat' in place && place.placeCategoryToEat) {
      return getCategoryEmoji(place.placeCategoryToEat);
    } else if ('placeCategoryToFun' in place && place.placeCategoryToFun) {
      return getCategoryEmoji(place.placeCategoryToFun);
    }
    return '📍';
  };

  const getMarkerColor = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    // Determinar color basado en el tipo de lugar
    if ('placeCategoryToEat' in place) {
      return '#ef4444'; // Rojo para lugares de comida
    } else {
      return '#3b82f6'; // Azul para lugares de diversión
    }
  };

  return (
    <>
      {places.map((place) => {
        const category = 'placeCategoryToEat' in place 
          ? place.placeCategoryToEat 
          : place.placeCategoryToFun;
        
        return (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={`${place.address} • ${place.openTime} - ${place.closeTime}`}
            pinColor={getMarkerColor(place)}
            onPress={() => onMarkerClick?.(place)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerEmoji}>{getCategoryEmojiForPlace(place)}</Text>
            </View>
          </Marker>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#7c3aed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 20,
  },
}); 