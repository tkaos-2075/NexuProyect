import { getAllPlacesToEat } from "@services/placesToEat/getAllPlacesToEat";
import { getAllPlacesToFun } from "@services/placesToFun/getAllPlacesToFun";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";

interface UseMapSearchProps {
  onPlacesLoaded?: (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => void;
  setLoading: (loading: boolean) => void;
  updateLoadedPlaces: (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => void;
}

export function useMapSearch({ setLoading, updateLoadedPlaces }: UseMapSearchProps) {
  
  // Carga todos los lugares de NexU (comida y diversión)
  const loadNexuPlaces = async () => {
    try {
      setLoading(true);
      const [placesToEatResponse, placesToFunResponse] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      const placesToEat = placesToEatResponse.data;
      const placesToFun = placesToFunResponse.data;
      const allPlaces = [...placesToEat, ...placesToFun];
      updateLoadedPlaces(allPlaces);
    } catch (error) {
      console.error("Error al cargar lugares:", error);
      alert("Error al cargar los lugares de Nexu. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Busca una dirección usando la API de Google Maps
  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) return null;
    
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].geometry.location;
      } else {
        alert("No se encontró el lugar especificado");
        return null;
      }
    } catch (error) {
      console.error("Error al buscar el lugar:", error);
      alert("Error al buscar el lugar. Inténtalo de nuevo.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadNexuPlaces,
    searchLocation,
  };
} 