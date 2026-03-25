import { useEffect, useState, useMemo } from 'react';
import { getAllPlacesToEat } from '@services/placesToEat/getAllPlacesToEat';
import { getAllPlacesToFun } from '@services/placesToFun/getAllPlacesToFun';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import Navbar from '@components/Navbar';
import { CategorizedView, UnifiedView } from '@components/places';
import SearchInput from '@components/common/SearchInput';
import { useNavigate } from 'react-router-dom';

type PlaceType = 'all' | 'eat' | 'fun';
type SortOption = 'name' | 'rating' | 'distance' | 'price';
type ViewMode = 'grid' | 'list' | 'compact';
type DisplayMode = 'unified' | 'categorized';

export default function PlacesPage() {
  const [placesEat, setPlacesEat] = useState<PlacesToEatResponseDto[]>([]);
  const [placesFun, setPlacesFun] = useState<PlacesToFunResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros y estado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PlaceType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('unified');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const navigate = useNavigate();

  const loadPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eatRes, funRes] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      setPlacesEat(eatRes.data || []);
      setPlacesFun(funRes.data || []);
    } catch {
      setError('Error al cargar los lugares');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  // Unificar todos los lugares
  const allPlaces = useMemo(() => [...placesEat, ...placesFun], [placesEat, placesFun]);

  // Filtrar lugares
  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces;

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(place => {
        if (selectedType === 'eat') return place.hasOwnProperty('placeCategoryToEat');
        if (selectedType === 'fun') return place.hasOwnProperty('placeCategoryToFun');
        return true;
      });
    }

    // Filtrar por categoría específica
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => {
        const category = place.hasOwnProperty('placeCategoryToEat')
          ? (place as PlacesToEatResponseDto).placeCategoryToEat 
          : (place as PlacesToFunResponseDto).placeCategoryToFun;
        return category === selectedCategory;
      });
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allPlaces, selectedType, selectedCategory, searchQuery]);

  // Ordenar lugares
  const sortedPlaces = useMemo(() => {
    const sorted = [...filteredPlaces];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return sorted.sort((a, b) => (b.qualification || 0) - (a.qualification || 0));
      case 'distance':
        // Aquí podrías implementar lógica de distancia real
        return sorted;
      case 'price':
        return sorted.sort((a, b) => (a.estimatedPrice || 0) - (b.estimatedPrice || 0));
      default:
        return sorted;
    }
  }, [filteredPlaces, sortBy]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allPlaces.forEach(place => {
      const category = place.hasOwnProperty('placeCategoryToEat')
        ? (place as PlacesToEatResponseDto).placeCategoryToEat 
        : (place as PlacesToFunResponseDto).placeCategoryToFun;
      cats.add(category);
    });
    return Array.from(cats).sort();
  }, [allPlaces]);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'RESTAURANT': return '🍽️';
      case 'COFFEE': return '☕';
      case 'PARK': return '🌳';
      case 'GAMES': return '🎮';
      default: return '📍';
    }
  };

  // Función para centrar el mapa en un lugar
  const handleShowOnMap = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    if (place.latitude && place.longitude) {
      navigate('/dashboard', { state: { lat: place.latitude, lng: place.longitude } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Lugares de NexU
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre {allPlaces.length} lugares para comer y divertirte
          </p>
        </div>

        {/* Filtros y controles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda */}
            <SearchInput
              label="Buscar"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Nombre, dirección..."
            />

            {/* Tipo de lugar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PlaceType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todos los lugares</option>
                <option value="eat">Comida</option>
                <option value="fun">Diversión</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryEmoji(category)} {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="name">Nombre</option>
                <option value="rating">Calificación</option>
                <option value="distance">Distancia</option>
                <option value="price">Precio</option>
              </select>
            </div>
          </div>

          {/* Controles adicionales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Modo de visualización */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Modo:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setDisplayMode('unified')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      displayMode === 'unified' 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Vista unificada - Todos los lugares juntos"
                  >
                    Unificada
                  </button>
                  <button
                    onClick={() => setDisplayMode('categorized')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      displayMode === 'categorized' 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Vista categorizada - Organizada por tipo"
                  >
                    Categorizada
                  </button>
                </div>
              </div>

              {/* Modo de vista (solo en modo unificado) */}
              {displayMode === 'unified' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vista:</span>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                      title="Vista de cuadrícula"
                    >
                      ⊞
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                      title="Vista de lista"
                    >
                      ☰
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-2 rounded ${viewMode === 'compact' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                      title="Vista compacta"
                    >
                      ⋯
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPlaces.length} de {allPlaces.length} lugares
            </div>
          </div>
        </div>

        {/* Loading y error */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando lugares...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadPlaces}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
              Intentar de nuevo
          </button>
        </div>
        )}

        {/* Contenido principal */}
        {!loading && !error && (
          <>
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No se encontraron lugares
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Intenta ajustar los filtros de búsqueda
                </p>
      </div>
            ) : (
              <>
                {displayMode === 'unified' ? (
                  <UnifiedView
                    places={sortedPlaces}
                    viewMode={viewMode}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onShowOnMap={handleShowOnMap}
                  />
                ) : (
                  <CategorizedView
                    places={sortedPlaces}
                    onShowOnMap={handleShowOnMap}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
} 