export interface PlacesToFunRequestDto {
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
  placeCategoryToFun: PlaceCategoryToFun;
  games?: string[];
  priceFicha?: number;
  sizePark?: SizePark;
  haveGames?: boolean;
}

export type Payment = 'FREE' | 'CARD' | 'CASH' | 'YAPE';
export type PlaceCategoryToFun = 'PARK' | 'GAMES';
export type SizePark = 'BIG' | 'REGULAR' | 'SMALL'; 