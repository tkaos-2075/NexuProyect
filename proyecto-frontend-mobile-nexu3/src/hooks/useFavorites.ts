import { useFavorites as useFavoritesContext } from '@contexts/FavoritesContext';

// Re-exportar el hook del contexto para mantener compatibilidad
export function useFavorites() {
  return useFavoritesContext();
} 