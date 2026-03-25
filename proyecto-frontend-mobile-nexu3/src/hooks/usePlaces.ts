import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { getAllPlacesToEat } from '@services/placesToEat/getAllPlacesToEat';
import { getAllPlacesToFun } from '@services/placesToFun/getAllPlacesToFun';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { useAuthState } from './useAuth';

export function usePlaces() {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const [places, setPlaces] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlaces = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Cargando lugares desde el backend...');
      const [placesToEatResponse, placesToFunResponse] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      
      const placesToEat = placesToEatResponse.data || [];
      const placesToFun = placesToFunResponse.data || [];
      const allPlaces = [...placesToEat, ...placesToFun];
      
      console.log(`Lugares cargados: ${allPlaces.length} (${placesToEat.length} comida, ${placesToFun.length} diversión)`);
      setPlaces(allPlaces);
    } catch (error: any) {
      console.error('Error al cargar lugares desde el backend:', error);
      const errorMessage = 'No se pudieron cargar los lugares. Verifica tu conexión a internet e intenta de nuevo.';
      setError(errorMessage);
      
      // Solo mostrar alerta si no es un error de autenticación
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        Alert.alert('Error', errorMessage, [
          { text: 'Reintentar', onPress: loadPlaces }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Cargar lugares cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadPlaces();
    }
  }, [isAuthenticated, authLoading, loadPlaces]);

  return {
    places,
    isLoading,
    error,
    loadPlaces,
    isAuthenticated,
    authLoading
  };
} 