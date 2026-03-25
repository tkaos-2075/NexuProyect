export interface PlacesToEatRequestDto {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  payment: Payment;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  description: string;
  wifi?: boolean;
  priceRange?: string;
  estimatedPrice?: number;
  capacity: number;
  status: string;
  placeCategoryToEat: PlaceCategoryToEat;
  typeRestaurant?: TypeRestaurant;
  delivery?: boolean;
  typeCoffee?: TypeCoffee;
  menu?: string;
}

export type Payment = 'FREE' | 'CARD' | 'CASH' | 'YAPE';
export type PlaceCategoryToEat = 'COFFEE' | 'RESTAURANT';
export type TypeRestaurant = 'CRIOLLO' | 'SELVATICO' | 'MARISCO';
export type TypeCoffee = 'TRADICIONAL' | 'PETFRIENDLY' | 'VEGANA'; 