import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@contexts/AuthContext';
import { addFavoritePlaceToEat, removeFavoritePlaceToEat } from '@services/placesToEat/favoritePlaceToEat';
import { addFavoritePlaceToFun, removeFavoritePlaceToFun } from '@services/placesToFun/favoritePlaceToFun';
import { getFavoritesPlacesToEatByUser } from '@services/placesToEat/getFavoritesPlacesToEatByUser';
import { getFavoritesPlacesToFunByUser } from '@services/placesToFun/getFavoritesPlacesToFunByUser';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getCurrentUser } from '@services/users/currentUser';

export function useFavorites() {
  const { session } = useAuthContext();
  const [favoriteEatIds, setFavoriteEatIds] = useState<Set<number>>(new Set());
  const [favoriteFunIds, setFavoriteFunIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Obtener el userId del usuario actual
  const getCurrentUserId = async (): Promise<number | null> => {
    if (!session) return null;

    // Si ya tenemos el userId cacheado, usarlo
    if (currentUserId) return currentUserId;

    try {
      console.log('Obteniendo userId del endpoint currentUser...');
      const userResponse = await getCurrentUser();
      const userId = userResponse.data.id;
      setCurrentUserId(userId);
      console.log('userId obtenido del endpoint:', userId);
      return userId;
    } catch (err) {
      console.error('Error obteniendo usuario actual:', err);
      return null;
    }
  };

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async () => {
    if (!session) return;

    const userId = await getCurrentUserId();
    if (!userId) {
      setError('No se pudo obtener el ID del usuario');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [favEatRes, favFunRes] = await Promise.all([
        getFavoritesPlacesToEatByUser(userId),
        getFavoritesPlacesToFunByUser(userId)
      ]);

      const eatIds = new Set(favEatRes.data?.map(place => place.id) || []);
      const funIds = new Set(favFunRes.data?.map(place => place.id) || []);

      setFavoriteEatIds(eatIds);
      setFavoriteFunIds(funIds);
    } catch (err) {
      setError('Error al cargar favoritos');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [session, currentUserId]);

  // Verificar si un lugar es favorito
  const isFavorite = useCallback((place: PlacesToEatResponseDto | PlacesToFunResponseDto): boolean => {
    try {
      // Verificaciones básicas de seguridad
      if (!place) return false;
      if (typeof place !== 'object') return false;
      if (place === null) return false;
      if (!place.id || typeof place.id !== 'number') return false;
      
      // Verificar si es un lugar de comida de manera segura
      const isEat = place.hasOwnProperty('placeCategoryToEat');
      
      if (isEat) {
        return favoriteEatIds.has(place.id);
      } else {
        return favoriteFunIds.has(place.id);
      }
    } catch (error) {
      console.error('Error en isFavorite:', error);
      return false;
    }
  }, [favoriteEatIds, favoriteFunIds]);

  // Toggle favorito
  const toggleFavorite = useCallback(async (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    try {
      // Verificaciones básicas de seguridad
      if (!place) {
        setError('Lugar no válido');
        return;
      }
      
      if (typeof place !== 'object') {
        setError('Lugar no válido');
        return;
      }
      
      if (place === null) {
        setError('Lugar no válido');
        return;
      }
      
      if (!place.id || typeof place.id !== 'number') {
        setError('Lugar no válido');
        return;
      }

      if (!session) {
        setError('Debes iniciar sesión para usar favoritos');
        return;
      }

      const userId = await getCurrentUserId();
      if (!userId) {
        setError('No se pudo obtener el ID del usuario');
        return;
      }

      setError(null);
      const currentlyFavorite = isFavorite(place);

      // Verificar si es un lugar de comida de manera segura
      const isEat = place.hasOwnProperty('placeCategoryToEat');

      if (isEat) {
        // Es lugar de comida
        if (currentlyFavorite) {
          await removeFavoritePlaceToEat(place.id, userId);
          setFavoriteEatIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(place.id);
            return newSet;
          });
        } else {
          await addFavoritePlaceToEat(place.id, userId);
          setFavoriteEatIds(prev => new Set(prev).add(place.id));
        }
      } else {
        // Es lugar de diversión
        if (currentlyFavorite) {
          await removeFavoritePlaceToFun(place.id, userId);
          setFavoriteFunIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(place.id);
            return newSet;
          });
        } else {
          await addFavoritePlaceToFun(place.id, userId);
          setFavoriteFunIds(prev => new Set(prev).add(place.id));
        }
      }
    } catch (err) {
      setError('Error al actualizar favoritos');
      console.error('Error toggling favorite:', err);
    }
  }, [session, isFavorite]);

  // Cargar favoritos al montar el hook
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    isFavorite,
    toggleFavorite,
    loadFavorites,
    loading,
    error,
    favoriteEatIds,
    favoriteFunIds
  };
} 