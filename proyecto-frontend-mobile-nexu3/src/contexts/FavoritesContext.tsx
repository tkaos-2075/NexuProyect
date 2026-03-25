import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from './AuthContext';
import { getFavoritesPlacesToEatByUser } from '@services/placesToEat/getFavoritesPlacesToEatByUser';
import { getFavoritesPlacesToFunByUser } from '@services/placesToFun/getFavoritesPlacesToFunByUser';
import { addFavoritePlaceToEat, removeFavoritePlaceToEat } from '@services/placesToEat/favoritePlaceToEat';
import { addFavoritePlaceToFun, removeFavoritePlaceToFun } from '@services/placesToFun/favoritePlaceToFun';
import { getCurrentUser } from '@services/users/currentUser';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';

interface FavoritesContextType {
  favorites: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  isLoading: boolean;
  isFavorite: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => boolean;
  toggleFavorite: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { session } = useAuthContext();
  const [favorites, setFavorites] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Obtener el usuario actual cuando hay sesión
  useEffect(() => {
    if (session && !currentUserId) {
      getCurrentUserInfo();
    }
  }, [session, currentUserId]);

  const getCurrentUserInfo = async () => {
    if (!session) return;
    
    try {
      const response = await getCurrentUser();
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      setCurrentUserId(null);
    }
  };

  // Cargar favoritos cuando cambia la sesión o el usuario
  useEffect(() => {
    if (session && currentUserId) {
      loadFavorites();
    } else if (!session) {
      // Limpiar favoritos cuando no hay sesión
      setFavorites([]);
      setCurrentUserId(null);
    }
  }, [session, currentUserId]);

  const loadFavorites = useCallback(async () => {
    if (!session || !currentUserId || isLoading) return;

    setIsLoading(true);
    try {
      // Cargar favoritos de ambos tipos de lugares
      const [eatFavorites, funFavorites] = await Promise.all([
        getFavoritesPlacesToEatByUser(currentUserId),
        getFavoritesPlacesToFunByUser(currentUserId)
      ]);
      
      const allFavorites = [
        ...(eatFavorites.data || []),
        ...(funFavorites.data || [])
      ];
      
      setFavorites(allFavorites);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los favoritos. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [session, currentUserId, isLoading]);

  const isFavorite = useCallback((place: PlacesToEatResponseDto | PlacesToFunResponseDto): boolean => {
    return favorites.some(fav => fav.id === place.id);
  }, [favorites]);

  const toggleFavorite = useCallback(async (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    if (!session || !currentUserId || loading) return;

    setLoading(true);
    try {
      const currentlyFavorite = isFavorite(place);
      
      // Determinar el tipo de lugar y llamar al servicio correspondiente
      const isEatPlace = 'placeCategoryToEat' in place;
      
      if (currentlyFavorite) {
        // Remover de favoritos
        if (isEatPlace) {
          await removeFavoritePlaceToEat(place.id, currentUserId);
        } else {
          await removeFavoritePlaceToFun(place.id, currentUserId);
        }
        
        setFavorites(prev => prev.filter(fav => fav.id !== place.id));
      } else {
        // Agregar a favoritos
        if (isEatPlace) {
          await addFavoritePlaceToEat(place.id, currentUserId);
        } else {
          await addFavoritePlaceToFun(place.id, currentUserId);
        }
        
        setFavorites(prev => [...prev, place]);
      }
      
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el favorito. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
      
      // Revertir el cambio en caso de error
      if (isFavorite(place)) {
        setFavorites(prev => prev.filter(fav => fav.id !== place.id));
      } else {
        setFavorites(prev => [...prev, place]);
      }
    } finally {
      setLoading(false);
    }
  }, [session, currentUserId, loading, isFavorite]);

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 