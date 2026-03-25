// Vista unificada para mostrar todos los lugares con paginación y diferentes modos de visualización
import { useMemo } from 'react';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { PlaceCard } from '@components/places';

type ViewMode = 'grid' | 'list' | 'compact';

interface UnifiedViewProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  viewMode: ViewMode;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onShowOnMap?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function UnifiedView({
  places,
  viewMode,
  currentPage,
  itemsPerPage,
  onPageChange,
  onShowOnMap
}: UnifiedViewProps) {
  // Calcula la paginación
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const paginatedPlaces = useMemo(() => {
    return places.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [places, currentPage, itemsPerPage]);

  return (
    <div>
      {/* Grid de lugares según el modo de vista */}
      <div className={
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :
        viewMode === 'list' ? 'space-y-4' :
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4'
      }>
        {paginatedPlaces.filter(place => place != null).map(place => (
          <PlaceCard 
            key={place.id} 
            place={place} 
            compact={viewMode === 'compact'}
            onShowOnMap={onShowOnMap}
          />
        ))}
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {/* Información de paginación */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Página {currentPage} de {totalPages} •
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, places.length)} de {places.length} lugares
        </div>
      )}
    </div>
  );
} 