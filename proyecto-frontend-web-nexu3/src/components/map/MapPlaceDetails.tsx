import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";

interface MapPlaceDetailsProps {
  selectedPlace: PlacesToEatResponseDto | PlacesToFunResponseDto | null;
  loadedPlaces: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onPlaceSelect: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function MapPlaceDetails({
  selectedPlace,
  loadedPlaces,
  onPlaceSelect
}: MapPlaceDetailsProps) {
  if (selectedPlace) {
    return (
      <div>
        <p className="text-gray-700 dark:text-gray-200 mb-2">
          <b>Dirección:</b> {selectedPlace.address}
        </p>
        <p className="text-gray-700 dark:text-gray-200 mb-2">
          <b>Categoría:</b> {
            selectedPlace.hasOwnProperty('placeCategoryToEat')
              ? (selectedPlace as PlacesToEatResponseDto).placeCategoryToEat 
              : (selectedPlace as PlacesToFunResponseDto).placeCategoryToFun
          }
        </p>
        <p className="text-gray-700 dark:text-gray-200 mb-2">
          <b>Estado:</b> {selectedPlace.status || 'Sin estado'}
        </p>
        <p className="text-gray-700 dark:text-gray-200 mb-2">
          <b>Descripción:</b> {selectedPlace.description}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {loadedPlaces.length === 0 ? (
        <li className="text-gray-400 text-center">No hay lugares cargados</li>
      ) : (
        loadedPlaces.map((place) => (
          <li
            key={place.id}
            className="text-gray-800 dark:text-gray-200 truncate cursor-pointer hover:underline"
            onClick={() => onPlaceSelect(place)}
          >
            {place.name}
          </li>
        ))
      )}
    </ul>
  );
} 