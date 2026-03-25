import { PlaceCategoryToEat } from "@interfaces/placesToEat/PlacesToEatRequestDto";
import { PlaceCategoryToFun } from "@interfaces/placesToFun/PlacesToFunRequestDto";

// Definir los iconos personalizados para cada categoría
export const getPlaceIcon = (category: PlaceCategoryToEat | PlaceCategoryToFun | string): google.maps.Icon => {
  let url = '';
  switch (category) {
    case 'RESTAURANT':
      // Emoji tenedor y cuchillo (🍴) en SVG negro
      url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="6" y="26" font-size="28">🍴</text></svg>';
      break;
    case 'COFFEE':
      url = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2615.png'; // ☕
      break;
    case 'PARK':
      url = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f333.png'; // 🌳
      break;
    case 'GAMES':
      url = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3ae.png'; // 🎮
      break;
    default:
      url = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4cd.png'; // 📍
      break;
  }
  return {
    url,
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16),
  };
};

// Función para obtener el color de fondo del tooltip según la categoría
export const getTooltipColor = (category: PlaceCategoryToEat | PlaceCategoryToFun): string => {
  switch (category) {
    case 'RESTAURANT':
      return "#FF6B6B";
    case 'PARK':
      return "#96CEB4";
    case 'GAMES':
      return "#14532d"; // Verde oscuro
    case 'COFFEE':
      return "#4ECDC4";
    default:
      return "#95A5A6";
  }
};

// Función para obtener el emoji representativo de cada categoría
export const getCategoryEmoji = (category: PlaceCategoryToEat | PlaceCategoryToFun | string): string => {
  switch (category) {
    case 'RESTAURANT':
      return "🍽️";
    case 'COFFEE':
      return "☕";
    case 'GAMES':
      return "🎮";
    case 'PARK':
      return "🌳";
    default:
      return "📍";
  }
}; 