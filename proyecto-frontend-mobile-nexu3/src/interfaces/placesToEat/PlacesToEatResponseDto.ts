import { Payment, PlaceCategoryToEat, TypeRestaurant, TypeCoffee } from './PlacesToEatRequestDto';

export interface PlacesToEatResponseDto {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  payment: Payment;
  wifi?: boolean;
  qualification?: number;
  description: string;
  priceRange?: string;
  estimatedPrice?: number;
  capacity: number;
  status: string;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  labelNames?: string[];
  reviewIds?: number[];
  pictureUrls?: string[];
  placeCategoryToEat: PlaceCategoryToEat;
  typeRestaurant?: TypeRestaurant;
  delivery?: boolean;
  typeCoffee?: TypeCoffee;
  menu?: string;
} 