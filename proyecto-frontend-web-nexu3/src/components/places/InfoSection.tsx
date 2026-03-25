import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";

interface InfoSectionProps {
  place: PlacesToEatResponseDto | PlacesToFunResponseDto;
}

// Función para capitalizar la primera letra y el resto en minúscula
function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función para mostrar el rango de precios de forma descriptiva
function formatPriceRange(range: string | undefined) {
  if (!range) return '';
  switch (range) {
    case '$': return '$ (Económico)';
    case '$$': return '$$ (Medio)';
    case '$$$': return '$$$ (Alto)';
    default: return range;
  }
}

export default function InfoSection({ place }: InfoSectionProps) {
  const isEat = 'placeCategoryToEat' in place;
  const isFun = 'placeCategoryToFun' in place;

  // Construir lista de datos a mostrar
  const infoItems: { label: string; value: string | number | boolean | undefined }[] = [
    { label: 'Horarios', value: `${place.openTime} - ${place.closeTime}` },
    { label: 'Rango de Precios', value: formatPriceRange(place.priceRange) },
    { label: 'Precio Estimado', value: place.estimatedPrice ? `S/. ${place.estimatedPrice}` : undefined },
  ];
  if (isEat && place.typeCoffee) infoItems.push({ label: 'Tipo de Cafetería', value: capitalize(place.typeCoffee) });
  if (isEat && place.typeRestaurant) infoItems.push({ label: 'Tipo de Restaurante', value: capitalize(place.typeRestaurant) });
  if (isEat && typeof place.wifi !== 'undefined') infoItems.push({ label: 'WiFi', value: place.wifi ? 'Disponible' : 'No disponible' });
  if (isEat && typeof place.delivery !== 'undefined') infoItems.push({ label: 'Delivery', value: place.delivery ? 'Sí' : 'No' });
  if (isFun && place.sizePark) infoItems.push({ label: 'Tamaño del parque', value: capitalize(place.sizePark) });
  if (isFun && place.games && place.games.length > 0) infoItems.push({ label: 'Juegos', value: Array.isArray(place.games) ? place.games.map(capitalize).join(', ') : capitalize(place.games) });

  // Balancear entre dos columnas
  const col1 = infoItems.filter((_, i) => i % 2 === 0);
  const col2 = infoItems.filter((_, i) => i % 2 === 1);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Información Detallada</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {col1.map((item, idx) => (
            item.value !== undefined && item.value !== '' && (
              <div key={idx}>
                <span className="block text-xs text-gray-400 mb-1">{item.label}</span>
                <span className="text-gray-200">{item.value}</span>
              </div>
            )
          ))}
        </div>
        <div className="space-y-2">
          {col2.map((item, idx) => (
            item.value !== undefined && item.value !== '' && (
              <div key={idx}>
                <span className="block text-xs text-gray-400 mb-1">{item.label}</span>
                <span className="text-gray-200">{item.value}</span>
              </div>
            )
          ))}
        </div>
      </div>
      {/* Descripción en toda la fila */}
      {place.description && (
        <div className="mt-2">
          <span className="block text-xs text-gray-400 mb-1">Descripción</span>
          <span className="text-gray-200">{place.description}</span>
        </div>
      )}
    </div>
  );
} 