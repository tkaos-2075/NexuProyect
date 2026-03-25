import { useState, useMemo } from 'react';
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { useFavorites } from '@hooks/useFavorites';
import { SearchInput, CheckboxList } from '@components/common';

interface PlaceSelectionProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  selectedPlaces: number[];
  onTogglePlace: (placeId: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function PlaceSelection({
  places,
  selectedPlaces,
  onTogglePlace,
  searchQuery,
  onSearchChange
}: PlaceSelectionProps) {
  const { isFavorite } = useFavorites();
  const [showAllFavs, setShowAllFavs] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);

  // Helper para obtener la categoría y el emoji de forma segura
  const getPlaceCategory = (place: any) => {
    if (place.hasOwnProperty('placeCategoryToEat')) return (place as PlacesToEatResponseDto).placeCategoryToEat;
    if (place.hasOwnProperty('placeCategoryToFun')) return (place as PlacesToFunResponseDto).placeCategoryToFun;
    return '';
  };

  const getPlaceEmoji = (place: any) => {
    const cat = getPlaceCategory(place);
    if (cat === 'RESTAURANT') return '🍽️';
    if (cat === 'COFFEE') return '☕';
    if (cat === 'GAMES') return '🎮';
    if (cat === 'PARK') return '🌳';
    return '📍';
  };

  // Filtrar lugares favoritos y no favoritos
  const filteredPlaces = useMemo(() => {
    const lowerSearch = searchQuery.trim().toLowerCase();
    const favs = places.filter(p => isFavorite(p) && (!lowerSearch || p.name.toLowerCase().includes(lowerSearch)));
    const others = places.filter(p => !isFavorite(p) && (!lowerSearch || p.name.toLowerCase().includes(lowerSearch)));
    return { favs, others };
  }, [places, isFavorite, searchQuery]);

  // Convertir lugares a formato de CheckboxList
  const convertToCheckboxItems = (placeList: any[]) => {
    return placeList.map(place => ({
      id: place.id,
      name: place.name,
      category: getPlaceCategory(place),
      emoji: getPlaceEmoji(place),
      isFavorite: isFavorite(place)
    }));
  };

  return (
    <div className="w-full">
      <SearchInput
        label="Buscar lugar"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Buscar por nombre..."
        className="mb-4"
      />
      
      <label className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
        Lugares Disponibles ({selectedPlaces.length} seleccionados)
      </label>
      
      {/* Lugares favoritos */}
      {filteredPlaces.favs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ⭐ Favoritos
          </h4>
          <CheckboxList
            items={convertToCheckboxItems(filteredPlaces.favs)}
            selectedIds={selectedPlaces}
            onToggle={(id) => onTogglePlace(Number(id))}
            showAll={showAllFavs}
            onShowAll={() => setShowAllFavs(true)}
            maxVisible={5}
          />
        </div>
      )}
      
      {/* Otros lugares */}
      {filteredPlaces.others.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📍 Otros lugares
          </h4>
          <CheckboxList
            items={convertToCheckboxItems(filteredPlaces.others)}
            selectedIds={selectedPlaces}
            onToggle={(id) => onTogglePlace(Number(id))}
            showAll={showAllOthers}
            onShowAll={() => setShowAllOthers(true)}
            maxVisible={5}
          />
        </div>
      )}
      
      {/* Mensaje si no hay lugares */}
      {filteredPlaces.favs.length === 0 && filteredPlaces.others.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchQuery ? "No se encontraron lugares que coincidan con la búsqueda" : "No hay lugares disponibles"}
        </div>
      )}
    </div>
  );
} 