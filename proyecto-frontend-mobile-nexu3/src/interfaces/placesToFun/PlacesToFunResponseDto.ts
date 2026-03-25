import { Payment, PlaceCategoryToFun, SizePark } from './PlacesToFunRequestDto';

export interface PlacesToFunResponseDto {
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
  placeCategoryToFun: PlaceCategoryToFun;
  games?: string[];
  priceFicha?: number;
  sizePark?: SizePark;
  haveGames?: boolean;
} 