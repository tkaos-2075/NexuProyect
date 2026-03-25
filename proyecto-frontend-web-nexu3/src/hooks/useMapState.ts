import { useState, useEffect } from 'react';
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";

interface MapState {
  searchQuery: string;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  isLoading: boolean;
  loadedPlaces: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  showAddPlace: boolean;
  selectedCoords: { lat: number; lng: number } | null;
  isSelectingPlace: boolean;
  mapInstance: any;
  shouldForceCenter: boolean;
  selectedPlace: PlacesToEatResponseDto | PlacesToFunResponseDto | null;
  sidebarOpen: boolean;
}

interface UseMapStateProps {
  center?: { lat: number; lng: number } | null;
  zoom?: number | null;
  onPlacesLoaded?: (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => void;
}

export function useMapState({ center, zoom, onPlacesLoaded }: UseMapStateProps) {
  const [state, setState] = useState<MapState>({
    searchQuery: "",
    mapCenter: { lat: -12.123066, lng: -77.027152 }, // Centro inicial: UTEC
    mapZoom: 15,
    isLoading: false,
    loadedPlaces: [],
    showAddPlace: false,
    selectedCoords: null,
    isSelectingPlace: false,
    mapInstance: null,
    shouldForceCenter: false,
    selectedPlace: null,
    sidebarOpen: false,
  });

  // Actualizar centro del mapa cuando se proporciona
  useEffect(() => {
    if (center) {
      setState(prev => ({ ...prev, mapCenter: center, shouldForceCenter: true }));
    }
  }, [center]);

  // Actualizar zoom cuando se proporciona
  useEffect(() => {
    if (zoom) {
      setState(prev => ({ ...prev, mapZoom: zoom, shouldForceCenter: true }));
    }
  }, [zoom]);

  // Actualizar lugares cargados
  const updateLoadedPlaces = (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => {
    setState(prev => ({ ...prev, loadedPlaces: places }));
    onPlacesLoaded?.(places);
  };

  // Actualizar estado de carga
  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  // Actualizar centro del mapa
  const updateMapCenter = (newCenter: { lat: number; lng: number }) => {
    setState(prev => ({ ...prev, mapCenter: newCenter }));
  };

  // Actualizar zoom del mapa
  const updateMapZoom = (newZoom: number) => {
    setState(prev => ({ ...prev, mapZoom: newZoom }));
  };

  // Actualizar coordenadas seleccionadas
  const updateSelectedCoords = (coords: { lat: number; lng: number } | null) => {
    setState(prev => ({ ...prev, selectedCoords: coords }));
  };

  // Actualizar modo de selección de lugar
  const updateSelectingPlace = (selecting: boolean) => {
    setState(prev => ({ ...prev, isSelectingPlace: selecting }));
  };

  // Actualizar instancia del mapa
  const updateMapInstance = (instance: any) => {
    setState(prev => ({ ...prev, mapInstance: instance }));
  };

  // Actualizar lugar seleccionado
  const updateSelectedPlace = (place: PlacesToEatResponseDto | PlacesToFunResponseDto | null) => {
    setState(prev => ({ ...prev, selectedPlace: place }));
  };

  // Actualizar estado del sidebar
  const updateSidebarOpen = (open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
  };

  // Actualizar estado del modal de agregar lugar
  const updateShowAddPlace = (show: boolean) => {
    setState(prev => ({ ...prev, showAddPlace: show }));
  };

  // Actualizar query de búsqueda
  const updateSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  // Resetear forzar centro
  const resetForceCenter = () => {
    setState(prev => ({ ...prev, shouldForceCenter: false }));
  };

  return {
    ...state,
    updateLoadedPlaces,
    setLoading,
    updateMapCenter,
    updateMapZoom,
    updateSelectedCoords,
    updateSelectingPlace,
    updateMapInstance,
    updateSelectedPlace,
    updateSidebarOpen,
    updateShowAddPlace,
    updateSearchQuery,
    resetForceCenter,
  };
} 