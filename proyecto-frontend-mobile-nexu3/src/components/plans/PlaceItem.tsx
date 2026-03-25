import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';

interface PlaceItemProps {
  item: PlacesToEatResponseDto | PlacesToFunResponseDto;
  isSelected: boolean;
  isFavorite: boolean;
  onToggle: () => void;
}

export default function PlaceItem({ 
  item, 
  isSelected, 
  isFavorite, 
  onToggle 
}: PlaceItemProps) {
  const getPlaceCategory = (place: any) => {
    if ('placeCategoryToEat' in place) return place.placeCategoryToEat;
    if ('placeCategoryToFun' in place) return place.placeCategoryToFun;
    return '';
  };
  
  const getPlaceEmoji = (place: any) => {
    const cat = getPlaceCategory(place);
    if (cat === 'RESTAURANT') return '🍽️';
    if (cat === 'COFFEE' || cat === 'CAFE') return '☕';
    if (cat === 'GAMES' || cat === 'ARCADE') return '🎮';
    if (cat === 'PARK') return '🌳';
    return '📍';
  };

  return (
    <TouchableOpacity
      style={[styles.placeItem, { backgroundColor: '#fff' }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.placeCheckbox, { borderColor: '#3b82f6' }]}>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.placeEmoji}>{getPlaceEmoji(item)}</Text>
      <View style={styles.placeInfo}>
        <Text style={[styles.placeName]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.placeCategory} numberOfLines={1}>
          {getPlaceCategory(item)}
        </Text>
      </View>
      {isFavorite && <Text style={styles.favoriteStar}>★</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  placeCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeCategory: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteStar: {
    fontSize: 16,
    color: '#fbbf24',
    marginLeft: 8,
  },
}); 