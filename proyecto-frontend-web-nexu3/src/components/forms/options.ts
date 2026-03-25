// Opciones para los selects de AddPlaceForm
// Cada array representa las opciones de un campo select específico

/** Estado del lugar */
export const statusOptions = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'CLOSE', label: 'Cerrado' },
  { value: 'NOT_ACCESSIBLE', label: 'No accesible' },
];

/** Wifi disponible */
export const wifiOptions = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

/** Rango de precios */
export const priceRangeOptions = [
  { value: '$', label: '$ (Económico)' },
  { value: '$$', label: '$$ (Medio)' },
  { value: '$$$', label: '$$$ (Alto)' },
];

/** Delivery */
export const deliveryOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

/** Categorías para comer */
export const placeCategoryToEatOptions = [
  { value: 'COFFEE', label: 'Café' },
  { value: 'RESTAURANT', label: 'Restaurante' },
];

/** Tipos de restaurante */
export const typeRestaurantOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'CRIOLLO', label: 'Criollo' },
  { value: 'SELVATICO', label: 'Selvático' },
  { value: 'MARISCO', label: 'Marisco' },
];

/** Tipos de café */
export const typeCoffeeOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'VEGANA', label: 'Vegana' },
  { value: 'TRADICIONAL', label: 'Tradicional' },
  { value: 'PETFRIENDLY', label: 'Petfriendly' },
];

/** Categorías para divertirse */
export const placeCategoryToFunOptions = [
  { value: 'PARK', label: 'Parque' },
  { value: 'GAMES', label: 'Arcade/Juegos' },
];

/** Opciones para "¿Tiene juegos?" */
export const haveGamesOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

/** Tamaño del parque */
export const sizeParkOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'PEQUEÑO', label: 'Pequeño' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'GRANDE', label: 'Grande' },
]; 