// Función de validación para AddPlaceForm
// Recibe el estado del formulario y retorna un objeto de errores por campo
import { isValidLat, isValidLng, isValidUrl, isValidTime } from './utils';

/**
 * Valida todos los campos del formulario de agregar lugar.
 * @param form Estado actual del formulario
 * @returns Objeto con errores por campo
 */
export function validateAddPlaceForm(form: any): { [k: string]: string } {
  const newErrors: { [k: string]: string } = {};
  if (!form.name) newErrors.name = 'El nombre es obligatorio';
  if (!form.address) newErrors.address = 'La dirección es obligatoria';
  if (!form.latitude || !isValidLat(form.latitude)) newErrors.latitude = 'Latitud inválida';
  if (!form.longitude || !isValidLng(form.longitude)) newErrors.longitude = 'Longitud inválida';
  if (!form.payment) newErrors.payment = 'Selecciona un método de pago';
  if (!form.openTime || !isValidTime(form.openTime)) newErrors.openTime = 'Hora inválida (hh:mm)';
  if (!form.closeTime || !isValidTime(form.closeTime)) newErrors.closeTime = 'Hora inválida (hh:mm)';
  if (!form.description) newErrors.description = 'La descripción es obligatoria';
  if (!form.priceRange && form.payment !== 'GRATIS') newErrors.priceRange = 'Selecciona un rango de precios';
  if ((!form.estimatedPrice || isNaN(Number(form.estimatedPrice))) && form.payment !== 'GRATIS') newErrors.estimatedPrice = 'Precio estimado inválido';
  if (!form.capacity || isNaN(Number(form.capacity))) newErrors.capacity = 'Capacidad inválida';
  if (!form.status) newErrors.status = 'Selecciona el estado';
  if (!form.labelIds.length) newErrors.labelIds = 'Selecciona al menos una etiqueta';
  if (!form.wifi) newErrors.wifi = 'Selecciona si tiene wifi';
  if (!form.placeType) newErrors.placeType = 'Selecciona el tipo de lugar';
  if (!form.subType) newErrors.subType = 'Selecciona la subcategoría';
  if (form.placeType === 'eat') {
    if (!form.delivery) newErrors.delivery = 'Selecciona si tiene delivery';
    if (!form.menu || !isValidUrl(form.menu)) newErrors.menu = 'URL de menú inválida';
    if (!form.placeCategoryToEat) newErrors.placeCategoryToEat = 'Selecciona la categoría';
    if (form.subType === 'COFFEE' && !form.typeCoffee) newErrors.typeCoffee = 'Selecciona el tipo de café';
    if (form.subType === 'RESTAURANT' && !form.typeRestaurant) newErrors.typeRestaurant = 'Selecciona el tipo de restaurante';
  }
  if (form.placeType === 'fun') {
    if (!form.placeCategoryToFun) newErrors.placeCategoryToFun = 'Selecciona la categoría';
    if ((form.subType === 'GAMES' || (form.subType === 'PARK' && form.haveGames === 'true')) && !form.games) newErrors.games = 'Agrega al menos un juego';
    if (!form.haveGames && form.subType === 'PARK') newErrors.haveGames = 'Selecciona si tiene juegos';
    if (form.subType === 'GAMES' && (!form.priceFicha || isNaN(Number(form.priceFicha)))) newErrors.priceFicha = 'Precio por ficha inválido';
  }
  return newErrors;
} 