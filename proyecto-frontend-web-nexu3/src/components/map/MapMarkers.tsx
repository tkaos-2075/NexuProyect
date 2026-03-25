import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { getPlaceIcon, getTooltipColor, getCategoryEmoji } from "@utils/mapIcons";

interface MapMarkersProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onMarkerClick?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function MapMarkers({ places, onMarkerClick }: MapMarkersProps) {
  const map = useMap();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);

  // Detecta el tema actual (oscuro o claro)
  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  useEffect(() => {
    if (!map || !places.length) return;
    // Limpia marcadores e infoWindows anteriores
    markers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];
    places.forEach((place) => {
      // Determina la categoría del lugar
      const category = place.hasOwnProperty('placeCategoryToEat')
        ? (place as PlacesToEatResponseDto).placeCategoryToEat 
        : (place as PlacesToFunResponseDto).placeCategoryToFun;
      // Crea el marcador
      const marker = new google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: map,
        icon: getPlaceIcon(category),
        title: place.name,
        animation: google.maps.Animation.DROP,
      });
      // Colores adaptativos según el tema
      const isDark = isDarkMode();
      const backgroundColor = isDark ? '#1f2937' : '#ffffff';
      const textColor = isDark ? '#f9fafb' : '#1f2937';
      const secondaryTextColor = isDark ? '#f9fafb' : '#1f2937';
      const borderColor = isDark ? '#374151' : '#e5e7eb';
      // Contenido del InfoWindow
      const content = `
        <div style="
          padding: 12px; 
          max-width: 280px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${backgroundColor};
          border: 1px solid ${borderColor};
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        ">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 24px; margin-right: 10px;">${getCategoryEmoji(category)}</span>
            <h3 style="margin: 0; color: ${textColor}; font-size: 16px; font-weight: 600; line-height: 1.2;">${place.name}</h3>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: ${secondaryTextColor}; font-size: 13px; display: flex; align-items: center;">
              <span style="margin-right: 6px;">📍</span>
              ${place.address}
            </span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: ${secondaryTextColor}; font-size: 13px; display: flex; align-items: center;">
              <span style="margin-right: 6px;">🕒</span>
              ${place.openTime} - ${place.closeTime}
            </span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: ${secondaryTextColor}; font-size: 13px; display: flex; align-items: center;">
              <span style="margin-right: 6px;">💰</span>
              ${place.payment}
            </span>
          </div>
          ${place.qualification ? `
            <div style="margin-bottom: 8px;">
              <span style="color: ${secondaryTextColor}; font-size: 13px; display: flex; align-items: center;">
                <span style="margin-right: 6px; color: #fbbf24;">⭐</span>
                ${place.qualification}/5
              </span>
            </div>
          ` : ''}
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid ${borderColor};">
            <span style="
              background-color: ${getTooltipColor(category)}; 
              color: white; 
              padding: 6px 12px; 
              border-radius: 16px; 
              font-size: 11px; 
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: inline-block;
            ">
              ${category}
            </span>
          </div>
        </div>
      `;
      // Crea el InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 300,
        pixelOffset: new google.maps.Size(0, -10),
      });
      // Evento de clic en el marcador
      marker.addListener('click', () => {
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
        if (onMarkerClick) onMarkerClick(place);
      });
      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });
    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
    // Limpieza al desmontar
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
      newInfoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, [map, places]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, []);

  return null; // Este componente no renderiza nada visualmente
} 