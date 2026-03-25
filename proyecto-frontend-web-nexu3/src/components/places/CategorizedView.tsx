import { useState, useMemo } from 'react';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { PlaceCard } from '@components/places';

interface CategorizedViewProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onShowOnMap?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function CategorizedView({ places, onShowOnMap }: CategorizedViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Organiza los lugares por categoría
  const categorizedPlaces = useMemo(() => {
    const categories: { [key: string]: (PlacesToEatResponseDto | PlacesToFunResponseDto)[] } = {};
    places.filter(place => place != null && typeof place === 'object').forEach(place => {
      // Verificar si es un lugar de comida de manera segura
      const isEat = place.hasOwnProperty('placeCategoryToEat');
      const category = isEat
        ? (place as PlacesToEatResponseDto).placeCategoryToEat 
        : (place as PlacesToFunResponseDto).placeCategoryToFun;
      if (!categories[category]) categories[category] = [];
      categories[category].push(place);
    });
    return categories;
  }, [places]);

  // Configuración visual de cada categoría
  const categoryConfig: { [key: string]: { emoji: string; color: string } } = {
    'RESTAURANT': { emoji: '🍽️', color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' },
    'CAFE': { emoji: '☕', color: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' },
    'BAR': { emoji: '🍺', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' },
    'PARK': { emoji: '🌳', color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' },
    'ARCADE': { emoji: '🎮', color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' },
    'CLUB': { emoji: '🎉', color: 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800' },
  };

  // Secciones de categoría para renderizar
  const categorySections = useMemo(() => {
    return Object.entries(categorizedPlaces)
      .map(([category, places]) => ({
        name: category,
        emoji: categoryConfig[category]?.emoji || '📍',
        places,
        color: categoryConfig[category]?.color || 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categorizedPlaces]);

  // Expansión/colapso de categorías
  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) newExpanded.delete(categoryName);
    else newExpanded.add(categoryName);
    setExpandedCategories(newExpanded);
  };
  const expandAll = () => setExpandedCategories(new Set(categorySections.map(cat => cat.name)));
  const collapseAll = () => setExpandedCategories(new Set());
  const isExpanded = (categoryName: string) => expandedCategories.has(categoryName);

  return (
    <div className="space-y-6">
      {/* Controles de expansión global */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {categorySections.length} categorías • {places.length} lugares
        </div>
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Expandir todo
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Colapsar todo
          </button>
        </div>
      </div>
      {/* Renderizado de cada sección de categoría */}
      {categorySections.map((section) => (
        <div
          key={section.name}
          className={`border rounded-lg overflow-hidden transition-all duration-300 ${section.color}`}
        >
          {/* Header de la categoría */}
          <button
            onClick={() => toggleCategory(section.name)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{section.emoji}</span>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {section.places.length} lugar{section.places.length !== 1 ? 'es' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {isExpanded(section.name) ? 'Ocultar' : 'Mostrar'}
              </span>
              <span className={`transform transition-transform duration-200 ${
                isExpanded(section.name) ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </div>
          </button>
          {/* Contenido de la categoría */}
          {isExpanded(section.name) && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.places.filter(place => place != null).map(place => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      compact={true}
                      onShowOnMap={onShowOnMap}
                    />
                  ))}
                </div>
                {/* Estadísticas de la categoría */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Promedio de calificación: {
                        section.places.length > 0 
                          ? (section.places.reduce((sum, place) => sum + (place.qualification || 0), 0) / section.places.length).toFixed(1)
                          : 'N/A'
                      } ⭐
                    </span>
                    <span>
                      {section.places.filter(p => p.status.toLowerCase() === 'abierto' || p.status.toLowerCase() === 'open').length} abierto{section.places.filter(p => p.status.toLowerCase() === 'abierto' || p.status.toLowerCase() === 'open').length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Mensaje si no hay categorías */}
      {categorySections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Los lugares no se han categorizado aún
          </p>
        </div>
      )}
    </div>
  );
} 