// Funciones utilitarias de validación para AddPlaceForm
// Estas funciones ayudan a validar campos individuales del formulario

/**
 * Valida si una latitud es válida (-90 a 90)
 */
export function isValidLat(lat: string): boolean {
  return /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(lat);
}

/**
 * Valida si una longitud es válida (-180 a 180)
 */
export function isValidLng(lng: string): boolean {
  return /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?|180(\.0+)?$/.test(lng);
}

/**
 * Valida si una URL tiene formato correcto (http/https)
 */
export function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+\..+/.test(url);
}

/**
 * Valida si una hora tiene formato hh:mm (24h)
 */
export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
} 