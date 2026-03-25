// Funciones para construir el payload de envío en AddPlaceForm
// Cada función recibe el form y retorna el objeto listo para la API

/**
 * Construye el payload para crear un lugar para comer
 */
export function buildPlaceToEatPayload(form: any) {
  const paymentMap = {
    'EFECTIVO': 'CASH',
    'TARJETA': 'CARD',
    'YAPE': 'YAPE',
    'GRATIS': 'FREE',
  };
  const placeCategoryToEatMap = {
    'COFFEE': 'COFFEE',
    'RESTAURANT': 'RESTAURANT',
  };
  const typeRestaurantMap = {
    'CRIOLLO': 'CRIOLLO',
    'SELVATICO': 'SELVATICO',
    'MARISCO': 'MARISCO',
  };
  const typeCoffeeMap = {
    'VEGANA': 'VEGANA',
    'TRADICIONAL': 'TRADICIONAL',
    'PETFRIENDLY': 'PETFRIENDLY',
  };
  return {
    ...form,
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    capacity: Number(form.capacity),
    estimatedPrice: Number(form.estimatedPrice),
    priceFicha: form.priceFicha ? Number(form.priceFicha) : undefined,
    labelIds: form.labelIds,
    wifi: form.wifi === 'true',
    delivery: form.delivery === 'true',
    typeCoffee: form.typeCoffee ? typeCoffeeMap[form.typeCoffee as keyof typeof typeCoffeeMap] : undefined,
    typeRestaurant: form.typeRestaurant ? typeRestaurantMap[form.typeRestaurant as keyof typeof typeRestaurantMap] : undefined,
    menu: form.menu || undefined,
    payment: paymentMap[form.payment as keyof typeof paymentMap] || 'FREE',
    placeCategoryToEat: placeCategoryToEatMap[form.placeCategoryToEat as keyof typeof placeCategoryToEatMap] || 'COFFEE',
  };
}

/**
 * Construye el payload para crear un lugar para divertirse
 */
export function buildPlaceToFunPayload(form: any) {
  const paymentMap = {
    'EFECTIVO': 'CASH',
    'TARJETA': 'CARD',
    'YAPE': 'YAPE',
    'GRATIS': 'FREE',
  };
  const placeCategoryToFunMap = {
    'PARK': 'PARK',
    'GAMES': 'GAMES',
  };
  const sizeParkMap = {
    'PEQUEÑO': 'SMALL',
    'REGULAR': 'REGULAR',
    'GRANDE': 'BIG',
  };
  return {
    ...form,
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    capacity: Number(form.capacity),
    estimatedPrice: Number(form.estimatedPrice),
    priceFicha: form.priceFicha ? Number(form.priceFicha) : undefined,
    labelIds: form.labelIds,
    wifi: form.wifi === 'true',
    haveGames: form.haveGames === 'true',
    games: form.games ? form.games.split(',').map((g: string) => g.trim()) : undefined,
    payment: paymentMap[form.payment as keyof typeof paymentMap] || 'FREE',
    placeCategoryToFun: placeCategoryToFunMap[form.placeCategoryToFun as keyof typeof placeCategoryToFunMap] || 'PARK',
    sizePark: form.sizePark ? sizeParkMap[form.sizePark as keyof typeof sizeParkMap] : undefined,
  };
} 