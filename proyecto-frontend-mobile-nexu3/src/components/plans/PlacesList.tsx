import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { useFavorites } from '@hooks/useFavorites';
import PlaceItem from './PlaceItem';

interface PlacesListProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  selectedPlaces: number[];
  onTogglePlace: (id: number) => void;
  search: string;
  onSearchChange: (text: string) => void;
}

export default function PlacesList({ 
  places, 
  selectedPlaces, 
  onTogglePlace, 
  search, 
  onSearchChange 
}: PlacesListProps) {
  const { isFavorite } = useFavorites();
  const [showAllFavs, setShowAllFavs] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);

  const filteredPlaces = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    const favs = places.filter(p => isFavorite(p) && (!lowerSearch || p.name.toLowerCase().includes(lowerSearch)));
    const others = places.filter(p => !isFavorite(p) && (!lowerSearch || p.name.toLowerCase().includes(lowerSearch)));
    return { favs, others };
  }, [places, isFavorite, search]);

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label]}>Buscar lugar</Text>
      <TextInput
        style={[styles.textInput]}
        value={search}
        onChangeText={onSearchChange}
        placeholder="Buscar por nombre..."
        placeholderTextColor="#9ca3af"
      />
      
      <Text style={[styles.label]}>Lugares Disponibles ({selectedPlaces.length} seleccionados)</Text>
      <View style={[styles.placesContainer]}>
        {/* Lugares Favoritos */}
        {filteredPlaces.favs.length > 0 && (
          <>
            <Text style={[styles.sectionTitle]}>⭐ Favoritos</Text>
            <FlatList
              data={filteredPlaces.favs.slice(0, showAllFavs ? filteredPlaces.favs.length : 5)}
              renderItem={({ item }) => (
                <PlaceItem
                  item={item}
                  isSelected={selectedPlaces.includes(item.id)}
                  isFavorite={isFavorite(item)}
                  onToggle={() => onTogglePlace(item.id)}
                />
              )}
              keyExtractor={(item) => `${item.id}-${item.name}`}
              scrollEnabled={false}
            />
            {filteredPlaces.favs.length > 5 && !showAllFavs && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllFavs(true)}
              >
                <Text style={[styles.showMoreText]}>Mostrar todos los favoritos</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Otros Lugares */}
        {filteredPlaces.others.length > 0 && (
          <>
            <Text style={[styles.sectionTitle]}>📍 Otros Lugares</Text>
            <FlatList
              data={filteredPlaces.others.slice(0, showAllOthers ? filteredPlaces.others.length : 5)}
              renderItem={({ item }) => (
                <PlaceItem
                  item={item}
                  isSelected={selectedPlaces.includes(item.id)}
                  isFavorite={isFavorite(item)}
                  onToggle={() => onTogglePlace(item.id)}
                />
              )}
              keyExtractor={(item) => `${item.id}-${item.name}`}
              scrollEnabled={false}
            />
            {filteredPlaces.others.length > 5 && !showAllOthers && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllOthers(true)}
              >
                <Text style={[styles.showMoreText]}>Mostrar todos los lugares</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  placesContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 